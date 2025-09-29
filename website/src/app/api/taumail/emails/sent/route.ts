import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Database connection - production ready with enhanced error handling
const pool = new Pool({
  connectionString = process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
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
    
    // Get user's sent emails
    const result = await pool.query(
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
