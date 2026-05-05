import { Router, Request, Response } from 'express';
import Venue from '../models/Venue';
import Template from '../models/Template';
import { sendBookingEmail, sendBookingEmailFromTemplate } from '../services/emailService';
import { getDanishEmailHtml, getDanishEmailText, getEnglishEmailHtml, getEnglishEmailText } from '../templates/emailTemplates';

const router = Router();

function applyPlaceholder(content: string, recipientName: string): string {
  return content.replace(/\{\{recipientName\}\}/g, recipientName);
}

router.post('/send/:venueId', async (req: Request, res: Response) => {
  try {
    const venue = await Venue.findById(req.params.venueId);
    if (!venue) return res.status(404).json({ error: 'Venue not found' });

    const recipientName = venue.contactPerson || venue.name;
    const language = venue.preferredLanguage || 'da';
    const { templateId, subject: customSubject } = req.body;

    if (templateId) {
      const template = await Template.findById(templateId);
      if (!template) return res.status(404).json({ error: 'Template not found' });
      const html = applyPlaceholder(template.htmlBody, recipientName);
      const text = applyPlaceholder(template.textBody, recipientName);
      const subject = customSubject || template.subject;
      await sendBookingEmailFromTemplate(venue.email, subject, html, text);
    } else {
      // Try default template for this language, else fall back to built-in
      const defaultTemplate = await Template.findOne({ language, isDefault: true });
      if (defaultTemplate) {
        const html = applyPlaceholder(defaultTemplate.htmlBody, recipientName);
        const text = applyPlaceholder(defaultTemplate.textBody, recipientName);
        const subject = customSubject || defaultTemplate.subject;
        await sendBookingEmailFromTemplate(venue.email, subject, html, text);
      } else {
        await sendBookingEmail(venue.email, recipientName, language, customSubject);
      }
    }

    venue.status = 'sent';
    venue.emailSentAt = new Date();
    await venue.save();

    res.json({ message: 'Email sent successfully', venue });
  } catch (err: any) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
});

// Preview a venue email (with optional templateId)
router.get('/preview/:venueId', async (req: Request, res: Response) => {
  try {
    const venue = await Venue.findById(req.params.venueId);
    if (!venue) return res.status(404).json({ error: 'Venue not found' });

    const recipientName = venue.contactPerson || venue.name;
    const language = (req.query.lang as 'da' | 'en') || venue.preferredLanguage || 'da';
    const templateId = req.query.templateId as string | undefined;

    let html: string;
    if (templateId) {
      const template = await Template.findById(templateId);
      if (!template) return res.status(404).json({ error: 'Template not found' });
      html = applyPlaceholder(template.htmlBody, recipientName);
    } else {
      const defaultTemplate = await Template.findOne({ language, isDefault: true });
      if (defaultTemplate) {
        html = applyPlaceholder(defaultTemplate.htmlBody, recipientName);
      } else {
        html = language === 'da' ? getDanishEmailHtml(recipientName) : getEnglishEmailHtml(recipientName);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

export default router;
