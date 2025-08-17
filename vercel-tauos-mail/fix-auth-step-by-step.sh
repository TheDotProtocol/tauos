#!/bin/bash

# Step-by-Step Authentication Fix
echo "🔧 Step-by-Step Authentication Fix..."

echo "👤 Checking existing noreply user..."
id noreply

echo "🔐 Setting password for noreply user (avoiding bash expansion)..."
echo 'noreply:TauOS2024!Secure' | sudo chpasswd

echo "📧 Creating email alias..."
echo "noreply@tauos.org noreply" | sudo tee -a /etc/aliases

echo "🗺️  Updating aliases database..."
sudo newaliases

echo "🔐 Creating PAM configuration for saslauthd..."
sudo tee /etc/pam.d/smtp > /dev/null << EOF
auth required pam_unix.so
account required pam_unix.so
EOF

echo "📧 Creating saslauthd configuration..."
sudo tee /etc/default/saslauthd > /dev/null << EOF
START=yes
DESC="SASL Authentication Daemon"
MECHANISMS="pam"
OPTIONS="-c -m /var/spool/postfix/var/run/saslauthd"
EOF

echo "📧 Creating saslauthd directory..."
sudo mkdir -p /var/spool/postfix/var/run/saslauthd
sudo chown postfix:sasl /var/spool/postfix/var/run/saslauthd
sudo chmod 710 /var/spool/postfix/var/run/saslauthd

echo "🔐 Creating SASL configuration..."
sudo mkdir -p /etc/postfix/sasl
sudo tee /etc/postfix/sasl/smtpd.conf > /dev/null << EOF
pwcheck_method: saslauthd
mech_list: PLAIN LOGIN
saslauthd_path: /var/spool/postfix/var/run/saslauthd/mux
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

echo "🔄 Restarting saslauthd..."
sudo systemctl stop saslauthd 2>/dev/null
sudo systemctl enable saslauthd
sudo systemctl start saslauthd

echo "🔄 Reloading Postfix..."
sudo systemctl reload postfix

echo "✅ Authentication Setup Complete!"
echo ""
echo "📋 Credentials:"
echo "SMTP_HOST=34.30.189.200"
echo "SMTP_PORT=587"
echo "SMTP_USER=noreply@tauos.org"
echo "SMTP_PASS=TauOS2024!Secure"
echo ""
echo "🔍 Testing authentication..."
sudo testsaslauthd -u noreply -p 'TauOS2024!Secure'

echo ""
echo "🔍 Testing email authentication..."
sudo testsaslauthd -u noreply@tauos.org -p 'TauOS2024!Secure'

echo ""
echo "📧 Checking saslauthd status..."
sudo systemctl status saslauthd --no-pager -l

echo ""
echo "📧 Checking saslauthd socket..."
ls -la /var/spool/postfix/var/run/saslauthd/

echo ""
echo "📧 Checking SASL configuration..."
sudo postconf -n | grep -i sasl 