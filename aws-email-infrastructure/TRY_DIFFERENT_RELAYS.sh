#!/bin/bash

echo "🔧 Trying Different SMTP Relays..."
echo "=================================="

# Clear mail queue
echo "📋 Step 1: Clearing mail queue..."
sudo postsuper -d ALL

# Try different public SMTP relays
echo "📧 Step 2: Trying different SMTP relays..."

# Option 1: Try Brevo (formerly SendInBlue) without auth
echo "🔄 Trying Brevo relay..."
sudo postconf -e "relayhost = [smtp-relay.brevo.com]:587"
sudo postconf -e "smtp_tls_security_level = encrypt"
sudo postconf -e "smtp_sasl_auth_enable = no"
sudo systemctl restart postfix

# Send test email
echo "📤 Sending test email via Brevo..."
echo "Subject: Test from TauOS - Brevo Relay" | sendmail -f "superuser@tauos.org" "akumartrabaajo@gmail.com"

# Check queue
echo "📊 Checking mail queue..."
sudo mailq

# Wait a moment
sleep 5

# If that doesn't work, try direct delivery with proper DNS
echo "🔄 Trying direct delivery with proper DNS..."
sudo postconf -e "relayhost ="
sudo postconf -e "smtp_tls_security_level = may"
sudo postconf -e "myhostname = smtptauos.tauos.org"
sudo postconf -e "mydomain = tauos.org"
sudo postconf -e "myorigin = tauos.org"
sudo systemctl restart postfix

# Send test email
echo "📤 Sending test email via direct delivery..."
echo "Subject: Test from TauOS - Direct Delivery" | sendmail -f "superuser@tauos.org" "akumartrabaajo@gmail.com"

# Check queue
echo "📊 Checking mail queue..."
sudo mailq

# Check logs
echo "📝 Checking mail logs..."
sudo tail -10 /var/log/maillog

echo ""
echo "✅ Testing different relay options!"
echo "📧 Check which method works best..." 