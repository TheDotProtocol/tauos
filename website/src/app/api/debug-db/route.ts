import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET(request: NextRequest) {
  try {
    // Test the exact same connection as webhook
    const pool = new Pool({
      connectionString: 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    
    // Test if we can query the table
    const result = await pool.query('SELECT COUNT(*) as count FROM incoming_emails');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      count: result.rows[0].count,
      connectionString: 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable'
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error.message
    }, { status: 500 });
  }
}
