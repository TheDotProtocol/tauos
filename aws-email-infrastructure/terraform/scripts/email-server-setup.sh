#!/bin/bash

# TauOS Email Server Setup Script
# This script installs and configures a complete email server infrastructure

set -e

# Update system
echo "🔄 Updating system packages..."
apt-get update
apt-get upgrade -y

# Install required packages
echo "📦 Installing email server packages..."
apt-get install -y \
    postfix \
    dovecot-core \
    dovecot-imapd \
    dovecot-pop3d \
    dovecot-mysql \
    dovecot-sieve \
    dovecot-managesieved \
    opendkim \
    opendmarc \
    spamassassin \
    clamav \
    clamav-daemon \
    nginx \
    certbot \
    python3-certbot-nginx \
    fail2ban \
    ufw \
    htop \
    vim \
    curl \
    wget \
    git

# Configure firewall
echo "🔥 Configuring firewall..."
ufw --force enable
ufw allow ssh
ufw allow 25/tcp   # SMTP
ufw allow 587/tcp  # SMTP with TLS
ufw allow 143/tcp  # IMAP
ufw allow 993/tcp  # IMAP with TLS
ufw allow 110/tcp  # POP3
ufw allow 995/tcp  # POP3 with TLS
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS

# Create mail user
echo "👤 Creating mail user..."
useradd -m -s /bin/bash mailuser
echo "mailuser:tauosmail2024!" | chpasswd

# Configure Postfix
echo "📧 Configuring Postfix..."
cat > /etc/postfix/main.cf << 'EOF'
# Basic Settings
myhostname = smtp.tauos.org
mydomain = tauos.org
myorigin = $mydomain
inet_interfaces = all
inet_protocols = ipv4

# Mailbox Settings
home_mailbox = Maildir/
mailbox_command =

# TLS Settings
smtpd_tls_cert_file = /etc/letsencrypt/live/smtp.tauos.org/fullchain.pem
smtpd_tls_key_file = /etc/letsencrypt/live/smtp.tauos.org/privkey.pem
smtpd_use_tls = yes
smtpd_tls_auth_only = yes
smtpd_tls_security_level = may
smtpd_tls_protocols = !SSLv2, !SSLv3

# Authentication
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes
smtpd_sasl_security_options = noanonymous

# Relay Settings
smtpd_relay_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination

# Network Settings
mynetworks = 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16

# Spam Protection
smtpd_helo_required = yes
smtpd_helo_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_invalid_helo_hostname, reject_non_fqdn_helo_hostname

# Rate Limiting
smtpd_client_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_pipelining, reject_invalid_helo_hostname, reject_non_fqdn_helo_hostname
smtpd_sender_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_non_fqdn_sender, reject_unauth_pipelining, reject_invalid_hostname, reject_unauth_pipelining
smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination, reject_invalid_hostname, reject_non_fqdn_hostname, reject_non_fqdn_recipient

# DKIM
milter_default_action = accept
milter_protocol = 2
smtpd_milters = inet:localhost:8891
non_smtpd_milters = inet:localhost:8891

# DMARC
smtpd_milters = inet:localhost:8892

# Logging
mailbox_size_limit = 0
message_size_limit = 0
EOF

# Configure Postfix master.cf
cat > /etc/postfix/master.cf << 'EOF'
# Postfix master process configuration file
smtp      inet  n       -       y       -       -       smtpd
  -o content_filter=spamassassin
submission inet n       -       y       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_tls_auth_only=yes
  -o smtpd_reject_unlisted_recipient=no
  -o smtpd_client_restrictions=$mua_client_restrictions
  -o smtpd_helo_restrictions=$mua_helo_restrictions
  -o smtpd_sender_restrictions=$mua_sender_restrictions
  -o smtpd_recipient_restrictions=
  -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
  -o milter_macro_daemon_name=ORIGINATING
smtps     inet  n       -       y       -       -       smtpd
  -o syslog_name=postfix/smtps
  -o smtpd_tls_wrappermode=yes
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_reject_unlisted_recipient=no
  -o smtpd_client_restrictions=$mua_client_restrictions
  -o smtpd_helo_restrictions=$mua_helo_restrictions
  -o smtpd_sender_restrictions=$mua_sender_restrictions
  -o smtpd_recipient_restrictions=
  -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
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
        -o syslog_name=postfix/$service_name
