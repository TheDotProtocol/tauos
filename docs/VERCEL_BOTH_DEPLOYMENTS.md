# Force Fresh Deployments for Both Applications

## 🚨 **Problem**: Both Applications Showing Old Version

Both [https://mail.tauos.org/](https://mail.tauos.org/) and [https://cloud.tauos.org/](https://cloud.tauos.org/) are showing the old version without PostgreSQL integration.

## 🔧 **Solution**: Force Fresh Deployments for Both**

### **Step 1: Force TauMail Deployment**
```bash
./scripts/force-vercel-taumail-deployment.sh
```

### **Step 2: Force TauCloud Deployment**
```bash
./scripts/force-vercel-deployment.sh
```

## 📋 **Manual Dashboard Deployment (Alternative)**

### **For TauMail:**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your TauMail project
3. Go to "Deployments" tab
4. Click "Redeploy" on latest deployment

### **For TauCloud:**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your TauCloud project
3. Go to "Deployments" tab
4. Click "Redeploy" on latest deployment

## 🔍 **Verification Steps**

### **TauMail Tests:**
```bash
# Test health endpoint
curl https://mail.tauos.org/api/health

# Test registration
curl -X POST https://mail.tauos.org/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'

# Test login
curl -X POST https://mail.tauos.org/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

### **TauCloud Tests:**
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

## 🎯 **Expected Results After Fresh Deployments**

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

## 📝 **Environment Variables to Verify**

### **TauMail Project:**
```
DATABASE_URL=postgresql://postgres:Ak1233%40%405_HIDDEN@db.tviqcormikopltejomkc.supabase.co:5432/postgres
NODE_ENV=production
JWT_SECRET=tauos-secret-key-change-in-production
```

### **TauCloud Project:**
```
DATABASE_URL=postgresql://postgres:Ak1233%40%405_HIDDEN@db.tviqcormikopltejomkc.supabase.co:5432/postgres
NODE_ENV=production
JWT_SECRET=tauos-secret-key-change-in-production
```

## 🚀 **Quick Commands to Run Both**

```bash
# Force both deployments
./scripts/force-vercel-taumail-deployment.sh
./scripts/force-vercel-deployment.sh

# Test both applications
curl https://mail.tauos.org/api/health
curl https://cloud.tauos.org/api/health
```

## 📊 **Success Indicators**

After both deployments complete:
- ✅ **mail.tauos.org** shows updated interface
- ✅ **cloud.tauos.org** shows updated interface
- ✅ **Both health endpoints return "connected"**
- ✅ **Both registration/login endpoints work**
- ✅ **PostgreSQL integration functional on both**

**Status**: 🔄 **FORCING FRESH DEPLOYMENTS FOR BOTH APPLICATIONS** 