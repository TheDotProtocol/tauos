const nodemailer = require('nodemailer');

// Test SMTP configurations
async function testSMTP() {
  console.log('🔍 Testing SMTP Configurations...\n');

  // Primary SMTP config
  const smtpConfig = {
    host: 'mailserver.tauos.org',
    port: 587,
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

  // Mailtrap config
  const mailtrapConfig = {
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER || 'e5b253ac8d7940',
      pass: process.env.MAILTRAP_PASS || 'dd6f3ec509aec7'
    }
  };

  console.log('📧 Primary SMTP Config:');
  console.log('- Host:', smtpConfig.host);
  console.log('- Port:', smtpConfig.port);
  console.log('- User:', smtpConfig.auth.user);
  console.log('- Pass:', smtpConfig.auth.pass ? '***' : 'not_set');
  console.log('- Environment SMTP_USER:', process.env.SMTP_USER);
  console.log('- Environment SMTP_PASS:', process.env.SMTP_PASS ? '***' : 'not_set');

  console.log('\n📧 Mailtrap Config:');
  console.log('- Host:', mailtrapConfig.host);
  console.log('- Port:', mailtrapConfig.port);
  console.log('- User:', mailtrapConfig.auth.user);
  console.log('- Pass:', mailtrapConfig.auth.pass ? '***' : 'not_set');
  console.log('- Environment MAILTRAP_USER:', process.env.MAILTRAP_USER);
  console.log('- Environment MAILTRAP_PASS:', process.env.MAILTRAP_PASS ? '***' : 'not_set');

  // Test primary SMTP
  console.log('\n🔍 Testing Primary SMTP...');
  try {
    const primaryTransporter = nodemailer.createTransport(smtpConfig);
    await primaryTransporter.verify();
    console.log('✅ Primary SMTP is working!');
  } catch (error) {
    console.log('❌ Primary SMTP failed:', error.message);
  }

  // Test Mailtrap
  console.log('\n🔍 Testing Mailtrap...');
  try {
    const mailtrapTransporter = nodemailer.createTransport(mailtrapConfig);
    await mailtrapTransporter.verify();
    console.log('✅ Mailtrap is working!');
    
    // Test sending a real email
    console.log('\n📤 Testing email send via Mailtrap...');
    const info = await mailtrapTransporter.sendMail({
      from: 'test@tauos.org',
      to: 'test@example.com',
      subject: 'SMTP Test',
      text: 'This is a test email to verify SMTP is working.'
    });
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('📧 Check your Mailtrap inbox at: https://mailtrap.io/inboxes');
    
  } catch (error) {
    console.log('❌ Mailtrap failed:', error.message);
  }
}

// Run the test
testSMTP().catch(console.error); 