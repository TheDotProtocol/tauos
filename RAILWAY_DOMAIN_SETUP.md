# Railway Custom Domain Setup for cloud.tauos.org

## 🎯 **Step 1: Get Your Railway URL**

1. Go to your Railway dashboard
2. Click on your TauCloud project
3. Look for the deployment URL (something like `https://your-app-name.railway.app`)
4. Copy this URL - we'll need it for DNS configuration

## 🔗 **Step 2: Configure Custom Domain in Railway**

### **In Railway Dashboard:**
1. Go to your project → Settings tab
2. Click on "Domains" section
3. Click "Add Domain"
4. Enter: `cloud.tauos.org`
5. Railway will provide DNS records to configure

## 🌐 **Step 3: Configure DNS Records**

### **Option A: If you control the DNS (recommended)**
Add these DNS records to your domain provider:

```
Type: CNAME
Name: cloud
Value: your-app-name.railway.app
TTL: 300 (or default)
```

### **Option B: If using Cloudflare**
1. Go to Cloudflare dashboard
2. Select your domain (tauos.org)
3. Go to DNS → Records
4. Add CNAME record:
   - Name: `cloud`
   - Target: `your-app-name.railway.app`
   - Proxy status: Proxied (orange cloud)

### **Option C: If using other DNS providers**
Add a CNAME record pointing `cloud.tauos.org` to your Railway URL.

## ⏱️ **Step 4: Wait for Propagation**

- **DNS propagation**: 5-30 minutes
- **SSL certificate**: Up to 24 hours (Railway will auto-generate)
- **Railway verification**: Usually instant

## ✅ **Step 5: Verify Setup**

1. **Check Railway dashboard**: Domain should show as "Active"
2. **Test the URL**: Visit `https://cloud.tauos.org`
3. **Test functionality**: Register, login, upload files
4. **Check SSL**: Should show as secure

## 🔧 **Troubleshooting**

### **If domain doesn't work:**
1. **Check DNS propagation**: Use [whatsmydns.net](https://whatsmydns.net)
2. **Verify CNAME record**: Should point to Railway URL
3. **Wait for SSL**: Can take up to 24 hours
4. **Check Railway logs**: Look for domain errors

### **If SSL doesn't work:**
1. **Wait longer**: SSL certificates take time
2. **Check Railway status**: Domain should be "Active"
3. **Contact Railway support**: If issues persist

## 📝 **Next Steps**

1. **Update homepage links**: Point to `https://cloud.tauos.org`
2. **Test all features**: Registration, login, file upload
3. **Monitor performance**: Check Railway dashboard
4. **Set up monitoring**: Configure alerts if needed

**Status:** 🚀 **READY FOR DOMAIN CONFIGURATION** 