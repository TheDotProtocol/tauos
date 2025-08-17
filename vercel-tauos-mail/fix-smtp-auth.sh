#!/bin/bash

# Fix SMTP Authentication for TauOS Mail Server
echo "🔧 Fixing SMTP Authentication for TauOS Mail Server..."

# Create a strong password for noreply@tauos.org
SMTP_PASSWORD="TauOS2024!Secure"

echo "📧 Recreating SASL password file..."
sudo tee /etc/postfix/sasl_passwd > /dev/null << EOF
[34.30.189.200]:587 noreply@tauos.org:$SMTP_PASSWORD
localhost:587 noreply@tauos.org:$SMTP_PASSWORD
127.0.0.1:587 noreply@tauos.org:$SMTP_PASSWORD
EOF

echo "🔐 Setting proper permissions..."
sudo chmod 600 /etc/postfix/sasl_passwd

echo "🗺️  Recreating Postfix database..."
sudo postmap /etc/postfix/sasl_passwd

echo "🔄 Reloading Postfix..."
sudo systemctl reload postfix

echo "✅ SMTP Authentication Fixed!"
echo ""
echo "📋 Current credentials:"
echo "SMTP_HOST=34.30.189.200"
echo "SMTP_PORT=587"
echo "SMTP_USER=noreply@tauos.org"
echo "SMTP_PASS=$SMTP_PASSWORD"
echo ""
echo "🔍 Testing authentication..."
echo "EHLO localhost" | openssl s_client -connect localhost:587 -starttls smtp -crlf

echo ""
echo "📧 Checking SASL configuration..."
sudo postconf -n | grep -i sasl 