# TauCore™ Hybrid Database Setup

## 🚀 Complete Database Solution for TauOS Ecosystem

This directory contains the complete database setup for the TauOS ecosystem, including a hybrid architecture that integrates all applications into a unified, scalable database.

## 📁 Files Overview

### Core Database Files
- **`hybrid-schema.sql`** - Complete database schema for all TauOS applications
- **`hybrid-seed.sql`** - Sample data for testing and development
- **`connection-optimization.sql`** - Performance optimization and connection pooling
- **`smtp-configuration.sql`** - Complete email system configuration

### Setup & Testing
- **`setup-hybrid-database.sh`** - Automated setup script
- **`test-database-setup.js`** - Comprehensive test suite
- **`README.md`** - This documentation

## 🏗️ Hybrid Architecture

### Centralized Core Schema
- **Users & Authentication** - Unified user management
- **Organizations** - Enterprise multi-tenancy
- **Security** - Comprehensive security logging
- **Preferences** - User settings across all apps

### Modular App Schemas
- **TauMail** - Complete email system
- **TauCloud** - Cloud storage and file management
- **TauStore** - App store and marketplace
- **TauBrowser** - Browser bookmarks and history
- **TauAI** - AI conversations and models
- **Developer Portal** - Projects, Git, CI/CD

## 🚀 Quick Start

### 1. Prerequisites
```bash
# Install PostgreSQL (if not already installed)
brew install postgresql

# Install Node.js dependencies
npm install pg dotenv
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit your database URL
DATABASE_URL=postgresql://username:password@localhost:5432/tauos
```

### 3. Run Setup
```bash
# Make setup script executable
chmod +x setup-hybrid-database.sh

# Run complete setup
./setup-hybrid-database.sh
```

### 4. Verify Installation
```bash
# Run tests
node test-database-setup.js

# Monitor database
node monitor-database.js
```

## 📊 Database Schema

### Core Tables
| Table | Purpose | Key Features |
|-------|---------|--------------|
| `users` | User management | Multi-tenant, enterprise features |
| `organizations` | Enterprise support | Plans, quotas, billing |
| `user_sessions` | Session management | Security, device tracking |
| `security_events` | Security logging | Comprehensive audit trail |

### Application Tables
| App | Tables | Purpose |
|-----|--------|---------|
| **TauMail** | `emails`, `email_attachments`, `email_templates` | Complete email system |
| **TauCloud** | `cloud_folders`, `cloud_files` | File storage and sharing |
| **TauStore** | `store_apps`, `store_categories` | App marketplace |
| **TauBrowser** | `browser_bookmarks`, `browser_history` | Browser data |
| **TauAI** | `ai_conversations`, `ai_models` | AI platform |
| **Developer** | `projects`, `pipelines`, `git_repositories` | Development tools |

## 🔧 Configuration

### Database Optimization
- **Connection Pooling** - Optimized for high concurrency
- **Indexing** - Performance-optimized indexes
- **Partitioning** - Large table partitioning for scalability
- **Materialized Views** - Analytics and reporting

### SMTP Configuration
- **Multiple SMTP Servers** - Load balancing and failover
- **Email Queuing** - Reliable email delivery
- **Template System** - Dynamic email templates
- **Analytics** - Email tracking and metrics

## 📈 Performance Features

### Connection Pooling
```sql
-- Optimized connection settings
max_connections = 200
shared_buffers = '256MB'
effective_cache_size = '1GB'
```

### Indexing Strategy
```sql
-- Composite indexes for common queries
CREATE INDEX idx_emails_user_folder_created ON emails(user_id, folder, created_at DESC);
CREATE INDEX idx_cloud_files_user_folder_created ON cloud_files(user_id, folder_id, created_at DESC);
```

### Materialized Views
```sql
-- Analytics views for performance
CREATE MATERIALIZED VIEW user_activity_summary AS ...
CREATE MATERIALIZED VIEW organization_usage_summary AS ...
```

## 🔒 Security Features

### Authentication
- **JWT Tokens** - Secure authentication
- **Password Hashing** - bcrypt with configurable rounds
- **Session Management** - Secure session handling
- **Rate Limiting** - Protection against abuse

### Authorization
- **Permission System** - Granular access control
- **Organization Isolation** - Multi-tenant security
- **API Keys** - Secure API access
- **Audit Logging** - Comprehensive security events

