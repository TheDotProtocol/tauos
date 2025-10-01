import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Use the EXACT same database connection as the webhook
const pool = new Pool({
  connectionString: 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 SIMPLE INBOX API - DIRECT DATABASE CONNECTION');
    
    // Get user ID from the request (default to saleena's ID)
    const userId = '00000000-0000-0000-0000-000000000001';
    
    console.log('🔍 Querying database for user:', userId);
    
    // Direct query to the incoming_emails table
    const result = await pool.query(`
      SELECT 
        id, 
        from_email, 
        subject, 
        body, 
        received_at, 
        is_read, 
        is_spam
      FROM incoming_emails 
      WHERE user_id = $1
      ORDER BY received_at DESC 
      LIMIT 50
    `, [userId]);
    
    console.log('🔍 Found emails:', result.rows.length);
    
    return NextResponse.json({
      success: true,
      emails: result.rows,
      total: result.rows.length,
      message: 'Simple inbox API working'
    });

  } catch (error) {
    console.error('Simple inbox error:', error);
    return NextResponse.json({ 
      error: 'Simple inbox failed',
      details: error.message
    }, { status: 500 });
  }
}
