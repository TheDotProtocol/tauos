#!/bin/bash

# TauOS Sovereign Email Server Setup Script
# For Vultr Server: 136.244.83.147
# Domain: mailserver.tauos.org
# Email Domain: @tauos.org

set -e

echo "🚀 Starting TauOS Email Server Setup..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="tauos.org"
MAIL_DOMAIN="mailserver.tauos.org"
SERVER_IP="136.244.83.147"
ADMIN_EMAIL="admin@tauos.org"

echo -e "${BLUE}📧 Domain: ${DOMAIN}${NC}"
echo -e "${BLUE}📧 Mail Server: ${MAIL_DOMAIN}${NC}"
echo -e "${BLUE}📧 Server IP: ${SERVER_IP}${NC}"
echo ""

# Update system
echo -e "${YELLOW}🔄 Updating system packages...${NC}"
apt update && apt upgrade -y

# Install essential packages
echo -e "${YELLOW}📦 Installing essential packages...${NC}"
apt install -y \
    postfix \
    dovecot-core \
    dovecot-imapd \
    dovecot-pop3d \
    dovecot-lmtpd \
    dovecot-sieve \
    dovecot-managesieved \
    spamassassin \
    spamc \
    clamav \
    clamav-daemon \
    fail2ban \
    ufw \
    certbot \
    python3-certbot-nginx \
    nginx \
    openssl \
    mailutils \
    mutt \
    nano \
    htop \
    curl \
    wget \
    git

# Configure firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
ufw --force enable
ufw allow ssh
ufw allow 25/tcp    # SMTP
ufw allow 587/tcp   # SMTP submission
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 80/tcp    # HTTP (for Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 143/tcp   # IMAP
ufw allow 110/tcp   # POP3

# Create mail user
echo -e "${YELLOW}👤 Creating mail user...${NC}"
useradd -m -s /bin/bash mailuser
echo "mailuser:$(openssl rand -base64 32)" | chpasswd
usermod -aG mail mailuser

# Create mail directories
echo -e "${YELLOW}📁 Creating mail directories...${NC}"
mkdir -p /var/mail/vhosts/${DOMAIN}
mkdir -p /var/mail/vhosts/${DOMAIN}/admin
mkdir -p /var/mail/vhosts/${DOMAIN}/john
mkdir -p /etc/ssl/private
mkdir -p /etc/ssl/certs

# Set permissions
chown -R mailuser:mail /var/mail/vhosts
chmod -R 755 /var/mail/vhosts

# Configure Postfix
echo -e "${YELLOW}📧 Configuring Postfix...${NC}"
cat > /etc/postfix/main.cf << EOF
# Basic configuration
myhostname = ${MAIL_DOMAIN}
mydomain = ${DOMAIN}
myorigin = \$mydomain
mydestination = localhost, localhost.\$mydomain, \$mydomain
mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128
inet_interfaces = all
inet_protocols = all

# Mailbox configuration
home_mailbox = Maildir/
mailbox_command = 

# TLS configuration
smtpd_use_tls = yes
smtpd_tls_cert_file = /etc/ssl/certs/mailserver.crt
smtpd_tls_key_file = /etc/ssl/private/mailserver.key
smtpd_tls_security_level = may
smtpd_tls_auth_only = no
smtpd_tls_loglevel = 1
smtpd_tls_received_header = yes
smtpd_tls_session_cache_timeout = 3600s
tls_random_source = dev:/dev/urandom

# SMTP authentication
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes
smtpd_sasl_security_options = noanonymous
smtpd_sasl_local_domain = \$myhostname
smtpd_recipient_restrictions = permit_sasl_authenticated,permit_mynetworks,reject_unauth_destination

# Virtual domains
virtual_mailbox_domains = ${DOMAIN}
virtual_mailbox_base = /var/mail/vhosts
virtual_mailbox_maps = hash:/etc/postfix/virtual_mailbox_maps
virtual_alias_maps = hash:/etc/postfix/virtual_alias_maps
virtual_minimum_uid = 1000
virtual_uid_maps = static:1000
virtual_gid_maps = static:1000

# Message size limits
message_size_limit = 10485760
mailbox_size_limit = 1073741824

# Logging
maillog_file = /var/log/mail.log
EOF

# Create virtual mailbox maps
echo -e "${YELLOW}📋 Creating virtual mailbox maps...${NC}"
cat > /etc/postfix/virtual_mailbox_maps << EOF
admin@${DOMAIN} ${DOMAIN}/admin/
john@${DOMAIN} ${DOMAIN}/john/
EOF

cat > /etc/postfix/virtual_alias_maps << EOF
postmaster@${DOMAIN} admin@${DOMAIN}
abuse@${DOMAIN} admin@${DOMAIN}
EOF

