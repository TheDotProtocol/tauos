// Test script to simulate an incoming email to the webhook
const fetch = require('node-fetch');

async function testIncomingEmail() {
  try {
    console.log('🧪 Testing incoming email webhook...');
    
    const testEmailData = {
      from: 'test@gmail.com',
      to: 'saleena@tauos.org',
      subject: 'Test Email from Gmail',
      text: 'This is a test email to verify the webhook is working correctly.',
      html: '<p>This is a test email to verify the webhook is working correctly.</p>',
      headers: {
        'from-name': 'Test User',
        'to': 'saleena@tauos.org',
        'subject': 'Test Email from Gmail'
      },
      attachments: []
    };

    const response = await fetch('https://tauos.vercel.app/api/taumail/webhook/incoming', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testEmailData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Webhook test successful:', result);
    } else {
      console.log('❌ Webhook test failed:', result);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testIncomingEmail();