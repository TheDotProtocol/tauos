# TauOS Production Deployment Checklist

## 🚀 Immediate Deployment Steps

### Step 1: Server Preparation
- [ ] **Verify Server Requirements**
  ```bash
  # Check system resources
  free -h
  df -h
  nproc
  ```
  - CPU: 4+ cores
  - RAM: 8GB+
  - Storage: 100GB+ SSD
  - OS: Ubuntu 20.04+ or CentOS 8+

- [ ] **Install Dependencies**
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

### Step 2: Deploy TauMail
- [ ] **Clone Repository**
  ```bash
  git clone https://github.com/tauos/tauos.git
  cd tauos
  ```

- [ ] **Run Production Deployment**
  ```bash
  chmod +x scripts/deploy_taumail_production.sh
  ./scripts/deploy_taumail_production.sh
  ```

- [ ] **Verify Deployment**
  ```bash
  # Check service status
  docker-compose ps
  
  # Test webmail health
  curl https://webmail.tauos.arholdings.group/api/health
  
  # Check SSL certificates
  openssl s_client -connect webmail.tauos.arholdings.group:443 -servername webmail.tauos.arholdings.group
  ```

### Step 3: Configure DNS (Squarespace)
- [ ] **Get Server IP**
  ```bash
  curl ifconfig.me
  ```

- [ ] **Add DNS Records in Squarespace**
  - Navigate to Settings → Domains → arholdings.group → DNS Settings
  - Add A records for:
    - `mail.tauos` → YOUR_SERVER_IP
    - `webmail.tauos` → YOUR_SERVER_IP
    - `api.tauos` → YOUR_SERVER_IP
  - Add MX record:
    - `mail.tauos` → `mail.tauos.arholdings.group` (priority 10)
  - Add TXT records:
    - SPF: `mail.tauos` → `v=spf1 mx a ip4:YOUR_SERVER_IP ~all`
    - DMARC: `_dmarc.mail.tauos` → `v=DMARC1; p=quarantine; rua=mailto:dmarc@mail.tauos.arholdings.group`
  - Add CNAME records:
    - `webmail.tauos` → `mail.tauos.arholdings.group`
    - `api.tauos` → `mail.tauos.arholdings.group`

### Step 4: Test Functionality
- [ ] **Test DNS Resolution**
  ```bash
  nslookup mail.tauos.arholdings.group
  nslookup webmail.tauos.arholdings.group
  ```

- [ ] **Test Mail Server**
  ```bash
  # Test SMTP
  telnet mail.tauos.arholdings.group 587
  
  # Test IMAP
  telnet mail.tauos.arholdings.group 993
  ```

- [ ] **Test Webmail Access**
  - Open https://webmail.tauos.arholdings.group
  - Verify SSL certificate is valid
  - Test login functionality
  - Send test email

### Step 5: Set Up Landing Page
- [ ] **Create Squarespace Page**
  - URL: arholdings.group/tauos
  - Title: "TauOS - Privacy-First Operating System"
  - Use template from `docs/landing_page_template.md`

- [ ] **Configure Mailchimp**
  - Create "TauOS Beta Users" list
  - Set up signup form with fields:
    - Name (required)
    - Email (required)
    - Use Case (dropdown)
    - Platform Preference (dropdown)
    - Comments (optional)

- [ ] **Test Landing Page**
  - Verify all links work
  - Test Mailchimp form submission
  - Check mobile responsiveness
  - Validate SEO elements

### Step 6: Monitor and Optimize
- [ ] **Set Up Monitoring**
  ```bash
  # Check service logs
  docker-compose logs -f
  
  # Monitor resource usage
  docker stats
  
  # Check backup status
  ls -la /var/backups/taumail/
  ```

- [ ] **Performance Testing**
  ```bash
  # Test webmail performance
  curl -w "@curl-format.txt" -o /dev/null -s "https://webmail.tauos.arholdings.group"
  
  # Test email delivery
  echo "Test email" | mail -s "Test" admin@arholdings.group
  ```

## 🔧 Troubleshooting Commands

### Service Issues
```bash
# Restart services
docker-compose restart

# Check logs
docker-compose logs [service_name]

# Rebuild services
docker-compose up -d --build
```

### SSL Issues
```bash
# Renew certificates
certbot renew

# Check certificate status
certbot certificates

# Test SSL connection
openssl s_client -connect webmail.tauos.arholdings.group:443
```

### DNS Issues
```bash
# Check DNS propagation
dig mail.tauos.arholdings.group
dig webmail.tauos.arholdings.group

# Test from different locations
nslookup mail.tauos.arholdings.group 8.8.8.8
```

### Mail Server Issues
```bash
# Check mail server status
docker exec taumail-postfix postfix status
docker exec taumail-dovecot doveadm who

# Test mail delivery
telnet mail.tauos.arholdings.group 587
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

## 🚨 Emergency Procedures

### Service Down
```bash
# Quick restart
docker-compose down && docker-compose up -d

# Check logs immediately
docker-compose logs --tail=100
```

### SSL Certificate Expired
```bash
# Force certificate renewal
certbot renew --force-renewal

# Restart nginx
docker-compose restart nginx
```

### Database Issues
```bash
# Check database status
docker exec taumail-postgres psql -U taumail -d taumail -c "SELECT version();"

# Restore from backup if needed
./scripts/restore_taumail.sh backup_file.tar.gz
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

## ✅ Final Checklist

### Pre-Launch
- [ ] All services deployed and running
- [ ] DNS configured and propagated
- [ ] SSL certificates valid
- [ ] Landing page live and functional
- [ ] Mailchimp form working
- [ ] Monitoring active
- [ ] Backup system tested

### Launch Day
- [ ] Send beta announcement email
- [ ] Monitor system performance
- [ ] Collect initial user feedback
- [ ] Address any immediate issues
- [ ] Document lessons learned

### Post-Launch
- [ ] Monitor user engagement
- [ ] Track system performance
- [ ] Collect and analyze feedback
- [ ] Plan feature updates
- [ ] Scale infrastructure as needed

---

**Status**: Ready for Execution
**Estimated Time**: 2-4 hours
**Risk Level**: Low (all systems tested) 