import { NextRequest, NextResponse } from 'next/server';
import { unifiedPool, testDatabaseConnection } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG DATABASE ENDPOINT CALLED');
    
    // Test database connection
    const dbInfo = await testDatabaseConnection();
    
    // Check if incoming_emails table exists
    const tableCheck = await unifiedPool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'incoming_emails'
      );
    `);
    
    // Count total emails in database
    const emailCount = await unifiedPool.query('SELECT COUNT(*) as count FROM incoming_emails');
    
    // Get recent emails
    const recentEmails = await unifiedPool.query(`
      SELECT id, from_email, subject, received_at 
      FROM incoming_emails 
      ORDER BY received_at DESC 
      LIMIT 10
    `);
    
    // Get all users
    const users = await unifiedPool.query('SELECT id, username, email FROM users LIMIT 5');
    
    return NextResponse.json({
      success: true,
      database: dbInfo,
      tableExists: tableCheck.rows[0].exists,
      totalEmails: emailCount.rows[0].count,
      recentEmails: recentEmails.rows,
      users: users.rows,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database Debug Error:', error);
    return NextResponse.json({ 
      error: 'Database debug failed',
      details: error.message
    }, { status: 500 });
  }
}
