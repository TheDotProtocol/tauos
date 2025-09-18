import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

// Database connection - using IPv4 compatible URL
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tauos-secret-key-change-in-production') as any;
    
    // Get user's spam emails
    const result = await pool.query(
      `SELECT ie.*, u.username as sender_username 
       FROM incoming_emails ie 
       LEFT JOIN users u ON ie.sender_email = u.email 
       WHERE ie.user_id = $1 AND ie.is_spam = true 
       ORDER BY ie.received_at DESC`,
      [decoded.userId]
    );

    return NextResponse.json({
      success: true,
      emails: result.rows
    });

  } catch (error) {
    console.error('TauMail Spam Error:', error);
    return NextResponse.json({ 
      error: 'Failed to load spam emails',
      details: error.message
    }, { status: 500 });
  }
}
