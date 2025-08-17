#!/bin/bash

# Final SMTP Fix - Get It Working Properly
echo "🔧 Final SMTP Fix - Getting Sovereign Email Working!"

echo "📧 Stopping all services..."
sudo systemctl stop saslauthd postfix

echo "🔐 Creating proper saslauthd configuration..."
sudo tee /etc/default/saslauthd > /dev/null << 'EOF'
START=yes
DESC="SASL Authentication Daemon"
MECHANISMS="pam"
OPTIONS="-c -m /var/spool/postfix/var/run/saslauthd"
EOF

echo "📧 Creating saslauthd directory with correct permissions..."
sudo mkdir -p /var/spool/postfix/var/run/saslauthd
sudo chown postfix:sasl /var/spool/postfix/var/run/saslauthd
sudo chmod 710 /var/spool/postfix/var/run/saslauthd

echo "🔐 Creating PAM configuration..."
sudo tee /etc/pam.d/smtp > /dev/null << 'EOF'
auth required pam_unix.so
account required pam_unix.so
EOF

echo "👤 Setting up noreply user..."
echo 'noreply:TauOS2024!Secure' | sudo chpasswd

echo "📧 Creating proper aliases..."
sudo sed -i '/noreply/d' /etc/aliases
echo "noreply: noreply@tauos.org" | sudo tee -a /etc/aliases
sudo newaliases

echo "🔐 Creating SASL configuration..."
sudo mkdir -p /etc/postfix/sasl
sudo tee /etc/postfix/sasl/smtpd.conf > /dev/null << 'EOF'
pwcheck_method: saslauthd
mech_list: PLAIN LOGIN
saslauthd_path: /var/spool/postfix/var/run/saslauthd/mux
EOF

echo "📧 Creating password file..."
sudo tee /etc/postfix/sasl_passwd > /dev/null << 'EOF'
[34.30.189.200]:587 noreply@tauos.org:TauOS2024!Secure
localhost:587 noreply@tauos.org:TauOS2024!Secure
127.0.0.1:587 noreply@tauos.org:TauOS2024!Secure
EOF

echo "🔐 Setting permissions..."
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd

echo "📊 Configuring Postfix..."
sudo postconf -e 'smtpd_sasl_auth_enable = yes'
sudo postconf -e 'smtpd_sasl_local_domain = $myhostname'
sudo postconf -e 'smtpd_sasl_security_options = noanonymous'
sudo postconf -e 'smtpd_sasl_authenticated_header = yes'
sudo postconf -e 'smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination'

echo "🔄 Starting services in correct order..."
sudo systemctl start saslauthd
sleep 3
sudo systemctl start postfix

echo "✅ Configuration Complete!"
echo ""
echo "🔍 Testing authentication..."
sudo testsaslauthd -u noreply -p 'TauOS2024!Secure'

echo ""
echo "📧 Checking saslauthd status..."
sudo systemctl status saslauthd --no-pager -l

echo ""
echo "📧 Checking saslauthd socket..."
ls -la /var/spool/postfix/var/run/saslauthd/

echo ""
echo "📧 Testing SMTP connection..."
echo "EHLO localhost" | openssl s_client -connect localhost:587 -starttls smtp -crlf 2>/dev/null | head -5

echo ""
echo "✅ Ready for email testing!"
echo ""
echo "📋 Vercel Environment Variables:"
echo "SMTP_HOST=34.30.189.200"
echo "SMTP_PORT=587"
echo "SMTP_USER=noreply@tauos.org"
echo "SMTP_PASS=TauOS2024!Secure"
echo ""
echo "🚀 Go to https://mail.tauos.org/dashboard and send a test email!" 