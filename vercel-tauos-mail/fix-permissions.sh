#!/bin/bash

# Fix saslauthd Permissions and Test Authentication
echo "🔧 Fixing saslauthd Permissions and Testing Authentication..."

echo "📧 Checking current permissions..."
sudo ls -la /var/spool/postfix/var/run/saslauthd/

echo ""
echo "🔐 Fixing directory permissions..."
sudo chown postfix:sasl /var/spool/postfix/var/run/saslauthd
sudo chmod 710 /var/spool/postfix/var/run/saslauthd

echo ""
echo "📧 Checking socket file..."
sudo ls -la /var/spool/postfix/var/run/saslauthd/

echo ""
echo "🔍 Testing authentication with sudo..."
sudo testsaslauthd -u noreply -p 'TauOS2024!Secure'

echo ""
echo "🔍 Testing authentication with email address..."
sudo testsaslauthd -u noreply@tauos.org -p 'TauOS2024!Secure'

echo ""
echo "📧 Checking saslauthd status..."
sudo systemctl status saslauthd --no-pager -l

echo ""
echo "📧 Testing SMTP connection..."
echo "EHLO localhost" | openssl s_client -connect localhost:587 -starttls smtp -crlf 2>/dev/null | head -5

echo ""
echo "✅ Ready for email testing!"
echo ""
echo "📋 Vercel Environment Variables:"
echo "SMTP_HOST=34.30.189.200"
echo "SMTP_PORT=587"
echo "SMTP_USER=noreply@tauos.org"
echo "SMTP_PASS=TauOS2024!Secure"
echo ""
echo "🚀 Go to https://mail.tauos.org/dashboard and send a test email!" 