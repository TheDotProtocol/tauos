const nodemailer = require('nodemailer');

// Test TauOS SMTP Server Configuration
async function testTauOSSMTP() {
  console.log('🔍 Testing TauOS Sovereign SMTP Server...\n');

  // TauOS SMTP config
  const tauosSmtpConfig = {
    host: process.env.SMTP_HOST || 'mailserver.tauos.org',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'noreply@tauos.org',
      pass: process.env.SMTP_PASS || ''
    },
    tls: {
      rejectUnauthorized: false
    },
    requireTLS: true
  };

  console.log('📧 TauOS SMTP Configuration:');
  console.log('- Host:', tauosSmtpConfig.host);
  console.log('- Port:', tauosSmtpConfig.port);
  console.log('- User:', tauosSmtpConfig.auth.user);
  console.log('- Pass:', tauosSmtpConfig.auth.pass ? '***' : 'not_set');
  console.log('- Environment SMTP_HOST:', process.env.SMTP_HOST);
  console.log('- Environment SMTP_PORT:', process.env.SMTP_PORT);
  console.log('- Environment SMTP_USER:', process.env.SMTP_USER);
  console.log('- Environment SMTP_PASS:', process.env.SMTP_PASS ? '***' : 'not_set');

  // Test TauOS SMTP connection
  console.log('\n🔍 Testing TauOS SMTP Connection...');
  try {
    const transporter = nodemailer.createTransport(tauosSmtpConfig);
    await transporter.verify();
    console.log('✅ TauOS SMTP server is working!');
    
    // Test sending a real email
    console.log('\n📤 Testing email send via TauOS SMTP...');
    const info = await transporter.sendMail({
      from: 'noreply@tauos.org',
      to: 'test@example.com',
      subject: 'TauOS SMTP Test',
      text: 'This is a test email from TauOS sovereign email infrastructure.',
      html: '<h1>TauOS Email Test</h1><p>This email was sent via our own SMTP server!</p>'
    });
    console.log('✅ Email sent successfully via TauOS SMTP!');
    console.log('Message ID:', info.messageId);
    console.log('📧 This email should reach real email addresses!');
    
  } catch (error) {
    console.log('❌ TauOS SMTP failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if mailserver.tauos.org is running');
    console.log('2. Verify SMTP credentials are correct');
    console.log('3. Check if port 587 is open');
    console.log('4. Verify DNS records (MX, SPF, DKIM)');
  }
}

// Run the test
testTauOSSMTP().catch(console.error); 