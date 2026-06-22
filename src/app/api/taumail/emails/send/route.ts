import { getPool, getJwtSecret, isProductionDeploy } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

// Database connection - production ready with enhanced error handling


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
    const jwtSecret = getJwtSecret('taumail');
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    const { to, subject, body, cc, bcc } = await request.json();
    
    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user details for sender info
    const userResult = await getPool().query(
      'SELECT username, email FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult.rows[0];
    const fromEmail = user.email || `saleena@tauos.org`;

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
    
    if (!process.env.SENDGRID_API_KEY) {
      if (isProductionDeploy()) {
        return NextResponse.json({ error: 'Mail service not configured' }, { status: 503 });
      }
      console.warn('SendGrid not configured — development only');
    } else {
      try {
        response = await sgMail.send(msg);
        messageId = response[0].headers['x-message-id'] || messageId;
      } catch (sgError) {
        console.error('SendGrid Error:', sgError);
        return NextResponse.json({ error: 'Failed to send email via mail provider' }, { status: 502 });
      }
    }

    // Log email details for debugging
    console.log('📧 Email Sent via SendGrid:');
    console.log('From:', msg.from);
    console.log('To:', msg.to);
    console.log('Subject:', msg.subject);
    console.log('Message ID:', messageId);
    console.log('---');

    // Save email to sent_emails table
    const result = await getPool().query(
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
