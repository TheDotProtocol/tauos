#!/bin/bash

# Start and Configure SASL Authentication Daemon
echo "🔧 Starting and Configuring SASL Authentication Daemon..."

echo "📧 Installing saslauthd..."
sudo apt-get install -y sasl2-bin

echo "🔐 Creating SASL configuration..."
sudo mkdir -p /etc/postfix/sasl
sudo tee /etc/postfix/sasl/smtpd.conf > /dev/null << EOF
pwcheck_method: saslauthd
mech_list: PLAIN LOGIN
EOF

echo "📧 Creating password file..."
sudo tee /etc/postfix/sasl_passwd > /dev/null << EOF
[34.30.189.200]:587 noreply@tauos.org:TauOS2024!Secure
localhost:587 noreply@tauos.org:TauOS2024!Secure
127.0.0.1:587 noreply@tauos.org:TauOS2024!Secure
EOF

echo "🔐 Setting permissions..."
sudo chmod 600 /etc/postfix/sasl_passwd

echo "🗺️  Creating database..."
sudo postmap /etc/postfix/sasl_passwd

echo "📊 Configuring Postfix..."
sudo postconf -e 'smtpd_sasl_auth_enable = yes'
sudo postconf -e 'smtpd_sasl_local_domain = $myhostname'
sudo postconf -e 'smtpd_sasl_security_options = noanonymous'
sudo postconf -e 'smtpd_sasl_authenticated_header = yes'
sudo postconf -e 'smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination'

echo "🔄 Starting saslauthd..."
sudo systemctl enable saslauthd
sudo systemctl start saslauthd

echo "🔄 Reloading Postfix..."
sudo systemctl reload postfix

echo "✅ SASL Authentication Daemon Started!"
echo ""
echo "📋 Credentials:"
echo "SMTP_HOST=34.30.189.200"
echo "SMTP_PORT=587"
echo "SMTP_USER=noreply@tauos.org"
echo "SMTP_PASS=TauOS2024!Secure"
echo ""
echo "🔍 Testing authentication..."
sudo testsaslauthd -u noreply@tauos.org -p 'TauOS2024!Secure'

echo ""
echo "📧 Checking saslauthd status..."
sudo systemctl status saslauthd --no-pager -l

echo ""
echo "📧 Checking SASL configuration..."
sudo postconf -n | grep -i sasl 