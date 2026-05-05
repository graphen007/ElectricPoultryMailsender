import { Router, Request, Response } from 'express';
import Gig from '../models/Gig';
import Trivia from '../models/Trivia';
import Template from '../models/Template';
import { getDanishEmailHtml, getEnglishEmailHtml } from '../templates/emailTemplates';

const router = Router();

// Public endpoint — returns all confirmed gigs, no auth required.
// CORS is handled with a permissive header so the band website can call it.
router.use((_req: Request, res: Response, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
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
