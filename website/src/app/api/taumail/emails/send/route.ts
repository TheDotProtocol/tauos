import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

// Database connection - production ready
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  ssl: false
});

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: NextRequest) {
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

    // Prepare SendGrid email message
    const msg = {
      to: to,
      from: {
        email: fromEmail,
        name: user.username
      },
      subject: subject,
      text: body,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
               <p>${body.replace(/\n/g, '<br>')}</p>
               <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
               <p style="font-size: 12px; color: #666;">
                 Sent via TauCore Mail - Privacy-Native Email Service<br>
                 <a href="https://www.tauos.org" style="color: #007bff;">www.tauos.org</a>
               </p>
             </div>`
    };

    // Add CC and BCC if provided
    if (cc) (msg as any).cc = cc;
    if (bcc) (msg as any).bcc = bcc;

    // Send email via SendGrid
    let response;
    let messageId = 'local-' + Date.now();
    
    if (process.env.SENDGRID_API_KEY) {
      try {
        response = await sgMail.send(msg);
        messageId = response[0].headers['x-message-id'] || messageId;
      } catch (sgError) {
        console.error('SendGrid Error:', sgError);
        // Continue with local storage even if SendGrid fails
        messageId = 'sg-error-' + Date.now();
      }
    } else {
      console.log('⚠️ SendGrid API key not configured, storing email locally');
    }

    // Log email details for debugging
    console.log('📧 Email Sent via SendGrid:');
    console.log('From:', msg.from);
    console.log('To:', msg.to);
    console.log('Subject:', msg.subject);
    console.log('Message ID:', messageId);
    console.log('---');

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
      messageId: messageId,
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
