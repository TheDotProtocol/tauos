import { NextRequest, NextResponse } from 'next/server';
import { unifiedPool } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DATABASE CONNECTIVITY TEST');
    
    // Test 1: Check if we can connect to database
    const dbInfo = await unifiedPool.query('SELECT current_database(), current_user, version()');
    
    // Test 2: Check if incoming_emails table exists
    const tableExists = await unifiedPool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'incoming_emails'
      );
    `);
    
    // Test 3: Count total emails
    const emailCount = await unifiedPool.query('SELECT COUNT(*) as count FROM incoming_emails');
    
    // Test 4: Get recent emails
    const recentEmails = await unifiedPool.query(`
      SELECT id, user_id, from_email, subject, received_at 
      FROM incoming_emails 
      ORDER BY received_at DESC 
      LIMIT 5
    `);
    
    // Test 5: Check saleena user
    const saleenaUser = await unifiedPool.query(`
      SELECT id, username, email 
      FROM users 
      WHERE email = 'saleena@tauos.org'
    `);
    
    // Test 6: Check emails for saleena specifically
    const saleenaEmails = await unifiedPool.query(`
      SELECT COUNT(*) as count 
      FROM incoming_emails 
      WHERE user_id = (SELECT id FROM users WHERE email = 'saleena@tauos.org')
    `);
    
    return NextResponse.json({
      success: true,
      database: dbInfo.rows[0],
      tableExists: tableExists.rows[0].exists,
      totalEmails: emailCount.rows[0].count,
      recentEmails: recentEmails.rows,
      saleenaUser: saleenaUser.rows,
      saleenaEmails: saleenaEmails.rows[0].count,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database test error:', error);
    return NextResponse.json({ 
      error: 'Database test failed',
      details: error.message
    }, { status: 500 });
  }
}