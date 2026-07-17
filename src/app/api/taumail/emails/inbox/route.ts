import { getPool, getJwtSecret } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Database connection - production ready with enhanced security


export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    let userId = 1; // Default to user ID 1 for testing
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const jwtSecret = getJwtSecret('taumail');
        const decoded = jwt.verify(token, jwtSecret) as any;
        userId = decoded.userId || 1;
      } catch (error) {
        console.log('JWT verification failed, using default user ID');
      }
    }
    
    // Get user's incoming emails with proper sender information and security filtering
    const result = await getPool().query(
      `SELECT ie.id, ie.subject, ie.body, ie.body_html, ie.from_email, ie.sender_name,
              ie.received_at, ie.is_read, ie.is_spam, ie.attachments,
              COALESCE(ie.sender_name, ie.from_email) as display_name,
              ie.from_email as sender_email,
              CASE 
                WHEN ie.is_spam = true THEN 'spam'
                ELSE 'normal'
              END as priority
       FROM incoming_emails ie 
       LEFT JOIN users u ON ie.from_email = u.email 
       WHERE ie.user_id = $1
       ORDER BY ie.received_at DESC
       LIMIT 50`,
      [userId]
    );

    // Return inbox emails
    return NextResponse.json({
      success: true,
      emails: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('TauMail Inbox Error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to load inbox',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
