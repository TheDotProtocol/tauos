# Email Server Troubleshooting Steps

## Issues Found:
1. ✅ Netcat installed successfully
2. ❌ SMTP connection refused on port 587
3. ❌ SSL certificate directory missing
4. ❌ Certbot not in PATH
5. ❌ IMAP connection reset

## Step-by-Step Fixes:

### 1. Fix Certbot PATH Issue
```bash
# Add /usr/local/bin to PATH
export PATH=$PATH:/usr/local/bin

# Test certbot
/usr/local/bin/certbot --version
```

### 2. Create SSL Certificate Directory
```bash
# Create SSL directories
sudo mkdir -p /etc/ssl/private
sudo mkdir -p /etc/ssl/certs

# Set proper permissions
sudo chmod 700 /etc/ssl/private
sudo chmod 755 /etc/ssl/certs
```

### 3. Generate Self-Signed SSL Certificate
```bash
# Generate SSL certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/smtptauos.tauos.org.key \
  -out /etc/ssl/certs/smtptauos.tauos.org.crt \
  -subj "/C=US/ST=State/L=City/O=TauOS/OU=IT/CN=smtptauos.tauos.org"
```

### 4. Configure Postfix for SSL
```bash
# Configure Postfix SSL settings
sudo postconf -e "smtpd_tls_cert_file = /etc/ssl/certs/smtptauos.tauos.org.crt"
sudo postconf -e "smtpd_tls_key_file = /etc/ssl/private/smtptauos.tauos.org.key"
sudo postconf -e "smtpd_tls_security_level = may"
sudo postconf -e "smtpd_tls_auth_only = no"
sudo postconf -e 'smtpd_tls_protocols = !SSLv2, !SSLv3'

# Restart Postfix
sudo systemctl restart postfix
```

### 5. Configure Dovecot SSL
```bash
# Configure Dovecot SSL
sudo sed -i 's|^ssl_cert =.*|ssl_cert = </etc/ssl/certs/smtptauos.tauos.org.crt|' /etc/dovecot/conf.d/10-ssl.conf
sudo sed -i 's|^ssl_key =.*|ssl_key = </etc/ssl/private/smtptauos.tauos.org.key|' /etc/dovecot/conf.d/10-ssl.conf

# Restart Dovecot
sudo systemctl restart dovecot
```

### 6. Check Postfix Configuration
```bash
# Check if Postfix is listening on port 587
sudo netstat -tlnp | grep :587

# Check Postfix configuration
sudo postconf -n | grep -E "(inet_interfaces|smtpd_tls|smtpd_sasl)"

# Check Postfix logs
sudo tail -f /var/log/maillog
```

### 7. Test SMTP Connection
```bash
# Test local SMTP
echo "EHLO smtptauos.tauos.org" | nc localhost 587

# Test external SMTP
echo "EHLO smtptauos.tauos.org" | nc smtptauos.tauos.org 587
```

### 8. Test IMAP Connection
```bash
# Test local IMAP
echo "a001 LOGIN superuser@tauos.org 1ac8886bf5633d3c3b49" | nc localhost 993

# Test external IMAP
echo "a001 LOGIN superuser@tauos.org 1ac8886bf5633d3c3b49" | nc imaptauos.tauos.org 993
```

### 9. Check Service Status
```bash
# Check all services
sudo systemctl status postfix
sudo systemctl status dovecot
sudo systemctl status httpd
```

### 10. Send Test Email
```bash
# Create a test email
echo "Subject: Test from TauOS Email Server
From: superuser@tauos.org
To: njmsweettie@gmail.com

This is a test email from the TauOS email server.
Server: smtptauos.tauos.org
Date: $(date)

TauOS Email Server is now live!" | sendmail -f "superuser@tauos.org" "njmsweettie@gmail.com"
```

## **TROUBLESHOOTING POSTFIX PORT 587 ISSUE:**

### Check Postfix Master Configuration
```bash
# Check if Postfix master is configured for port 587
sudo grep -n "587" /etc/postfix/master.cf

# If not found, add the submission service
sudo echo "submission inet n       -       n       -       -       smtpd" >> /etc/postfix/master.cf
sudo echo "  -o syslog_name=postfix/submission" >> /etc/postfix/master.cf
sudo echo "  -o smtpd_tls_security_level=encrypt" >> /etc/postfix/master.cf
sudo echo "  -o smtpd_sasl_auth_enable=yes" >> /etc/postfix/master.cf
sudo echo "  -o smtpd_reject_unlisted_recipient=no" >> /etc/postfix/master.cf
sudo echo "  -o smtpd_client_restrictions=permit_sasl_authenticated,reject" >> /etc/postfix/master.cf
sudo echo "  -o smtpd_helo_restrictions=permit_sasl_authenticated,reject" >> /etc/postfix/master.cf
sudo echo "  -o smtpd_sender_restrictions=permit_sasl_authenticated,reject" >> /etc/postfix/master.cf
sudo echo "  -o smtpd_recipient_restrictions=reject" >> /etc/postfix/master.cf
sudo echo "  -o milter_macro_daemon_name=ORIGINATING" >> /etc/postfix/master.cf
```

### Restart Postfix After Configuration
```bash
# Restart Postfix to apply master.cf changes
sudo systemctl restart postfix

# Check if port 587 is now listening
sudo netstat -tlnp | grep :587
```

## **TROUBLESHOOTING DOVECOT SSL ISSUE:**

### Check Dovecot SSL Configuration
```bash
# Check Dovecot SSL configuration
sudo grep -n "ssl" /etc/dovecot/conf.d/10-ssl.conf

# Test Dovecot SSL certificate
sudo openssl x509 -in /etc/ssl/certs/smtptauos.tauos.org.crt -text -noout

# Check Dovecot logs
sudo tail -f /var/log/dovecot.log
```

### Test IMAP with SSL
```bash
# Test IMAP with explicit SSL
openssl s_client -connect localhost:993 -crlf

# Then type IMAP commands:
# a001 LOGIN superuser@tauos.org 1ac8886bf5633d3c3b49
# a002 LIST "" "*"
# a003 LOGOUT
```

## Expected Results:
- ✅ SMTP accepts connections on port 587
- ✅ IMAP accepts connections on port 993
- ✅ SSL certificates installed and working
- ✅ Test emails sent successfully
- ✅ Welcome emails received by test recipients

## Troubleshooting Commands:
```bash
# Check if ports are open
sudo netstat -tlnp | grep -E ":(587|993)"

# Check service logs
sudo journalctl -u postfix -f
sudo journalctl -u dovecot -f

# Test from external
nc -zv 54.156.132.149 587
nc -zv 54.156.132.149 993
``` 