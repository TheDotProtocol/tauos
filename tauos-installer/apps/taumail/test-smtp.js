const nodemailer = require('nodemailer');
require('dotenv').config();

const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
};

console.log('SMTP Config:', smtpConfig);

async function testSMTP() {
    try {
        const transporter = nodemailer.createTransport(smtpConfig);
        await transporter.verify();
        console.log('✅ SMTP connection successful!');
    } catch (error) {
        console.error('❌ SMTP connection failed:', error.message);
        console.error('Full error:', error);
    }
}

testSMTP();
