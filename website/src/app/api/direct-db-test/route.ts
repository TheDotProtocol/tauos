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
    console.log('🔍 DIRECT DATABASE TEST - FORCE FRESH DEPLOYMENT');
    
    // Test 1: Check if table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'incoming_emails'
      );
    `);
    
    console.log('🔍 Table exists:', tableExists.rows[0].exists);
    
    // Test 2: Try to query the table directly
    let emails = [];
    let error = null;
    
    try {
      const result = await pool.query(`
        SELECT id, user_id, from_email, subject, received_at
        FROM incoming_emails 
        ORDER BY received_at DESC 
        LIMIT 5
      `);
      emails = result.rows;
      console.log('🔍 Direct query successful:', emails.length, 'emails');
    } catch (queryError) {
      error = queryError.message;
      console.log('🔍 Direct query failed:', error);
    }
    
    // Test 3: Check database connection
    const connectionTest = await pool.query('SELECT NOW() as current_time');
    
    return NextResponse.json({
      success: true,
      message: 'Direct database test completed',
      tableExists: tableExists.rows[0].exists,
      emails: emails,
      error: error,
      connectionTime: connectionTest.rows[0].current_time,
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
    });

  } catch (error) {
    console.error('Direct DB test error:', error);
    return NextResponse.json({ 
      error: 'Direct database test failed',
      details: error.message
    }, { status: 500 });
  }
}
