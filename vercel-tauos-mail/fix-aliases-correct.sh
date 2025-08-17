#!/bin/bash

# Fix Aliases with Correct Format
echo "🔧 Fixing Aliases with Correct Format..."

echo "📧 Checking current aliases file..."
cat /etc/aliases

echo ""
echo "📧 Fixing aliases file with correct format..."
sudo sed -i '/noreply@tauos.org/d' /etc/aliases
echo "noreply: noreply@tauos.org" | sudo tee -a /etc/aliases

echo ""
echo "🗺️  Updating aliases database..."
sudo newaliases

echo ""
echo "📧 Checking fixed aliases..."
cat /etc/aliases | grep noreply

echo ""
echo "🔍 Testing authentication with noreply user..."
sudo testsaslauthd -u noreply -p 'TauOS2024!Secure'

echo ""
echo "🔍 Testing authentication with email address..."
sudo testsaslauthd -u noreply@tauos.org -p 'TauOS2024!Secure'

echo ""
echo "📧 Checking saslauthd socket..."
ls -la /var/spool/postfix/var/run/saslauthd/

echo ""
echo "📧 Testing SMTP connection..."
echo "EHLO localhost" | openssl s_client -connect localhost:587 -starttls smtp -crlf 2>/dev/null | head -10

echo ""
echo "✅ Ready to test email sending!"
echo ""
echo "📋 Current credentials:"
echo "SMTP_HOST=34.30.189.200"
echo "SMTP_PORT=587"
echo "SMTP_USER=noreply@tauos.org"
echo "SMTP_PASS=TauOS2024!Secure" 