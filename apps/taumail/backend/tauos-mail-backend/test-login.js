// Test login functionality
const fetch = require('node-fetch');

async function testLogin() {
    try {
        console.log('Testing login...');
        const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'saleena@tauos.org',
                password: 'Saleena@132'
            })
        });
        
        const result = await response.json();
        console.log('Login result:', result);
        
        if (result.token) {
            console.log('✅ Login successful! Token received.');
            
            // Test sent emails
            console.log('Testing sent emails...');
            const sentResponse = await fetch('http://localhost:3001/api/emails/sent', {
                headers: {
                    'Authorization': `Bearer ${result.token}`
                }
            });
            const sentResult = await sentResponse.json();
            console.log('Sent emails result:', sentResult);
        }
        
    } catch (error) {
        console.error('Test error:', error.message);
    }
}

testLogin();
