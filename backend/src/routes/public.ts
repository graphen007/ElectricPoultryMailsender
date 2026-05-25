import { Router, Request, Response } from 'express';
import Gig from '../models/Gig';
import PracticeDay from '../models/PracticeDay';
import Trivia from '../models/Trivia';
import Template from '../models/Template';
import { getDanishEmailHtml, getEnglishEmailHtml } from '../templates/emailTemplates';

const router = Router();

// All public endpoints are CORS-open
router.use((_req: Request, res: Response, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// ─── iCal helpers ────────────────────────────────────────────────────────────

function icalDate(d: Date, timeStr?: string): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = d.getFullYear();
  const mo = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  if (!timeStr) return `${y}${mo}${day}`;
  const [h, m] = timeStr.split(':');
  return `${y}${mo}${day}T${pad(Number(h))}${pad(Number(m))}00`;
}

// iCal spec: lines must be <= 75 octets, continuation lines start with a space
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let i = 0;
  chunks.push(line.slice(0, 75));
  i = 75;
  while (i < line.length) {
    chunks.push(' ' + line.slice(i, i + 74));
    i += 74;
  }
  return chunks.join('\r\n');
}

function escapeIcal(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// ─── calendar.ics endpoint ───────────────────────────────────────────────────

router.get('/calendar.ics', async (req: Request, res: Response) => {
  try {
    const [gigs, practiceDays] = await Promise.all([
      Gig.find({ confirmed: true }).sort({ date: 1 }),
      PracticeDay.find().sort({ date: 1 }),
    ]);

    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Electric Poultry//Band Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Electric Poultry',
      'X-WR-CALDESC:Gigs and practice sessions for Electric Poultry',
      'X-WR-TIMEZONE:Europe/Copenhagen',
    ];

    for (const gig of gigs) {
      const start = icalDate(gig.date, gig.startTime);
      const isAllDay = !gig.startTime;
      // Default duration 2 hours for timed gigs; all-day events span 1 day
      let dtEnd: string;
      if (isAllDay) {
        const next = new Date(gig.date);
        next.setDate(next.getDate() + 1);
        dtEnd = icalDate(next);
      } else {
        const endH = gig.endTime ? icalDate(gig.date, gig.endTime) : (() => {
          const d = new Date(gig.date);
          const [h, m] = (gig.startTime as string).split(':').map(Number);
          d.setHours(h + 2, m);
          return icalDate(d, `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`);
        })();
        dtEnd = endH;
      }

      lines.push('BEGIN:VEVENT');
      lines.push(foldLine(`UID:gig-${gig._id}@electricpoultry`));
      lines.push(foldLine(`DTSTAMP:${icalDate(new Date())}T000000Z`));
      if (isAllDay) {
        lines.push(foldLine(`DTSTART;VALUE=DATE:${start}`));
        lines.push(foldLine(`DTEND;VALUE=DATE:${dtEnd}`));
      } else {
        lines.push(foldLine(`DTSTART;TZID=Europe/Copenhagen:${start}`));
        lines.push(foldLine(`DTEND;TZID=Europe/Copenhagen:${dtEnd}`));
      }
      lines.push(foldLine(`SUMMARY:${escapeIcal(gig.title || gig.venue)}`));
      if (gig.venue) lines.push(foldLine(`LOCATION:${escapeIcal(gig.city ? `${gig.venue}, ${gig.city}` : gig.venue)}`));
      if (gig.notes) lines.push(foldLine(`DESCRIPTION:${escapeIcal(gig.notes)}`));
      lines.push('STATUS:CONFIRMED');
      lines.push('END:VEVENT');
    }

    for (const pd of practiceDays) {
      const start = icalDate(pd.date);
      const next = new Date(pd.date);
      next.setDate(next.getDate() + 1);
      const end = icalDate(next);

      lines.push('BEGIN:VEVENT');
      lines.push(foldLine(`UID:practice-${pd._id}@electricpoultry`));
      lines.push(foldLine(`DTSTAMP:${icalDate(new Date())}T000000Z`));
      lines.push(foldLine(`DTSTART;VALUE=DATE:${start}`));
      lines.push(foldLine(`DTEND;VALUE=DATE:${end}`));
      lines.push('SUMMARY:Practice — Electric Poultry');
      if (pd.notes) lines.push(foldLine(`DESCRIPTION:${escapeIcal(pd.notes)}`));
      lines.push('STATUS:CONFIRMED');
      lines.push('END:VEVENT');
    }

    lines.push('END:VCALENDAR');

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="electric-poultry.ics"');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.send(lines.join('\r\n'));
  } catch {
    res.status(500).send('Failed to generate calendar');
  }
});

// Public endpoint — returns all active trivia items
router.get('/trivia', async (_req: Request, res: Response) => {
  try {
    const trivia = await Trivia.find({ active: true }).select('text').sort({ createdAt: -1 });
    res.json(trivia.map(t => t.text));
  } catch {
    res.status(500).json({ error: 'Failed to fetch trivia' });
  }
});

router.get('/gigs', async (_req: Request, res: Response) => {
  try {
    const gigs = await Gig.find({ confirmed: true })
      .sort({ date: 1 })
      .select('title venue city date startTime endTime');
    res.json(gigs);
  } catch {
    res.status(500).json({ error: 'Failed to fetch gigs' });
  }
});

// Email template preview — public so previews can be opened in any browser
router.get('/preview-template', async (req: Request, res: Response) => {
  try {
    const templateId = req.query.templateId as string;
    const recipientName = (req.query.recipientName as string) || 'Spillestedet';

    let html: string;
    if (templateId) {
      const template = await Template.findById(templateId);
      if (!template) return res.status(404).json({ error: 'Template not found' });
      html = template.htmlBody.replace(/\{\{recipientName\}\}/g, recipientName);
    } else {
      const lang = (req.query.lang as 'da' | 'en') || 'da';
      html = lang === 'da' ? getDanishEmailHtml(recipientName) : getEnglishEmailHtml(recipientName);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch {
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

export default router;
