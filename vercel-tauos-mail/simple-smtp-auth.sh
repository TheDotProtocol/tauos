#!/bin/bash

# Simple SMTP Authentication Setup
echo "🔧 Setting up Simple SMTP Authentication..."

echo "📧 Creating simple password file..."
sudo tee /etc/postfix/sasl_passwd > /dev/null << EOF
[34.30.189.200]:587 noreply@tauos.org:TauOS2024!Secure
localhost:587 noreply@tauos.org:TauOS2024!Secure
127.0.0.1:587 noreply@tauos.org:TauOS2024!Secure
EOF

echo "🔐 Setting permissions..."
sudo chmod 600 /etc/postfix/sasl_passwd

echo "🗺️  Creating database..."
sudo postmap /etc/postfix/sasl_passwd

echo "📊 Configuring Postfix for simple auth..."
sudo postconf -e 'smtpd_sasl_auth_enable = yes'
sudo postconf -e 'smtpd_sasl_local_domain = $myhostname'
sudo postconf -e 'smtpd_sasl_security_options = noanonymous'
sudo postconf -e 'smtpd_sasl_authenticated_header = yes'
sudo postconf -e 'smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination'
sudo postconf -e 'smtpd_client_restrictions = permit_mynetworks, permit_sasl_authenticated, reject'
sudo postconf -e 'smtpd_relay_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination'

echo "🔐 Creating SASL configuration..."
sudo mkdir -p /etc/postfix/sasl
sudo tee /etc/postfix/sasl/smtpd.conf > /dev/null << EOF
pwcheck_method: auxprop
auxprop_plugin: sasldb
mech_list: PLAIN LOGIN
EOF

echo "🔄 Reloading Postfix..."
sudo systemctl reload postfix

echo "✅ Simple SMTP Authentication Setup Complete!"
echo ""
echo "📋 Credentials:"
echo "SMTP_HOST=34.30.189.200"
echo "SMTP_PORT=587"
echo "SMTP_USER=noreply@tauos.org"
echo "SMTP_PASS=TauOS2024!Secure"
echo ""
echo "🔍 Testing connection..."
echo "EHLO localhost" | openssl s_client -connect localhost:587 -starttls smtp -crlf 