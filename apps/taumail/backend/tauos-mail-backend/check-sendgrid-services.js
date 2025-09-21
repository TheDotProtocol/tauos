const https = require('https');

// Check what SendGrid services are available
const checkSendGridServices = () => {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
        console.error('❌ SENDGRID_API_KEY not found');
        return;
    }

    // Check user info to see what's available
    const options = {
        hostname: 'api.sendgrid.com',
        port: 443,
        path: '/v3/user',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log('📋 SendGrid User Info:');
            const userInfo = JSON.parse(data);
            console.log(JSON.stringify(userInfo, null, 2));
            
            // Check if we can use Mailgun or another service
            console.log('\n💡 Alternative Solutions:');
            console.log('1. Use Mailgun for email receiving');
            console.log('2. Set up our own SMTP server');
            console.log('3. Use a different email service provider');
            console.log('4. Configure SendGrid Event Webhook for incoming emails');
        });
    });

    req.on('error', (e) => {
        console.error('❌ Error checking SendGrid services:', e.message);
    });

    req.end();
};

checkSendGridServices();
