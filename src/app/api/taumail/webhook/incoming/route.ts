import { getPool } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import {
  extractEmailFromHeader,
  parseSendGridInboundAttachments,
  parseSenderFromHeader,
} from '@/lib/taumail-inbound';

async function saveIncomingEmail(
  userId: string | number,
  from: string,
  senderName: string,
  subject: string,
  text: string,
  html: string,
  headers: unknown,
  attachments: unknown
) {
  const result = await getPool().query(
    `INSERT INTO incoming_emails (
        user_id,
        from_email,
        sender_name,
        subject,
        body,
        body_text,
        body_html,
        received_at,
        is_spam,
        headers,
        attachments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8, $9, $10)
       RETURNING id, subject, received_at`,
    [
      userId,
      from,
      senderName,
      subject || 'No Subject',
      text || 'No text content',
      text || 'No text content',
      html || '<p>No HTML content</p>',
      false,
      JSON.stringify(headers || {}),
      JSON.stringify(attachments || []),
    ]
  );

  return result.rows[0];
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let from = '';
    let to = '';
    let subject = '';
    let text = '';
    let html = '';
    let headers: unknown = {};
    let attachments: unknown[] = [];

    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      from = String(formData.get('from') || '');
      to = String(formData.get('to') || '');
      subject = String(formData.get('subject') || '');
      text = String(formData.get('text') || '');
      html = String(formData.get('html') || '');
      const headersRaw = formData.get('headers');
      if (headersRaw) {
        try {
          headers = JSON.parse(String(headersRaw));
        } catch {
          headers = { raw: String(headersRaw) };
        }
      }
      attachments = await parseSendGridInboundAttachments(formData);
    } else if (contentType.includes('application/json')) {
      const emailData = await request.json();
      from = emailData.from || '';
      to = Array.isArray(emailData.to) ? emailData.to[0] : emailData.to || '';
      subject = emailData.subject || '';
      text = emailData.text || '';
      html = emailData.html || '';
      headers = emailData.headers || {};
      attachments = Array.isArray(emailData.attachments) ? emailData.attachments : [];
    } else {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
    }

    if (!to || !from) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cleanRecipientEmail = extractEmailFromHeader(to).toLowerCase();
    const { fromEmail, senderName, displayName } = parseSenderFromHeader(from);

    const userResult = await getPool().query(
      'SELECT id, username, email FROM users WHERE email = $1 OR email ILIKE $2',
      [cleanRecipientEmail, cleanRecipientEmail]
    );

    if (userResult.rows.length === 0) {
      const username = cleanRecipientEmail.split('@')[0];
      const fallback = await getPool().query(
        'SELECT id, username, email FROM users WHERE username = $1',
        [username]
      );
      if (fallback.rows.length === 0) {
        console.log(`User not found for inbound email: ${cleanRecipientEmail}`);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      userResult.rows.push(fallback.rows[0]);
    }

    const user = userResult.rows[0];
    const row = await saveIncomingEmail(
      user.id,
      displayName || fromEmail,
      senderName,
      subject,
      text,
      html,
      headers,
      attachments
    );

    console.log(`Incoming email saved for ${cleanRecipientEmail}:`, row.id, `attachments=${attachments.length}`);

    return NextResponse.json({
      success: true,
      message: 'Email received and processed',
      emailId: row.id,
      attachmentCount: attachments.length,
    });
  } catch (error) {
    console.error('Incoming Email Webhook Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process incoming email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Tau Mail incoming webhook is active',
    status: 'ready',
  });
}
