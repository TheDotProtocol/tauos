#!/bin/bash

echo "🔧 Final Email Solution - Using Free SMTP Relay..."
echo "================================================="

# Clear any stuck emails
echo "📋 Step 1: Clearing mail queue..."
sudo postsuper -d ALL

# Configure Postfix for a free SMTP relay
echo "📧 Step 2: Configuring Postfix for free SMTP relay..."

# Use a public SMTP relay that doesn't require authentication
sudo postconf -e "relayhost = [smtp-relay.sendinblue.com]:587"
sudo postconf -e "smtp_tls_security_level = encrypt"
sudo postconf -e "smtp_sasl_auth_enable = no"
sudo postconf -e "smtp_sasl_security_options = noanonymous"

# Alternative relays if the above doesn't work
# sudo postconf -e "relayhost = [smtp-relay.brevo.com]:587"
# sudo postconf -e "relayhost = [smtp-relay.mailgun.org]:587"

# Restart Postfix
echo "🔄 Step 3: Restarting Postfix..."
sudo systemctl restart postfix

# Send a simple test email first
echo "📤 Step 4: Sending simple test email..."
echo "Subject: Test from TauOS Email Server" | sendmail -f "superuser@tauos.org" "akumartrabaajo@gmail.com"

# Check mail queue
echo "📊 Step 5: Checking mail queue..."
sudo mailq

# Check mail logs
echo "📝 Step 6: Checking mail logs..."
sudo tail -10 /var/log/maillog

echo ""
echo "✅ Email configuration updated!"
echo "📧 Check if the test email gets delivered..."
echo "🌐 If this works, we'll send the full welcome emails!" 