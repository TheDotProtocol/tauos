# TauMail Production Environment Configuration

## Environment Variables for Production

Create a `.env` file in the production server with these variables:

```bash
# Server Configuration
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secure-jwt-secret-change-this-in-production

# Database Configuration (PostgreSQL)
DATABASE_URL=postgresql://taumail_user:secure_password@db.tauos.org:5432/taumail_prod

# SMTP Configuration for TauMail Email Service
SMTP_HOST=smtp.tauos.org
SMTP_PORT=587
SMTP_USER=noreply@tauos.org
SMTP_PASSWORD=your-secure-smtp-password

# Domain Configuration
TAUOS_DOMAIN=tauos.org
MAIL_DOMAIN=tauos.org

# Security Configuration
CORS_ORIGIN=https://mail.tauos.org
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=/var/log/taumail/app.log

# Monitoring Configuration
HEALTH_CHECK_ENDPOINT=/api/health
METRICS_ENDPOINT=/api/metrics
```

## Production Setup Steps

### 1. Database Setup
```sql
-- Create production database
CREATE DATABASE taumail_prod;
CREATE USER taumail_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE taumail_prod TO taumail_user;
```

### 2. SMTP Server Setup
- Configure SMTP server at `smtp.tauos.org`
- Set up authentication for `noreply@tauos.org`
- Configure SPF, DKIM, and DMARC records

### 3. DNS Configuration
```
# A Records
mail.tauos.org -> Your server IP
smtp.tauos.org -> Your SMTP server IP

# MX Records
tauos.org -> mail.tauos.org (priority 10)

# SPF Record
tauos.org TXT "v=spf1 include:_spf.tauos.org ~all"

# DKIM Record
default._domainkey.tauos.org TXT "v=DKIM1; k=rsa; p=your-public-key"
```

### 4. SSL Certificate
- Obtain SSL certificate for `mail.tauos.org`
- Configure HTTPS with proper security headers

### 5. Email Flow
```
User (user@tauos.org) → TauMail Server → SMTP Server → Recipient (any domain)
```

All emails sent FROM `@tauos.org` addresses TO any domain (gmail.com, yahoo.com, etc.) 