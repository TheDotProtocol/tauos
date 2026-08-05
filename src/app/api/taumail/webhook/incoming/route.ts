import { parseSendGridInboundAttachments, extractEmailFromHeader } from '@/lib/taumail-inbound';
import { findUserForInboundRecipient, storeInboundEmail } from '@/lib/taumail/inbound-store';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
      to = String(formData.get('to') || formData.get('envelope') || '');
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
    const user = await findUserForInboundRecipient(to);
    if (!user) {
      console.warn(`[webhook/incoming] User not found for inbound email: ${cleanRecipientEmail}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isSpam =
      subject?.toLowerCase().includes('spam') ||
      subject?.toLowerCase().includes('viagra') ||
      from?.toLowerCase().includes('noreply') ||
      false;

    const row = await storeInboundEmail({
      userId: user.id,
      fromRaw: from,
      subject,
      text,
      html,
      headers,
      attachments,
      isSpam,
    });

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
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Tau Mail incoming webhook is active',
    status: 'ready',
  });
}
