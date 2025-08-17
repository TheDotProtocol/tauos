#!/bin/bash

# Temporarily Disable SMTP Authentication
echo "🔧 Temporarily Disabling SMTP Authentication..."

echo "📊 Disabling SASL authentication..."
sudo postconf -e 'smtpd_sasl_auth_enable = no'
sudo postconf -e 'smtpd_recipient_restrictions = permit_mynetworks, reject_unauth_destination'
sudo postconf -e 'smtpd_client_restrictions = permit_mynetworks, reject'
sudo postconf -e 'smtpd_relay_restrictions = permit_mynetworks, reject_unauth_destination'

echo "🔄 Reloading Postfix..."
sudo systemctl reload postfix

echo "✅ Authentication Disabled!"
echo ""
echo "📋 Update Vercel Environment Variables to:"
echo "SMTP_HOST=34.30.189.200"
echo "SMTP_PORT=587"
echo "SMTP_USER="
echo "SMTP_PASS="
echo ""
echo "🔍 Testing SMTP connection..."
echo "EHLO localhost" | openssl s_client -connect localhost:587 -starttls smtp -crlf 2>/dev/null | head -10

echo ""
echo "📧 Checking Postfix configuration..."
sudo postconf -n | grep -E "(sasl|recipient_restrictions)"

echo ""
echo "📧 Checking recent mail logs..."
sudo tail -5 /var/log/mail.log 