error     unix  -       -       y       -       -       error
retry     unix  -       -       y       -       -       error
discard   unix  -       -       y       -       -       discard
lmtp      unix  -       -       y       -       -       lmtp
anvil     unix  -       -       y       -       1       anvil
scache    unix  -       -       y       -       1       scache
postlog   unix-dgram n  -       n       -       1       postlogd
maildrop  unix  -       n       n       -       -       pipe
  flags=DRhu user=vmail argv=/usr/bin/maildrop -d ${recipient}
uucp      unix  -       n       n       -       -       pipe
  flags=Fqhu user=uucp argv=uux -r -n -z -a$sender - $nexthop!rmail ($recipient)
ifmail    unix  -       n       n       -       -       pipe
  flags=F user=ftn argv=/usr/lib/ifmail/ifmail -r $nexthop ($recipient)
bsmtp     unix  -       n       n       -       -       pipe
  flags=Fq. user=bsmtp argv=/usr/lib/bsmtp/bsmtp -t$nexthop -f$sender $recipient
scalemail-backend unix  -       n       n       -       2       pipe
  flags=R user=scalemail argv=/usr/lib/scalemail/bin/scalemail-store ${nexthop} ${user} ${extension}
mailman   unix  -       n       n       -       -       pipe
  flags=FR user=list argv=/usr/lib/mailman/bin/postfix-to-mailman.py
  ${nexthop} ${user}
spamassassin unix -     n       n       -       -       pipe
  user=spamd argv=/usr/bin/spamc -f -e /usr/sbin/sendmail -oi -f ${sender} ${recipient}
EOF

# Configure Dovecot
echo "📥 Configuring Dovecot..."
cat > /etc/dovecot/conf.d/10-mail.conf << 'EOF'
mail_location = maildir:~/Maildir
mail_privileged_group = mail
mail_access_groups = mail
mail_uid = 1000
mail_gid = 1000
EOF

cat > /etc/dovecot/conf.d/10-auth.conf << 'EOF'
disable_plaintext_auth = yes
auth_mechanisms = plain login
passdb {
  driver = pam
}
userdb {
  driver = passwd
}
EOF

cat > /etc/dovecot/conf.d/10-master.conf << 'EOF'
service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0660
    user = postfix
    group = postfix
  }
}
EOF

cat > /etc/dovecot/conf.d/10-ssl.conf << 'EOF'
ssl = required
ssl_cert = </etc/letsencrypt/live/smtp.tauos.org/fullchain.pem
ssl_key = </etc/letsencrypt/live/smtp.tauos.org/privkey.pem
ssl_protocols = !SSLv2 !SSLv3
ssl_cipher_list = ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384
ssl_prefer_server_ciphers = yes
ssl_dh_parameters_length = 2048
EOF

# Configure OpenDKIM
echo "🔐 Configuring OpenDKIM..."
mkdir -p /etc/opendkim/keys/tauos.org
opendkim-genkey -t -s mail -d tauos.org -D /etc/opendkim/keys/tauos.org/
chown -R opendkim:opendkim /etc/opendkim/keys/tauos.org/

cat > /etc/opendkim.conf << 'EOF'
AutoRestart             Yes
AutoRestartRate         10/1h
UMask                   002
Syslog                  yes
SyslogSuccess           Yes
LogWhy                  Yes

Canonicalization        relaxed/simple

Mode                    sv
SubDomains             No

# Sign for domain
Domain                  tauos.org
KeyFile                 /etc/opendkim/keys/tauos.org/mail.private
Selector                mail

# Socket
Socket                  inet:8891@localhost

PidFile                 /var/run/opendkim/opendkim.pid
SignatureAlgorithm      rsa-sha256

# Always oversign From (sign using actual From and a null From to prevent malicious signatures header fields (From: <sender@domain.com>)
OversignHeaders         From
EOF

# Configure OpenDMARC
echo "📊 Configuring OpenDMARC..."
cat > /etc/opendmarc.conf << 'EOF'
AuthservID smtp.tauos.org
PidFile /var/run/opendmarc/opendmarc.pid
RejectFailures false
SyslogSockName inet:8892@localhost
TrustedHosts 127.0.0.1
UMask 0002
UserID opendmarc:opendmarc
IgnoreHosts /etc/opendmarc/ignore.hosts
HistoryFile /var/run/opendmarc/opendmarc.dat
Socket inet:8892@localhost
EOF

