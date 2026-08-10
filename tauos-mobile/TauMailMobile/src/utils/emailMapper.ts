import type { TauMailEmail } from '@tau/taumail-mobile-client';
import type { Email } from '../store/slices/emailSlice';

export function mapApiEmailToLocal(email: TauMailEmail): Email {
  return {
    id: String(email.id),
    from: email.senderEmail || email.sender,
    senderName: email.sender,
    to: [email.senderEmail].filter(Boolean),
    subject: email.subject,
    body: email.body,
    timestamp: email.time,
    isRead: !email.unread,
    isStarred: email.starred,
    folder: 'inbox',
    attachments: email.attachments?.map((a) => a.name),
    encryptionStatus: 'encrypted',
  };
}

export function filterEmailsByQuery(emails: Email[], query: string): Email[] {
  const q = query.trim().toLowerCase();
  if (!q) return emails;
  return emails.filter(
    (e) =>
      e.subject.toLowerCase().includes(q) ||
      e.body.toLowerCase().includes(q) ||
      e.from.toLowerCase().includes(q) ||
      (e.senderName && e.senderName.toLowerCase().includes(q)),
  );
}
