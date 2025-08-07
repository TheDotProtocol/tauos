#!/bin/bash

# Update TauOS Apps to Use AWS Email Server
# This script updates the web applications to use our AWS email infrastructure

set -e

echo "🔄 Updating TauOS applications to use AWS email server..."

# Get the email server IP from Terraform
cd "$(dirname "$0")/terraform"
EMAIL_SERVER_IP=$(terraform output -raw email_server_public_ip 2>/dev/null || echo "mail.tauos.org")

# Update TauMail web app configuration
echo "📧 Updating TauMail configuration..."

cat > ../tauos-apps-update/tauos-mail-config.js << EOF
// TauOS Mail Configuration
// Updated to use AWS email server

const config = {
  // Email Server Configuration
  smtp: {
    host: '${EMAIL_SERVER_IP}',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: 'test@tauos.org',
      pass: 'tauostest2024!'
    }
  },
  
  imap: {
    host: '${EMAIL_SERVER_IP}',
    port: 993,
    secure: true, // SSL/TLS
    auth: {
      user: 'test@tauos.org',
      pass: 'tauostest2024!'
    }
  },
  
  // Domain Configuration
  domain: 'tauos.org',
  mailDomain: '@tauos.org',
  
  // Security
  encryption: {
    enabled: true,
    algorithm: 'AES-256-GCM'
  },
  
  // Features
  features: {
    spamFilter: true,
    virusScan: true,
    dkim: true,
    dmarc: true
  }
};

module.exports = config;
EOF

echo "✅ Configuration updated!"
echo "📧 SMTP Server: ${EMAIL_SERVER_IP}:587"
echo "📥 IMAP Server: ${EMAIL_SERVER_IP}:993"
echo "🔐 Test User: test@tauos.org"

echo ""
echo "🎯 Next Steps:"
echo "1. Deploy the updated configuration to Vercel"
echo "2. Test email sending/receiving"
echo "3. Configure DNS records"
echo "4. Obtain SSL certificates" 