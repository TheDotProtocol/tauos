# Infrastructure Setup Guide
**Date**: January 2025  
**Status**: Production Infrastructure Configuration  
**Target**: Complete setup for production launch

---

## 🔧 Infrastructure Components

### 1. Redis Configuration for Session Persistence

#### Local Development Setup
```bash
# Install Redis (macOS)
brew install redis

# Start Redis
brew services start redis

# Or run manually
redis-server
```

#### Environment Variables
Add to `.env.local`:
```env
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

#### Production Setup (Vercel/Cloud)
For production, use a managed Redis service:
- **Upstash Redis** (recommended for Vercel)
- **Redis Cloud**
- **AWS ElastiCache**

Environment variables for production:
```env
REDIS_URL=rediss://your-redis-instance:6380
REDIS_HOST=your-redis-instance.redis.cache.amazonaws.com
REDIS_PORT=6380
REDIS_PASSWORD=your-secure-password
```

#### Verification
```bash
# Test Redis connection
redis-cli ping
# Should return: PONG
```

---

### 2. SSL/TLS Certificate Setup

#### Development (Local)
For local development, use self-signed certificates or HTTP (development only).

#### Production (Vercel)
Vercel automatically provides SSL certificates for all deployments.

**Manual SSL Setup** (if not using Vercel):
1. **Let's Encrypt** (Free)
   ```bash
   # Install certbot
   sudo apt-get install certbot
   
   # Generate certificate
   sudo certbot certonly --standalone -d yourdomain.com
   ```

2. **Configure Nginx/Reverse Proxy**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name yourdomain.com;
       
       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
       
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers on;
   }
   ```

#### Environment Variables
```env
# Production
HTTPS=true
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

---

### 3. Data Encryption at Rest

#### Database Encryption (PostgreSQL)

**Option 1: PostgreSQL Transparent Data Encryption (TDE)**
```sql
-- Enable encryption for specific tables
ALTER TABLE users ENCRYPT WITH (algorithm = 'AES256');
```

**Option 2: Application-Level Encryption**
- Encrypt sensitive fields before storing
- Use libraries like `crypto` in Node.js

**Option 3: Filesystem Encryption**
- Use encrypted volumes (LUKS on Linux, FileVault on macOS)
- Database files stored on encrypted filesystem

#### Environment Variables
```env
# Encryption keys (store securely, use secrets management)
ENCRYPTION_KEY=your-32-byte-encryption-key
ENCRYPTION_ALGORITHM=aes-256-gcm
```

#### Implementation Example
```typescript
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

function encrypt(text: string): { encrypted: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  };
}

function decrypt(encrypted: string, iv: string, tag: string): string {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

---

### 4. Monitoring and Alerting

#### Application Monitoring
- **Vercel Analytics** (built-in)
- **Sentry** (error tracking)
- **LogRocket** (session replay)

#### Infrastructure Monitoring
- **Uptime Robot** (uptime monitoring)
- **Datadog** (full-stack monitoring)
- **New Relic** (APM)

#### Environment Variables
```env
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
MONITORING_ENABLED=true
```

---

### 5. Backup Strategy

#### Database Backups
```bash
# PostgreSQL backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U postgres -d tauos_db > backup_$DATE.sql

# Compress
gzip backup_$DATE.sql

# Upload to S3/Cloud Storage
aws s3 cp backup_$DATE.sql.gz s3://tauos-backups/
```

#### Automated Backups
- **Daily backups** (retain 7 days)
- **Weekly backups** (retain 4 weeks)
- **Monthly backups** (retain 12 months)

#### Backup Verification
- Test restore process monthly
- Verify backup integrity
- Document recovery procedures

---

### 6. Disaster Recovery Plan

#### Recovery Time Objectives (RTO)
- **Critical Systems**: < 4 hours
- **Non-Critical Systems**: < 24 hours

#### Recovery Point Objectives (RPO)
- **Critical Data**: < 1 hour
- **Non-Critical Data**: < 24 hours

#### Recovery Procedures
1. **Identify failure** (monitoring alerts)
2. **Assess impact** (severity classification)
3. **Activate DR plan** (team notification)
4. **Restore from backup** (follow documented procedures)
5. **Verify functionality** (smoke tests)
6. **Post-incident review** (document lessons learned)

---

## 📋 Setup Checklist

### Redis Setup
- [ ] Redis installed locally
- [ ] Redis running and accessible
- [ ] Environment variables configured
- [ ] Connection tested
- [ ] Production Redis instance provisioned
- [ ] Production credentials configured
- [ ] Session persistence verified

### SSL/TLS Setup
- [ ] SSL certificates obtained
- [ ] Certificates installed
- [ ] HTTPS configured
- [ ] TLS 1.2+ enforced
- [ ] Certificate auto-renewal configured
- [ ] Mixed content warnings resolved

### Data Encryption
- [ ] Encryption keys generated
- [ ] Keys stored securely (secrets management)
- [ ] Database encryption configured
- [ ] Application-level encryption implemented
- [ ] Encryption tested
- [ ] Key rotation plan documented

### Monitoring
- [ ] Monitoring tools configured
- [ ] Alerts configured
- [ ] Dashboards created
- [ ] Log aggregation set up
- [ ] Error tracking enabled
- [ ] Performance monitoring active

### Backups
- [ ] Backup strategy documented
- [ ] Automated backups configured
- [ ] Backup storage configured
- [ ] Backup verification process
- [ ] Restore procedures tested
- [ ] Backup retention policy defined

### Disaster Recovery
- [ ] DR plan documented
- [ ] RTO/RPO defined
- [ ] Recovery procedures tested
- [ ] Team trained on procedures
- [ ] Contact information updated
- [ ] Communication plan ready

---

## 🚀 Quick Start Commands

### Local Development
```bash
# Start Redis
brew services start redis

# Verify Redis
redis-cli ping

# Start development servers
cd newebsite/frontend && PORT=3003 yarn start &
cd developerhub/frontend && npm run dev &
```

### Production Deployment
```bash
# Build for production
cd newebsite/frontend && yarn build
cd developerhub/frontend && npm run build

# Deploy to Vercel
vercel --prod

# Verify deployment
curl https://yourdomain.com
```

---

## 📝 Notes

- **Security**: Never commit secrets to version control
- **Backups**: Test restore procedures regularly
- **Monitoring**: Set up alerts for critical metrics
- **Documentation**: Keep infrastructure docs updated

---

**Status**: 🟡 Setup In Progress  
**Last Updated**: [Date]

