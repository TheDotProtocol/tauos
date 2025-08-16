
const nodemailer = require("nodemailer");

// Configuration options in order of preference
const smtpConfigs = [
  {
    name: "TauOS SMTP (Port 587)",
    config: {
      host: "mailserver.tauos.org",
      port: 587,
      secure: false,
      auth: {
        user: "noreply@tauos.org",
        pass: ""
      },
      tls: {
        rejectUnauthorized: false
      },
      requireTLS: true
    }
  },
  {
    name: "TauOS SMTP (Port 465)",
    config: {
      host: "mailserver.tauos.org",
      port: 465,
      secure: true,
      auth: {
        user: "noreply@tauos.org",
        pass: ""
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  },
  {
    name: "Gmail SMTP (Fallback)",
    config: {
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com', // Replace with actual Gmail
        pass: 'your-app-password'      // Replace with app password
      }
    }
  }
];

async function testSMTPConfigs() {
  console.log("🔍 Testing SMTP Configurations...\n");
  
  for (const { name, config } of smtpConfigs) {
    console.log(`Testing: ${name}`);
    
    try {
      const transporter = nodemailer.createTransport(config);
      await transporter.verify();
      console.log(`✅ ${name} - Connection successful!`);
      return { name, config };
    } catch (error) {
      console.log(`❌ ${name} - Failed: ${error.message}`);
    }
    console.log("");
  }
  
  console.log("❌ All SMTP configurations failed!");
  return null;
}

testSMTPConfigs().then(result => {
  if (result) {
    console.log(`\n🎉 Working configuration: ${result.name}`);
  }
  process.exit(0);
});

