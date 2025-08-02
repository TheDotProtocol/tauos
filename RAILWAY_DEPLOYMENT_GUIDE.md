# Railway Deployment Guide for TauCloud

## 🚀 **Quick Deployment (5 minutes)**

### **Step 1: Go to Railway**
1. Visit [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"

### **Step 2: Import Repository**
1. Select "Deploy from GitHub repo"
2. Choose `TheDotProtocol/tauos`
3. Set root directory to: `vercel-tauos-cloud`
4. Click "Deploy Now"

### **Step 3: Configure Environment Variables**
In Railway dashboard, go to your project → Variables tab:

```
DATABASE_URL=postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres
NODE_ENV=production
JWT_SECRET=tauos-secret-key-change-in-production
```

### **Step 4: Configure Custom Domain**
1. Go to Settings → Domains
2. Add custom domain: `cloud.tauos.org`
3. Configure DNS records as instructed

## 🔧 **Automatic Deployment**

### **Option A: Use Deployment Script**
```bash
./scripts/deploy-railway.sh
```

### **Option B: Use Railway CLI**
```bash
cd vercel-tauos-cloud
railway login
railway init
railway up
```

## 📊 **Railway Benefits**

- ✅ **No rate limits**: Unlimited deployments
- ✅ **PostgreSQL included**: Built-in database
- ✅ **Custom domains**: Free SSL certificates
- ✅ **Automatic scaling**: Handles traffic spikes
- ✅ **GitHub integration**: Automatic deployments
- ✅ **Environment variables**: Secure configuration
- ✅ **Logs & monitoring**: Built-in observability

## 🎯 **Expected Results**

After deployment:
- ✅ **Application URL**: `https://your-app-name.railway.app`
- ✅ **Custom Domain**: `https://cloud.tauos.org` (after DNS setup)
- ✅ **Database**: Connected to Supabase PostgreSQL
- ✅ **Authentication**: JWT tokens working
- ✅ **File operations**: Metadata storage working
- ✅ **API endpoints**: All endpoints functional

## 🔍 **Troubleshooting**

### **If deployment fails:**
1. Check Railway logs in dashboard
2. Verify environment variables are set
3. Ensure DATABASE_URL is correct
4. Check if all dependencies are installed

### **If custom domain doesn't work:**
1. Verify DNS records are configured
2. Wait for SSL certificate (up to 24 hours)
3. Check Railway domain settings

## 📝 **Next Steps**

1. **Deploy to Railway** (this guide)
2. **Test all endpoints** (registration, login, file upload)
3. **Configure custom domain** (cloud.tauos.org)
4. **Update homepage links** (point to Railway URL)
5. **Monitor performance** (Railway dashboard)

**Status:** 🚀 **READY FOR DEPLOYMENT** 