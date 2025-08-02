# Clean Vercel Deployment Guide

## 🧹 **Clean Deployment Process**

This guide will help you create fresh, clean deployments for both TauMail and TauCloud without cluttering your Vercel dashboard.

## 📁 **Project Structure**

### **TauMail Project**
- **Root Directory**: `vercel-tauos-mail`
- **Framework**: Other (not Node.js)
- **Build Command**: (leave empty)
- **Output Directory**: (leave empty)
- **Install Command**: `npm install`
- **Development Command**: `npm start`

### **TauCloud Project**
- **Root Directory**: `vercel-tauos-cloud`
- **Framework**: Other (not Node.js)
- **Build Command**: (leave empty)
- **Output Directory**: (leave empty)
- **Install Command**: `npm install`
- **Development Command**: `npm start`

## 🔧 **Environment Variables**

### **For TauMail Project:**
```
DATABASE_URL=postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres
NODE_ENV=production
JWT_SECRET=tauos-secret-key-change-in-production
```

### **For TauCloud Project:**
```
DATABASE_URL=postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres
NODE_ENV=production
JWT_SECRET=tauos-secret-key-change-in-production
```

## 🚀 **Deployment Steps**

### **Step 1: Clean Up Vercel Dashboard**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Delete old/duplicate projects
3. Keep only the latest versions

### **Step 2: Deploy TauMail**
1. Click "New Project"
2. Import from GitHub: `TheDotProtocol/tauos`
3. **Root Directory**: `vercel-tauos-mail`
4. **Framework Preset**: Other
5. **Install Command**: `npm install`
6. **Development Command**: `npm start`
7. Add environment variables (see above)
8. Click "Deploy"

### **Step 3: Deploy TauCloud**
1. Click "New Project"
2. Import from GitHub: `TheDotProtocol/tauos`
3. **Root Directory**: `vercel-tauos-cloud`
4. **Framework Preset**: Other
5. **Install Command**: `npm install`
6. **Development Command**: `npm start`
7. Add environment variables (see above)
8. Click "Deploy"

### **Step 4: Configure Custom Domains**
1. **TauMail Project**:
   - Go to Settings → Domains
   - Add: `mail.tauos.org`
   - Follow DNS instructions

2. **TauCloud Project**:
   - Go to Settings → Domains
   - Add: `cloud.tauos.org`
   - Follow DNS instructions

## 🔍 **Verification Steps**

### **TauMail Tests:**
```bash
# Health endpoint
curl https://mail.tauos.org/api/health

# Registration
curl -X POST https://mail.tauos.org/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'

# Login
curl -X POST https://mail.tauos.org/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

### **TauCloud Tests:**
```bash
# Health endpoint
curl https://cloud.tauos.org/api/health

# Registration
curl -X POST https://cloud.tauos.org/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'

# Login
curl -X POST https://cloud.tauos.org/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

## 🎯 **Expected Results**

### **TauMail:**
✅ **Updated interface with PostgreSQL integration**
✅ **Database connection working**
✅ **User registration/login functional**
✅ **Email composition working**
✅ **Health endpoint returning "connected"**

### **TauCloud:**
✅ **Updated interface with PostgreSQL integration**
✅ **Database connection working**
✅ **User registration/login functional**
✅ **File upload operations working**
✅ **Health endpoint returning "connected"**

## 📊 **Success Indicators**

After both deployments complete:
- ✅ **mail.tauos.org** shows updated interface
- ✅ **cloud.tauos.org** shows updated interface
- ✅ **Both health endpoints return "connected"**
- ✅ **Both registration/login endpoints work**
- ✅ **PostgreSQL integration functional on both**
- ✅ **Clean Vercel dashboard with only 2 projects**

## 🚨 **Important Notes**

1. **Framework Selection**: Choose "Other" not "Node.js"
2. **Root Directory**: Must be exact (`vercel-tauos-mail` or `vercel-tauos-cloud`)
3. **Environment Variables**: Copy exactly as shown above
4. **DNS Propagation**: Allow 5-30 minutes for domain changes
5. **SSL Certificates**: May take up to 24 hours for custom domains

## 📝 **Troubleshooting**

### **If Deployment Fails:**
1. Check environment variables are set correctly
2. Verify root directory is correct
3. Ensure framework is set to "Other"
4. Check Vercel logs for specific errors

### **If Database Connection Fails:**
1. Verify DATABASE_URL is correct
2. Check Supabase is accessible
3. Ensure SSL settings are correct

**Status**: 🚀 **READY FOR CLEAN DEPLOYMENTS** 