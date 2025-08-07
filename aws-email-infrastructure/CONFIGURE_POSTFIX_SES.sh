#!/bin/bash

echo "📧 Configuring Postfix for AWS SES"
echo "================================="

# Clear mail queue
echo "📋 Step 1: Clearing mail queue..."
sudo postsuper -d ALL

# Configure Postfix for AWS SES
echo "📧 Step 2: Configuring Postfix for AWS SES..."

# Use AWS SES SMTP endpoint
sudo postconf -e "relayhost = [email-smtp.us-east-1.amazonaws.com]:587"
sudo postconf -e "smtp_tls_security_level = encrypt"
sudo postconf -e "smtp_sasl_auth_enable = yes"
sudo postconf -e "smtp_sasl_security_options = noanonymous"
sudo postconf -e "smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd"
sudo postconf -e "smtp_sasl_mechanism_filter = plain, login"

# Get SES SMTP credentials
echo "🔑 Step 3: Getting SES SMTP credentials..."
SES_CREDENTIALS=$(aws iam list-access-keys --user-name ses-smtp-user --query 'AccessKeyMetadata[0].AccessKeyId' --output text)

if [ "$SES_CREDENTIALS" = "None" ]; then
    echo "❌ No SES credentials found. Creating new ones..."
    aws iam create-access-key --user-name ses-smtp-user
    SES_CREDENTIALS=$(aws iam list-access-keys --user-name ses-smtp-user --query 'AccessKeyMetadata[0].AccessKeyId' --output text)
fi

# Get the secret key (you'll need to get this from AWS console or store it securely)
echo "⚠️  You need to get the secret key from AWS console"
echo "📧 Go to: https://us-east-1.console.aws.amazon.com/iam/home#/users/ses-smtp-user"
echo "🔑 Access Key ID: $SES_CREDENTIALS"

# Create SES credentials file (you'll need to add the secret key)
echo "📝 Step 4: Creating SES credentials file..."
sudo tee /etc/postfix/sasl_passwd << 'EOF'
[email-smtp.us-east-1.amazonaws.com]:587 YOUR_SES_SMTP_USERNAME:YOUR_SES_SMTP_PASSWORD
EOF

echo "⚠️  Replace YOUR_SES_SMTP_USERNAME and YOUR_SES_SMTP_PASSWORD with actual SES credentials"

# Hash the password file
sudo postmap /etc/postfix/sasl_passwd

# Set proper permissions
sudo chmod 600 /etc/postfix/sasl_passwd
sudo chmod 600 /etc/postfix/sasl_passwd.db

# Restart Postfix
echo "🔄 Step 5: Restarting Postfix..."
sudo systemctl restart postfix

# Test email sending
echo "📤 Step 6: Testing email sending..."
echo "Subject: Test from TauOS Email Server - AWS SES" | sendmail -f "no-reply@tauos.org" "akumartrabaajo@gmail.com"

# Check results
echo "📊 Step 7: Checking results..."
sudo mailq
sudo tail -10 /var/log/maillog

echo ""
echo "✅ Postfix configured for AWS SES!"
echo "📧 Next: Add DNS records to Cloudflare and test delivery" 