# Supabase Database Setup Instructions

## 🗄️ **Complete Database Setup for TauOS Platform**

### **Step 1: Login to Supabase CLI**

```bash
# Login to your Supabase account
supabase login

# You'll be prompted to enter your access token
# Get this from: https://supabase.com/dashboard/account/tokens
```

### **Step 2: Link to Your Project**

```bash
# Link to your Supabase project
supabase link --project-ref tviqcormikopltejomkc
```

### **Step 3: Push Database Migrations**

```bash
# Push the migrations to your Supabase database
supabase db push
```

### **Step 4: Verify Database Setup**

```bash
# Check the status of your database
supabase db diff

# View your database in the Supabase dashboard
# https://supabase.com/dashboard/project/tviqcormikopltejomkc/editor
```

## 📊 **Database Schema Overview**

### **Tables Created:**

1. **organizations** - Multi-tenant organizations
2. **users** - Users within organizations
3. **domains** - Custom domain management
4. **emails** - TauMail email storage
5. **email_attachments** - Email file attachments
6. **files** - TauCloud file storage
7. **folders** - File organization
8. **subscriptions** - Billing and plan management
9. **usage_logs** - Usage tracking and analytics

### **Business Functions:**

1. **check_storage_limit()** - Validates storage limits
2. **update_storage_usage()** - Updates storage usage
3. **get_user_storage_stats()** - Returns storage statistics
4. **validate_domain()** - Validates domain names

### **Sample Data:**

- **TauOS Organization** (Free Plan)
  - Domain: tauos.org
  - Users: admin@tauos.org, testuser@tauos.org
  - Password: password123

- **AR Holdings Group** (Pro Plan)
  - Domain: arholdings.group
  - Ready for user addition

## 🔧 **Next Steps After Database Setup**

### **1. Get Your API Keys**

Visit: https://supabase.com/dashboard/project/tviqcormikopltejomkc/settings/api

Copy these values:
- **Project URL**: `https://tviqcormikopltejomkc.supabase.co`
- **anon public**: Your anon key
- **service_role secret**: Your service role key

### **2. Update Environment Configuration**

Update `config/env.local` with your actual API keys:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tviqcormikopltejomkc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here

# Database Configuration
DATABASE_URL=postgresql://postgres:Ak1233%40%405_HIDDEN@db.tviqcormikopltejomkc.supabase.co:5432/postgres
POOLER_URL=postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405_HIDDEN@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

### **3. Test Database Connection**

```bash
# Test the connection
psql "postgresql://postgres:Ak1233%40%405_HIDDEN@db.tviqcormikopltejomkc.supabase.co:5432/postgres" -c "SELECT COUNT(*) FROM organizations;"
```

### **4. Update Applications**

Update your local applications to use the new database:

```bash
# Update TauMail
cd local-development/taumail-local
# Update server.js to use PostgreSQL instead of SQLite

# Update TauCloud
cd ../taucloud-local
# Update server.js to use PostgreSQL instead of SQLite
```

## 🎯 **Success Indicators**

✅ **Database**: All 8 tables created successfully  
✅ **Functions**: 4 business functions working  
✅ **Sample Data**: 2 organizations, 2 users created  
✅ **Indexes**: Performance indexes in place  
✅ **Triggers**: Automatic timestamp updates working  
✅ **API Keys**: Retrieved from Supabase dashboard  
✅ **Environment**: Updated with correct credentials  

## 🚀 **Production Features**

### **Multi-Tenant Architecture:**
- Complete data isolation between organizations
- Per-organization storage limits
- Custom domain support
- Role-based access control

### **Storage Management:**
- 5GB free tier
- Per-user and per-organization limits
- Automatic usage tracking
- Storage limit enforcement

### **Billing Integration:**
- Stripe subscription management
- Plan-based feature limits
- Usage analytics
- Automated billing

### **Domain Management:**
- Custom domain registration
- DNS record management
- SSL certificate automation
- Domain verification system

## 📞 **Support**

If you encounter any issues:

1. **Check Supabase Dashboard**: https://supabase.com/dashboard/project/tviqcormikopltejomkc
2. **View Database Logs**: Dashboard → Logs → Database
3. **Test Connection**: Use the SQL Editor in the dashboard
4. **Reset if Needed**: `supabase db reset`

## 🎉 **Congratulations!**

Your TauOS platform now has a complete production-ready database with:
- ✅ Multi-tenant architecture
- ✅ Complete user management
- ✅ File storage system
- ✅ Email system
- ✅ Domain management
- ✅ Billing integration
- ✅ Usage tracking
- ✅ Performance optimization

**Next Phase**: Update your applications to use the new PostgreSQL database! 