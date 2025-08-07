const nodemailer = require('nodemailer');

// Email configuration for our AWS email server
const transporter = nodemailer.createTransport({
  host: '54.156.132.149', // Our AWS email server IP
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: 'test@tauos.org',
    pass: 'tauostest2024!'
  },
  tls: {
    rejectUnauthorized: false // For self-signed certificates
  }
});

// Email content
const emailContent = {
  from: '"TauOS Email Server" <test@tauos.org>',
  to: 'njmsweettie@gmail.com, akumartrabaajo@gmail.com',
  subject: '🎉 TauOS Email Server is Live! Welcome!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🚀 TauOS Email Server is Live!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Welcome to our new AWS email infrastructure</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0;">🎉 Welcome to TauOS Email!</h2>
        
        <p style="color: #666; line-height: 1.6;">
          This email was sent from our <strong>brand new AWS email server</strong> running on <code>smtptauos.tauos.org</code>!
        </p>
        
        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c5aa0; margin-top: 0;">✅ What's Working:</h3>
          <ul style="color: #666;">
            <li>✅ SMTP Server: Postfix on AWS EC2 (54.156.132.149)</li>
            <li>✅ IMAP Server: Dovecot with SSL</li>
            <li>✅ DNS Resolution: smtptauos.tauos.org → 54.156.132.149</li>
            <li>✅ Security: DKIM, DMARC, SPF configured</li>
            <li>✅ Privacy: Zero telemetry, complete control</li>
          </ul>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          <strong>This is a fully independent email service</strong> - no Gmail, no SendGrid, no third-party dependencies. 
          Just pure, privacy-first email infrastructure running on our own AWS servers.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://mail.tauos.org" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
            🌐 Try TauMail Web Interface
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 14px; text-align: center;">
          <strong>Server Details:</strong><br>
          SMTP: smtptauos.tauos.org:587<br>
          IMAP: imaptauos.tauos.org:993<br>
          IP: 54.156.132.149<br>
          Account: test@tauos.org
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>🎯 <strong>Mission Accomplished!</strong> We now have a complete, independent email infrastructure!</p>
      </div>
    </div>
  `,
  text: `
🎉 TauOS Email Server is Live! Welcome!

This email was sent from our brand new AWS email server running on smtptauos.tauos.org!

✅ What's Working:
- SMTP Server: Postfix on AWS EC2 (54.156.132.149)
- IMAP Server: Dovecot with SSL
- DNS Resolution: smtptauos.tauos.org → 54.156.132.149
- Security: DKIM, DMARC, SPF configured
- Privacy: Zero telemetry, complete control

This is a fully independent email service - no Gmail, no SendGrid, no third-party dependencies. Just pure, privacy-first email infrastructure running on our own AWS servers.

🌐 Try TauMail Web Interface: https://mail.tauos.org

Server Details:
- SMTP: smtptauos.tauos.org:587
- IMAP: imaptauos.tauos.org:993
- IP: 54.156.132.149
- Account: test@tauos.org

🎯 Mission Accomplished! We now have a complete, independent email infrastructure!
  `
};

// Send the email
async function sendTestEmail() {
  try {
    console.log('📧 Sending test email from our AWS email server...');
    console.log('📤 From: test@tauos.org');
    console.log('📥 To: njmsweettie@gmail.com, akumartrabaajo@gmail.com');
    console.log('🌐 Server: smtptauos.tauos.org:587');
    
    const info = await transporter.sendMail(emailContent);
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📤 Response:', info.response);
    
    console.log('\n🎉 TauOS Email Server is officially LIVE!');
    console.log('📧 Check your inboxes for the test email!');
    
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if SMTP port 587 is open');
    console.log('2. Verify server is running');
    console.log('3. Check authentication credentials');
  }
}

// Run the test
sendTestEmail(); 