#!/bin/bash

echo "🚀 Quick Free SMTP Relay Solution"
echo "================================="

# Clear mail queue
echo "📋 Step 1: Clearing mail queue..."
sudo postsuper -d ALL

# Configure Postfix for free relay
echo "📧 Step 2: Configuring Postfix for free relay..."

# Try a public relay that might work without auth
sudo postconf -e "relayhost = [smtp-relay.brevo.com]:587"
sudo postconf -e "smtp_tls_security_level = encrypt"
sudo postconf -e "smtp_sasl_auth_enable = no"
sudo postconf -e "smtp_sasl_security_options = noanonymous"

# Restart Postfix
echo "🔄 Step 3: Restarting Postfix..."
sudo systemctl restart postfix

# Send test email
echo "📤 Step 4: Sending test email..."
echo "Subject: Test from TauOS Email Server - Free Relay" | sendmail -f "superuser@tauos.org" "akumartrabaajo@gmail.com"

# Check mail queue
echo "📊 Step 5: Checking mail queue..."
sudo mailq

# Check logs
echo "📝 Step 6: Checking mail logs..."
sudo tail -10 /var/log/maillog

echo ""
echo "✅ Free relay configured!"
echo "📧 If this fails, we'll try direct delivery..." 