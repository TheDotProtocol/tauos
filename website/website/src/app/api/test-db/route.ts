import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(request: NextRequest) {
  try {
    // Check if incoming_emails table exists and has data
    const emailsResult = await pool.query(`
      SELECT id, from_email, subject, received_at, user_id 
      FROM incoming_emails 
      ORDER BY received_at DESC 
      LIMIT 10
    `);

    // Check users table
    const usersResult = await pool.query(`
      SELECT id, username, email 
      FROM users 
      WHERE email LIKE '%saleena%' OR email LIKE '%tauos%'
      LIMIT 5
    `);

    return NextResponse.json({
      success: true,
      emails: emailsResult.rows,
      users: usersResult.rows,
      emailCount: emailsResult.rows.length,
      userCount: usersResult.rows.length
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}