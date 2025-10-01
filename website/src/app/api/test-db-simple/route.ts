import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// SIMPLE TEST API - DIRECT DATABASE CONNECTION
const pool = new Pool({
  connectionString: 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 SIMPLE DB TEST - Starting...');
    
    // Test 1: Basic connection
    const connectionTest = await pool.query('SELECT current_database(), current_user, version()');
    console.log('🧪 Connection test:', connectionTest.rows[0]);
    
    // Test 2: Check if table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'incoming_emails'
      );
    `);
    console.log('🧪 Table exists:', tableCheck.rows[0]);
    
    // Test 3: Count emails
    const emailCount = await pool.query('SELECT COUNT(*) FROM incoming_emails');
    console.log('🧪 Email count:', emailCount.rows[0]);
    
    // Test 4: Get sample emails
    const sampleEmails = await pool.query(`
      SELECT id, subject, from_email, received_at
      FROM incoming_emails 
      ORDER BY received_at DESC 
      LIMIT 5
    `);
    console.log('🧪 Sample emails:', sampleEmails.rows.length);
    
    return NextResponse.json({
      success: true,
      connection: connectionTest.rows[0],
      tableExists: tableCheck.rows[0].exists,
      emailCount: emailCount.rows[0].count,
      sampleEmails: sampleEmails.rows,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ SIMPLE DB TEST ERROR:', error);
    return NextResponse.json({ 
      error: 'Database test failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
