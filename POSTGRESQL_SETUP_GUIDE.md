# PostgreSQL Setup Guide for TauOS Platform

## 🚀 **Overview**

This guide will help you set up PostgreSQL for the TauOS platform, enabling production-ready email and cloud storage services.

## 📋 **Prerequisites**

### **1. Install PostgreSQL**

#### **macOS:**
```bash
brew install postgresql
brew services start postgresql
```

#### **Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### **Windows:**
Download and install from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)

### **2. Verify Installation**
```bash
psql --version
pg_isready
```

## 🗄️ **Database Setup**

### **1. Create Databases**
```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create databases
CREATE DATABASE taumail;
CREATE DATABASE taucloud;

# Exit
\q
```

### **2. Set Up User Permissions**
```bash
sudo -u postgres psql

# Create user (optional)
CREATE USER tauos_user WITH PASSWORD 'your_password';

# Grant permissions
GRANT ALL PRIVILEGES ON DATABASE taumail TO tauos_user;
GRANT ALL PRIVILEGES ON DATABASE taucloud TO tauos_user;

\q
```

## 🔧 **Application Setup**

### **1. Install Dependencies**
```bash
# TauMail
cd local-development/taumail-local
npm install pg

# TauCloud
cd ../taucloud-local
npm install pg
```

### **2. Configure Environment Variables**

#### **TauMail (.env):**
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=taumail
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your-secret-key-change-in-production
```

#### **TauCloud (.env):**
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=taucloud
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your-secret-key-change-in-production
```

### **3. Run Migrations**
```bash
# TauMail
cd local-development/taumail-local
npm run migrate

# TauCloud
cd ../taucloud-local
npm run migrate
```

## 🚀 **Quick Setup Script**

Use our automated setup script:

```bash
# Make script executable
chmod +x scripts/setup-postgresql.sh

# Run setup
./scripts/setup-postgresql.sh
```

## 📊 **Database Schema**

### **TauMail Tables:**

#### **users**
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR UNIQUE)
- `email` (VARCHAR UNIQUE)
- `password_hash` (VARCHAR)
- `recovery_email` (VARCHAR)
- `created_at` (TIMESTAMP)
- `last_login` (TIMESTAMP)

#### **emails**
- `id` (SERIAL PRIMARY KEY)
- `sender_id` (INTEGER REFERENCES users)
- `recipient_id` (INTEGER REFERENCES users)
- `subject` (TEXT)
- `body` (TEXT)
- `is_read` (BOOLEAN)
- `is_starred` (BOOLEAN)
- `is_deleted` (BOOLEAN)
- `created_at` (TIMESTAMP)

#### **email_attachments**
- `id` (SERIAL PRIMARY KEY)
- `email_id` (INTEGER REFERENCES emails)
- `filename` (VARCHAR)
- `file_path` (TEXT)
- `file_size` (INTEGER)
- `mime_type` (VARCHAR)
- `created_at` (TIMESTAMP)

### **TauCloud Tables:**

#### **users**
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR UNIQUE)
- `email` (VARCHAR UNIQUE)
- `password_hash` (VARCHAR)
- `recovery_email` (VARCHAR)
- `storage_used` (BIGINT)
- `storage_limit` (BIGINT)
- `created_at` (TIMESTAMP)
- `last_login` (TIMESTAMP)

#### **files**
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER REFERENCES users)
- `original_name` (VARCHAR)
- `filename` (VARCHAR)
- `file_path` (TEXT)
- `file_size` (BIGINT)
- `mime_type` (VARCHAR)
- `file_type` (VARCHAR)
- `parent_folder_id` (INTEGER)
- `created_at` (TIMESTAMP)

#### **folders**
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER REFERENCES users)
- `name` (VARCHAR)
- `parent_folder_id` (INTEGER)
- `created_at` (TIMESTAMP)

## 🔍 **Testing**

### **1. Start Services**
```bash
# Terminal 1 - TauMail
cd local-development/taumail-local
npm start

# Terminal 2 - TauCloud
cd local-development/taucloud-local
npm start
```

### **2. Access Applications**
- **TauMail**: http://localhost:3001
- **TauCloud**: http://localhost:3002

### **3. Test Accounts**
- **Username**: `admin`, **Password**: `password123`
- **Username**: `testuser`, **Password**: `password123`

## 🔧 **Production Configuration**

### **1. Security**
- Change default passwords
- Use strong JWT secrets
- Enable SSL connections
- Configure firewall rules

### **2. Performance**
- Adjust PostgreSQL settings in `postgresql.conf`
- Configure connection pooling
- Set up proper indexes
- Monitor query performance

### **3. Backup**
```bash
# Create backup
pg_dump taumail > taumail_backup.sql
pg_dump taucloud > taucloud_backup.sql

# Restore backup
psql taumail < taumail_backup.sql
psql taucloud < taucloud_backup.sql
```

## 🐛 **Troubleshooting**

### **Common Issues:**

#### **1. Connection Refused**
```bash
# Check if PostgreSQL is running
pg_isready

# Start service
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Ubuntu
```

#### **2. Permission Denied**
```bash
# Check user permissions
sudo -u postgres psql -c "\du"

# Grant permissions
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE taumail TO your_user;"
```

#### **3. Migration Errors**
```bash
# Check database exists
psql -U postgres -l

# Recreate database
dropdb taumail
createdb taumail
npm run migrate
```

## 📈 **Monitoring**

### **1. Database Performance**
```sql
-- Check slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### **2. Application Logs**
```bash
# Check application logs
tail -f local-development/taumail-local/logs/app.log
tail -f local-development/taucloud-local/logs/app.log
```

## 🎉 **Success Indicators**

✅ PostgreSQL service running  
✅ Databases created successfully  
✅ Migrations completed without errors  
✅ Applications start without connection errors  
✅ Can register/login users  
✅ Can send/receive emails  
✅ Can upload/download files  
✅ File filtering works correctly  

## 🚀 **Next Steps**

1. **Corporate Domains**: Set up custom domain support
2. **SSL Certificates**: Configure HTTPS
3. **Load Balancing**: Set up multiple instances
4. **Monitoring**: Implement comprehensive monitoring
5. **Backup Strategy**: Automated backup system
6. **Security Hardening**: Additional security measures

---

**🎯 Your TauOS platform is now ready for production use!** 