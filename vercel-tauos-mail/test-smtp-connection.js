const nodemailer = require('nodemailer');

async function testSMTPConnection() {
    console.log('🧪 Testing SMTP Connection...\n');
    
    // Test configuration
    const config = {
        host: '34.30.189.200',
        port: 587,
        secure: false,
        auth: {
            user: 'noreply',
            pass: 'TauOS2024!Secure'
        },
        tls: {
            rejectUnauthorized: false
        }
    };
    
    console.log('📧 SMTP Configuration:');
    console.log(`   Host: ${config.host}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   User: ${config.auth.user}`);
    console.log(`   Pass: ${config.auth.pass ? '***' : 'NOT SET'}\n`);
    
    try {
        // Create transporter
        console.log('🔌 Creating SMTP transporter...');
        const transporter = nodemailer.createTransport(config);
        
        // Verify connection
        console.log('🔍 Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully!\n');
        
        // Test email
        console.log('📤 Sending test email...');
        const info = await transporter.sendMail({
            from: 'noreply@tauos.org',
            to: 'test@example.com',
            subject: 'Test from TauOS SMTP',
            text: 'This is a test email from TauOS SMTP server.',
            html: '<p>This is a test email from <strong>TauOS SMTP server</strong>.</p>'
        });
        
        console.log('✅ Test email sent successfully!');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Response: ${info.response}`);
        
    } catch (error) {
        console.log('❌ SMTP connection failed:');
        console.log(`   Error: ${error.message}`);
        console.log(`   Code: ${error.code}`);
        console.log(`   Command: ${error.command}`);
    }
}

testSMTPConnection(); 