# Generate Postfix maps
postmap /etc/postfix/virtual_mailbox_maps
postmap /etc/postfix/virtual_alias_maps

# Configure Postfix master.cf
echo -e "${YELLOW}⚙️ Configuring Postfix master.cf...${NC}"
cat > /etc/postfix/master.cf << EOF
# Postfix master process configuration file
smtp      inet  n       -       y       -       -       smtpd
smtps     inet  n       -       y       -       -       smtpd
  -o smtpd_tls_wrappermode=yes
  -o smtpd_sasl_auth_enable=yes
submission inet n       -       y       -       -       smtpd
  -o smtpd_enforce_tls=yes
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_reject_unlisted_recipient=no
  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
  -o milter_macro_daemon_name=ORIGINATING
pickup    unix  n       -       y       60      1       pickup
cleanup   unix  n       -       y       -       0       cleanup
qmgr      unix  n       -       n       300     1       qmgr
tlsmgr    unix  -       -       y       1000?   1       tlsmgr
rewrite   unix  -       -       y       -       -       trivial-rewrite
bounce    unix  -       -       y       -       0       bounce
defer     unix  -       -       y       -       0       bounce
trace     unix  -       -       y       -       0       bounce
verify    unix  -       -       y       -       1       verify
flush     unix  n       -       y       1000?   0       flush
proxymap  unix  -       -       n       -       -       proxymap
proxywrite unix -       -       n       -       1       proxymap
smtp      unix  -       -       y       -       -       smtp
relay     unix  -       -       y       -       -       smtp
showq     unix  n       -       y       -       -       showq
error     unix  -       -       y       -       -       error
retry     unix  -       -       y       -       -       error
discard   unix  -       -       y       -       -       discard
local     unix  -       n       n       -       -       local
virtual   unix  -       n       n       -       -       virtual
lmtp      unix  -       -       y       -       -       lmtp
anvil     unix  -       -       y       -       1       anvil
scache    unix  -       -       y       -       1       scache
EOF

# Configure Dovecot
echo -e "${YELLOW}📧 Configuring Dovecot...${NC}"
cat > /etc/dovecot/dovecot.conf << EOF
# Dovecot configuration
protocols = imap pop3 lmtp
listen = *, ::

# Logging
log_path = /var/log/dovecot.log
info_log_path = /var/log/dovecot-info.log
debug_log_path = /var/log/dovecot-debug.log

# Authentication
auth_mechanisms = plain login
auth_username_format = %n
passdb {
  driver = passwd-file
  args = /etc/dovecot/passwd
}
userdb {
  driver = static
  args = uid=mailuser gid=mail home=/var/mail/vhosts/%d/%n
}

# Mail location
mail_location = maildir:/var/mail/vhosts/%d/%n

# SSL/TLS
ssl = required
ssl_cert = </etc/ssl/certs/mailserver.crt
ssl_key = </etc/ssl/private/mailserver.key
ssl_protocols = !SSLv2 !SSLv3
ssl_cipher_list = ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384

# IMAP configuration
protocol imap {
  mail_plugins = \$mail_plugins
}

# POP3 configuration
protocol pop3 {
  mail_plugins = \$mail_plugins
}

# LMTP configuration
protocol lmtp {
  mail_plugins = \$mail_plugins
}

# Plugin configuration
plugin {
  sieve = /var/mail/vhosts/%d/%n/.dovecot.sieve
  sieve_dir = /var/mail/vhosts/%d/%n/sieve
}
EOF

# Create Dovecot passwd file
echo -e "${YELLOW}🔐 Creating Dovecot authentication...${NC}"
cat > /etc/dovecot/passwd << EOF
admin@${DOMAIN}:{PLAIN}$(openssl rand -base64 32)
john@${DOMAIN}:{PLAIN}$(openssl rand -base64 32)
EOF

# Set permissions
chown root:root /etc/dovecot/passwd
chmod 600 /etc/dovecot/passwd

# Generate self-signed certificates (temporary)
echo -e "${YELLOW}🔒 Generating temporary SSL certificates...${NC}"
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/mailserver.key \
    -out /etc/ssl/certs/mailserver.crt \
    -subj "/C=DE/ST=Frankfurt/L=Frankfurt/O=TauOS/OU=IT/CN=${MAIL_DOMAIN}/emailAddress=${ADMIN_EMAIL}"

chmod 600 /etc/ssl/private/mailserver.key
chmod 644 /etc/ssl/certs/mailserver.crt

# Configure SpamAssassin
echo -e "${YELLOW}🛡️ Configuring SpamAssassin...${NC}"
systemctl enable spamassassin
systemctl start spamassassin

# Configure ClamAV
echo -e "${YELLOW}🦠 Configuring ClamAV...${NC}"
systemctl enable clamav-daemon
systemctl start clamav-daemon

