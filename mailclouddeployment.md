# TauMail & TauCloud Public Deployment Guide

## Overview

This document outlines how to deploy TauMail and TauCloud as public services to replace Google Workspace, providing email and cloud storage for both personal use and public customers.

## 🎯 **Goals**

- **Replace Google Workspace**: Eliminate monthly payments and dependency
- **Public Service**: Offer TauMail/TauCloud to customers
- **Self-Hosted**: Complete control over data and infrastructure
- **Revenue Stream**: Generate income from subscription services
- **Privacy-First**: Zero telemetry, end-to-end encryption

## 🏗️ **Infrastructure Requirements**

### **Primary Server (Production)**
- **CPU**: 8+ cores (Intel/AMD)
- **RAM**: 32GB minimum
- **Storage**: 2TB NVMe SSD
- **Bandwidth**: 1Gbps minimum
- **OS**: Ubuntu 22.04 LTS
- **Location**: US/EU for compliance

### **Backup Server (Secondary)**
- **CPU**: 4+ cores
- **RAM**: 16GB minimum
- **Storage**: 1TB SSD
- **Bandwidth**: 500Mbps minimum
- **Purpose**: Backup and failover

### **CDN/Edge Locations**
- **Cloudflare**: Global CDN for static assets
- **Geographic Distribution**: US, EU, Asia-Pacific
- **SSL/TLS**: Automatic certificate management

## 📧 **TauMail Public Deployment**

### **Server Setup**

```bash
# 1. Server Preparation
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose nginx certbot

# 2. Domain Configuration
# Primary: mail.tauos.org
# Secondary: mail.arholdings.group
# Backup: mail.tauos.cloud
```

### **Docker Compose Configuration**

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Database Cluster
  postgres-primary:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: taumail
      POSTGRES_USER: taumail_admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: unless-stopped

  postgres-replica:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: taumail
      POSTGRES_USER: taumail_readonly
      POSTGRES_PASSWORD: ${DB_READONLY_PASSWORD}
    volumes:
      - postgres_replica_data:/var/lib/postgresql/data
    restart: unless-stopped

  # Redis Cluster
  redis-master:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_master_data:/data
    restart: unless-stopped

  redis-replica:
    image: redis:7-alpine
    command: redis-server --slaveof redis-master 6379 --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_replica_data:/data
    restart: unless-stopped

  # Mail Services
  postfix:
    image: catatnight/postfix:latest
    environment:
      maildomain: ${MAIL_DOMAIN}
      smtp_user: ${SMTP_USER}:${SMTP_PASSWORD}
    volumes:
      - mail_data:/var/mail
      - ./config/postfix:/etc/postfix
    ports:
      - "25:25"
      - "587:587"
    restart: unless-stopped

  dovecot:
    image: dovemark/dovecot:latest
    environment:
      DOVECOT_DOMAIN: ${MAIL_DOMAIN}
    volumes:
      - mail_data:/var/mail
      - ./config/dovecot:/etc/dovecot
    ports:
      - "143:143"
      - "993:993"
    restart: unless-stopped

  # Anti-spam
  rspamd:
    image: rspamd/rspamd:latest
    volumes:
      - ./config/rspamd:/etc/rspamd
    ports:
      - "11334:11334"
    restart: unless-stopped

  # Webmail Interface
  webmail:
    build: ./webmail
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://taumail_admin:${DB_PASSWORD}@postgres-primary:5432/taumail
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis-master:6379
      JWT_SECRET: ${JWT_SECRET}
      MAIL_DOMAIN: ${MAIL_DOMAIN}
    volumes:
      - ./config/webmail:/app/config
      - ./logs/webmail:/app/logs
    ports:
      - "3000:3000"
    restart: unless-stopped

  # Admin Dashboard
  admin:
    build: ./admin
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://taumail_admin:${DB_PASSWORD}@postgres-primary:5432/taumail
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis-master:6379
      JWT_SECRET: ${JWT_SECRET}
    volumes:
      - ./config/admin:/app/config
      - ./logs/admin:/app/logs
    ports:
      - "3001:3001"
    restart: unless-stopped

  # Reverse Proxy
  nginx:
    image: nginx:alpine
    volumes:
      - ./config/nginx:/etc/nginx
      - ./ssl:/etc/nginx/ssl
      - ./logs/nginx:/var/log/nginx
    ports:
      - "80:80"
      - "443:443"
    restart: unless-stopped

  # Monitoring
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./config/prometheus:/etc/prometheus
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3002:3000"
    restart: unless-stopped

volumes:
  postgres_data:
  postgres_replica_data:
  redis_master_data:
  redis_replica_data:
  mail_data:
  prometheus_data:
  grafana_data:
