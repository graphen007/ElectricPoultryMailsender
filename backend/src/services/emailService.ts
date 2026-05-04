import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {
  getDanishEmailHtml,
  getDanishEmailText,
  getEnglishEmailHtml,
  getEnglishEmailText,
} from '../templates/emailTemplates';

dotenv.config();

export function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendBookingEmail(
  toEmail: string,
  recipientName: string,
  language: 'da' | 'en',
  customSubject?: string
): Promise<void> {
  const transporter = createTransporter();

  const subject =
    customSubject ||
    (language === 'da'
      ? 'Electric Poultry - Vi vil gerne spille for jer!'
      : 'Electric Poultry - We would love to play at your venue!');

  const html = language === 'da' ? getDanishEmailHtml(recipientName) : getEnglishEmailHtml(recipientName);
  const text = language === 'da' ? getDanishEmailText(recipientName) : getEnglishEmailText(recipientName);

  await transporter.sendMail({
    from: `"Electric Poultry" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject,
    html,
    text,
  });
}

export async function sendBookingEmailFromTemplate(
  toEmail: string,
  subject: string,
  html: string,
  text: string
): Promise<void> {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Electric Poultry" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject,
    html,
    text,
  });
}
