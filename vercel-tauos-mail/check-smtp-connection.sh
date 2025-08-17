#!/bin/bash

# Check SMTP Connection and Status
echo "🔍 Checking SMTP Connection and Status"
echo "======================================"

echo ""
echo "📧 Testing SMTP server accessibility:"
echo "-----------------------------------"
echo "Testing connection to 34.30.189.200:587"
timeout 10 telnet 34.30.189.200 587

echo ""
echo "🔍 Testing SMTP with OpenSSL:"
echo "----------------------------"
echo "Testing TLS connection to 34.30.189.200:587"
timeout 10 openssl s_client -connect 34.30.189.200:587 -starttls smtp 2>/dev/null | head -10

echo ""
echo "📊 Checking Postfix status:"
echo "-------------------------"
sudo systemctl status postfix --no-pager -l

echo ""
echo "🔍 Checking recent mail logs:"
echo "----------------------------"
sudo tail -30 /var/log/mail.log

echo ""
echo "📋 Checking Postfix queue:"
echo "------------------------"
sudo mailq

echo ""
echo "🔍 Checking SMTP authentication:"
echo "-------------------------------"
sudo cat /etc/postfix/sasl_passwd 2>/dev/null || echo "SASL password file not found"

echo ""
echo "🌐 Testing DNS resolution:"
echo "------------------------"
echo "Testing mailserver.tauos.org resolution:"
nslookup mailserver.tauos.org
echo ""
echo "Testing from Google DNS:"
dig +short @8.8.8.8 mailserver.tauos.org A 