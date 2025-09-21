# Force Fresh Vercel Deployment Guide

## 🚨 **Problem**: Old Version Showing

The Vercel deployment is showing the old version without PostgreSQL integration. We need to force a fresh deployment.

## 🔧 **Solution 1: Manual Dashboard Deployment**

### **Step 1: Go to Vercel Dashboard**
1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your TauCloud project
3. Go to "Deployments" tab

### **Step 2: Trigger Manual Deployment**
1. Click "Redeploy" on the latest deployment
2. Or click "Deploy" to create a new deployment
3. Wait for build to complete

### **Step 3: Verify Environment Variables**
In your project settings, ensure these are set:
```
DATABASE_URL=postgresql://postgres:Ak1233%40%405_HIDDEN@db.tviqcormikopltejomkc.supabase.co:5432/postgres
NODE_ENV=production
JWT_SECRET=tauos-secret-key-change-in-production
```

## 🔧 **Solution 2: GitHub Integration**

### **Step 1: Check GitHub Integration**
1. Go to project settings
2. Verify GitHub integration is connected
3. Ensure auto-deploy is enabled

### **Step 2: Force Push**
The script we just ran should trigger a deployment:
```bash
./scripts/force-vercel-deployment.sh
```

## 🔍 **Verification Steps**

### **1. Check Health Endpoint**
```bash
curl https://cloud.tauos.org/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-08-02T..."
}
```

### **2. Test User Registration**
```bash
curl -X POST https://cloud.tauos.org/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

### **3. Check Frontend**
Visit [https://cloud.tauos.org/](https://cloud.tauos.org/) and verify:
- ✅ Updated interface
- ✅ PostgreSQL integration working
- ✅ All features functional

## 🎯 **Expected Results After Fresh Deployment**

✅ **Updated interface with PostgreSQL integration**
✅ **Database connection working**
✅ **User registration/login functional**
✅ **File upload operations working**
✅ **Health endpoint returning "connected"**

## 📝 **Troubleshooting**

### **If Still Showing Old Version**:
1. **Clear browser cache**: Hard refresh (Ctrl+F5)
2. **Check deployment logs**: In Vercel dashboard
3. **Verify environment variables**: Ensure DATABASE_URL is set
4. **Wait for DNS propagation**: May take 5-30 minutes

### **If Database Connection Fails**:
1. **Check Supabase**: Verify database is accessible
2. **Verify connection string**: Ensure URL is correct
3. **Check SSL settings**: May need to adjust SSL config

## 🚀 **Quick Test Commands**

```bash
# Test health endpoint
curl https://cloud.tauos.org/api/health

# Test registration
curl -X POST https://cloud.tauos.org/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'

# Test login
curl -X POST https://cloud.tauos.org/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

**Status**: 🔄 **FORCING FRESH DEPLOYMENT** 