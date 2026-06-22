import { getPool, getJwtSecret } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Database connection - production ready with enhanced error handling


export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify token
    const jwtSecret = getJwtSecret('taumail');
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Get user's sent emails
    const result = await getPool().query(
      `SELECT se.*, u.username as sender_username 
       FROM sent_emails se 
       LEFT JOIN users u ON se.user_id = u.id::text 
       WHERE se.user_id = $1 
       ORDER BY se.sent_at DESC`,
      [decoded.userId]
    );

    return NextResponse.json({
      success: true,
      emails: result.rows
    });

  } catch (error) {
    console.error('TauMail Sent Emails Error:', error);
    return NextResponse.json({ 
      error: 'Failed to load sent emails',
      details: error.message
    }, { status: 500 });
  }
}
