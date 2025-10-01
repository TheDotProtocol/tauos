import { NextRequest, NextResponse } from 'next/server';
import { unifiedPool } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 TESTING FIXED DATABASE');
    
    // Test the exact same query that should work now
    const result = await unifiedPool.query(`
      SELECT ie.id, ie.subject, ie.body, ie.from_email, ie.sender_name, 
             ie.received_at, ie.is_read, ie.is_spam
      FROM incoming_emails ie 
      WHERE ie.user_id = (SELECT id FROM users WHERE email = 'saleena@tauos.org')
      ORDER BY ie.received_at DESC
      LIMIT 10
    `);
    
    console.log('🔍 FIXED DB TEST - Found', result.rows.length, 'emails');
    
    return NextResponse.json({
      success: true,
      emails: result.rows,
      total: result.rows.length,
      message: 'Database fix successful!'
    });
    
  } catch (error) {
    console.error('❌ Fixed DB test error:', error);
    return NextResponse.json({ 
      error: 'Fixed DB test failed',
      details: error.message
    }, { status: 500 });
  }
}