## 📧 Email System

### SMTP Configuration
```sql
-- Multiple SMTP servers for reliability
INSERT INTO smtp_servers (name, host, port, use_tls) VALUES
('Primary', 'smtp.gmail.com', 587, true),
('Backup', 'smtp.sendgrid.net', 587, true);
```

### Email Templates
```sql
-- Dynamic email templates
INSERT INTO email_templates (name, subject, html_body, template_type) VALUES
('Welcome', 'Welcome to TauOS!', '<h1>Welcome!</h1>', 'welcome');
```

### Email Analytics
```sql
-- Comprehensive email tracking
SELECT get_email_analytics(user_id, organization_id, date_from, date_to);
```

## 🧪 Testing

### Test Suite
The test suite covers:
- ✅ Database connection
- ✅ Table creation
- ✅ Function creation
- ✅ Index creation
- ✅ Sample data
- ✅ Performance tests
- ✅ SMTP configuration
- ✅ Email functionality

### Running Tests
```bash
# Run all tests
node test-database-setup.js

# Run specific test
node -e "const { runTest } = require('./test-database-setup.js'); runTest('Database Connection', () => pool.query('SELECT 1'))"
```

## 📊 Monitoring

### Database Metrics
```bash
# Monitor database performance
node monitor-database.js
```

### Key Metrics
- **Connection Count** - Active database connections
- **Query Performance** - Slow query identification
- **Table Sizes** - Storage usage by table
- **User Activity** - Active users and sessions

## 🔄 Backup & Restore

### Automated Backups
```bash
# Create backup
./backup-database.sh

# Restore from backup
./restore-database.sh backups/tauos_backup_20241201_120000.sql.gz
```

### Backup Strategy
- **Daily Backups** - Automated daily backups
- **Compression** - Gzip compression for storage efficiency
- **Retention** - Configurable retention periods
- **Verification** - Backup integrity checks

## 🚀 Production Deployment

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
JWT_SECRET=your-jwt-secret
BCRYPT_ROUNDS=12
```

### Production Checklist
- [ ] Database connection pooling configured
- [ ] SMTP servers configured and tested
- [ ] Backup strategy implemented
- [ ] Monitoring setup
- [ ] Security audit completed
- [ ] Performance testing completed

## 📚 API Reference

### Core Functions
```sql
-- User dashboard data
SELECT get_user_dashboard_data(user_id);

-- Organization analytics
SELECT get_organization_analytics(org_id);

-- Email analytics
SELECT get_email_analytics(user_id, org_id, date_from, date_to);

-- Database metrics
SELECT get_database_metrics();
```

### Email Functions
```sql
-- Queue email for delivery
SELECT queue_email_for_delivery(email_id, smtp_server_id, priority);

-- Process email queue
SELECT process_email_queue();

-- Handle email bounces
SELECT handle_email_bounce(email_id, bounce_type, bounce_reason);
```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check connection
psql "$DATABASE_URL" -c "SELECT 1;"

# Check environment
echo $DATABASE_URL
```

#### SMTP Issues
```bash
# Test SMTP configuration
node -e "const nodemailer = require('nodemailer'); const transporter = nodemailer.createTransporter({...}); transporter.verify().then(console.log);"
```

#### Performance Issues
```bash
# Monitor slow queries
node monitor-database.js

# Check indexes
psql "$DATABASE_URL" -c "SELECT * FROM pg_indexes WHERE tablename = 'emails';"
```

## 📞 Support

### Documentation
- **Schema Documentation** - Complete table and function documentation
- **API Reference** - Function parameters and return values
- **Examples** - Usage examples for common operations

### Community
- **GitHub Issues** - Bug reports and feature requests
- **Discord** - Community support and discussions
- **Documentation** - Comprehensive guides and tutorials

## 🎯 Next Steps

1. **Configure SMTP** - Set up your email delivery
2. **Test Email Flow** - Verify email sending and receiving
3. **Monitor Performance** - Set up database monitoring
4. **Backup Strategy** - Implement automated backups
5. **Security Audit** - Complete security review
6. **Production Deployment** - Deploy to production environment

---

**TauCore™ Hybrid Database Setup** - Complete database solution for the TauOS ecosystem. Built for scale, security, and performance. 🚀
