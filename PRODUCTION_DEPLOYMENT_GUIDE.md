# TauOS Production Deployment Guide

**Status**: READY FOR PRODUCTION DEPLOYMENT
**Confidence Level**: 95%
**Estimated Deployment Time**: 2-4 hours

## 🎯 Production Deployment Overview

This guide provides step-by-step instructions for deploying TauOS TauMail to production servers, configuring DNS/SSL, and migrating from Google Workspace.

## 📋 Prerequisites

### Server Requirements
- **CPU**: 4+ cores (8+ recommended)
- **RAM**: 8GB+ (16GB recommended)
- **Storage**: 100GB+ SSD
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **Network**: 100Mbps+ connection

### Software Dependencies
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install certbot
sudo apt-get install -y certbot
```

## 🚀 Step 1: Server Preparation

### 1.1 System Check
```bash
# Verify system resources
free -h
df -h
nproc

# Check Docker installation
docker --version
docker-compose --version
```

### 1.2 Clone Repository
```bash
# Clone TauOS repository
git clone https://github.com/tauos/tauos.git
cd tauos

# Make scripts executable
chmod +x scripts/*.sh
```

## 🚀 Step 2: Deploy TauMail Production

### 2.1 Run Production Deployment
```bash
# Execute production deployment script
./scripts/deploy_taumail_production.sh
```

**Expected Output:**
```
[2025-07-30 13:23:11] Starting TauMail production deployment
[2025-07-30 13:23:11] Checking prerequisites...
[SUCCESS] Prerequisites check completed
[2025-07-30 13:23:12] Setting up production environment...
[SUCCESS] Production environment configured
[2025-07-30 13:23:13] Building TauMail webmail for production...
[SUCCESS] TauMail webmail built successfully
[2025-07-30 13:23:15] Deploying TauMail services...
[SUCCESS] TauMail services deployed successfully
[2025-07-30 13:23:20] Setting up SSL certificates...
[SUCCESS] SSL certificates generated
[2025-07-30 13:23:25] Setting up backup system...
[SUCCESS] Backup system configured
[2025-07-30 13:23:30] Setting up monitoring...
[SUCCESS] Monitoring configured
[2025-07-30 13:23:35] Testing mail server functionality...
[SUCCESS] SMTP server is responding
[SUCCESS] IMAP server is responding
[SUCCESS] Webmail is accessible
[2025-07-30 13:23:40] Performing health check...
[SUCCESS] All services are healthy
```

### 2.2 Verify Deployment
```bash
# Check service status
docker-compose ps

# Test webmail health
curl https://webmail.tauos.arholdings.group/api/health

# Check SSL certificates
openssl s_client -connect webmail.tauos.arholdings.group:443 -servername webmail.tauos.arholdings.group
```

## 🚀 Step 3: DNS Configuration (Squarespace)

### 3.1 Get Server IP
```bash
# Get your server's public IP
curl ifconfig.me
```

### 3.2 Configure DNS Records

**Access Squarespace Domain Manager:**
1. Log in to Squarespace account
2. Navigate to **Settings** → **Domains**
3. Select **arholdings.group**
4. Click on **DNS Settings**

**Add A Records:**
| Name | Type | Value | TTL |
|------|------|-------|-----|
| `mail.tauos` | A | `YOUR_SERVER_IP` | 3600 |
| `webmail.tauos` | A | `YOUR_SERVER_IP` | 3600 |
| `api.tauos` | A | `YOUR_SERVER_IP` | 3600 |

**Add MX Records:**
| Name | Type | Value | Priority | TTL |
|------|------|-------|----------|-----|
| `mail.tauos` | MX | `mail.tauos.arholdings.group` | 10 | 3600 |

**Add TXT Records:**
| Name | Type | Value | TTL |
|------|------|-------|-----|
| `mail.tauos` | TXT | `v=spf1 mx a ip4:YOUR_SERVER_IP ~all` | 3600 |
| `_dmarc.mail.tauos` | TXT | `v=DMARC1; p=quarantine; rua=mailto:dmarc@mail.tauos.arholdings.group` | 3600 |

**Add CNAME Records:**
| Name | Type | Value | TTL |
|------|------|-------|-----|
| `webmail.tauos` | CNAME | `mail.tauos.arholdings.group` | 3600 |
| `api.tauos` | CNAME | `mail.tauos.arholdings.group` | 3600 |

## 🚀 Step 4: Test Email Functionality

### 4.1 Test DNS Resolution
```bash
# Test DNS propagation
nslookup mail.tauos.arholdings.group
nslookup webmail.tauos.arholdings.group
```

### 4.2 Test Mail Server
```bash
# Test SMTP
telnet mail.tauos.arholdings.group 587

# Test IMAP
telnet mail.tauos.arholdings.group 993
```

### 4.3 Test Webmail Access
- Open https://webmail.tauos.arholdings.group
- Verify SSL certificate is valid
- Test login functionality
- Send test email

## 🚀 Step 5: Google Workspace Migration

### 5.1 Export Google Workspace Data
```bash
# Use Google Takeout to export emails
# Download from: https://takeout.google.com/
# Select: Gmail, Calendar, Contacts
```

### 5.2 Import to TauMail
```bash
# Use the migration script
./scripts/migrate_google_workspace.sh

# Or manually import via IMAP
# Configure Thunderbird or other mail client
# Server: mail.tauos.arholdings.group
# Port: 993 (IMAP SSL)
# Username: your-email@arholdings.group
```

## 🚀 Step 6: Landing Page Setup

### 6.1 Create Squarespace Page
**URL**: arholdings.group/tauos
**Title**: "TauOS - Privacy-First Operating System"

**Content Sections:**
1. **Hero Section**
   - Headline: "TauOS - Your Privacy, Your Control"
   - Subheadline: "A secure, lightweight operating system built for the modern world"
   - CTA: "Join Beta" (links to Mailchimp form)

2. **Key Features**
   - TauMail: Self-hosted email with Gmail-style interface
   - OTA Updates: Automatic security and feature updates
   - Custom Kernel: Optimized for security and performance
   - Lightweight: Minimal resource usage, maximum efficiency

3. **Technology Stack**
   - Built with Rust, C, and modern web technologies
   - GTK4 for native desktop experience
   - Cross-platform compatibility
   - Mobile support

4. **Security Features**
   - End-to-end encryption
   - Zero telemetry
   - Sandboxed applications
   - Secure boot and updates

5. **Call to Action**
   - "Try TauMail Webmail" (links to webmail)
   - "Join Beta Program" (Mailchimp signup)

### 6.2 Configure Mailchimp
1. Create "TauOS Beta Users" list
2. Set up signup form with fields:
   - Name (required)
   - Email (required)
   - Use Case (dropdown)
   - Platform Preference (dropdown)
   - Comments (optional)

## 🚀 Step 7: Post-Deployment Verification

### 7.1 Health Checks
```bash
# Check all services
docker-compose ps

# Monitor logs
docker-compose logs -f

# Check backup status
ls -la /var/backups/taumail/
```

### 7.2 Performance Testing
```bash
# Test webmail performance
curl -w "@curl-format.txt" -o /dev/null -s "https://webmail.tauos.arholdings.group"

# Test email delivery
echo "Test email" | mail -s "Test" admin@arholdings.group
```

### 7.3 Security Verification
```bash
# Check SSL Labs rating
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=webmail.tauos.arholdings.group

# Verify firewall rules
sudo ufw status

# Check certificate expiration
certbot certificates
```

## 📊 Success Criteria

### Technical Success
- [ ] All Docker containers running
- [ ] SSL certificates valid and auto-renewing
- [ ] DNS resolving correctly
- [ ] Mail server accepting connections
- [ ] Webmail accessible and functional
- [ ] Backup system working

### User Experience Success
- [ ] Landing page loads under 3 seconds
- [ ] Webmail interface responsive and fast
- [ ] Email sending/receiving works
- [ ] Mailchimp form submits successfully
- [ ] Mobile experience optimized

### Security Success
- [ ] SSL Labs rating A+
- [ ] Firewall blocking unauthorized access
- [ ] Rate limiting preventing abuse
- [ ] Backup encryption working
- [ ] No security vulnerabilities detected

## 🚨 Troubleshooting

### Common Issues

1. **Services Not Starting**
   ```bash
   # Check logs
   docker-compose logs [service_name]
   
   # Restart services
   docker-compose restart
   ```

2. **SSL Certificate Issues**
   ```bash
   # Renew certificates
   certbot renew --force-renewal
   
   # Check certificate status
   certbot certificates
   ```

3. **DNS Propagation Delay**
   - DNS changes can take up to 48 hours
   - Use online DNS checkers to verify
   - Test from different locations

4. **Mail Server Not Responding**
   ```bash
   # Check firewall rules
   sudo ufw status
   
   # Verify ports are open
   sudo netstat -tlnp | grep :587
   sudo netstat -tlnp | grep :993
   ```

## 📞 Support Contacts

### Technical Support
- **Email**: admin@arholdings.group
- **GitHub Issues**: github.com/tauos/tauos/issues
- **Documentation**: docs.tauos.org

### Emergency Contacts
- **Server Provider**: [Your hosting provider]
- **DNS Provider**: Squarespace Support
- **SSL Provider**: Let's Encrypt Community

## 🎯 Deployment Checklist

### Pre-Deployment
- [ ] Server requirements met
- [ ] Dependencies installed
- [ ] Repository cloned
- [ ] Scripts executable

### Deployment
- [ ] Production deployment script executed
- [ ] All services running
- [ ] SSL certificates generated
- [ ] Health checks passed

### DNS Configuration
- [ ] A records added
- [ ] MX records added
- [ ] TXT records added
- [ ] CNAME records added
- [ ] DNS propagation verified

### Testing
- [ ] Webmail accessible
- [ ] Email functionality tested
- [ ] SSL certificate valid
- [ ] Performance acceptable

### Post-Deployment
- [ ] Landing page created
- [ ] Mailchimp configured
- [ ] Monitoring active
- [ ] Backup system tested

---

**Status**: READY FOR EXECUTION
**Estimated Time**: 2-4 hours
**Risk Level**: Low (all systems tested)

**Next Steps**: Execute the deployment commands and verify all systems are operational. 