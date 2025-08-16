# Deploy TauOS SMTP Server on Google Cloud

## 🎯 Mission: Deploy Our Own SMTP Infrastructure

We need to deploy a real SMTP server on Google Cloud and link it to `mailserver.tauos.org`.

## 🚀 Step-by-Step Deployment

### Step 1: Access Your Google Cloud Instance

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com
   - Navigate to Compute Engine → VM instances

2. **Connect to Your Instance**
   - Click on your existing instance
   - Use SSH or connect via terminal

### Step 2: Install and Configure Postfix

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Postfix and related packages
sudo apt install postfix mailutils dovecot-core dovecot-imapd dovecot-pop3d -y

# During Postfix installation, choose "Internet Site"
# Set system mail name to: tauos.org
```

### Step 3: Configure Postfix

```bash
# Edit Postfix main configuration
sudo nano /etc/postfix/main.cf
```

**Add/update these settings:**
```
# Basic Settings
myhostname = mailserver.tauos.org
mydomain = tauos.org
myorigin = $mydomain

# Network Settings
inet_interfaces = all
inet_protocols = ipv4

# Mail Delivery
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain
mynetworks = 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
relay_domains = $mydomain

# Authentication
smtpd_sasl_auth_enable = yes
smtpd_sasl_security_options = noanonymous
smtpd_sasl_local_domain = $myhostname

# TLS Settings
smtpd_tls_cert_file = /etc/ssl/certs/ssl-cert-snakeoil.pem
smtpd_tls_key_file = /etc/ssl/private/ssl-cert-snakeoil.key
smtpd_use_tls = yes
smtpd_tls_session_cache_database = btree:${data_directory}/smtpd_scache
smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache

# SMTP Authentication
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
```

### Step 4: Configure Dovecot

```bash
# Edit Dovecot configuration
sudo nano /etc/dovecot/conf.d/10-master.conf
```

**Update the service section:**
```
service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0666
    user = postfix
    group = postfix
  }
}
```

### Step 5: Create SMTP User

```bash
# Create user for SMTP authentication
sudo useradd -r -s /bin/false noreply
sudo passwd noreply

# Add to postfix group
sudo usermod -a -G postfix noreply
```

### Step 6: Configure Firewall

```bash
# Allow SMTP ports
sudo ufw allow 25/tcp   # SMTP
sudo ufw allow 587/tcp  # SMTP submission
sudo ufw allow 465/tcp  # SMTPS
sudo ufw allow 993/tcp  # IMAPS
sudo ufw allow 995/tcp  # POP3S

# Enable firewall
sudo ufw enable
```

### Step 7: Restart Services

```bash
# Restart all services
sudo systemctl restart postfix
sudo systemctl restart dovecot
sudo systemctl enable postfix
sudo systemctl enable dovecot
```

### Step 8: Test SMTP Server

```bash
# Test SMTP connection
telnet localhost 587

# Test authentication
openssl s_client -connect localhost:587 -starttls smtp
```

## 🌐 DNS Configuration

### Update DNS Records for mailserver.tauos.org:

1. **A Record:**
   ```
   mailserver.tauos.org.    A    YOUR_GOOGLE_CLOUD_IP
   ```

2. **MX Record:**
   ```
   tauos.org.    MX  10 mailserver.tauos.org.
   ```

3. **SPF Record:**
   ```
   tauos.org.    TXT  "v=spf1 mx a ip4:YOUR_GOOGLE_CLOUD_IP ~all"
   ```

## 🔧 Update Vercel Environment Variables

After deployment, update your Vercel environment variables:

```
SMTP_HOST=mailserver.tauos.org
SMTP_PORT=587
SMTP_USER=noreply@tauos.org
SMTP_PASS=your_noreply_user_password
```

## 🧪 Test the Setup

1. **Test SMTP Connection:**
   ```bash
   cd vercel-tauos-mail
   node test-tauos-smtp.js
   ```

2. **Send Test Email from TauMail:**
   - Go to https://mail.tauos.org/dashboard
   - Send email to external address
   - Check if it arrives

## 🔍 Troubleshooting

### Common Issues:
1. **Port 25 blocked**: Use port 587 for submission
2. **Authentication failed**: Check user credentials
3. **DNS not resolving**: Verify A record for mailserver.tauos.org
4. **Firewall blocking**: Check UFW rules

### Check Logs:
```bash
# Postfix logs
sudo tail -f /var/log/mail.log

# Dovecot logs
sudo tail -f /var/log/dovecot.log
```

## 🎯 Expected Result

After deployment:
- ✅ **mailserver.tauos.org** points to your Google Cloud instance
- ✅ **SMTP server** accepts connections on port 587
- ✅ **Authentication** works with noreply@tauos.org
- ✅ **Real email delivery** to any email address
- ✅ **Sovereign email infrastructure** under your control

**Let's deploy this and get real email delivery working!** 🚀 