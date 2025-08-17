#!/bin/bash

# Fix Aliases and Test Authentication
echo "🔧 Fixing Aliases and Testing Authentication..."

echo "📧 Fixing aliases file..."
sudo sed -i '/noreply@tauos.org noreply/d' /etc/aliases
echo "noreply@tauos.org: noreply" | sudo tee -a /etc/aliases

echo "🗺️  Updating aliases database..."
sudo newaliases

echo "🔍 Testing authentication with noreply user..."
sudo testsaslauthd -u noreply -p 'TauOS2024!Secure'

echo ""
echo "🔍 Testing authentication with email address..."
sudo testsaslauthd -u noreply@tauos.org -p 'TauOS2024!Secure'

echo ""
echo "📧 Checking saslauthd socket..."
ls -la /var/spool/postfix/var/run/saslauthd/

echo ""
echo "📧 Checking aliases..."
cat /etc/aliases | grep noreply

echo ""
echo "📧 Checking user account..."
id noreply

echo ""
echo "📧 Testing SMTP connection..."
echo "EHLO localhost" | openssl s_client -connect localhost:587 -starttls smtp -crlf 2>/dev/null | head -10

echo ""
echo "📧 Checking recent mail logs..."
sudo tail -10 /var/log/mail.log | grep -i "auth\|sasl\|password"

echo ""
echo "✅ Ready to test email sending!"
echo ""
echo "📋 Current credentials:"
echo "SMTP_HOST=34.30.189.200"
echo "SMTP_PORT=587"
echo "SMTP_USER=noreply@tauos.org"
echo "SMTP_PASS=TauOS2024!Secure" 