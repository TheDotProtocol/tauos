#!/usr/bin/env node

/**
 * TauOS Email System Setup Script
 * Sets up email addresses and tests welcome email system
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.NEXT_PUBLIC_TAUOS_URL || 'http://localhost:3000';

// Email addresses to create
const emailAddresses = [
  {
    email: 'noreply@tauos.org',
    name: 'TauOS No Reply',
    description: 'Automated system emails',
    type: 'system'
  },
  {
    email: 'info@tauos.org',
    name: 'TauOS Information',
    description: 'General information and inquiries',
    type: 'support'
  },
  {
    email: 'hello@tauos.org',
    name: 'TauOS Hello',
    description: 'Welcome and onboarding emails',
    type: 'welcome'
  },
  {
    email: 'press@tauos.org',
    name: 'TauOS Press',
    description: 'Media and press inquiries',
    type: 'media'
  },
  {
    email: 'support@tauos.org',
    name: 'TauOS Support',
    description: 'Technical support and help',
    type: 'support'
  },
  {
    email: 'admin@tauos.org',
    name: 'TauOS Admin',
    description: 'Administrative functions',
    type: 'admin'
  },
  {
    email: 'alerts@tauos.org',
    name: 'TauOS Alerts',
    description: 'System alerts and notifications',
    type: 'system'
  },
  {
    email: 'notifications@tauos.org',
    name: 'TauOS Notifications',
    description: 'User notifications',
    type: 'system'
  },
  {
    email: 'errors@tauos.org',
    name: 'TauOS Errors',
    description: 'Error reporting and tracking',
    type: 'system'
  }
];

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function setupEmailAddresses() {
  console.log('🚀 Setting up TauOS email addresses...\n');

  try {
    const response = await makeRequest(`${BASE_URL}/api/email/setup-addresses`, {
      method: 'POST'
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ Email addresses setup completed successfully!');
      console.log('📧 Created addresses:');
      response.data.addresses.forEach(email => {
        console.log(`   - ${email}`);
      });
    } else {
      console.log('❌ Failed to setup email addresses:', response.data);
    }
  } catch (error) {
    console.log('❌ Error setting up email addresses:', error.message);
  }
}

async function testWelcomeEmail() {
  console.log('\n🧪 Testing welcome email system...\n');

  try {
    const testUser = {
      userEmail: 'test@example.com',
      userName: 'Test User'
    };

    const response = await makeRequest(`${BASE_URL}/api/email/welcome`, {
      method: 'POST',
      body: testUser
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ Welcome email system working!');
      console.log(`📧 Message ID: ${response.data.messageId}`);
      console.log(`📤 Sent: ${response.data.sent}`);
    } else {
      console.log('❌ Welcome email test failed:', response.data);
    }
  } catch (error) {
    console.log('❌ Error testing welcome email:', error.message);
  }
}

async function getEmailStatistics() {
  console.log('\n📊 Getting email statistics...\n');

  try {
    const response = await makeRequest(`${BASE_URL}/api/email/welcome`);

    if (response.status === 200 && response.data.success) {
      console.log('📈 Welcome email statistics:');
      console.log(`   - Total sent: ${response.data.statistics.total_sent}`);
      console.log(`   - Sent today: ${response.data.statistics.sent_today}`);
      console.log(`   - Sent this week: ${response.data.statistics.sent_this_week}`);
    } else {
      console.log('❌ Failed to get statistics:', response.data);
    }
  } catch (error) {
    console.log('❌ Error getting statistics:', error.message);
  }
}

async function main() {
  console.log('🎯 TauOS Email System Setup');
  console.log('==========================\n');

  // Check if server is running
  try {
    const healthResponse = await makeRequest(`${BASE_URL}/api/health`);
    if (healthResponse.status !== 200) {
      console.log('❌ Server is not running. Please start the development server first:');
      console.log('   npm run dev');
      process.exit(1);
    }
  } catch (error) {
    console.log('❌ Cannot connect to server. Please start the development server first:');
    console.log('   npm run dev');
    process.exit(1);
  }

  // Setup email addresses
  await setupEmailAddresses();

  // Test welcome email
  await testWelcomeEmail();

  // Get statistics
  await getEmailStatistics();

  console.log('\n🎉 Email system setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Configure SMTP settings in your environment variables');
  console.log('2. Test email sending with real SMTP server');
  console.log('3. Set up email templates and branding');
  console.log('4. Configure email routing and forwarding');
  console.log('\n🔗 Useful links:');
  console.log(`   - Email setup: ${BASE_URL}/api/email/setup-addresses`);
  console.log(`   - Welcome email: ${BASE_URL}/api/email/welcome`);
  console.log(`   - Documentation: ${BASE_URL}/docs`);
}

// Run the setup
main().catch(console.error);
