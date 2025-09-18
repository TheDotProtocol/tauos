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

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tauos-secret-key-change-in-production') as any;
    
    const { to, subject, body } = await request.json();
    
    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save email to sent_emails table
    const result = await pool.query(
      `INSERT INTO sent_emails (user_id, recipient_email, subject, body, sent_at, status) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 'sent') 
       RETURNING id, recipient_email, subject, sent_at`,
      [decoded.userId, to, subject, body]
    );

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      email: result.rows[0]
    });

  } catch (error) {
    console.error('TauMail Send Email Error:', error);
    return NextResponse.json({ 
      error: 'Failed to send email',
      details: error.message
    }, { status: 500 });
  }
}
