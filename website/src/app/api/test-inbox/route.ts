import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function GET(request: NextRequest) {
  try {
    // Test direct database query
    const userId = '00000000-0000-0000-0000-000000000001';
    
    // Check if user exists
    const userCheck = await pool.query(
      'SELECT id, email, username FROM users WHERE id = $1',
      [userId]
    );
    
    // Get all emails for this user
    const emailsResult = await pool.query(
      `SELECT ie.id, ie.subject, ie.from_email, ie.received_at, ie.is_spam
       FROM incoming_emails ie 
       WHERE ie.user_id = $1
       ORDER BY ie.received_at DESC
       LIMIT 10`,
      [userId]
    );
    
    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM incoming_emails WHERE user_id = $1',
      [userId]
    );

    return NextResponse.json({
      success: true,
      user: userCheck.rows[0] || null,
      emails: emailsResult.rows,
      total: countResult.rows[0].total,
      userId: userId
    });

  } catch (error) {
    console.error('Test inbox error:', error);
    return NextResponse.json({ 
      error: 'Failed to test inbox',
      details: error.message
    }, { status: 500 });
  }
}
