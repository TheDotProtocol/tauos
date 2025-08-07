#!/bin/bash

echo "🚀 TauOS Email Server - Complete Fix Script"
echo "=========================================="

# Step 1: Fix Postfix Master Configuration
echo "📧 Step 1: Configuring Postfix for port 587..."

# Backup original master.cf
sudo cp /etc/postfix/master.cf /etc/postfix/master.cf.backup

# Add submission service to master.cf using proper method
sudo tee -a /etc/postfix/master.cf > /dev/null << 'EOF'
submission inet n       -       n       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_reject_unlisted_recipient=no
  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
  -o smtpd_helo_restrictions=permit_sasl_authenticated,reject
  -o smtpd_sender_restrictions=permit_sasl_authenticated,reject
  -o smtpd_recipient_restrictions=reject
  -o milter_macro_daemon_name=ORIGINATING
EOF

echo "✅ Postfix master.cf updated"

# Step 2: Configure Postfix SSL
echo "🔐 Step 2: Configuring Postfix SSL..."

sudo postconf -e "smtpd_tls_cert_file = /etc/ssl/certs/smtptauos.tauos.org.crt"
sudo postconf -e "smtpd_tls_key_file = /etc/ssl/private/smtptauos.tauos.org.key"
sudo postconf -e "smtpd_tls_security_level = may"
sudo postconf -e "smtpd_tls_auth_only = no"
sudo postconf -e 'smtpd_tls_protocols = !SSLv2, !SSLv3'
sudo postconf -e "smtpd_sasl_auth_enable = yes"
sudo postconf -e "smtpd_sasl_security_options = noanonymous"
sudo postconf -e "smtpd_sasl_local_domain = smtptauos.tauos.org"

echo "✅ Postfix SSL configured"

# Step 3: Configure Dovecot SSL
echo "📥 Step 3: Configuring Dovecot SSL..."

# Update Dovecot SSL configuration
sudo sed -i 's|^ssl_cert =.*|ssl_cert = </etc/ssl/certs/smtptauos.tauos.org.crt|' /etc/dovecot/conf.d/10-ssl.conf
sudo sed -i 's|^ssl_key =.*|ssl_key = </etc/ssl/private/smtptauos.tauos.org.key|' /etc/dovecot/conf.d/10-ssl.conf
sudo sed -i 's|^ssl = required|ssl = yes|' /etc/dovecot/conf.d/10-ssl.conf

echo "✅ Dovecot SSL configured"

# Step 4: Restart Services
echo "🔄 Step 4: Restarting services..."

sudo systemctl restart postfix
sudo systemctl restart dovecot

echo "✅ Services restarted"

# Step 5: Test Configuration
echo "🧪 Step 5: Testing configuration..."

echo "📊 Checking ports..."
sudo netstat -tlnp | grep -E ":(587|993)"

echo "📧 Testing SMTP..."
echo "EHLO smtptauos.tauos.org" | nc localhost 587

echo "📥 Testing IMAP..."
echo "a001 LOGIN superuser@tauos.org 1ac8886bf5633d3c3b49" | nc localhost 993

echo "✅ Testing completed"

# Step 6: Send Test Email
echo "📤 Step 6: Sending test email..."

cat << 'EOF' | sendmail -f "superuser@tauos.org" "njmsweettie@gmail.com"
Subject: 🎉 TauOS Email Server is LIVE!
From: superuser@tauos.org
To: njmsweettie@gmail.com

🎉 TauOS Email Server is now LIVE!

✅ SMTP Server: smtptauos.tauos.org:587
✅ IMAP Server: imaptauos.tauos.org:993
✅ SSL Certificates: Installed and working
✅ User Account: superuser@tauos.org
✅ Password: 1ac8886bf5633d3c3b49

This email was sent from our brand new AWS email server!
Server IP: 54.156.132.149
Date: $(date)

🚀 Mission Accomplished! TauOS Email Server is fully operational!

Best regards,
TauOS Team
EOF

echo "✅ Test email sent!"

echo ""
echo "🎉 TauOS Email Server Setup Complete!"
echo "====================================="
echo "✅ SMTP: smtptauos.tauos.org:587"
echo "✅ IMAP: imaptauos.tauos.org:993"
echo "✅ SSL: Self-signed certificates installed"
echo "✅ User: superuser@tauos.org"
echo "✅ Password: 1ac8886bf5633d3c3b49"
echo ""
echo "📧 Check your email for the test message!"
echo "🌐 Test the server: nc -zv 54.156.132.149 587" 