import { getPool, getJwtSecret } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { sendMail } from '@/lib/mail-transport';
import { isExternalRecipient } from '@/lib/taumail-compose';
import { validateAttachmentPayloads, validateAttachmentRefs } from '@/lib/taumail-attachments';
import {
  fetchMailAttachmentContent,
  deleteMailAttachment,
} from '@/lib/taumail-attachment-storage';

async function resolveAttachments(raw: unknown) {
  if (raw == null) {
    return { ok: true as const, attachments: [], totalBytes: 0, storagePaths: [] as string[] };
  }

  if (Array.isArray(raw) && raw.length > 0 && (raw[0] as { path?: string }).path) {
    const refCheck = validateAttachmentRefs(raw);
    if (refCheck.ok === false) {
      return { ok: false as const, error: refCheck.error };
    }

    const attachments = [];
    for (const ref of refCheck.refs) {
      const fetched = await fetchMailAttachmentContent(ref.path);
      attachments.push({
        filename: ref.filename,
        contentType: ref.contentType || fetched.contentType,
        content: fetched.content,
        size: ref.size,
      });
    }

    return {
      ok: true as const,
      attachments,
      totalBytes: refCheck.totalBytes,
      storagePaths: refCheck.refs.map((r) => r.path),
    };
  }

  const inline = validateAttachmentPayloads(raw);
  if (inline.ok === false) {
    return { ok: false as const, error: inline.error };
  }
  return inline;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const jwtSecret = getJwtSecret('taumail');
    const decoded = jwt.verify(token, jwtSecret) as { userId: number | string };

    const { to, subject, body, cc, bcc, inReplyTo, references, attachments } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const attachmentCheck = await resolveAttachments(attachments);
    if (!attachmentCheck.ok) {
      return NextResponse.json({ error: attachmentCheck.error }, { status: 400 });
    }

    const userResult = await getPool().query(
      'SELECT username, email, full_name FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult.rows[0];
    const fromEmail = user.email;
    const fromName = user.full_name || user.username;

    const html = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>${body.replace(/\n/g, '<br>')}</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #666;">
        Sent via Tau Mail — Privacy-native email on TAU CORE™<br>
        <a href="https://www.tauos.org/taumail" style="color: #b8860b;">tauos.org/taumail</a>
      </p>
    </div>`;

    const { messageId, transport, accepted, envelopeFrom } = await sendMail({
      from: { email: fromEmail, name: fromName },
      to,
      subject,
      text: body,
      html,
      cc,
      bcc,
      replyTo: fromEmail,
      inReplyTo,
      references,
      attachments: attachmentCheck.attachments.map((a) => ({
        filename: a.filename,
        contentType: a.contentType,
        content: a.content,
      })),
    });

    const external = isExternalRecipient(String(to).split(',')[0]?.trim() || '');
    const deliverabilityHint =
      external && transport === 'smtp'
        ? 'Sent via backup SMTP relay. Gmail delivery may be delayed — check Spam/Promotions. For reliable external delivery, update SENDGRID_API_KEY in Vercel (current key returns Unauthorized).'
        : external
          ? 'Message accepted by our mail server. External delivery may take a few minutes — check recipient spam folder if not received.'
          : undefined;

    const result = await getPool().query(
      `INSERT INTO sent_emails (user_id, recipient_email, subject, body, sent_at, smtp_status, message_id)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6)
       RETURNING id, recipient_email, subject, sent_at`,
      [decoded.userId, to, subject, body, transport, messageId]
    );

    await Promise.all(
      attachmentCheck.storagePaths.map((path) => deleteMailAttachment(path))
    );

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      email: result.rows[0],
      messageId,
      transport,
      accepted,
      envelopeFrom,
      deliverabilityHint,
      from: fromEmail,
      fromName,
      attachmentCount: attachmentCheck.attachments.length,
      attachmentBytes: attachmentCheck.totalBytes,
    });
  } catch (error) {
    console.error('TauMail Send Email Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