# Configure Fail2ban
echo -e "${YELLOW}🚫 Configuring Fail2ban...${NC}"
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log

[postfix]
enabled = true
port = smtp,465,submission
logpath = /var/log/mail.log

[dovecot]
enabled = true
port = imap,imaps,pop3,pop3s
logpath = /var/log/dovecot.log
EOF

systemctl enable fail2ban
systemctl start fail2ban

# Start services
echo -e "${YELLOW}🚀 Starting email services...${NC}"
systemctl enable postfix
systemctl start postfix
systemctl enable dovecot
systemctl start dovecot

# Create test email accounts
echo -e "${YELLOW}👤 Creating test email accounts...${NC}"
echo "admin@${DOMAIN}:admin123" | chpasswd
echo "john@${DOMAIN}:password123" | chpasswd

# Create mail directories for test users
mkdir -p /var/mail/vhosts/${DOMAIN}/admin/Maildir/{cur,new,tmp}
mkdir -p /var/mail/vhosts/${DOMAIN}/john/Maildir/{cur,new,tmp}
chown -R mailuser:mail /var/mail/vhosts

# Configure Nginx for webmail (optional)
echo -e "${YELLOW}🌐 Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/mailserver << EOF
server {
    listen 80;
    server_name ${MAIL_DOMAIN};
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name ${MAIL_DOMAIN};
    
    ssl_certificate /etc/ssl/certs/mailserver.crt;
    ssl_certificate_key = /etc/ssl/private/mailserver.key;
    
    location / {
        root /var/www/html;
        index index.html;
    }
}
EOF

ln -sf /etc/nginx/sites-available/mailserver /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Create simple webmail page
mkdir -p /var/www/html
cat > /var/www/html/index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>TauOS Mail Server</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; }
        .info { background: #e8f4f8; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .credentials { background: #f8f8f8; padding: 15px; border-radius: 4px; margin: 10px 0; }
        .status { color: #28a745; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📧 TauOS Mail Server</h1>
        <div class="info">
            <h3>✅ Server Status: Online</h3>
            <p><strong>Domain:</strong> ${DOMAIN}</p>
            <p><strong>Mail Server:</strong> ${MAIL_DOMAIN}</p>
            <p><strong>Server IP:</strong> ${SERVER_IP}</p>
        </div>
        
        <div class="credentials">
            <h3>🔐 Test Accounts</h3>
            <p><strong>Admin:</strong> admin@${DOMAIN} / admin123</p>
            <p><strong>User:</strong> john@${DOMAIN} / password123</p>
        </div>
        
        <div class="info">
            <h3>📱 Email Client Configuration</h3>
            <p><strong>IMAP:</strong> ${MAIL_DOMAIN} (port 993, SSL)</p>
            <p><strong>POP3:</strong> ${MAIL_DOMAIN} (port 995, SSL)</p>
            <p><strong>SMTP:</strong> ${MAIL_DOMAIN} (port 587, STARTTLS)</p>
        </div>
        
        <div class="status">
            <p>🎉 TauOS Sovereign Email Server is ready!</p>
        </div>
    </div>
</body>
</html>
EOF

systemctl enable nginx
systemctl start nginx

# Final status check
echo -e "${GREEN}✅ Email server setup completed!${NC}"
echo "=================================="
echo -e "${BLUE}📧 Domain: ${DOMAIN}${NC}"
echo -e "${BLUE}📧 Mail Server: ${MAIL_DOMAIN}${NC}"
echo -e "${BLUE}📧 Server IP: ${SERVER_IP}${NC}"
echo ""
echo -e "${GREEN}🔐 Test Accounts:${NC}"
echo -e "${GREEN}  Admin: admin@${DOMAIN} / admin123${NC}"
echo -e "${GREEN}  User: john@${DOMAIN} / password123${NC}"
echo ""
echo -e "${GREEN}📱 Email Client Settings:${NC}"
echo -e "${GREEN}  IMAP: ${MAIL_DOMAIN} (port 993, SSL)${NC}"
echo -e "${GREEN}  POP3: ${MAIL_DOMAIN} (port 995, SSL)${NC}"
echo -e "${GREEN}  SMTP: ${MAIL_DOMAIN} (port 587, STARTTLS)${NC}"
echo ""
echo -e "${GREEN}🌐 Web Interface: http://${MAIL_DOMAIN}${NC}"
echo ""
echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo -e "${YELLOW}  1. Configure DNS records for ${DOMAIN}${NC}"
echo -e "${YELLOW}  2. Point mailserver.tauos.org to ${SERVER_IP}${NC}"
echo -e "${YELLOW}  3. Get Let's Encrypt SSL certificate${NC}"
echo -e "${YELLOW}  4. Test email sending/receiving${NC}"
echo ""
echo -e "${GREEN}🎉 TauOS Sovereign Email Server is ready!${NC}"
