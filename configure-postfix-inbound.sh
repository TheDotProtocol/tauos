#!/bin/bash

# Configure Postfix for TauOS Mail Inbound Processing
# Run this on your Vultr server (136.244.83.147)

echo "🔧 Configuring Postfix for TauOS Mail Inbound Processing..."

# Update system
sudo apt update

# Install required packages
sudo apt install -y postfix dovecot-core dovecot-imapd dovecot-pop3d

# Configure Postfix main.cf
sudo tee /etc/postfix/main.cf > /dev/null <<EOF
# Basic configuration
myhostname = mail.tauos.org
mydomain = tauos.org
myorigin = \$mydomain
mydestination = localhost, mail.tauos.org, tauos.org
mynetworks = 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
inet_interfaces = all
inet_protocols = all

# Mailbox configuration
home_mailbox = Maildir/
mailbox_command = 

# Virtual domains
virtual_alias_domains = tauos.org
virtual_alias_maps = hash:/etc/postfix/virtual

# SMTP authentication
smtpd_sasl_auth_enable = yes
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_security_options = noanonymous
smtpd_sasl_local_domain = tauos.org

# TLS configuration
smtpd_tls_security_level = may
smtpd_tls_cert_file = /etc/ssl/certs/ssl-cert-snakeoil.pem
smtpd_tls_key_file = /etc/ssl/private/ssl-cert-snakeoil.key
smtpd_tls_session_cache_database = btree:\${data_directory}/smtpd_scache

# Inbound processing
smtpd_recipient_restrictions = 
    permit_mynetworks,
    permit_sasl_authenticated,
    reject_unauth_destination

# Custom processing for TauOS
smtpd_data_restrictions = 
    check_policy_service inet:127.0.0.1:10023

# Logging
maillog_file = /var/log/mail.log
EOF

# Create virtual aliases
sudo tee /etc/postfix/virtual > /dev/null <<EOF
# TauOS Mail Virtual Aliases
saleena@tauos.org    saleena
rudra@tauos.org      rudra
admin@tauos.org      admin
support@tauos.org    support
hello@tauos.org      hello
info@tauos.org       info
business@tauos.org   business
EOF

# Update virtual database
sudo postmap /etc/postfix/virtual

# Configure Dovecot
sudo tee /etc/dovecot/dovecot.conf > /dev/null <<EOF
protocols = imap pop3 lmtp
listen = *, ::

mail_location = maildir:~/Maildir

passdb {
  driver = passwd-file
  args = /etc/dovecot/passwd
}

userdb {
  driver = passwd-file
  args = /etc/dovecot/passwd
}

service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0666
    user = postfix
    group = postfix
  }
}

service lmtp {
  unix_listener /var/spool/postfix/private/dovecot-lmtp {
    mode = 0666
    user = postfix
    group = postfix
  }
}
EOF

# Create Dovecot passwd file
sudo tee /etc/dovecot/passwd > /dev/null <<EOF
saleena:{PLAIN}Saleena@132
rudra:{PLAIN}Rudra@132
admin:{PLAIN}Ak1233@@5
support:{PLAIN}Ak1233@@5
hello:{PLAIN}Ak1233@@5
info:{PLAIN}Ak1233@@5
business:{PLAIN}Ak1233@@5
EOF

# Create users
sudo useradd -m -s /bin/bash saleena
sudo useradd -m -s /bin/bash rudra
sudo useradd -m -s /bin/bash admin
sudo useradd -m -s /bin/bash support
sudo useradd -m -s /bin/bash hello
sudo useradd -m -s /bin/bash info
sudo useradd -m -s /bin/bash business

# Set passwords
echo "saleena:Saleena@132" | sudo chpasswd
echo "rudra:Rudra@132" | sudo chpasswd
echo "admin:Ak1233@@5" | sudo chpasswd
echo "support:Ak1233@@5" | sudo chpasswd
echo "hello:Ak1233@@5" | sudo chpasswd
echo "info:Ak1233@@5" | sudo chpasswd
echo "business:Ak1233@@5" | sudo chpasswd

# Create Maildirs
sudo -u saleena maildirmake.dovecot /home/saleena/Maildir
sudo -u rudra maildirmake.dovecot /home/rudra/Maildir
sudo -u admin maildirmake.dovecot /home/admin/Maildir
sudo -u support maildirmake.dovecot /home/support/Maildir
sudo -u hello maildirmake.dovecot /home/hello/Maildir
sudo -u info maildirmake.dovecot /home/info/Maildir
sudo -u business maildirmake.dovecot /home/business/Maildir

# Restart services
sudo systemctl restart postfix
sudo systemctl restart dovecot
sudo systemctl enable postfix
sudo systemctl enable dovecot

echo "✅ Postfix and Dovecot configured successfully!"
echo "📧 TauOS Mail server ready for inbound emails"
echo "🌐 Server: mail.tauos.org (136.244.83.147)"
echo "📬 Ports: 25 (SMTP), 587 (SMTP-TLS), 993 (IMAPS), 995 (POP3S)"
