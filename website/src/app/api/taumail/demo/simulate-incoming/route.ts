import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  ssl: { rejectUnauthorized: false }
});

export async function POST(request: NextRequest) {
  try {
    const { from, subject, body, senderName } = await request.json();

    if (!from || !subject || !body) {
      return NextResponse.json({ 
        error: 'Missing required fields: from, subject, body' 
      }, { status: 400 });
    }

    // Get saleena user ID
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', ['saleena@tauos.org']);
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    // Simulate incoming email
    const result = await pool.query(`
      INSERT INTO incoming_emails (user_id, from_email, sender_name, subject, body, received_at, is_read, is_spam)
      VALUES ($1, $2, $3, $4, $5, NOW(), false, false)
      RETURNING id
    `, [userId, from, senderName || from.split('@')[0], subject, body]);

    return NextResponse.json({
      success: true,
      message: 'Demo email simulated successfully',
      emailId: result.rows[0].id
    });

  } catch (error) {
    console.error('Demo simulation error:', error);
    return NextResponse.json({ 
      error: 'Failed to simulate email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
