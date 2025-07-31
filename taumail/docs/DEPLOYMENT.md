# TauMail Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying TauMail, a self-hosted email service for TauOS and AR Holdings domains.

## Prerequisites

### System Requirements
- **OS**: Ubuntu 22.04 LTS or later
- **CPU**: 2+ cores (4+ recommended)
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 50GB minimum (100GB recommended)
- **Network**: Static IP address with ports 25, 80, 443, 143, 993 open

### Software Requirements
- Docker 20.10+
- Docker Compose 2.0+
- Git
- OpenSSL

### Domain Requirements
- Domain names with DNS access
- Valid SSL certificates (Let's Encrypt recommended)
- Proper DNS records (MX, A, TXT)

## Quick Deployment

### 1. Clone Repository
```bash
git clone https://github.com/tauos/taumail.git
cd taumail
```

### 2. Configure Environment
```bash
# Copy example configuration
cp config/domains.example.yml config/domains.yml

# Edit domain configuration
nano config/domains.yml
```

### 3. Deploy with Script
```bash
# Make deployment script executable
chmod +x scripts/deploy.sh

# Deploy to production
./scripts/deploy.sh production

# Or deploy to development
./scripts/deploy.sh development
```

## Manual Deployment

### 1. Environment Setup

Create `.env` file:
```bash
cat > .env << EOF
# TauMail Environment Configuration
ENVIRONMENT=production
DOMAIN=mail.tauos.org
ADMIN_EMAIL=admin@tauos.org

# Database
DB_PASSWORD=$(openssl rand -base64 32)
DATABASE_URL=postgresql://taumail:${DB_PASSWORD}@postgres:5432/taumail

# Redis
REDIS_PASSWORD=$(openssl rand -base64 32)

# API Secrets
API_SECRET=$(openssl rand -base64 64)
ADMIN_SECRET=$(openssl rand -base64 64)

# SSL Configuration
SSL_EMAIL=admin@tauos.org
SSL_STAGING=false
EOF
```

### 2. SSL Certificate Setup

#### Production (Let's Encrypt)
```bash
# Generate certificates
docker-compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email admin@tauos.org \
  --agree-tos \
  --no-eff-email \
  -d mail.tauos.org \
  -d api.tauos.org
```

#### Development (Self-signed)
```bash
# Generate self-signed certificates
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout server/ssl/tauos.org.key \
  -out server/ssl/tauos.org.crt \
  -subj "/C=US/ST=State/L=City/O=TauOS/CN=mail.tauos.org"
```

### 3. DNS Configuration

Add the following DNS records:

#### MX Records
```
mail.tauos.org -> mail.tauos.org (priority 10)
```

#### A Records
```
mail.tauos.org -> YOUR_SERVER_IP
api.tauos.org -> YOUR_SERVER_IP
```

#### TXT Records (SPF)
```
mail.tauos.org -> "v=spf1 mx a ip4:YOUR_SERVER_IP ~all"
```

#### TXT Records (DMARC)
```
_dmarc.mail.tauos.org -> "v=DMARC1; p=quarantine; rua=mailto:dmarc@mail.tauos.org; ruf=mailto:dmarc@mail.tauos.org"
```

### 4. Deploy Services

```bash
# Build and start services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 5. Verify Deployment

```bash
# Check service health
./scripts/health-check.sh

# Test email functionality
./scripts/test-email.sh

# Verify SSL certificates
./scripts/ssl-check.sh
```

## Configuration

### Domain Configuration

Edit `config/domains.yml`:
```yaml
domains:
  tauos.org:
    enabled: true
    primary: true
    mx_records:
      - priority: 10
        host: mail.tauos.org
    spf_record: "v=spf1 mx a ip4:YOUR_SERVER_IP ~all"
    dkim_selector: "taumail"
    dmarc_policy: "v=DMARC1; p=quarantine; rua=mailto:dmarc@tauos.org"
    ssl_certificate: "/etc/ssl/nginx/tauos.org.crt"
    ssl_key: "/etc/ssl/nginx/tauos.org.key"
    quota: "10GB"
    max_attachment_size: "50MB"
```

### Postfix Configuration

Edit `server/postfix/main.cf`:
```bash
# Basic Settings
myhostname = mail.tauos.org
mydomain = tauos.org
myorigin = $mydomain

# TLS Configuration
smtpd_tls_cert_file = /etc/ssl/postfix/tauos.org.crt
smtpd_tls_key_file = /etc/ssl/postfix/tauos.org.key
smtpd_tls_security_level = may
smtpd_tls_auth_only = yes

# Virtual Domains
virtual_mailbox_domains = tauos.org, arholdings.group, thedotprotocol.com
virtual_mailbox_base = /var/mail
virtual_mailbox_maps = hash:/etc/postfix/virtual_mailbox_maps
```

### Dovecot Configuration

Edit `server/dovecot/dovecot.conf`:
```bash
# Protocols
protocols = imap pop3 lmtp

# SSL Configuration
ssl = yes
ssl_cert = </etc/ssl/dovecot/tauos.org.crt
ssl_key = </etc/ssl/dovecot/tauos.org.key

# Mail location
mail_location = maildir:/var/mail/%d/%n
```

## Monitoring and Maintenance

### Health Checks

```bash
# Check all services
./scripts/health-check.sh

# Monitor email queue
./scripts/queue-monitor.sh

# Check SSL certificates
./scripts/ssl-check.sh

# Monitor system resources
./scripts/system-monitor.sh
```

### Backup and Recovery

```bash
# Create backup
./scripts/backup.sh

# Restore from backup
./scripts/restore.sh backup-2024-01-01.tar.gz

# Automated backups (cron)
0 2 * * * /path/to/taumail/scripts/backup.sh
```

### Log Management

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f postfix
docker-compose logs -f dovecot
docker-compose logs -f webmail

# Rotate logs
./scripts/log-rotate.sh
```

### SSL Certificate Renewal

```bash
# Manual renewal
docker-compose run --rm certbot renew

# Automated renewal (cron)
0 12 * * * docker-compose run --rm certbot renew --quiet
```

## Troubleshooting

### Common Issues

#### 1. SSL Certificate Issues
```bash
# Check certificate validity
openssl x509 -in server/ssl/tauos.org.crt -text -noout

# Regenerate certificates
./scripts/ssl-setup.sh
```

#### 2. Email Delivery Issues
```bash
# Check Postfix logs
docker-compose logs postfix

# Test SMTP connection
telnet mail.tauos.org 25

# Check DNS records
dig MX mail.tauos.org
dig TXT mail.tauos.org
```

#### 3. IMAP Connection Issues
```bash
# Check Dovecot logs
docker-compose logs dovecot

# Test IMAP connection
telnet mail.tauos.org 143
```

#### 4. Webmail Access Issues
```bash
# Check webmail logs
docker-compose logs webmail

# Test webmail access
curl -I https://mail.tauos.org
```

### Performance Optimization

#### 1. Database Optimization
```sql
-- Optimize database
VACUUM ANALYZE;
REINDEX DATABASE taumail;
```

#### 2. Email Queue Management
```bash
# Check queue status
docker-compose exec postfix postqueue -p

# Flush queue
docker-compose exec postfix postqueue -f
```

#### 3. Memory Optimization
```bash
# Monitor memory usage
docker stats

# Restart services if needed
docker-compose restart
```

## Security Hardening

### 1. Firewall Configuration
```bash
# Allow only necessary ports
ufw allow 25/tcp   # SMTP
ufw allow 80/tcp   # HTTP (for SSL)
ufw allow 443/tcp  # HTTPS
ufw allow 143/tcp  # IMAP
ufw allow 993/tcp  # IMAPS
ufw allow 587/tcp  # SMTP submission
```

### 2. SSL/TLS Hardening
```bash
# Update SSL configuration
smtpd_tls_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
smtpd_tls_ciphers = high
smtpd_tls_exclude_ciphers = aNULL, DES, 3DES, MD5, DES+MD5, RC4
```

### 3. Anti-Spam Configuration
```bash
# Configure Rspamd
docker-compose exec rspamd rspamadm configdump

# Update spam thresholds
docker-compose exec rspamd rspamadm configwizard
```

## Scaling

### 1. Horizontal Scaling
```bash
# Scale webmail instances
docker-compose up -d --scale webmail=3

# Scale API instances
docker-compose up -d --scale api=2
```

### 2. Load Balancing
```bash
# Configure Nginx load balancer
# Edit config/nginx/load-balancer.conf
```

### 3. Database Scaling
```bash
# Set up database replication
# Configure PostgreSQL master-slave
```

## Support

### Getting Help
- **Documentation**: https://docs.taumail.org
- **Issues**: https://github.com/tauos/taumail/issues
- **Discussions**: https://github.com/tauos/taumail/discussions
- **Email**: support@taumail.org

### Logs and Debugging
```bash
# Enable debug logging
export RUST_LOG=debug
export LOG_LEVEL=debug

# Restart services with debug
docker-compose down
docker-compose up -d
```

### Performance Monitoring
```bash
# Monitor system resources
htop
iotop
nethogs

# Monitor Docker resources
docker stats

# Monitor email metrics
curl http://localhost:9090/metrics
``` 