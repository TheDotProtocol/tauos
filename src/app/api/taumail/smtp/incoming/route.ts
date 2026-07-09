import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db-pool';
import { isAllowedMailDomain, parseEmailAddress } from '@/config/mail-domains';

async function storeIncomingEmail(
  to: string,
  from: string,
  subject: string,
  body: string
) {
  const parsed = parseEmailAddress(to);
  if (!parsed || !isAllowedMailDomain(parsed.domain)) {
    return NextResponse.json({ error: 'Unsupported recipient domain' }, { status: 400 });
  }

  const userResult = await getPool().query(
    'SELECT id, email FROM users WHERE email = $1 OR (username = $2 AND email LIKE $3)',
    [to.toLowerCase(), parsed.local, `%@${parsed.domain}`]
  );

  if (userResult.rows.length === 0) {
    return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
  }

  const userId = userResult.rows[0].id;
  const senderName = from.includes('<')
    ? from.split('<')[0].trim().replace(/"/g, '')
    : from.split('@')[0];

  const result = await getPool().query(
    `INSERT INTO incoming_emails (user_id, from_email, sender_name, subject, body, received_at, is_read, is_spam)
     VALUES ($1, $2, $3, $4, $5, NOW(), false, false)
     RETURNING id`,
    [userId, from, senderName || parsed.local, subject, body]
  );

  console.log(`✅ Incoming email stored: ${from} -> ${to}`);

  return NextResponse.json({
    success: true,
    message: 'Email received and stored',
    emailId: result.rows[0].id,
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
          { status: 400 }
        );
      }
      return storeIncomingEmail(to, from, subject, text || html || '');
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
      { status: 500 }
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
  } catch (error) {
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}