```

### **Public Account System**

```sql
-- Database Schema for Public Users
CREATE TABLE public_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    plan_type VARCHAR(20) DEFAULT 'free', -- free, basic, pro, enterprise
    storage_limit BIGINT DEFAULT 1073741824, -- 1GB in bytes
    email_limit INTEGER DEFAULT 1000, -- emails per month
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false
);

CREATE TABLE user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public_users(id),
    plan_type VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    status VARCHAR(20) DEFAULT 'active',
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE TABLE user_usage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public_users(id),
    storage_used BIGINT DEFAULT 0,
    emails_sent INTEGER DEFAULT 0,
    emails_received INTEGER DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE
);
```

## ☁️ **TauCloud Public Deployment**

### **Server Setup**

```bash
# 1. Storage Server Preparation
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose nginx certbot minio

# 2. Storage Configuration
# Primary: cloud.tauos.org
# Secondary: cloud.arholdings.group
# Backup: cloud.tauos.cloud
```

### **MinIO S3-Compatible Storage**

```yaml
# docker-compose.cloud.yml
version: '3.8'

services:
  # MinIO Storage
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    restart: unless-stopped

  # PostgreSQL for Metadata
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: taucloud
      POSTGRES_USER: taucloud_admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  # Redis for Caching
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # TauCloud API
  taucloud-api:
    build: ./api
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://taucloud_admin:${DB_PASSWORD}@postgres:5432/taucloud
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      MINIO_ENDPOINT: minio:9000
      MINIO_ACCESS_KEY: ${MINIO_ROOT_USER}
      MINIO_SECRET_KEY: ${MINIO_ROOT_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "3003:3003"
    restart: unless-stopped

  # TauCloud Web Interface
  taucloud-web:
    build: ./web
    environment:
      NODE_ENV: production
      API_URL: http://taucloud-api:3003
    ports:
      - "3004:3000"
    restart: unless-stopped

volumes:
  minio_data:
  postgres_data:
  redis_data:
```

### **Public Account System**

```sql
-- TauCloud User Management
CREATE TABLE cloud_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    plan_type VARCHAR(20) DEFAULT 'free', -- free, basic, pro, enterprise
    storage_limit BIGINT DEFAULT 5368709120, -- 5GB in bytes
    storage_used BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false
);

CREATE TABLE user_files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES cloud_users(id),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    is_encrypted BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🌐 **Domain Configuration**

### **Primary Domains**
```
mail.tauos.org     → TauMail Webmail
cloud.tauos.org    → TauCloud Storage
admin.tauos.org    → Admin Dashboard
api.tauos.org      → Public API
```

### **Secondary Domains**
```
mail.arholdings.group     → Backup Mail
cloud.arholdings.group    → Backup Cloud
tauos.org                 → Main Website
```

### **DNS Configuration**

```bash
# A Records
mail.tauos.org     → [SERVER_IP]
cloud.tauos.org    → [SERVER_IP]
admin.tauos.org    → [SERVER_IP]
api.tauos.org      → [SERVER_IP]

# CNAME Records
www.tauos.org      → tauos.org
www.mail.tauos.org → mail.tauos.org
www.cloud.tauos.org → cloud.tauos.org

# MX Records
tauos.org          → mail.tauos.org (Priority 10)
arholdings.group   → mail.arholdings.group (Priority 10)

# TXT Records (SPF, DKIM, DMARC)
tauos.org          → "v=spf1 include:_spf.tauos.org ~all"
```

## 🔐 **SSL/TLS Configuration**

### **Let's Encrypt Setup**

