#!/bin/bash

# Check SASL Configuration for SMTP Authentication
echo "🔍 Checking SASL Configuration for SMTP Authentication"
echo "======================================================"

echo ""
echo "📧 Checking SASL configuration files:"
echo "-----------------------------------"
echo "SASL password file:"
sudo cat /etc/postfix/sasl_passwd 2>/dev/null || echo "SASL password file not found"

echo ""
echo "SASL password database:"
ls -la /etc/postfix/sasl_passwd.db 2>/dev/null || echo "SASL password database not found"

echo ""
echo "📊 Postfix SASL settings:"
echo "-----------------------"
sudo postconf -n | grep -i sasl

echo ""
echo "🔍 Checking SMTP authentication settings:"
echo "----------------------------------------"
sudo postconf -n | grep -i smtp

echo ""
echo "📧 Testing SMTP authentication manually:"
echo "--------------------------------------"
echo "Testing connection and authentication..."
(
echo "EHLO localhost"
echo "AUTH LOGIN"
echo "bm9yZXBseUB0YXVvcy5vcmc="  # noreply@tauos.org in base64
echo "VGF1T1MyMDI0IVNlY3VyZQ=="  # TauOS2024!Secure in base64
echo "QUIT"
) | openssl s_client -connect localhost:587 -starttls smtp -crlf 2>/dev/null

echo ""
echo "🔍 Checking for authentication errors in logs:"
echo "--------------------------------------------"
sudo grep -i "sasl\|auth\|password" /var/log/mail.log | tail -10 