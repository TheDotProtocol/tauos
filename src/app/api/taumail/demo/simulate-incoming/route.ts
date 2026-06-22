import { NextRequest, NextResponse } from 'next/server';
import { getPool, isProductionDeploy } from '@/lib/db-pool';

/** Development-only helper — disabled in production */
export async function POST(request: NextRequest) {
  if (isProductionDeploy()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { from, subject, body, senderName } = await request.json();

    if (!from || !subject || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: from, subject, body' },
        { status: 400 }
      );
    }

    const userResult = await getPool().query('SELECT id FROM users WHERE email = $1', [
      'saleena@tauos.org',
    ]);
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    const result = await getPool().query(
      `INSERT INTO incoming_emails (user_id, from_email, sender_name, subject, body, received_at, is_read, is_spam)
       VALUES ($1, $2, $3, $4, $5, NOW(), false, false)
       RETURNING id`,
      [userId, from, senderName || from.split('@')[0], subject, body]
    );

    return NextResponse.json({
      success: true,
      message: 'Demo email simulated successfully',
      emailId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Demo simulation error:', error);
    return NextResponse.json({ error: 'Failed to simulate email' }, { status: 500 });
  }
}
