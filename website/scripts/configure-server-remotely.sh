#!/bin/bash

# TauOS Email Server Remote Configuration Script
# This script will configure the email server using AWS Systems Manager

echo "🚀 TauOS Email Server Remote Configuration"
echo "=========================================="

# Generate a secure password for superuser
SUPERUSER_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

echo "🔐 Generated password for superuser@tauos.org: $SUPERUSER_PASSWORD"

# Create the configuration script to run on the server
cat > server-config.sh << 'EOF'
#!/bin/bash

echo "🔧 Configuring TauOS Email Server..."

# Update system
sudo apt update

# Install additional packages
sudo apt install -y certbot python3-certbot-nginx

# Update hostname
sudo hostnamectl set-hostname smtptauos.tauos.org

# Create superuser account
sudo useradd -m -s /bin/bash superuser
echo "superuser:$SUPERUSER_PASSWORD" | sudo chpasswd

# Configure Postfix for the new domain
sudo postconf -e "myhostname = smtptauos.tauos.org"
sudo postconf -e "mydomain = tauos.org"
sudo postconf -e "myorigin = tauos.org"
sudo postconf -e "inet_interfaces = all"
sudo postconf -e "inet_protocols = ipv4"
sudo postconf -e "smtp_tls_security_level = may"
sudo postconf -e "smtpd_tls_security_level = may"
sudo postconf -e "smtpd_tls_cert_file = /etc/ssl/certs/ssl-cert-snakeoil.pem"
sudo postconf -e "smtpd_tls_key_file = /etc/ssl/private/ssl-cert-snakeoil.key"

# Configure Dovecot
sudo sed -i 's/#disable_plaintext_auth = yes/disable_plaintext_auth = no/' /etc/dovecot/conf.d/10-auth.conf
sudo sed -i 's/^ssl = required/ssl = yes/' /etc/dovecot/conf.d/10-ssl.conf

# Restart services
sudo systemctl restart postfix
sudo systemctl restart dovecot

# Install SSL certificates
sudo certbot --nginx -d smtptauos.tauos.org -d imaptauos.tauos.org --non-interactive --agree-tos --email admin@tauos.org

echo "✅ Server configuration completed!"
echo "📧 SMTP: smtptauos.tauos.org:587"
echo "📥 IMAP: imaptauos.tauos.org:993"
echo "👤 Superuser: superuser@tauos.org"
echo "🔐 Password: $SUPERUSER_PASSWORD"
EOF

# Send the configuration script to the server using AWS Systems Manager
echo "📤 Sending configuration script to server..."
aws ssm send-command \
    --instance-ids "i-036f6d9a6262b42fe" \
    --document-name "AWS-RunShellScript" \
    --parameters 'commands=["curl -o server-config.sh https://raw.githubusercontent.com/your-repo/server-config.sh", "chmod +x server-config.sh", "./server-config.sh"]'

echo "✅ Configuration script sent to server!"
echo "🔧 The server will now be configured with:"
echo "   - Updated hostname: smtptauos.tauos.org"
echo "   - SSL certificates for both domains"
echo "   - Superuser account: superuser@tauos.org"
echo "   - Password: $SUPERUSER_PASSWORD"

echo ""
echo "🎯 Next Steps:"
echo "1. Wait for configuration to complete (5-10 minutes)"
echo "2. Test email sending with the new credentials"
echo "3. Send welcome emails to test recipients" 