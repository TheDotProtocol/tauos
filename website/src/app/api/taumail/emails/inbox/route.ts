import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

// Database connection - production ready
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
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
    const jwtSecret = process.env.JWT_SECRET || 'tauos-prod-jwt-secret-2025-launch-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Get user's incoming emails
    const result = await pool.query(
      `SELECT ie.*, u.username as sender_username 
       FROM incoming_emails ie 
       LEFT JOIN users u ON ie.from_email = u.email 
       WHERE ie.user_id = $1 
       ORDER BY ie.received_at DESC`,
      [decoded.userId]
    );

    return NextResponse.json({
      success: true,
      emails: result.rows
    });

  } catch (error) {
    console.error('TauMail Inbox Error:', error);
    return NextResponse.json({ 
      error: 'Failed to load inbox',
      details: error.message
    }, { status: 500 });
  }
}
