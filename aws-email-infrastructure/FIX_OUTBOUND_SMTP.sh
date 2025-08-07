#!/bin/bash

echo "🔧 Fixing Outbound SMTP Issue..."
echo "================================="

# Configure Postfix to use port 587 for outbound mail
echo "📧 Step 1: Configuring Postfix for outbound SMTP on port 587..."

# Configure Postfix to use port 587 for outbound
sudo postconf -e "relayhost = [smtp.gmail.com]:587"
sudo postconf -e "smtp_tls_security_level = encrypt"
sudo postconf -e "smtp_tls_CAfile = /etc/ssl/certs/ca-bundle.crt"
sudo postconf -e "smtp_sasl_auth_enable = no"
sudo postconf -e "smtp_sasl_password_maps ="
sudo postconf -e "smtp_sasl_security_options = noanonymous"

# Alternative: Configure to use AWS SES or allow direct delivery
echo "📧 Step 2: Configuring for direct delivery..."

# Remove relayhost to allow direct delivery
sudo postconf -e "relayhost ="

# Configure for direct delivery with proper DNS
sudo postconf -e "smtp_host_lookup = dns, native"
sudo postconf -e "disable_dns_lookups = no"

# Configure for port 587 outbound
sudo postconf -e "smtp_tls_security_level = may"
sudo postconf -e "smtp_tls_protocols = !SSLv2, !SSLv3"

echo "✅ Postfix configured for outbound SMTP"

# Restart Postfix
echo "🔄 Step 3: Restarting Postfix..."
sudo systemctl restart postfix

# Flush the mail queue
echo "📋 Step 4: Flushing mail queue..."
sudo postsuper -d ALL

# Send a new test email
echo "📤 Step 5: Sending new test email..."
echo "Subject: Test from TauOS Email Server - Fixed" | sendmail -f "superuser@tauos.org" "akumartrabaajo@gmail.com"

# Check mail queue
echo "📊 Step 6: Checking mail queue..."
sudo mailq

echo ""
echo "✅ Outbound SMTP fix completed!"
echo "📧 Check if the new email gets delivered..." 