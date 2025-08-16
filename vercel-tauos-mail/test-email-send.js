const { Pool } = require('pg');
const nodemailer = require('nodemailer');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

// SMTP Configuration
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

const mailtrapConfig = {
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER || 'e5b253ac8d7940',
    pass: process.env.MAILTRAP_PASS || 'dd6f3ec509aec7'
  }
};

async function testEmailSending() {
  try {
    console.log('🧪 Testing email sending functionality...');
    
    // Test 1: Check database connection
    console.log('\n1. Testing database connection...');
    const dbTest = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', dbTest.rows[0]);
    
    // Test 2: Check if emails table has message_id column
    console.log('\n2. Checking emails table structure...');
    const tableCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'emails' 
      AND column_name = 'message_id'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ message_id column does not exist in emails table');
      console.log('💡 Run the fix-emails-schema.sql in Supabase SQL Editor');
      return;
    } else {
      console.log('✅ message_id column exists');
    }
    
    // Test 3: Check if there are any users
    console.log('\n3. Checking for users...');
    const usersCheck = await pool.query('SELECT id, username, email, organization_id FROM users LIMIT 1');
    
    if (usersCheck.rows.length === 0) {
      console.log('❌ No users found in database');
      return;
    }
    
    const testUser = usersCheck.rows[0];
    console.log('✅ Found user:', testUser);
    
    // Test 4: Test SMTP connection
    console.log('\n4. Testing SMTP connection...');
    let transporter = nodemailer.createTransport(smtpConfig);
    
    try {
      await transporter.verify();
      console.log('✅ Primary SMTP working');
    } catch (smtpError) {
      console.log('❌ Primary SMTP failed:', smtpError.message);
      console.log('🔄 Trying Mailtrap...');
      
      transporter = nodemailer.createTransport(mailtrapConfig);
      try {
        await transporter.verify();
        console.log('✅ Mailtrap SMTP working');
      } catch (mailtrapError) {
        console.log('❌ Mailtrap also failed:', mailtrapError.message);
        console.log('⚠️  No SMTP available');
        return;
      }
    }
    
    // Test 5: Try to send a test email
    console.log('\n5. Testing email sending...');
    const mailOptions = {
      from: testUser.email,
      to: 'test@example.com',
      subject: 'Test Email from TauMail',
      text: 'This is a test email from TauMail system.',
      html: '<div>This is a test email from TauMail system.</div>'
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully:', info.messageId);
    
    // Test 6: Try to store email in database
    console.log('\n6. Testing database storage...');
    const insertResult = await pool.query(
      `INSERT INTO emails (organization_id, sender_id, recipient_id, subject, body, message_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [testUser.organization_id, testUser.id, testUser.id, 'Test Email', 'Test body', info.messageId]
    );
    
    console.log('✅ Email stored in database with ID:', insertResult.rows[0].id);
    
    // Clean up test email
    await pool.query('DELETE FROM emails WHERE id = $1', [insertResult.rows[0].id]);
    console.log('✅ Test email cleaned up');
    
    console.log('\n🎉 All tests passed! Email sending should work.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
  } finally {
    await pool.end();
  }
}

testEmailSending(); 