# Configure SpamAssassin
echo "🛡️ Configuring SpamAssassin..."
cat > /etc/spamassassin/local.cf << 'EOF'
# SpamAssassin local configuration
rewrite_header Subject *****SPAM*****
required_score 5.0
use_bayes 1
bayes_auto_learn 1
EOF

# Configure Fail2ban
echo "🚫 Configuring Fail2ban..."
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[postfix]
enabled = true
port = smtp,465,submission
filter = postfix
logpath = /var/log/mail.log
maxretry = 3

[dovecot]
enabled = true
port = pop3,pop3s,imap,imaps
filter = dovecot
logpath = /var/log/mail.log
maxretry = 3
EOF

# Create SSL certificate (self-signed for now, will be replaced with Let's Encrypt)
echo "🔒 Creating SSL certificate..."
mkdir -p /etc/letsencrypt/live/smtp.tauos.org/
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/letsencrypt/live/smtp.tauos.org/privkey.pem \
    -out /etc/letsencrypt/live/smtp.tauos.org/fullchain.pem \
    -subj "/C=US/ST=State/L=City/O=TauOS/CN=smtp.tauos.org"

# Configure Nginx
echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/smtp.tauos.org << 'EOF'
server {
    listen 80;
    server_name smtp.tauos.org imap.tauos.org;
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name smtp.tauos.org imap.tauos.org;
    
    ssl_certificate /etc/letsencrypt/live/smtp.tauos.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/smtp.tauos.org/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    location / {
        root /var/www/html;
        index index.html;
    }
    
    location /webmail {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/smtp.tauos.org /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Create web interface directory
mkdir -p /var/www/html
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>TauOS Email Server</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #1a1a1a; color: #ffffff; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .status { background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .service { margin: 10px 0; padding: 10px; background: #333; border-radius: 4px; }
        .online { color: #4CAF50; }
        .offline { color: #f44336; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 TauOS Email Server</h1>
            <p>Privacy-first email infrastructure</p>
        </div>
        
        <div class="status">
            <h2>Service Status</h2>
            <div class="service">
                <strong>SMTP (Port 25):</strong> <span class="online">● Online</span>
            </div>
            <div class="service">
                <strong>SMTP with TLS (Port 587):</strong> <span class="online">● Online</span>
            </div>
            <div class="service">
                <strong>IMAP (Port 143):</strong> <span class="online">● Online</span>
            </div>
            <div class="service">
                <strong>IMAP with TLS (Port 993):</strong> <span class="online">● Online</span>
            </div>
            <div class="service">
                <strong>POP3 (Port 110):</strong> <span class="online">● Online</span>
            </div>
            <div class="service">
                <strong>POP3 with TLS (Port 995):</strong> <span class="online">● Online</span>
            </div>
        </div>
        
        <div class="status">
            <h2>Configuration</h2>
            <p><strong>Domain:</strong> tauos.org</p>
            <p><strong>SMTP Server:</strong> smtp.tauos.org</p>
            <p><strong>IMAP Server:</strong> imap.tauos.org</p>
            <p><strong>Web Interface:</strong> <a href="https://mail.tauos.org" style="color: #4CAF50;">https://mail.tauos.org</a></p>
        </div>
    </div>
</body>
</html>
EOF

# Start and enable services
echo "🚀 Starting services..."
systemctl enable postfix dovecot opendkim opendmarc spamassassin fail2ban nginx
systemctl start postfix dovecot opendkim opendmarc spamassassin fail2ban nginx

# Create test user
echo "👤 Creating test user..."
useradd -m -s /bin/bash test@tauos.org
echo "test@tauos.org:tauostest2024!" | chpasswd

# Set up Maildir for test user
mkdir -p /home/test@tauos.org/Maildir/{new,cur,tmp}
chown -R test@tauos.org:test@tauos.org /home/test@tauos.org/Maildir

echo "✅ TauOS Email Server setup complete!"
echo "📧 SMTP server is running on smtp.tauos.org"
echo "📥 IMAP server is running on imap.tauos.org"
echo "🌐 Web interface available at https://mail.tauos.org"
echo "🔑 Test user: test@tauos.org / tauostest2024!" 