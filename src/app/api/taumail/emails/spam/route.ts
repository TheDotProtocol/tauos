import { getPool, getJwtSecret } from '@/lib/db-pool';
import { stripAttachmentContentForList } from '@/lib/taumail-inbound';
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
    
    // Get user's spam emails
    const result = await getPool().query(
      `SELECT ie.*, u.username as sender_username 
       FROM incoming_emails ie 
       LEFT JOIN users u ON ie.from_email = u.email 
       WHERE ie.user_id = $1 AND ie.is_spam = true 
       ORDER BY ie.received_at DESC`,
      [decoded.userId]
    );

    return NextResponse.json({
      success: true,
      emails: result.rows.map((row) => ({
        ...row,
        attachments: stripAttachmentContentForList(row.attachments),
      })),
    });

  } catch (error) {
    console.error('TauMail Spam Error:', error);
    return NextResponse.json({ 
      error: 'Failed to load spam emails',
      details: error.message
    }, { status: 500 });
  }
}
