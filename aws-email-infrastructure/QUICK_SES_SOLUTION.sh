#!/bin/bash

echo "🚀 Quick AWS SES Solution for External Email Delivery"
echo "====================================================="

# Clear mail queue
echo "📋 Step 1: Clearing mail queue..."
sudo postsuper -d ALL

# Configure Postfix to use AWS SES
echo "📧 Step 2: Configuring Postfix for AWS SES..."

# Use AWS SES SMTP endpoint
sudo postconf -e "relayhost = [email-smtp.us-east-1.amazonaws.com]:587"
sudo postconf -e "smtp_tls_security_level = encrypt"
sudo postconf -e "smtp_sasl_auth_enable = yes"
sudo postconf -e "smtp_sasl_security_options = noanonymous"
sudo postconf -e "smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd"

# Create SES credentials file (you'll need to get these from AWS SES)
echo "📝 Step 3: Creating SES credentials file..."
sudo tee /etc/postfix/sasl_passwd << 'EOF'
[email-smtp.us-east-1.amazonaws.com]:587 YOUR_SES_SMTP_USERNAME:YOUR_SES_SMTP_PASSWORD
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
echo "Subject: Test from TauOS Email Server - AWS SES" | sendmail -f "superuser@tauos.org" "akumartrabaajo@gmail.com"

# Check mail queue
echo "📊 Step 6: Checking mail queue..."
sudo mailq

echo ""
echo "✅ AWS SES configured!"
echo "📧 You need to:"
echo "1. Go to AWS SES Console"
echo "2. Create SMTP credentials"
echo "3. Replace YOUR_SES_SMTP_USERNAME and YOUR_SES_SMTP_PASSWORD"
echo "4. Verify your domain in SES"
echo "🌐 SES Console: https://us-east-1.console.aws.amazon.com/ses/" 