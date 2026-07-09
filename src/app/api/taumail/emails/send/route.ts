import { getPool, getJwtSecret } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { sendMail } from '@/lib/mail-transport';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const jwtSecret = getJwtSecret('taumail');
    const decoded = jwt.verify(token, jwtSecret) as { userId: number };

    const { to, subject, body, cc, bcc } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    const { messageId, transport } = await sendMail({
      from: { email: fromEmail, name: fromName },
      to,
      subject,
      text: body,
      html,
      cc,
      bcc,
    });

    const result = await getPool().query(
      `INSERT INTO sent_emails (user_id, recipient_email, subject, body, sent_at, smtp_status, message_id)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6)
       RETURNING id, recipient_email, subject, sent_at`,
      [decoded.userId, to, subject, body, transport, messageId]
    );

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      email: result.rows[0],
      messageId,
      transport,
      from: fromEmail,
      fromName,
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