```bash
# 1. Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# 2. Generate Certificates
sudo certbot --nginx -d mail.tauos.org -d cloud.tauos.org -d admin.tauos.org -d api.tauos.org

# 3. Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Nginx Configuration**

```nginx
# /etc/nginx/sites-available/tauos.org
server {
    listen 80;
    server_name mail.tauos.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mail.tauos.org;

    ssl_certificate /etc/letsencrypt/live/mail.tauos.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mail.tauos.org/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 💰 **Pricing & Plans**

### **TauMail Plans**
```
Free Plan:
- 1GB storage
- 100 emails/month
- Basic spam protection
- Webmail access

Basic Plan ($5/month):
- 10GB storage
- 1000 emails/month
- Advanced spam protection
- Mobile apps
- Custom domain (1)

Pro Plan ($15/month):
- 50GB storage
- Unlimited emails
- Premium spam protection
- Multiple custom domains
- Priority support
- API access

Enterprise Plan ($50/month):
- 500GB storage
- Unlimited emails
- Advanced security
- Unlimited domains
- 24/7 support
- Custom integrations
```

### **TauCloud Plans**
```
Free Plan:
- 5GB storage
- Basic file sharing
- Web interface

Basic Plan ($8/month):
- 100GB storage
- Advanced sharing
- Mobile apps
- Version history

Pro Plan ($20/month):
- 1TB storage
- Team collaboration
- Advanced security
- API access
- Priority support

Enterprise Plan ($100/month):
- 10TB storage
- Unlimited users
- Custom integrations
- 24/7 support
- On-premise options
```

## 🔄 **Migration from Google Workspace**

### **Email Migration**

```bash
# 1. Export Google Workspace Data
gmail-oauth2-tool --client-id=YOUR_CLIENT_ID --client-secret=YOUR_CLIENT_SECRET

# 2. Import to TauMail
python3 migrate_gmail.py --source=google_export --destination=taumail_api

# 3. Update DNS Records
# Change MX records from Google to TauMail
```

### **Cloud Storage Migration**

```bash
# 1. Download Google Drive Data
rclone copy gdrive: tauos_cloud: --transfers=4 --checkers=8

# 2. Sync to TauCloud
rclone sync gdrive: tauos_cloud: --progress

# 3. Verify Migration
rclone check gdrive: tauos_cloud:
```

## 📊 **Monitoring & Analytics**

### **System Monitoring**

```yaml
# Prometheus Configuration
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'taumail'
    static_configs:
      - targets: ['localhost:3000', 'localhost:3001']

  - job_name: 'taucloud'
    static_configs:
      - targets: ['localhost:3003', 'localhost:3004']

  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:5432']

  - job_name: 'redis'
    static_configs:
      - targets: ['localhost:6379']
```

### **Business Analytics**

```sql
-- Revenue Tracking
CREATE TABLE revenue_analytics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    plan_type VARCHAR(20) NOT NULL,
    new_subscriptions INTEGER DEFAULT 0,
    cancellations INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    mrr DECIMAL(10,2) DEFAULT 0 -- Monthly Recurring Revenue
);

-- Usage Analytics
CREATE TABLE usage_analytics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    service VARCHAR(20) NOT NULL, -- taumail, taucloud
    active_users INTEGER DEFAULT 0,
    storage_used BIGINT DEFAULT 0,
    emails_sent INTEGER DEFAULT 0,
    files_uploaded INTEGER DEFAULT 0
);
```

## 🚀 **Deployment Scripts**

### **Production Deployment**

```bash
#!/bin/bash
# deploy_production.sh

echo "🐢 Deploying TauMail & TauCloud to Production..."

# 1. Update server
sudo apt update && sudo apt upgrade -y

# 2. Install dependencies
sudo apt install -y docker.io docker-compose nginx certbot

# 3. Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# 4. Deploy services
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.cloud.yml up -d

# 5. Configure SSL
sudo certbot --nginx -d mail.tauos.org -d cloud.tauos.org

# 6. Setup monitoring
docker-compose -f docker-compose.monitoring.yml up -d

echo "✅ Production deployment complete!"
```

### **Backup Script**

```bash
#!/bin/bash
# backup_services.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/$DATE"

mkdir -p $BACKUP_DIR

# Backup databases
docker exec postgres-primary pg_dump -U taumail_admin taumail > $BACKUP_DIR/taumail.sql
docker exec postgres-primary pg_dump -U taucloud_admin taucloud > $BACKUP_DIR/taucloud.sql

# Backup mail data
docker exec postfix tar -czf - /var/mail > $BACKUP_DIR/mail_data.tar.gz

# Backup cloud storage
docker exec minio mc mirror /data $BACKUP_DIR/minio_backup

# Upload to remote backup
rclone copy $BACKUP_DIR backup_server:tauos_backups/$DATE

echo "✅ Backup completed: $BACKUP_DIR"
```

## 📈 **Business Benefits**

### **Cost Savings**
- **Google Workspace**: $6/user/month × 8 users = $48/month
- **TauMail/TauCloud**: $0/month (self-hosted)
- **Annual Savings**: $576/year
- **Public Revenue**: Potential $500-2000/month from customers

### **Privacy & Control**
- **Zero Telemetry**: No data collection
- **End-to-End Encryption**: All data encrypted
- **Self-Hosted**: Complete control over infrastructure
- **GDPR Compliant**: European data protection

### **Scalability**
- **Unlimited Users**: No per-user licensing
- **Custom Features**: Tailored to specific needs
- **API Access**: Integration with existing systems
- **White Label**: Rebrand for different markets

## 🎯 **Next Steps**

1. **Purchase Domains**: tauos.org, arholdings.group
2. **Setup Servers**: Production and backup infrastructure
3. **Deploy Services**: TauMail and TauCloud
4. **Configure DNS**: Point domains to servers
5. **Setup SSL**: Let's Encrypt certificates
6. **Migrate Data**: From Google Workspace
7. **Launch Public**: Accept customer registrations
8. **Monitor & Scale**: Based on usage and revenue

---

*This deployment will eliminate Google Workspace dependency and create a new revenue stream from public TauMail/TauCloud services.* 