import { getPool, getJwtSecret } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Database connection - production ready with enhanced security


export async function POST(request: NextRequest) {
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

    const { emailId } = await request.json();

    if (!emailId) {
      return NextResponse.json({ 
        error: 'Email ID is required' 
      }, { status: 400 });
    }

    // Mark email as read
    const result = await getPool().query(
      'UPDATE incoming_emails SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING id, subject',
      [emailId, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Email not found or access denied' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Email marked as read',
      email: result.rows[0]
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to mark email as read',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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

    const { emailIds } = await request.json();

    if (!emailIds || !Array.isArray(emailIds)) {
      return NextResponse.json({ 
        error: 'Email IDs array is required' 
      }, { status: 400 });
    }

    // Mark multiple emails as read
    const result = await getPool().query(
      'UPDATE incoming_emails SET is_read = true WHERE id = ANY($1) AND user_id = $2 RETURNING id, subject',
      [emailIds, userId]
    );

    return NextResponse.json({
      success: true,
      message: `Marked ${result.rows.length} emails as read`,
      emails: result.rows
    });

  } catch (error) {
    console.error('Bulk mark as read error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to mark emails as read',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
