const nodemailer = require("nodemailer");

// Working SMTP configurations (in order of preference)
const workingConfigs = [
  {
    name: "Mailtrap (Development)",
    config: {
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "your_mailtrap_user", // Get from mailtrap.io
        pass: "your_mailtrap_pass"
      }
    },
    note: "Free for development, 100 emails/month"
  },
  {
    name: "Gmail SMTP",
    config: {
      service: 'gmail',
      auth: {
        user: 'your-gmail@gmail.com',
        pass: 'your-app-password' // Generate at myaccount.google.com/apppasswords
      }
    },
    note: "Use Gmail App Password, not regular password"
  },
  {
    name: "SendGrid",
    config: {
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: 'your_sendgrid_api_key' // Get from sendgrid.com
      }
    },
    note: "100 emails/day free"
  },
  {
    name: "Mailgun",
    config: {
      host: 'smtp.mailgun.org',
      port: 587,
      auth: {
        user: 'postmaster@your-domain.mailgun.org',
        pass: 'your-mailgun-password'
      }
    },
    note: "10,000 emails/month free for 3 months"
  }
];

// Test function
async function testWorkingConfigs() {
  console.log("🔍 Testing Working SMTP Services...\n");
  
  for (const { name, config, note } of workingConfigs) {
    console.log(`Testing: ${name}`);
    console.log(`Note: ${note}`);
    
    try {
      const transporter = nodemailer.createTransport(config);
      await transporter.verify();
      console.log(`✅ ${name} - Ready to use!`);
      
      // Test sending an email
      const testEmail = {
        from: config.auth?.user || 'test@tauos.org',
        to: 'test@example.com',
        subject: 'TauOS SMTP Test',
        text: 'This is a test email from TauOS'
      };
      
      console.log(`📧 Test email configuration ready`);
      return { name, config, testEmail };
      
    } catch (error) {
      console.log(`❌ ${name} - ${error.message}`);
    }
    console.log("");
  }
  
  return null;
}

// Instructions for each service
const setupInstructions = {
  "Mailtrap (Development)": `
1. Go to https://mailtrap.io/
2. Sign up for free account
3. Go to Email Testing → Inboxes
4. Copy SMTP credentials
5. Replace 'your_mailtrap_user' and 'your_mailtrap_pass'
`,
  "Gmail SMTP": `
1. Enable 2-Factor Authentication on Gmail
2. Go to https://myaccount.google.com/apppasswords
3. Generate app password for "Mail"
4. Use your Gmail and the app password (not regular password)
`,
  "SendGrid": `
1. Sign up at https://sendgrid.com/
2. Go to Settings → API Keys
3. Create new API key with "Mail Send" permissions
4. Replace 'your_sendgrid_api_key' with the key
`,
  "Mailgun": `
1. Sign up at https://www.mailgun.com/
2. Go to Domains → Add domain or use sandbox
3. Get SMTP credentials from domain settings
4. Replace credentials in config
`
};

console.log("🚀 TauOS SMTP Configuration Helper");
console.log("=====================================\n");

testWorkingConfigs().then(result => {
  if (result) {
    console.log(`\n🎉 Recommended: ${result.name}`);
    console.log("\n📋 Setup Instructions:");
    console.log(setupInstructions[result.name]);
    console.log("\n🔧 Update your app.js with this config:");
    console.log(JSON.stringify(result.config, null, 2));
  } else {
    console.log("\n📧 Choose any service above and follow setup instructions");
  }
  
  process.exit(0);
}); 