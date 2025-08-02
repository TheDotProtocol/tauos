# Railway Deployment Guide

## 🚀 **Quick Fix for Database Connection Issues**

### **Problem**: `ENETUNREACH` Database Connection Error

The Railway deployment is failing to connect to Supabase PostgreSQL due to network restrictions.

### **Solution 1: Use Supabase Pooler (Recommended)**

1. **Update Environment Variables in Railway Dashboard**:
   ```
   DATABASE_URL=postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   NODE_ENV=production
   JWT_SECRET=your-secret-key
   ```

2. **Redeploy the application**:
   ```bash
   cd vercel-tauos-cloud
   railway up --detach
   ```

### **Solution 2: Use Direct Connection (Alternative)**

If the pooler doesn't work, try the direct connection:
```
DATABASE_URL=postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres
```

### **Solution 3: Check Supabase Settings**

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `tviqcormikopltejomkc`
3. **Go to Settings > Database**
4. **Check "Connection pooling" is enabled**
5. **Verify the connection strings**

### **Solution 4: Railway Network Configuration**

1. **Check Railway Dashboard**: https://railway.app/dashboard
2. **Go to your project settings**
3. **Verify environment variables are set correctly**
4. **Check if there are any network restrictions**

## 🔧 **Manual Deployment Steps**

### **Step 1: Install Railway CLI**
```bash
npm install -g @railway/cli
```

### **Step 2: Login to Railway**
```bash
railway login
```

### **Step 3: Navigate to Project**
```bash
cd vercel-tauos-cloud
```

### **Step 4: Deploy**
```bash
railway up --detach
```

### **Step 5: Set Environment Variables**
```bash
railway variables set DATABASE_URL="postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
railway variables set NODE_ENV="production"
railway variables set JWT_SECRET="your-secret-key"
```

## 📊 **Health Check**

After deployment, test the health endpoint:
```bash
curl https://your-app.railway.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-08-02T..."
}
```

## 🔍 **Troubleshooting**

### **If Database Still Fails**:
1. **Check Railway logs**: `railway logs`
2. **Verify Supabase is accessible**: Test connection locally
3. **Try different connection string**: Use direct vs pooler
4. **Check Railway region**: Ensure it's in a supported region

### **If App Deploys but Database Fails**:
1. **Check environment variables**: Ensure DATABASE_URL is set
2. **Verify SSL settings**: Railway might need different SSL config
3. **Test connection manually**: Use psql or pgAdmin

## 🎯 **Success Indicators**

✅ **App starts without errors**
✅ **Health endpoint returns "healthy"**
✅ **Database queries work**
✅ **User registration/login works**
✅ **File upload operations work**

## 📞 **Support**

If issues persist:
1. **Check Railway documentation**: https://docs.railway.app
2. **Check Supabase documentation**: https://supabase.com/docs
3. **Review application logs**: `railway logs --tail`

**Status**: 🔧 **FIXING DATABASE CONNECTION** 