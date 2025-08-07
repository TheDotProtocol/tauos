# 🚀 GCP SMTP Server Setup Guide

## Why Google Cloud Platform?

### ✅ **Advantages**
- **Generous Free Tier**: $300 credit for 90 days + always-free tier
- **Port 25 Available**: No restrictions on SMTP ports
- **Reliable Infrastructure**: Google's global network
- **Easy Setup**: Simple VM creation and configuration
- **Cost Effective**: Can run for months on free tier

### 📊 **Free Tier Includes**
- **Compute Engine**: 1 f1-micro instance per month (always free)
- **Network**: 1 GB egress per month (always free)
- **Storage**: 5 GB standard storage (always free)
- **Additional**: $300 credit for 90 days

## 🛠️ **Step-by-Step Setup**

### 1. **Create GCP Account**
1. Go to https://console.cloud.google.com/
2. Click "Get started for free"
3. Enter your email and create account
4. Add credit card for verification (won't charge during free period)
5. Verify your identity

### 2. **Create VM Instance**
```bash
# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

### 3. **Create VM with SMTP Support**
```bash
# Create VM instance
gcloud compute instances create tauos-smtp \
  --zone=us-central1-a \
  --machine-type=e2-micro \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud \
  --tags=smtp-server \
  --metadata=startup-script='#! /bin/bash
    # Update system
    apt-get update
    apt-get install -y postfix dovecot-core dovecot-imapd dovecot-pop3d
    
    # Configure Postfix
    echo "postfix postfix/mailname string tauos.org" | debconf-set-selections
    echo "postfix postfix/main_mailer_type string Internet Site" | debconf-set-selections
    
    # Start services
    systemctl enable postfix
    systemctl start postfix
    systemctl enable dovecot
    systemctl start dovecot'
```

### 4. **Configure Firewall Rules**
```bash
# Create firewall rules for SMTP
gcloud compute firewall-rules create allow-smtp \
  --direction=INGRESS \
  --priority=1000 \
  --network=default \
  --action=ALLOW \
  --rules=tcp:25,tcp:587,tcp:465,tcp:143,tcp:993,tcp:110,tcp:995 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=smtp-server
```

### 5. **Configure DNS Records**
Add these records to your DNS provider:
```
# A Record
smtp.tauos.org → [VM_IP_ADDRESS]

# MX Record
tauos.org → smtp.tauos.org (priority 10)

# SPF Record
tauos.org TXT → "v=spf1 mx a:smtp.tauos.org ~all"

# DKIM Record (after setup)
# Will be generated during configuration
```

## 📧 **Postfix Configuration**

### 1. **Basic Configuration**
```bash
# SSH into your VM
gcloud compute ssh tauos-smtp --zone=us-central1-a

# Edit Postfix configuration
sudo nano /etc/postfix/main.cf
```

### 2. **Main.cf Configuration**
```conf
# Basic Settings
myhostname = smtp.tauos.org
mydomain = tauos.org
myorigin = $mydomain
inet_interfaces = all
inet_protocols = ipv4

# Mail Settings
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain
mynetworks = 127.0.0.0/8, [::ffff:127.0.0.0]/104, [::1]/128
relay_domains = $mydomain

# Security Settings
smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination
smtpd_sasl_auth_enable = yes
smtpd_sasl_security_options = noanonymous
smtpd_sasl_local_domain = $myhostname

# TLS Settings
smtpd_tls_cert_file = /etc/ssl/certs/ssl-cert-snakeoil.pem
smtpd_tls_key_file = /etc/ssl/private/ssl-cert-snakeoil.key
smtpd_use_tls = yes
smtpd_tls_session_cache_database = btree:${data_directory}/smtpd_scache
smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache
```

### 3. **Dovecot Configuration**
```bash
# Edit Dovecot configuration
sudo nano /etc/dovecot/conf.d/10-mail.conf
```

```conf
# Mail location
mail_location = maildir:~/Maildir
```

## 🔐 **Security Setup**

### 1. **SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot
sudo apt-get install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d smtp.tauos.org

# Update Postfix configuration
sudo nano /etc/postfix/main.cf
```

### 2. **Update SSL Paths**
```conf
# Update TLS settings with real certificate
smtpd_tls_cert_file = /etc/letsencrypt/live/smtp.tauos.org/fullchain.pem
smtpd_tls_key_file = /etc/letsencrypt/live/smtp.tauos.org/privkey.pem
```

## 📊 **Monitoring & Maintenance**

### 1. **Check Service Status**
```bash
# Check Postfix status
sudo systemctl status postfix

# Check mail queue
sudo mailq

# Check logs
sudo tail -f /var/log/mail.log
```

### 2. **Create Monitoring Script**
```bash
#!/bin/bash
# Monitor SMTP server health
echo "=== TauOS SMTP Server Health Check ==="
echo "Date: $(date)"
echo ""

# Check Postfix status
if systemctl is-active --quiet postfix; then
    echo "✅ Postfix: Running"
else
    echo "❌ Postfix: Stopped"
fi

# Check Dovecot status
if systemctl is-active --quiet dovecot; then
    echo "✅ Dovecot: Running"
else
    echo "❌ Dovecot: Stopped"
fi

# Check disk usage
echo "💾 Disk Usage:"
df -h / | tail -1

# Check memory usage
echo "🧠 Memory Usage:"
free -h | grep Mem
```

## 💰 **Cost Estimation**

### **Free Tier Usage**
- **VM Instance**: e2-micro (always free)
- **Network**: 1 GB/month (always free)
- **Storage**: 5 GB (always free)
- **Total Cost**: $0/month for basic setup

### **Paid Tier (if needed)**
- **VM Instance**: ~$5-10/month for better performance
- **Network**: ~$0.12/GB after free tier
- **Storage**: ~$0.02/GB after free tier

## 🚀 **Next Steps**

1. **Create GCP Account**: Sign up with $300 free credit
2. **Deploy VM**: Use the provided scripts
3. **Configure DNS**: Add MX and A records
4. **Test SMTP**: Verify email sending/receiving
5. **Monitor**: Set up health checks and alerts

## ✅ **Benefits for TauOS**

- **Professional Email**: Custom domain email addresses
- **Reliable Infrastructure**: Google's global network
- **Cost Effective**: Can run for months on free tier
- **Scalable**: Easy to upgrade as needed
- **Secure**: Built-in SSL/TLS support

**Ready to set up your GCP SMTP server!** 🎉 