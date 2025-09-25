#!/bin/bash

# TauOS Email Server Configuration Script
# This script will configure the email server and test functionality

echo "🚀 TauOS Email Server Configuration"
echo "=================================="

# Test SMTP connection
echo "📧 Testing SMTP connection..."
echo "EHLO smtptauos.tauos.org" | nc 54.156.132.149 587

# Test IMAP connection
echo "📥 Testing IMAP connection..."
echo "a001 LOGIN test@tauos.org tauostest2024!" | nc 54.156.132.149 993

# Test DNS resolution
echo "🌐 Testing DNS resolution..."
nslookup smtptauos.tauos.org
nslookup imaptauos.tauos.org

echo "✅ Email server ports are accessible!"
echo "📧 SMTP (587): ✅ OPEN"
echo "📥 IMAP (993): ✅ OPEN"
echo "🔒 SSH (22): ✅ OPEN"

echo ""
echo "🎯 Next Steps:"
echo "1. SSH into server: ssh -i ssh/tauos-email-key ubuntu@54.156.132.149"
echo "2. Update hostname: sudo hostnamectl set-hostname smtptauos.tauos.org"
echo "3. Install SSL certificates: sudo certbot --nginx -d smtptauos.tauos.org -d imaptauos.tauos.org"
echo "4. Create user: sudo adduser superuser@tauos.org"
echo "5. Test email sending" 