# Clean Deployment Checklist

## 🧹 **Step-by-Step Clean Deployment Process**

### **✅ Pre-Deployment Verification (COMPLETED)**
- [x] Local servers updated with health endpoints
- [x] PostgreSQL integration verified in all applications
- [x] All code changes pushed to GitHub
- [x] Health endpoints working on local servers

### **🔄 Step 1: Vercel Dashboard Cleanup**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Delete these projects** (if they exist):
   - `tauos-v8je` (old deployment)
   - Any duplicate TauMail projects
   - Any duplicate TauCloud projects
   - Keep only the main `tauos.org` website project

### **🔄 Step 2: Deploy TauMail**
1. Click "New Project"
2. Import from GitHub: `TheDotProtocol/tauos`
3. **Root Directory**: `vercel-tauos-mail` ✅
4. **Framework Preset**: Other (not Node.js)
5. **Install Command**: `npm install`
6. **Development Command**: `npm start`
7. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres
   NODE_ENV=production
   JWT_SECRET=tauos-secret-key-change-in-production
   ```
8. Click "Deploy"

### **🔄 Step 3: Deploy TauCloud**
1. Click "New Project"
2. Import from GitHub: `TheDotProtocol/tauos`
3. **Root Directory**: `vercel-tauos-cloud` ✅
4. **Framework Preset**: Other (not Node.js)
5. **Install Command**: `npm install`
6. **Development Command**: `npm start`
7. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres
   NODE_ENV=production
   JWT_SECRET=tauos-secret-key-change-in-production
   ```
8. Click "Deploy"

### **🔄 Step 4: Configure Custom Domains**
1. **TauMail Project**:
   - Go to Settings → Domains
   - Add: `mail.tauos.org`
   - Follow DNS instructions

2. **TauCloud Project**:
   - Go to Settings → Domains
   - Add: `cloud.tauos.org`
   - Follow DNS instructions

### **🔄 Step 5: Verification Tests**
After both deployments complete, test:

#### **TauMail Tests:**
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

#### **TauCloud Tests:**
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

### **✅ Expected Results**
- ✅ **mail.tauos.org** shows updated interface with PostgreSQL integration
- ✅ **cloud.tauos.org** shows updated interface with PostgreSQL integration
- ✅ **Both health endpoints return "connected"**
- ✅ **Both registration/login endpoints work**
- ✅ **PostgreSQL integration functional on both**
- ✅ **Clean Vercel dashboard with only 3 projects** (tauos.org, mail, cloud)

### **🚨 Important Notes**
1. **Framework Selection**: Choose "Other" not "Node.js"
2. **Root Directory**: Must be exact (`vercel-tauos-mail` or `vercel-tauos-cloud`)
3. **Environment Variables**: Copy exactly as shown above
4. **DNS Propagation**: Allow 5-30 minutes for domain changes
5. **SSL Certificates**: May take up to 24 hours for custom domains

### **📋 Troubleshooting**
- **If deployment fails**: Check environment variables and root directory
- **If old version shows**: Wait 2-3 minutes for rebuild, then hard refresh browser
- **If database connection fails**: Verify DATABASE_URL is correct
- **If domains don't work**: Check DNS settings and wait for propagation

**Status**: 🚀 **READY FOR CLEAN DEPLOYMENTS** 