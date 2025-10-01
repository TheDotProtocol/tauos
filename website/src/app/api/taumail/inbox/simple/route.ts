import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// SIMPLE API - QUERY ONLY, NO COMPLEX LOGIC
const pool = new Pool({
  connectionString: 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 SIMPLE API - Starting...');
    
    // QUERY ONLY - Simple database query
    const result = await pool.query(`
      SELECT id, subject, body, from_email, sender_name, 
             received_at, is_read, is_spam
      FROM incoming_emails 
      WHERE user_id = '00000000-0000-0000-0000-000000000001'
      ORDER BY received_at DESC
      LIMIT 50
    `);
    
    console.log('🚀 SIMPLE API - Found', result.rows.length, 'emails');
    
    return NextResponse.json({
      success: true,
      emails: result.rows,
      total: result.rows.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ SIMPLE API ERROR:', error);
    return NextResponse.json({ 
      error: 'Failed to load inbox',
      details: error.message
    }, { status: 500 });
  }
}
