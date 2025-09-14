const https = require('https');

// Configure SendGrid Inbound Parse to receive emails
const configureInboundParse = () => {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
        console.error('❌ SENDGRID_API_KEY not found');
        return;
    }

    const postData = JSON.stringify({
        "hostname": "tauos.org",
        "url": "https://tauos-47am.vercel.app/api/webhook/incoming-email",
        "spam_check": false,
        "send_raw": false
    });

    const options = {
        hostname: 'api.sendgrid.com',
        port: 443,
        path: '/v3/inbound/parse/settings',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            if (res.statusCode === 201) {
                console.log('✅ SendGrid Inbound Parse configured successfully');
                console.log('📧 Emails sent to @tauos.org will now be forwarded to our webhook');
            } else {
                console.log('❌ Failed to configure Inbound Parse:', res.statusCode);
                console.log('Response:', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error('❌ Error configuring Inbound Parse:', e.message);
    });

    req.write(postData);
    req.end();
};

// Check current Inbound Parse settings
const checkInboundParse = () => {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
        console.error('❌ SENDGRID_API_KEY not found');
        return;
    }

    const options = {
        hostname: 'api.sendgrid.com',
        port: 443,
        path: '/v3/inbound/parse/settings',
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
            console.log('📋 Current Inbound Parse Settings:');
            console.log(JSON.parse(data));
        });
    });

    req.on('error', (e) => {
        console.error('❌ Error checking Inbound Parse:', e.message);
    });

    req.end();
};

// Run the configuration
console.log('🔧 Configuring SendGrid Inbound Parse...');
checkInboundParse();
setTimeout(() => {
    configureInboundParse();
}, 2000);
