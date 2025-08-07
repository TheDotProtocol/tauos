# Amazon Linux 2 Email Server Setup Guide

## Current Status
✅ EC2 instance running (i-036f6d9a6262b42fe)  
✅ Postfix installed and running  
✅ Dovecot installed  
✅ Superuser account created  
✅ Hostname set to smtptauos.tauos.org  
✅ Basic Postfix configuration applied  

## Next Steps to Complete Setup

### Step 1: Install netcat for testing
```bash
sudo yum install -y nc
```

### Step 2: Test SMTP locally
```bash
echo "EHLO smtptauos.tauos.org" | nc localhost 587
```

### Step 3: Install certbot on Amazon Linux 2
```bash
# Install EPEL repository first
sudo yum install -y epel-release

# Install certbot
sudo yum install -y certbot python3-certbot-nginx

# Alternative if EPEL doesn't work:
sudo yum install -y python3-pip
sudo pip3 install certbot certbot-nginx
```

### Step 4: Configure Postfix for external connections
```bash
# Allow external connections
sudo postconf -e "inet_interfaces = all"
sudo postconf -e "smtpd_relay_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination"
sudo postconf -e "smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination"

# Configure SASL authentication
sudo postconf -e "smtpd_sasl_auth_enable = yes"
sudo postconf -e "smtpd_sasl_security_options = noanonymous"
sudo postconf -e "smtpd_sasl_local_domain = smtptauos.tauos.org"

# Restart Postfix
sudo systemctl restart postfix
```

### Step 5: Configure Dovecot
```bash
# Edit Dovecot configuration
sudo sed -i 's/#disable_plaintext_auth = yes/disable_plaintext_auth = no/' /etc/dovecot/conf.d/10-auth.conf
sudo sed -i 's/^ssl = required/ssl = yes/' /etc/dovecot/conf.d/10-ssl.conf

# Start and enable Dovecot
sudo systemctl start dovecot
sudo systemctl enable dovecot
```

### Step 6: Install SSL certificates
```bash
# Install SSL certificates for both domains
sudo certbot --nginx -d smtptauos.tauos.org -d imaptauos.tauos.org --non-interactive --agree-tos --email admin@tauos.org

# If certbot fails, try manual installation:
sudo yum install -y mod_ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/smtptauos.tauos.org.key -out /etc/ssl/certs/smtptauos.tauos.org.crt
```

### Step 7: Test email functionality
```bash
# Test SMTP connection
echo "EHLO smtptauos.tauos.org" | nc smtptauos.tauos.org 587

# Test IMAP connection
echo "a001 LOGIN superuser@tauos.org 1ac8886bf5633d3c3b49" | nc imaptauos.tauos.org 993
```

### Step 8: Send test email
```bash
# Create a test email
echo "Subject: Test from TauOS Email Server" | sendmail -f "superuser@tauos.org" "njmsweettie@gmail.com"
```

## Troubleshooting Commands

### Check service status
```bash
sudo systemctl status postfix
sudo systemctl status dovecot
sudo systemctl status nginx
```

### Check logs
```bash
sudo tail -f /var/log/maillog
sudo tail -f /var/log/dovecot.log
```

### Check port accessibility
```bash
sudo netstat -tlnp | grep :587
sudo netstat -tlnp | grep :993
```

### Test from external
```bash
# From your local machine:
nc -zv 54.156.132.149 587
nc -zv 54.156.132.149 993
```

## Expected Results
- ✅ SMTP accepts connections on port 587
- ✅ IMAP accepts connections on port 993
- ✅ SSL certificates installed
- ✅ superuser@tauos.org can send/receive emails
- ✅ Test emails delivered to external addresses

## Next Steps After Setup
1. Update DNS records in Squarespace
2. Test email sending from TauMail web app
3. Send welcome emails to test recipients
4. Configure TauCloud backend on AWS 