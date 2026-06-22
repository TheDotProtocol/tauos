import { getPool, getJwtSecret } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Database connection - production ready with enhanced error handling


// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Welcome email template
const getWelcomeEmailTemplate = (userName: string, userEmail: string) => {
  return {
    subject: `Welcome to TauOS Mail, ${userName}! 🚀`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to TauOS Mail</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to TauOS Mail, ${userName}!</h1>
            <p>Your privacy-first email experience starts now</p>
          </div>
          
          <div class="content">
            <p>Dear ${userName},</p>
            
            <p>Welcome to <strong>TauOS Mail</strong> - the most secure, privacy-focused email service built for the modern world!</p>
            
            <div class="feature">
              <h3>🔒 Privacy First</h3>
              <p>Your emails are encrypted end-to-end. We never read your messages or sell your data.</p>
            </div>
            
            <div class="feature">
              <h3>🚀 AI-Powered</h3>
              <p>Smart features powered by advanced AI to help you manage your inbox efficiently.</p>
            </div>
            
            <div class="feature">
              <h3>🌍 Global Access</h3>
              <p>Access your email from anywhere in the world with our secure, fast infrastructure.</p>
            </div>
            
            <p>Your account is ready to use! You can start sending and receiving emails immediately.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.tauos.org/taumail/dashboard" class="button">Access Your Inbox</a>
            </div>
            
            <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>
            
            <p>Welcome aboard!</p>
            <p><strong>The TauOS Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This email was sent to ${userEmail}</p>
            <p>TauOS Mail - Privacy-First Email Service</p>
            <p>© 2025 TauOS. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to TauOS Mail, ${userName}!

Your privacy-first email experience starts now.

🔒 Privacy First - Your emails are encrypted end-to-end. We never read your messages or sell your data.
🚀 AI-Powered - Smart features powered by advanced AI to help you manage your inbox efficiently.
🌍 Global Access - Access your email from anywhere in the world with our secure, fast infrastructure.

Your account is ready to use! You can start sending and receiving emails immediately.

Access your inbox: https://www.tauos.org/taumail/dashboard

If you have any questions or need help getting started, don't hesitate to reach out to our support team.

Welcome aboard!
The TauOS Team

This email was sent to ${userEmail}
TauOS Mail - Privacy-First Email Service
© 2025 TauOS. All rights reserved.
    `
  };
};

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName } = await request.json();

    if (!userEmail || !userName) {
      return NextResponse.json(
        { success: false, error: 'User email and name are required' },
        { status: 400 }
      );
    }

    // Check if SendGrid API key is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('SendGrid API key not configured, welcome email disabled');
      return NextResponse.json({
        success: true,
        message: 'Welcome email is disabled - SendGrid not configured',
        sent: false
      });
    }

    const client = await getPool().connect();

    // Check if user already received welcome email
    const existingWelcome = await client.query(
      'SELECT id FROM incoming_emails WHERE from_email = $1 AND subject LIKE $2',
      ['noreply@tauos.org', '%Welcome to TauOS Mail%']
    );

    if (existingWelcome.rows.length > 0) {
      client.release();
      return NextResponse.json({
        success: true,
        message: 'Welcome email already sent to this user',
        sent: false
      });
    }

    // Get welcome email template
    const emailTemplate = getWelcomeEmailTemplate(userName, userEmail);

    // Send welcome email via SendGrid
    const msg = {
      to: userEmail,
      from: 'noreply@tauos.org',
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    };

    const info = await sgMail.send(msg);

    // Save email to database as incoming email (simulating it being received)
    await client.query(`
      INSERT INTO incoming_emails (user_id, from_email, sender_name, subject, body, received_at, is_read, is_spam)
      VALUES ($1, $2, $3, $4, $5, NOW(), false, false)
    `, [
      1, // Default user ID for welcome emails
      'noreply@tauos.org',
      'TauOS Team',
      emailTemplate.subject,
      emailTemplate.html
    ]);

    client.release();

    console.log(`✅ Welcome email sent to ${userEmail} for user ${userName}`);

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully',
      sent: true
    });

  } catch (error) {
    console.error('Welcome email error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to send welcome email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
