#!/bin/bash

# Fresh Email Server Setup for TauOS
# This script completely removes and reinstalls Postfix and Dovecot

echo "🚀 Starting fresh email server setup..."

# Stop and remove existing services
echo "🛑 Stopping and removing existing services..."
systemctl stop postfix dovecot
apt-get remove --purge -y postfix dovecot-core dovecot-imapd dovecot-pop3d dovecot-lmtpd dovecot-sieve dovecot-managesieved
apt-get autoremove -y
apt-get autoclean

# Clean up configuration files
echo "🧹 Cleaning up configuration files..."
rm -rf /etc/postfix
rm -rf /etc/dovecot
rm -rf /var/mail/vhosts
rm -rf /etc/ssl/certs/mailserver.*
rm -rf /etc/ssl/private/mailserver.*

# Update system
echo "📦 Updating system packages..."
apt-get update

# Install fresh packages
echo "📥 Installing fresh email packages..."
apt-get install -y postfix dovecot-core dovecot-imapd dovecot-pop3d dovecot-lmtpd dovecot-sieve dovecot-managesieved

# Create mail directories
echo "📁 Creating mail directories..."
mkdir -p /var/mail/vhosts/tauos.org
useradd -r -u 5000 -g mail -d /var/mail/vhosts -s /sbin/nologin -c "Virtual Mailbox" vmail
chown -R vmail:mail /var/mail/vhosts

# Generate SSL certificate
echo "🔐 Generating SSL certificate..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/mailserver.key \
    -out /etc/ssl/certs/mailserver.crt \
    -subj "/C=US/ST=CA/L=San Francisco/O=TauOS/OU=IT/CN=mailserver.tauos.org/emailAddress=admin@tauos.org"

chmod 600 /etc/ssl/private/mailserver.key
chmod 644 /etc/ssl/certs/mailserver.crt

# Configure Postfix
echo "📧 Configuring Postfix..."
cat > /etc/postfix/main.cf << 'EOF'
# Basic settings
myhostname = mailserver.tauos.org
mydomain = tauos.org
myorigin = $mydomain
inet_interfaces = all
inet_protocols = all
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain
mynetworks = 127.0.0.0/8, [::ffff:127.0.0.0]/104, [::1]/128
relay_domains = 
home_mailbox = Maildir/

# TLS settings
smtpd_use_tls = yes
smtpd_tls_cert_file = /etc/ssl/certs/mailserver.crt
smtpd_tls_key_file = /etc/ssl/private/mailserver.key
smtpd_tls_security_level = may
smtpd_tls_auth_only = no
smtpd_tls_loglevel = 1
smtpd_tls_received_header = yes
smtpd_tls_session_cache_timeout = 3600s

# SMTP Authentication
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes
smtpd_sasl_security_options = noanonymous
smtpd_sasl_local_domain = $myhostname

# Virtual domains
virtual_mailbox_domains = tauos.org
virtual_mailbox_base = /var/mail/vhosts
virtual_mailbox_maps = hash:/etc/postfix/virtual_mailbox_maps
virtual_alias_maps = hash:/etc/postfix/virtual_alias_maps

# Recipient restrictions
smtpd_recipient_restrictions = permit_sasl_authenticated,permit_mynetworks,reject_unauth_destination

# Message size limit
message_size_limit = 10485760

# Other settings
biff = no
append_dot_mydomain = no
readme_directory = no
EOF

# Create virtual mailbox maps
echo "📋 Creating virtual mailbox maps..."
cat > /etc/postfix/virtual_mailbox_maps << 'EOF'
admin@tauos.org tauos.org/admin/
john@tauos.org tauos.org/john/
EOF

cat > /etc/postfix/virtual_alias_maps << 'EOF'
postmaster@tauos.org admin@tauos.org
EOF

# Generate hash files
postmap /etc/postfix/virtual_mailbox_maps
postmap /etc/postfix/virtual_alias_maps

# Configure master.cf for submission port
echo "🔧 Configuring master.cf..."
cat >> /etc/postfix/master.cf << 'EOF'

# SMTP submission port
submission inet n       -       y       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_tls_auth_only=yes
  -o smtpd_reject_unlisted_recipient=no
  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
  -o smtpd_recipient_restrictions=permit_sasl_authenticated,reject
  -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
  -o milter_macro_daemon_name=ORIGINATING
EOF

# Configure Dovecot
echo "🕊️ Configuring Dovecot..."
cat > /etc/dovecot/dovecot.conf << 'EOF'
# Protocols
protocols = imap pop3 lmtp

# Listen addresses
listen = *, ::

# Mail location
mail_location = maildir:/var/mail/vhosts/%d/%n

# User and group
mail_uid = vmail
mail_gid = mail

# Authentication
auth_mechanisms = plain login
!include auth-passwdfile.conf.ext

# SSL
ssl = required
ssl_cert = </etc/ssl/certs/mailserver.crt
ssl_key = </etc/ssl/private/mailserver.key
ssl_min_protocol = TLSv1.2

# Logging
log_path = /var/log/dovecot.log
info_log_path = /var/log/dovecot.log
debug_log_path = /var/log/dovecot.log
EOF

# Create passwdfile configuration
cat > /etc/dovecot/conf.d/auth-passwdfile.conf.ext << 'EOF'
passdb {
  driver = passwd-file
  args = scheme=PLAIN username_format=%u /etc/dovecot/users
}

userdb {
  driver = passwd-file
  args = username_format=%u /etc/dovecot/users
  default_fields = uid=vmail gid=mail home=/var/mail/vhosts/%d/%n
}
EOF

# Create user database
echo "👤 Creating user database..."
cat > /etc/dovecot/users << 'EOF'
admin@tauos.org:{PLAIN}TauOS@132
john@tauos.org:{PLAIN}password123
EOF

# Configure master service
cat > /etc/dovecot/conf.d/10-master.conf << 'EOF'
service imap-login {
  inet_listener imap {
    port = 143
  }
  inet_listener imaps {
    port = 993
    ssl = yes
  }
}

service pop3-login {
  inet_listener pop3 {
    port = 110
  }
  inet_listener pop3s {
    port = 995
    ssl = yes
  }
}

service lmtp {
  unix_listener /var/spool/postfix/private/dovecot-lmtp {
    mode = 0600
    user = postfix
    group = postfix
  }
}

service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0666
    user = postfix
    group = postfix
  }
  unix_listener auth-userdb {
    mode = 0600
    user = vmail
    group = mail
  }
  user = dovecot
}

service auth-worker {
  user = vmail
}
EOF

# Set permissions
chown -R vmail:mail /var/mail/vhosts
chmod -R 755 /var/mail/vhosts

# Start services
echo "🚀 Starting services..."
systemctl enable postfix dovecot
systemctl start postfix dovecot

# Check status
echo "✅ Checking service status..."
systemctl status postfix --no-pager
systemctl status dovecot --no-pager

echo "🎉 Fresh email server setup complete!"
echo "📧 SMTP: mailserver.tauos.org:587 (TLS)"
echo "📧 IMAP: mailserver.tauos.org:993 (SSL)"
echo "📧 POP3: mailserver.tauos.org:995 (SSL)"
echo "👤 Test users: admin@tauos.org / TauOS@132, john@tauos.org / password123"
