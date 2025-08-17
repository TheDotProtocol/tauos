#!/bin/bash

# Test SMTP Authentication
echo "🔍 Testing SMTP Authentication..."

echo "📧 Testing authentication with quotes..."
sudo testsaslauthd -u noreply@tauos.org -p 'TauOS2024!Secure'

echo ""
echo "📧 Testing SMTP connection..."
echo "EHLO localhost" | openssl s_client -connect localhost:587 -starttls smtp -crlf 2>/dev/null | head -10

echo ""
echo "📧 Testing manual authentication..."
(
echo "EHLO localhost"
echo "AUTH LOGIN"
echo "bm9yZXBseUB0YXVvcy5vcmc="  # noreply@tauos.org in base64
echo "VGF1T1MyMDI0IVNlY3VyZQ=="  # TauOS2024!Secure in base64
echo "QUIT"
) | openssl s_client -connect localhost:587 -starttls smtp -crlf 2>/dev/null

echo ""
echo "📧 Checking recent mail logs for auth attempts..."
sudo tail -10 /var/log/mail.log | grep -i "auth\|sasl\|password"

echo ""
echo "📧 Checking SASL configuration files..."
echo "SASL password file:"
sudo cat /etc/postfix/sasl_passwd

echo ""
echo "SASL configuration:"
sudo cat /etc/postfix/sasl/smtpd.conf 