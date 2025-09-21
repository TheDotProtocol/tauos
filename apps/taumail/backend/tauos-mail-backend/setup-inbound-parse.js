const https = require('https');

// Set up SendGrid Inbound Parse using the correct API
const setupInboundParse = () => {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
        console.error('❌ SENDGRID_API_KEY not found');
        return;
    }

    // First, let's try to create the inbound parse setting
    const postData = JSON.stringify({
        "hostname": "tauos.org",
        "url": "https://tauos-47am.vercel.app/api/webhook/incoming-email",
        "spam_check": false,
        "send_raw": false
    });

    const options = {
        hostname: 'api.sendgrid.com',
        port: 443,
        path: '/v3/inbound/parse',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log('🔧 Creating Inbound Parse configuration...');
    console.log('📧 Hostname: tauos.org');
    console.log('🔗 Webhook URL: https://tauos-47am.vercel.app/api/webhook/incoming-email');

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log('📋 Response Status:', res.statusCode);
            console.log('📋 Response:', data);
            
            if (res.statusCode === 201 || res.statusCode === 200) {
                console.log('✅ Inbound Parse configured successfully!');
                console.log('📧 Emails sent to @tauos.org will now be forwarded to our webhook');
            } else {
                console.log('❌ Failed to configure Inbound Parse');
                console.log('💡 This might be because:');
                console.log('   1. Inbound Parse is not available in your SendGrid plan');
                console.log('   2. The API endpoint has changed');
                console.log('   3. Domain verification is required first');
            }
        });
    });

    req.on('error', (e) => {
        console.error('❌ Error configuring Inbound Parse:', e.message);
    });

    req.write(postData);
    req.end();
};

// Alternative: Check if we can use Event Webhook instead
const checkEventWebhook = () => {
    const apiKey = process.env.SENDGRID_API_KEY;
    
    const options = {
        hostname: 'api.sendgrid.com',
        port: 443,
        path: '/v3/user/webhooks/event',
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
            console.log('\n📋 Event Webhook Status:');
            console.log(JSON.parse(data));
        });
    });

    req.on('error', (e) => {
        console.error('❌ Error checking Event Webhook:', e.message);
    });

    req.end();
};

setupInboundParse();
setTimeout(checkEventWebhook, 3000);
