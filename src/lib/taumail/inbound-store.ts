import { getPool } from '@/lib/db-pool';
import { extractEmailFromHeader, parseSenderFromHeader } from '@/lib/taumail-inbound';
import {
  processInboundHtmlBody,
  type InlineAttachmentPart,
} from '@/lib/taumail/inbound-html';
import { parseEmailAddress } from '@/config/mail-domains';
import type { MailAttachmentPayload } from '@/lib/taumail-attachments';

export type InboundUser = {
  id: string;
  email: string;
  username: string;
};

export async function findUserForInboundRecipient(recipientRaw: string): Promise<InboundUser | null> {
  const cleanRecipient = extractEmailFromHeader(recipientRaw).toLowerCase().trim();
  const parsed = parseEmailAddress(cleanRecipient);
  if (!parsed) return null;

  const pool = getPool();

  const byEmail = await pool.query(
    'SELECT id, email, username FROM users WHERE LOWER(email) = $1 LIMIT 1',
    [cleanRecipient],
  );
  if (byEmail.rows.length > 0) {
    return normalizeUserRow(byEmail.rows[0]);
  }

  const byUsername = await pool.query(
    'SELECT id, email, username FROM users WHERE username = $1 AND LOWER(email) LIKE $2 LIMIT 1',
    [parsed.local, `%@${parsed.domain}`],
  );
  if (byUsername.rows.length > 0) {
    return normalizeUserRow(byUsername.rows[0]);
  }

  return null;
}

function normalizeUserRow(row: Record<string, unknown>): InboundUser {
  return {
    id: String(row.id),
    email: String(row.email),
    username: String(row.username),
  };
}

export async function storeInboundEmail(input: {
  userId: string | number;
  fromRaw: string;
  subject: string;
  text: string;
  html?: string;
  inlineAttachments?: InlineAttachmentPart[];
  headers?: unknown;
  attachments?: MailAttachmentPayload[] | unknown;
  isSpam?: boolean;
}) {
  const { fromEmail, senderName } = parseSenderFromHeader(input.fromRaw);
  const pool = getPool();
  const bodyHtml = processInboundHtmlBody(
    input.html,
    input.text,
    input.inlineAttachments || [],
  );

  const result = await pool.query(
    `INSERT INTO incoming_emails (
        user_id,
        from_email,
        sender_name,
        subject,
        body,
        body_text,
        body_html,
        received_at,
        is_read,
        is_spam,
        is_deleted,
        headers,
        attachments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, false, $8, false, $9, $10)
       RETURNING id, subject, received_at`,
    [
      String(input.userId),
      fromEmail,
      senderName,
      input.subject || 'No Subject',
      input.text || 'No text content',
      input.text || 'No text content',
      bodyHtml,
      Boolean(input.isSpam),
      JSON.stringify(input.headers || {}),
      JSON.stringify(input.attachments || []),
    ],
  );

  return result.rows[0];
}
