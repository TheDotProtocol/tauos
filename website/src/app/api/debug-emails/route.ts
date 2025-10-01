import { NextRequest, NextResponse } from 'next/server';
import { unifiedPool } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG EMAILS ENDPOINT');
    
    // Get all emails from incoming_emails table
    const allEmails = await unifiedPool.query(`
      SELECT id, user_id, from_email, subject, received_at 
      FROM incoming_emails 
      ORDER BY received_at DESC 
      LIMIT 10
    `);
    
    // Get all users
    const users = await unifiedPool.query(`
      SELECT id, username, email 
      FROM users 
      WHERE email = 'saleena@tauos.org'
    `);
    
    // Get total count
    const totalCount = await unifiedPool.query('SELECT COUNT(*) as count FROM incoming_emails');
    
    return NextResponse.json({
      success: true,
      totalEmails: totalCount.rows[0].count,
      recentEmails: allEmails.rows,
      saleenaUser: users.rows,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Debug emails error:', error);
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error.message
    }, { status: 500 });
  }
}