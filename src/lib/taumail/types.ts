/** Shared Tau Mail email types for UI + API mapping */

import { formatAttachmentSize } from '@/lib/taumail-attachments';
import { parseStoredIncomingAttachments } from '@/lib/taumail-inbound';

export type TauMailEmail = {
  id: string | number;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  body: string;
  bodyHtml?: string;
  time: string;
  unread: boolean;
  starred: boolean;
  attachment?: boolean;
  attachments?: { name: string; size: string; type: string; content?: string }[];
  avatar?: string;
};

export type TauMailFolder = 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash';

export function mapApiInboxEmail(email: Record<string, unknown>): TauMailEmail {
  const body = String(email.body || email.body_text || '');
  const bodyHtml = String(email.body_html || '');
  const fromEmail = String(email.from_email || email.sender_email || '');
  const storedAttachments = parseStoredIncomingAttachments(email.attachments);
  return {
    id: email.id as string | number,
    sender: String(email.display_name || email.sender_name || fromEmail || 'Unknown'),
    senderEmail: fromEmail,
    subject: String(email.subject || 'No Subject'),
    preview: body ? `${body.slice(0, 100)}...` : 'No preview',
    body,
    bodyHtml: bodyHtml || undefined,
    time: email.received_at ? new Date(String(email.received_at)).toLocaleString() : 'Unknown',
    unread: !email.is_read,
    starred: Boolean(email.is_starred),
    attachment: storedAttachments.length > 0,
    attachments: storedAttachments.map((a) => ({
      name: a.filename,
      size: formatAttachmentSize(a.size),
      type: a.contentType,
      content: a.content,
    })),
  };
}

export function mapApiSentEmail(email: Record<string, unknown>): TauMailEmail {
  const body = String(email.body || '');
  return {
    id: email.id as string | number,
    sender: 'You',
    senderEmail: String(email.recipient_email || ''),
    subject: String(email.subject || 'No Subject'),
    preview: body ? `${body.slice(0, 100)}...` : 'No preview',
    body,
    time: email.sent_at ? new Date(String(email.sent_at)).toLocaleString() : 'Unknown',
    unread: false,
    starred: false,
  };
}

export function mapApiDraftEmail(email: Record<string, unknown>): TauMailEmail {
  const body = String(email.body || '');
  const to = String(email.to_email || '');
  return {
    id: email.id as string | number,
    sender: 'Draft',
    senderEmail: to,
    subject: String(email.subject || 'No Subject'),
    preview: body ? `${body.slice(0, 100)}...` : 'No preview',
    body,
    time: email.updated_at ? new Date(String(email.updated_at)).toLocaleString() : 'Unknown',
    unread: true,
    starred: false,
  };
}

export function mapApiTrashEmail(email: Record<string, unknown>): TauMailEmail {
  const mapped = mapApiInboxEmail(email);
  const deletedAt = email.deleted_at ? String(email.deleted_at) : null;
  return {
    ...mapped,
    time: deletedAt ? new Date(deletedAt).toLocaleString() : mapped.time,
    unread: false,
  };
}
