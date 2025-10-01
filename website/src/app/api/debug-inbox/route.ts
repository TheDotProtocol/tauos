import { NextRequest, NextResponse } from 'next/server';
import { unifiedPool } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG INBOX - STARTING');
    
    // Test 1: Basic database connection
    console.log('🔍 Test 1: Database connection');
    const dbTest = await unifiedPool.query('SELECT current_database(), current_user');
    console.log('✅ Database connected:', dbTest.rows[0]);
    
    // Test 2: Check if table exists
    console.log('🔍 Test 2: Table existence');
    const tableTest = await unifiedPool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'incoming_emails'
      );
    `);
    console.log('✅ Table exists:', tableTest.rows[0].exists);
    
    // Test 3: Count total emails
    console.log('🔍 Test 3: Total emails');
    const countTest = await unifiedPool.query('SELECT COUNT(*) as count FROM incoming_emails');
    console.log('✅ Total emails:', countTest.rows[0].count);
    
    // Test 4: Get saleena user
    console.log('🔍 Test 4: Saleena user');
    const userTest = await unifiedPool.query(`
      SELECT id, username, email FROM users WHERE email = 'saleena@tauos.org'
    `);
    console.log('✅ Saleena user:', userTest.rows[0]);
    
    // Test 5: Get emails for saleena
    console.log('🔍 Test 5: Emails for saleena');
    const emailsTest = await unifiedPool.query(`
      SELECT ie.id, ie.subject, ie.from_email, ie.received_at
      FROM incoming_emails ie 
      WHERE ie.user_id = (SELECT id FROM users WHERE email = 'saleena@tauos.org')
      ORDER BY ie.received_at DESC
      LIMIT 5
    `);
    console.log('✅ Emails found:', emailsTest.rows.length);
    
    return NextResponse.json({
      success: true,
      database: dbTest.rows[0],
      tableExists: tableTest.rows[0].exists,
      totalEmails: countTest.rows[0].count,
      saleenaUser: userTest.rows[0],
      emails: emailsTest.rows,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ DEBUG INBOX ERROR:', error);
    return NextResponse.json({ 
      error: 'Debug inbox failed',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
