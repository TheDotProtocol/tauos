#!/bin/bash

echo "🔧 Configuring Free SMTP Relay..."
echo "================================="

# Clear the mail queue first
echo "📋 Step 1: Clearing mail queue..."
sudo postsuper -d ALL

# Configure Postfix for free SMTP relay (SendGrid, Mailgun, etc.)
echo "📧 Step 2: Configuring Postfix for free SMTP relay..."

# Option 1: Use SendGrid (free tier available)
sudo postconf -e "relayhost = [smtp.sendgrid.net]:587"
sudo postconf -e "smtp_tls_security_level = encrypt"
sudo postconf -e "smtp_sasl_auth_enable = yes"
sudo postconf -e "smtp_sasl_security_options = noanonymous"
sudo postconf -e "smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd"

# Create SASL password file for SendGrid
echo "📝 Step 3: Creating SASL password file..."
sudo tee /etc/postfix/sasl_passwd << 'EOF'
[smtp.sendgrid.net]:587 apikey:SG.YOUR_SENDGRID_API_KEY
EOF

# Hash the password file
sudo postmap /etc/postfix/sasl_passwd

# Set proper permissions
sudo chmod 600 /etc/postfix/sasl_passwd
sudo chmod 600 /etc/postfix/sasl_passwd.db

# Restart Postfix
echo "🔄 Step 4: Restarting Postfix..."
sudo systemctl restart postfix

# Send test email
echo "📤 Step 5: Sending test email..."
echo "Subject: Test from TauOS Email Server - Free Relay" | sendmail -f "superuser@tauos.org" "akumartrabaajo@gmail.com"

# Check mail queue
echo "📊 Step 6: Checking mail queue..."
sudo mailq

echo ""
echo "✅ Free SMTP relay configured!"
echo "📧 Note: You'll need to sign up for a free SendGrid account and replace YOUR_SENDGRID_API_KEY with your actual API key"
echo "🌐 Sign up at: https://sendgrid.com/free/" 