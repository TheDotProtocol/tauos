import type { MailAttachmentPayload } from '@/lib/taumail-attachments';

/** Parse attachments JSON stored on incoming_emails.attachments */
export function parseStoredIncomingAttachments(raw: unknown): MailAttachmentPayload[] {
  if (!raw) return [];
  let parsed: unknown = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter(
      (a): a is MailAttachmentPayload =>
        Boolean(
          a &&
            typeof a === 'object' &&
            typeof (a as MailAttachmentPayload).filename === 'string' &&
            typeof (a as MailAttachmentPayload).content === 'string'
        )
    )
    .map((a) => ({
      filename: a.filename,
      contentType: a.contentType || 'application/octet-stream',
      content: a.content,
      size: a.size || 0,
    }));
}

/** SendGrid Inbound Parse: attachment-info + attachment1, attachment2, … */
export async function parseSendGridInboundAttachments(
  formData: FormData
): Promise<MailAttachmentPayload[]> {
  const attachments: MailAttachmentPayload[] = [];
  const infoRaw = formData.get('attachment-info');
  if (!infoRaw) return attachments;

  let info: Record<string, { filename?: string; type?: string; name?: string }> = {};
  try {
    info = JSON.parse(String(infoRaw));
  } catch {
    return attachments;
  }

  for (const key of Object.keys(info)) {
    const file = formData.get(key);
    if (!(file instanceof File) || file.size === 0) continue;

    const meta = info[key] || {};
    const buf = Buffer.from(await file.arrayBuffer());
    attachments.push({
      filename: meta.filename || meta.name || file.name || `${key}.bin`,
      contentType: meta.type || file.type || 'application/octet-stream',
      content: buf.toString('base64'),
      size: file.size,
    });
  }

  return attachments;
}

export function extractEmailFromHeader(value: string): string {
  const trimmed = value.trim();
  const match = trimmed.match(/<([^>]+)>/);
  return (match ? match[1] : trimmed).trim();
}

export function parseSenderFromHeader(from: string): { fromEmail: string; senderName: string; displayName: string } {
  const trimmed = from.trim();
  if (trimmed.includes('<') && trimmed.includes('>')) {
    const match = trimmed.match(/^(.+?)\s*<(.+?)>$/);
    if (match) {
      const senderName = match[1].trim().replace(/^["']|["']$/g, '');
      const fromEmail = match[2].trim();
      return { fromEmail, senderName, displayName: `${senderName} <${fromEmail}>` };
    }
  }

  const fromEmail = extractEmailFromHeader(trimmed);
  const senderName = fromEmail.split('@')[0] || 'Unknown';
  return { fromEmail, senderName, displayName: trimmed.includes('@') ? trimmed : fromEmail };
}
