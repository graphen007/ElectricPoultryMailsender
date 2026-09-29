import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import Venue from '../models/Venue';

let checkInProgress = false;

function getImapConfig() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  return {
    host: process.env.GMAIL_IMAP_HOST || 'imap.gmail.com',
    port: Number(process.env.GMAIL_IMAP_PORT || 993),
    secure: true,
    auth: { user, pass },
  };
}

function getReplyText(text: string | undefined, subject: string | undefined): string {
  const cleaned = (text || '')
    .split('\n')
    .filter(line => !line.trim().startsWith('>'))
    .join('\n')
    .trim();

  return (cleaned || subject || 'Reply received').slice(0, 5000);
}

export async function checkForReplies(): Promise<number> {
  if (checkInProgress) return 0;

  const config = getImapConfig();
  if (!config) throw new Error('Gmail IMAP credentials are not configured');

  const venues = await Venue.find({
    emailSentAt: { $exists: true },
    $and: [
      { $or: [{ responseReceivedAt: { $exists: false } }, { responseReceivedAt: null }] },
      { $or: [{ mailResponse: { $exists: false } }, { mailResponse: '' }] },
    ],
  }).select('_id email emailSentAt');

  if (venues.length === 0) return 0;

  const earliestSentAt = venues.reduce((earliest, venue) => {
    const sentAt = venue.emailSentAt?.getTime() || Date.now();
    return Math.min(earliest, sentAt);
  }, Date.now());

  checkInProgress = true;
  const client = new ImapFlow(config);
  let updated = 0;

  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');
    try {
      for await (const message of client.fetch(
        { since: new Date(earliestSentAt) },
        { source: true, envelope: true }
      )) {
        if (!message.source) continue;

        const parsed = await simpleParser(message.source);
        const receivedAtValue = parsed.date || message.envelope?.date || new Date();
        const receivedAt = receivedAtValue instanceof Date ? receivedAtValue : new Date(receivedAtValue);
        if (receivedAt.getTime() < earliestSentAt) continue;

        const senders = parsed.from?.value
          ?.map(sender => sender.address?.toLowerCase())
          .filter((address): address is string => Boolean(address)) || [];
        const venue = venues.find(item => senders.includes(item.email.toLowerCase()));
        if (!venue) continue;

        const result = await Venue.updateOne(
          {
            _id: venue._id,
            $or: [
              { responseReceivedAt: { $exists: false } },
              { responseReceivedAt: null },
            ],
          },
          {
            $set: {
              responseReceivedAt: receivedAt,
              mailResponse: getReplyText(parsed.text, parsed.subject),
            },
          }
        );

        if (result.modifiedCount > 0) updated += 1;
      }
    } finally {
      lock.release();
    }
  } finally {
    checkInProgress = false;
    await client.logout().catch(() => undefined);
  }

  return updated;
}

export function startReplyChecker(): void {
  if (!getImapConfig()) {
    console.warn('Reply checker disabled: Gmail IMAP credentials are not configured');
    return;
  }

  const intervalMs = Number(process.env.REPLY_CHECK_INTERVAL_MS || 300000);
  const run = async () => {
    try {
      const updated = await checkForReplies();
      if (updated > 0) console.log(`Reply checker recorded ${updated} venue response(s)`);
    } catch (err) {
      console.error('Reply checker error:', err);
    }
  };

  void run();
  setInterval(run, intervalMs);
}
