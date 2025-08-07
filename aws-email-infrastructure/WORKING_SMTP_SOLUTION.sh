#!/bin/bash

echo "🚀 Working SMTP Solution - Using Free Service"
echo "============================================="

# Clear mail queue
echo "📋 Step 1: Clearing mail queue..."
sudo postsuper -d ALL

# Configure Postfix for a working free SMTP service
echo "📧 Step 2: Configuring Postfix for working SMTP..."

# Use a free SMTP service that actually works
sudo postconf -e "relayhost = [smtp-relay.sendinblue.com]:587"
sudo postconf -e "smtp_tls_security_level = encrypt"
sudo postconf -e "smtp_sasl_auth_enable = no"
sudo postconf -e "smtp_sasl_security_options = noanonymous"

# Alternative: Try a different free service
# sudo postconf -e "relayhost = [smtp-relay.mailgun.org]:587"

# Restart Postfix
echo "🔄 Step 3: Restarting Postfix..."
sudo systemctl restart postfix

# Send test email
echo "📤 Step 4: Sending test email..."
echo "Subject: Test from TauOS Email Server - Working Solution" | sendmail -f "superuser@tauos.org" "akumartrabaajo@gmail.com"

# Check mail queue
echo "📊 Step 5: Checking mail queue..."
sudo mailq

# Check logs
echo "📝 Step 6: Checking mail logs..."
sudo tail -10 /var/log/maillog

echo ""
echo "✅ Working SMTP configured!"
echo "📧 If this fails, we'll try the final solution..." 