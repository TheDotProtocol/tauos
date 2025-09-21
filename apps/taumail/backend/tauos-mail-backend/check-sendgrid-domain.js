const https = require('https');

// Check SendGrid domain verification and Inbound Parse status
const checkSendGridDomain = () => {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
        console.error('❌ SENDGRID_API_KEY not found');
        return;
    }

    // Check domain verification
    const domainOptions = {
        hostname: 'api.sendgrid.com',
        port: 443,
        path: '/v3/whitelabel/domains',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    };

    const domainReq = https.request(domainOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log('📋 Domain Verification Status:');
            console.log(JSON.parse(data));
            
            // Now check Inbound Parse with different endpoint
            checkInboundParseAlternative();
        });
    });

    domainReq.on('error', (e) => {
        console.error('❌ Error checking domain:', e.message);
    });

    domainReq.end();
};

const checkInboundParseAlternative = () => {
    const apiKey = process.env.SENDGRID_API_KEY;
    
    // Try the alternative endpoint
    const options = {
        hostname: 'api.sendgrid.com',
        port: 443,
        path: '/v3/inbound/parse',
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
            console.log('\n📋 Inbound Parse Status:');
            console.log(JSON.parse(data));
        });
    });

    req.on('error', (e) => {
        console.error('❌ Error checking Inbound Parse:', e.message);
    });

    req.end();
};

checkSendGridDomain();
