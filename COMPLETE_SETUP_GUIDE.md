# Complete TauOS Platform Setup Guide

## 🚀 **Overview**

This guide will help you set up the complete TauOS platform with multi-tenant architecture, domain management, pricing tiers, and production-ready infrastructure.

## 📋 **Prerequisites**

### **1. System Requirements**
- **Node.js**: 18.0.0 or higher
- **PostgreSQL**: 14.0 or higher
- **Supabase CLI**: Latest version
- **Git**: For version control
- **Docker**: For containerization (optional)

### **2. Accounts Required**
- **Supabase**: https://supabase.com (free tier available)
- **Stripe**: https://stripe.com (for billing)
- **Cloudflare**: https://cloudflare.com (for DNS management)
- **Vercel**: https://vercel.com (for deployment)

## 🗄️ **Phase 1: Database Setup**

### **1. Install Supabase CLI**
```bash
# macOS
brew install supabase/tap/supabase

# Linux
curl -fsSL https://supabase.com/install.sh | sh

# Verify installation
supabase --version
```

### **2. Initialize Supabase Project**
```bash
# Run the setup script
./scripts/setup-supabase.sh

# Start Supabase locally
supabase start

# Get your API keys
supabase status
```

### **3. Configure Environment**
```bash
# Copy environment template
cp .env.local.example .env.local

# Update with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🌐 **Phase 2: Domain Management**

### **1. Configure DNS Providers**
```bash
# Update domain management config
nano config/domain-management.json

# Add your API credentials
{
  "dns_providers": {
    "cloudflare": {
      "api_token": "your_cloudflare_api_token",
      "zone_id": "your_zone_id"
    }
  }
}
```

### **2. Set Up SSL Certificates**
```bash
# Configure Let's Encrypt
nano config/domain-management.json

# Update SSL settings
{
  "ssl_providers": {
    "lets_encrypt": {
      "email": "admin@tauos.org",
      "staging": false
    }
  }
}
```

### **3. Test Domain Verification**
```bash
# Test domain verification
node scripts/verify-domain.js example.com org-id
```

## 💰 **Phase 3: Pricing & Billing**

### **1. Configure Stripe**
```bash
# Install Stripe
npm install stripe

# Set up environment variables
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### **2. Create Stripe Products**
```bash
# Create pricing plans in Stripe dashboard
# Basic: $9.99/month
# Pro: $19.99/month  
# Enterprise: $99.99/month

# Update pricing.json with Stripe price IDs
nano config/pricing.json
```

### **3. Set Up Webhooks**
```bash
# Configure Stripe webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 🏢 **Phase 4: Organization Management**

### **1. Create Sample Organizations**
```bash
# Create TauOS organization
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TauOS",
    "domain": "tauos.org",
    "subdomain": "tauos",
    "plan_type": "free"
  }'

# Create AR Holdings organization
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AR Holdings Group",
    "domain": "arholdings.group",
    "subdomain": "arholdings",
    "plan_type": "pro"
  }'
```

### **2. Add Users to Organizations**
```bash
# Add admin user to TauOS
curl -X POST http://localhost:3000/api/organizations/org-id/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@tauos.org",
    "password": "password123",
    "role": "owner"
  }'
```

## 🔧 **Phase 5: Application Setup**

### **1. Install Dependencies**
```bash
# Install all dependencies
npm install

# Install PostgreSQL client
npm install pg

# Install additional packages
npm install stripe @supabase/supabase-js
```

### **2. Configure Applications**
```bash
# TauMail configuration
cd local-development/taumail-local
npm install
cp .env.example .env

# TauCloud configuration  
cd ../taucloud-local
npm install
cp .env.example .env
```

### **3. Run Migrations**
```bash
# Run database migrations
supabase db reset

# Verify tables created
supabase db diff
```

## 🚀 **Phase 6: Production Deployment**

### **1. Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy applications
vercel --prod

# Configure custom domains
vercel domains add mail.tauos.org
vercel domains add cloud.tauos.org
```

### **2. Set Up Monitoring**
```bash
# Configure logging
npm install winston

# Set up monitoring
npm install @sentry/node
```

### **3. Configure Backups**
```bash
# Set up automated backups
supabase db dump --data-only > backup.sql

# Schedule regular backups
crontab -e
# Add: 0 2 * * * supabase db dump > /backups/tauos-$(date +%Y%m%d).sql
```

## 📊 **Phase 7: Testing & Validation**

### **1. Test User Registration**
```bash
# Test TauMail registration
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "recovery_email": "test@example.com"
  }'
```

### **2. Test File Upload**
```bash
# Test TauCloud file upload
curl -X POST http://localhost:3002/api/files/upload \
  -H "Authorization: Bearer your_token" \
  -F "file=@test.txt"
```

### **3. Test Domain Management**
```bash
# Test domain addition
curl -X POST http://localhost:3000/api/domains \
  -H "Content-Type: application/json" \
  -d '{
    "domain_name": "example.com",
    "organization_id": "org-id"
  }'
```

## 🔍 **Phase 8: Monitoring & Analytics**

### **1. Set Up Logging**
```bash
# Configure application logging
npm install winston winston-daily-rotate-file

# Set up log rotation
mkdir logs
```

### **2. Monitor Performance**
```bash
# Install monitoring tools
npm install prom-client

# Set up metrics collection
npm install @sentry/node
```

### **3. Set Up Alerts**
```bash
# Configure email alerts
npm install nodemailer

# Set up monitoring alerts
npm install node-cron
```

## 🎯 **Success Indicators**

✅ **Database**: Supabase running with all tables created  
✅ **Authentication**: User registration and login working  
✅ **File Storage**: File upload/download working  
✅ **Email System**: Email sending/receiving working  
✅ **Domain Management**: Domain verification working  
✅ **Organization Management**: Multi-tenant isolation working  
✅ **Pricing**: Plan limits enforced correctly  
✅ **SSL**: HTTPS working on custom domains  
✅ **Monitoring**: Logs and metrics being collected  
✅ **Backups**: Automated backups running  

## 🚀 **Next Steps**

1. **Stripe Integration**: Complete billing system setup
2. **Email Service**: Set up SMTP for email delivery
3. **File Storage**: Configure S3-compatible storage
4. **CDN**: Set up content delivery network
5. **Load Balancing**: Configure multiple instances
6. **Security Audit**: Complete security review
7. **Performance Optimization**: Database and application tuning
8. **Documentation**: Complete user and admin documentation

## 📞 **Support**

- **Documentation**: https://docs.tauos.org
- **Community**: https://discord.gg/tauos
- **Issues**: https://github.com/tauos/tauos/issues
- **Email**: support@tauos.org

---

**🎉 Your TauOS platform is now ready for production use!** 