import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import nodemailer from 'nodemailer';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// SMTP Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Welcome email template
const getWelcomeEmailTemplate = (userName: string, userEmail: string) => {
  return {
    subject: `Welcome to TauOS, ${userName}! 🚀`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to TauOS</title>
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
            <h1>🎉 Welcome to TauOS, ${userName}!</h1>
            <p>Your privacy-first, AI-native operating system is ready</p>
          </div>
          
          <div class="content">
            <p>Dear ${userName},</p>
            
            <p>Welcome to the future of computing! You've just joined the TauOS community - a revolutionary operating system that puts your privacy first while delivering cutting-edge AI capabilities.</p>
            
            <h2>🌟 What makes TauOS special?</h2>
            
            <div class="feature">
              <h3>🔒 Privacy-First Design</h3>
              <p>Your data stays on your device. No tracking, no surveillance, no data collection.</p>
            </div>
            
            <div class="feature">
              <h3>🤖 AI-Native Experience</h3>
              <p>Built-in AI capabilities that work locally, keeping your data private while providing intelligent assistance.</p>
            </div>
            
            <div class="feature">
              <h3>🌐 Complete Ecosystem</h3>
              <p>TauMail, TauCloud, TauID, and more - all designed to work together seamlessly.</p>
            </div>
            
            <h2>🚀 Get Started</h2>
            <p>Here's what you can do next:</p>
            <ul>
              <li>📧 Set up your TauMail account for secure email</li>
              <li>☁️ Configure TauCloud for private file storage</li>
              <li>🆔 Create your TauID for secure identity management</li>
              <li>🛍️ Explore the TauStore for privacy-focused applications</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://tauos.vercel.app/taumail" class="button">Open TauMail</a>
              <a href="https://tauos.vercel.app/taucloud" class="button">Access TauCloud</a>
            </div>
            
            <h2>📚 Need Help?</h2>
            <p>We're here to help you get the most out of TauOS:</p>
            <ul>
              <li>📖 <a href="https://tauos.vercel.app/docs">Documentation Hub</a> - Complete guides and tutorials</li>
              <li>❓ <a href="https://tauos.vercel.app/docs/faq">FAQ</a> - Common questions answered</li>
              <li>💬 <a href="https://tauos.vercel.app/contact">Contact Support</a> - Get help from our team</li>
              <li>🌍 <a href="https://tauos.vercel.app/docs/community">Community</a> - Connect with other users</li>
            </ul>
            
            <h2>🎯 Your Privacy Matters</h2>
            <p>At TauOS, we believe that privacy is a fundamental human right. That's why we've built an operating system that:</p>
            <ul>
              <li>✅ Never collects your personal data</li>
              <li>✅ Never tracks your activities</li>
              <li>✅ Never sells your information</li>
              <li>✅ Gives you complete control over your digital life</li>
            </ul>
            
            <p>Welcome to a new era of computing where you're in control!</p>
            
            <p>Best regards,<br>
            The TauOS Team</p>
          </div>
          
          <div class="footer">
            <p>This email was sent to ${userEmail} because you created a TauOS account.</p>
            <p>© 2025 TauOS. All rights reserved. | <a href="https://tauos.vercel.app/legal/privacy">Privacy Policy</a> | <a href="https://tauos.vercel.app/legal/terms">Terms of Service</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to TauOS, ${userName}!

Your privacy-first, AI-native operating system is ready.

What makes TauOS special:
- Privacy-First Design: Your data stays on your device
- AI-Native Experience: Built-in AI capabilities that work locally
- Complete Ecosystem: TauMail, TauCloud, TauID, and more

Get Started:
- Set up your TauMail account for secure email
- Configure TauCloud for private file storage
- Create your TauID for secure identity management
- Explore the TauStore for privacy-focused applications

Need Help?
- Documentation Hub: https://tauos.vercel.app/docs
- FAQ: https://tauos.vercel.app/docs/faq
- Contact Support: https://tauos.vercel.app/contact
- Community: https://tauos.vercel.app/docs/community

Your Privacy Matters:
At TauOS, we believe that privacy is a fundamental human right. We never collect, track, or sell your personal data.

Welcome to a new era of computing where you're in control!

Best regards,
The TauOS Team

This email was sent to ${userEmail} because you created a TauOS account.
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

    // Check if welcome email is enabled
    if (process.env.WELCOME_EMAIL_ENABLED !== 'true') {
      return NextResponse.json({
        success: true,
        message: 'Welcome email is disabled',
        sent: false
      });
    }

    const client = await pool.connect();

    // Check if user already received welcome email
    const existingWelcome = await client.query(
      'SELECT id FROM emails WHERE recipient_email = $1 AND subject LIKE $2',
      [userEmail, '%Welcome to TauOS%']
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

    // Send welcome email
    const mailOptions = {
      from: process.env.WELCOME_EMAIL_FROM || 'noreply@tauos.org',
      to: userEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    };

    const info = await transporter.sendMail(mailOptions);

    // Save email to database
    await client.query(`
      INSERT INTO emails (sender_email, recipient_email, subject, body, status, sent_at, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    `, [
      process.env.WELCOME_EMAIL_FROM || 'noreply@tauos.org',
      userEmail,
      emailTemplate.subject,
      emailTemplate.html,
      'sent'
    ]);

    client.release();

    console.log(`✅ Welcome email sent to ${userEmail} for user ${userName}`);

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully',
      messageId: info.messageId,
      sent: true
    });

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send welcome email' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect();
    
    // Get welcome email statistics
    const result = await client.query(`
      SELECT 
        COUNT(*) as total_sent,
        COUNT(CASE WHEN sent_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as sent_today,
        COUNT(CASE WHEN sent_at >= NOW() - INTERVAL '7 days' THEN 1 END) as sent_this_week
      FROM emails 
      WHERE subject LIKE '%Welcome to TauOS%'
    `);

    client.release();

    return NextResponse.json({
      success: true,
      statistics: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching welcome email statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
