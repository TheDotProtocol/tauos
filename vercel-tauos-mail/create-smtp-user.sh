#!/bin/bash

# Create SMTP User Account for SASL Authentication
echo "🔧 Creating SMTP User Account for SASL Authentication..."

echo "👤 Creating noreply user..."
sudo useradd -r -s /bin/false noreply

echo "🔐 Setting password for noreply user..."
echo "noreply:TauOS2024!Secure" | sudo chpasswd

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
# This is the config for saslauthd, the SASL authentication daemon
START=yes
DESC="SASL Authentication Daemon"
MECHANISMS="pam"
OPTIONS="-c -m /var/spool/postfix/var/run/saslauthd"
EOF

echo "📧 Creating saslauthd directory..."
sudo mkdir -p /var/spool/postfix/var/run/saslauthd
sudo chown postfix:sasl /var/spool/postfix/var/run/saslauthd
sudo chmod 710 /var/spool/postfix/var/run/saslauthd

echo "🔄 Restarting saslauthd..."
sudo systemctl stop saslauthd 2>/dev/null
sudo systemctl enable saslauthd
sudo systemctl start saslauthd

echo "✅ SMTP User Account Created!"
echo ""
echo "📋 User Details:"
echo "Username: noreply"
echo "Email: noreply@tauos.org"
echo "Password: TauOS2024!Secure"
echo ""
echo "🔍 Testing authentication..."
sudo testsaslauthd -u noreply -p 'TauOS2024!Secure'

echo ""
echo "🔍 Testing email authentication..."
sudo testsaslauthd -u noreply@tauos.org -p 'TauOS2024!Secure'

echo ""
echo "📧 Checking user account..."
id noreply

echo ""
echo "📧 Checking saslauthd status..."
sudo systemctl status saslauthd --no-pager -l 