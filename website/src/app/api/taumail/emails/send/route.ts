import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';

// Database connection - using IPv4 compatible URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  ssl: {
    rejectUnauthorized: false
  }
});

// Create SMTP transporter
const createTransporter = () => {
  // For development/testing, use a mock transporter that logs emails
  if (process.env.NODE_ENV === 'development' || !process.env.SMTP_USER) {
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    });
  }
  
  // Production SMTP configuration
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

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
    
    const { to, subject, body, cc, bcc } = await request.json();
    
    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user details for sender info
    const userResult = await pool.query(
      'SELECT username, email FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult.rows[0];
    const fromEmail = user.email || `${user.username}@tauos.org`;

    // Create email options
    const mailOptions = {
      from: `"${user.username}" <${fromEmail}>`,
      to: to,
      cc: cc || undefined,
      bcc: bcc || undefined,
      subject: subject,
      text: body,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
               <p>${body.replace(/\n/g, '<br>')}</p>
               <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
               <p style="font-size: 12px; color: #666;">
                 Sent via TauOS Mail - Privacy-Native Email Service<br>
                 <a href="https://www.tauos.org" style="color: #007bff;">www.tauos.org</a>
               </p>
             </div>`
    };

    // Send email via SMTP
    const transporter = createTransporter();
    const info = await (transporter as any).sendMail(mailOptions);

    // Generate a message ID for tracking
    const messageId = info.messageId || `tauos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Log email details for development
    if (process.env.NODE_ENV === 'development' || !process.env.SMTP_USER) {
      console.log('📧 Email Sent (Mock Mode):');
      console.log('From:', mailOptions.from);
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Message ID:', messageId);
      console.log('---');
    }

    // Save email to sent_emails table
    const result = await pool.query(
      `INSERT INTO sent_emails (user_id, recipient_email, subject, body, sent_at, smtp_status, message_id) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 'sent', $5) 
       RETURNING id, recipient_email, subject, sent_at`,
      [decoded.userId, to, subject, body, messageId]
    );

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      email: result.rows[0],
      messageId: info.messageId,
      from: fromEmail,
      fromName: user.username
    });

  } catch (error) {
    console.error('TauMail Send Email Error:', error);
    return NextResponse.json({ 
      error: 'Failed to send email',
      details: error.message
    }, { status: 500 });
  }
}
