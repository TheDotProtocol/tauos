import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { unifiedPool, testDatabaseConnection, ensureIncomingEmailsTable } from '@/lib/database';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 INBOX API CALLED - SIMPLE DIRECT APPROACH -', new Date().toISOString());
    
    // SIMPLE DIRECT APPROACH - Just get emails without complex logic
    const result = await unifiedPool.query(`
      SELECT id, subject, body, from_email, sender_name, 
             received_at, is_read, is_spam
      FROM incoming_emails 
      WHERE user_id = '00000000-0000-0000-0000-000000000001'
      ORDER BY received_at DESC
      LIMIT 50
    `);
    
    console.log('🔍 SIMPLE APPROACH - Found', result.rows.length, 'emails');
    
    // SIMPLE APPROACH - No complex logic, just return the emails

    // Return inbox emails with cache-busting headers
    return NextResponse.json({
      success: true,
      emails: result.rows,
      total: result.rows.length,
      timestamp: new Date().toISOString(),
      cacheBust: Math.random()
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('TauMail Inbox Error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to load inbox',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

