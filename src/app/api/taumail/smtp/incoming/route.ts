import { getPool } from '@/app/api/taumail/middleware/security';
import { isAllowedMailDomain, parseEmailAddress } from '@/config/mail-domains';
import { extractEmailFromHeader } from '@/lib/taumail-inbound';
import { findUserForInboundRecipient, storeInboundEmail } from '@/lib/taumail/inbound-store';
import { NextRequest, NextResponse } from 'next/server';

async function storeIncomingEmail(
  to: string,
  from: string,
  subject: string,
  body: string,
  html?: string,
) {
  const cleanTo = extractEmailFromHeader(to).toLowerCase();
  const parsed = parseEmailAddress(cleanTo);
  if (!parsed || !isAllowedMailDomain(parsed.domain)) {
    return NextResponse.json({ error: 'Unsupported recipient domain' }, { status: 400 });
  }

  const user = await findUserForInboundRecipient(to);
  if (!user) {
    console.warn(`[smtp/incoming] Recipient not found: ${cleanTo}`);
    return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
  }

  const row = await storeInboundEmail({
    userId: user.id,
    fromRaw: from,
    subject,
    text: body,
    html: html || body,
  });

  console.log(`✅ Incoming email stored: ${from} -> ${cleanTo} (user ${user.id})`);

  return NextResponse.json({
    success: true,
    message: 'Email received and stored',
    emailId: row.id,
    domain: parsed.domain,
  });
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const { to, from, subject, text, html } = await request.json();
      if (!to || !from || !subject) {
        return NextResponse.json(
          { error: 'Missing required fields: to, from, subject' },
          { status: 400 },
        );
      }
      return storeIncomingEmail(to, from, subject, text || html || '', html);
    }

    const rawEmail = await request.text();
    if (!rawEmail) {
      return NextResponse.json({ error: 'No email content received' }, { status: 400 });
    }

    const lines = rawEmail.split('\n');
    let from = '';
    let to = '';
    let subject = '';
    let body = '';
    let inBody = false;

    for (const line of lines) {
      if (line.startsWith('From:')) from = line.replace('From:', '').trim();
      else if (line.startsWith('To:')) to = line.replace('To:', '').trim();
      else if (line.startsWith('Subject:')) subject = line.replace('Subject:', '').trim();
      else if (line.trim() === '') inBody = true;
      else if (inBody) body += line + '\n';
    }

    if (!to || !from || !subject) {
      return NextResponse.json({ error: 'Missing required email headers' }, { status: 400 });
    }

    return storeIncomingEmail(to, from, subject, body.trim());
  } catch (error) {
    console.error('SMTP incoming error:', error);
    return NextResponse.json(
      { error: 'Failed to process incoming email' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { to, from, subject, text } = await request.json();
    if (!to || !from || !subject) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    return storeIncomingEmail(to, from, subject, text || 'Simulated incoming message');
  } catch {
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}
