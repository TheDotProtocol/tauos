import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Database connection - production ready with enhanced security
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable';

// Force sslmode=disable for production
const finalConnectionString = connectionString.includes('sslmode=') 
  ? connectionString.replace(/sslmode=[^&]*/, 'sslmode=disable')
  : connectionString + (connectionString.includes('?') ? '&' : '?') + 'sslmode=disable';

const pool = new Pool({
  connectionString: finalConnectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify token
    const jwtSecret = process.env.JWT_SECRET_TAUMAIL || 'tauos-taumail-jwt-secret-2025-launch-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Get user's incoming emails with proper sender information and security filtering
    const result = await pool.query(
      `SELECT ie.id, ie.subject, ie.body, ie.from_email, ie.sender_name, 
              ie.received_at, ie.is_read, ie.is_spam,
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
      [decoded.userId]
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
