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
    // Test if we can query the table directly
    const result = await pool.query(`
      SELECT id, user_id, from_email, subject, received_at
      FROM incoming_emails 
      ORDER BY received_at DESC 
      LIMIT 3
    `);

    return NextResponse.json({
      success: true,
      message: 'Table query successful',
      emails: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Table test error:', error);
    return NextResponse.json({ 
      error: 'Table query failed',
      details: error.message,
      errorCode: error.code
    }, { status: 500 });
  }
}
