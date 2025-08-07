#!/bin/bash

echo "🚀 Quick Direct Delivery Solution"
echo "================================="

# Clear mail queue
echo "📋 Step 1: Clearing mail queue..."
sudo postsuper -d ALL

# Configure Postfix for direct delivery
echo "📧 Step 2: Configuring Postfix for direct delivery..."

# Remove relayhost to allow direct delivery
sudo postconf -e "relayhost ="

# Configure for direct delivery with proper DNS
sudo postconf -e "smtp_host_lookup = dns, native"
sudo postconf -e "disable_dns_lookups = no"
sudo postconf -e "smtp_tls_security_level = may"
sudo postconf -e "myhostname = smtptauos.tauos.org"
sudo postconf -e "mydomain = tauos.org"
sudo postconf -e "myorigin = tauos.org"

# Configure for port 587 outbound (AWS allows this)
sudo postconf -e "smtp_tls_protocols = !SSLv2, !SSLv3"

# Restart Postfix
echo "🔄 Step 3: Restarting Postfix..."
sudo systemctl restart postfix

# Send test email
echo "📤 Step 4: Sending test email..."
echo "Subject: Test from TauOS Email Server - Direct Delivery" | sendmail -f "superuser@tauos.org" "akumartrabaajo@gmail.com"

# Check mail queue
echo "📊 Step 5: Checking mail queue..."
sudo mailq

# Check logs
echo "📝 Step 6: Checking mail logs..."
sudo tail -10 /var/log/maillog

echo ""
echo "✅ Direct delivery configured!"
echo "📧 This should work if DNS is properly configured..." 