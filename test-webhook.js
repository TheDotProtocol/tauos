// Test script to simulate an incoming email to the webhook
const testEmail = {
  from: "saleenafalcon@gmail.com",
  to: "saleena@tauos.org", 
  subject: "Re: Test Email from TauMail",
  text: "This is a reply to your test email from TauMail. Testing the webhook functionality.",
  html: "<p>This is a reply to your test email from TauMail. Testing the webhook functionality.</p>",
  headers: {
    "from-name": "Saleena Falcon",
    "reply-to": "saleenafalcon@gmail.com"
  },
  attachments: []
};

async function testWebhook() {
  try {
    console.log('🧪 Testing webhook with simulated email...');
    
    const response = await fetch('https://tauos.vercel.app/api/taumail/webhook/incoming', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testEmail)
    });
    
    const result = await response.json();
    
    console.log('📨 Webhook Response:', response.status, result);
    
    if (response.ok) {
      console.log('✅ Webhook test successful! Email should appear in inbox.');
    } else {
      console.log('❌ Webhook test failed:', result);
    }
    
  } catch (error) {
    console.error('❌ Error testing webhook:', error);
  }
}

testWebhook();
