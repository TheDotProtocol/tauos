# TauMail Multi-Tenant Admin Dashboard

## Overview

The TauMail Multi-Tenant Admin Dashboard allows companies to self-register, manage their domains, and control their email infrastructure through a web interface.

## Features

### 🏢 **Company Self-Registration**
- **Domain Registration**: Companies can register their domains
- **DNS Validation**: Automatic DNS record validation
- **SSL Certificate**: Automatic Let's Encrypt certificate generation
- **Email Verification**: Domain ownership verification

### 👥 **User Management**
- **User Creation**: Create email accounts for company employees
- **Role Management**: Admin, user, and read-only roles
- **Quota Management**: Per-user storage quotas
- **Password Policies**: Enforce strong password requirements

### 📧 **Email Configuration**
- **MX Records**: Automatic MX record setup guidance
- **SPF/DKIM/DMARC**: Email authentication configuration
- **Anti-Spam Settings**: Customizable spam filtering
- **Backup Configuration**: Email backup and retention policies

### 📊 **Analytics & Monitoring**
- **Email Statistics**: Volume, delivery rates, spam detection
- **System Health**: Server performance and uptime
- **Security Alerts**: Suspicious activity notifications
- **Compliance Reports**: GDPR and privacy compliance

## API Endpoints

### Company Management
```bash
# Register new company
POST /api/admin/companies
{
  "company_name": "AR Holdings",
  "domain": "arholdings.group",
  "admin_email": "admin@arholdings.group",
  "contact_info": {
    "name": "John Doe",
    "phone": "+1-555-0123",
    "address": "123 Business St"
  }
}

# Get company info
GET /api/admin/companies/{company_id}

# Update company settings
PUT /api/admin/companies/{company_id}

# Delete company
DELETE /api/admin/companies/{company_id}
```

### Domain Management
```bash
# Add domain to company
POST /api/admin/companies/{company_id}/domains
{
  "domain": "newdomain.com",
  "mx_records": ["mail.tauos.org"],
  "quota": "10GB",
  "max_attachment_size": "50MB"
}

# Update domain settings
PUT /api/admin/companies/{company_id}/domains/{domain}

# Remove domain
DELETE /api/admin/companies/{company_id}/domains/{domain}
```

### User Management
```bash
# Create user
POST /api/admin/companies/{company_id}/users
{
  "email": "user@arholdings.group",
  "password": "secure_password",
  "role": "user",
  "quota": "5GB"
}

# Update user
PUT /api/admin/companies/{company_id}/users/{user_id}

# Delete user
DELETE /api/admin/companies/{company_id}/users/{user_id}
```

## Database Schema

### Companies Table
```sql
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE NOT NULL,
  admin_email VARCHAR(255) NOT NULL,
  contact_info JSONB,
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  quota BIGINT DEFAULT 5368709120, -- 5GB
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Domains Table
```sql
CREATE TABLE domains (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  domain VARCHAR(255) UNIQUE NOT NULL,
  mx_records TEXT[],
  spf_record TEXT,
  dkim_selector VARCHAR(50),
  dmarc_policy TEXT,
  ssl_certificate TEXT,
  ssl_key TEXT,
  quota BIGINT DEFAULT 5368709120,
  max_attachment_size BIGINT DEFAULT 26214400,
  spam_threshold DECIMAL DEFAULT 5.0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Implementation

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- Docker & Docker Compose

### Quick Start

1. **Setup Admin Dashboard**:
```bash
cd tauos/taumail/admin/dashboard
npm install
```

2. **Configure Database**:
```bash
npm run db:migrate
npm run db:seed
```

3. **Start Admin Dashboard**:
```bash
npm run dev
```

4. **Access Admin Interface**:
- Admin Dashboard: https://mail.tauos.org/admin
- API Documentation: https://mail.tauos.org/admin/api

## Security Features

### Authentication
- **JWT Tokens**: Secure authentication
- **Role-Based Access**: Company-specific permissions
- **API Rate Limiting**: Prevent abuse
- **Audit Logging**: Complete action tracking

### Data Protection
- **Encryption**: All data encrypted at rest
- **Isolation**: Company data isolation
- **Backup**: Automated backups
- **Compliance**: GDPR and privacy compliance

## Deployment

### Production Deployment
```bash
# Deploy admin dashboard
cd tauos/taumail/admin/dashboard
npm run build
docker-compose up -d
```

### Environment Variables
```bash
ADMIN_DOMAIN=mail.tauos.org
ADMIN_SECRET=admin_secret_2025
DATABASE_URL=postgresql://admin:admin@postgres:5432/taumail_admin
REDIS_URL=redis://admin:admin@redis:6379
JWT_SECRET=admin_jwt_secret_2025
```

## Monitoring

### Health Checks
- **Service Health**: `/admin/health`
- **Database Status**: `/admin/db/status`
- **SSL Certificate**: `/admin/ssl/status`
- **Email Queue**: `/admin/queue/status`

### Metrics
- **Company Registration**: Number of new companies
- **User Growth**: Active users per company
- **Email Volume**: Messages per company
- **System Performance**: Response times and uptime

## Support

### Documentation
- **Admin Guide**: https://docs.taumail.org/admin
- **API Reference**: https://docs.taumail.org/admin/api
- **Troubleshooting**: https://docs.taumail.org/admin/troubleshooting

### Support Channels
- **Email**: admin@taumail.org
- **Discord**: #taumail-admin
- **GitHub Issues**: https://github.com/tauos/taumail/issues

## License

MIT License - See LICENSE file for details. 