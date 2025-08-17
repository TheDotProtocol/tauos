# Complete Environment Variables for TauMail Deployment

## **📋 All Required Environment Variables for Vercel:**

### **Database Configuration (Supabase PostgreSQL)**
```
DATABASE_URL=postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### **JWT Configuration**
```
JWT_SECRET=tauos-secret-key-change-in-production
```

### **SMTP Configuration (TauOS Sovereign Server)**
```
SMTP_HOST=34.30.189.200
SMTP_PORT=587
SMTP_USER=noreply@tauos.org
SMTP_PASS=TauOS2024!Secure
```

### **Mailtrap Configuration (Fallback for testing)**
```
MAILTRAP_USER=e5b253ac8d7940
MAILTRAP_PASS=dd6f3ec509aec7
```

### **Application Configuration**
```
NODE_ENV=production
PORT=3000
```

### **Domain Configuration**
```
TAUOS_DOMAIN=tauos.org
TAUMAIL_DOMAIN=mail.tauos.org
```

### **Security Configuration**
```
CORS_ORIGIN=https://www.tauos.org,https://mail.tauos.org
```

## **🚀 New Deployment Steps:**

### **Step 1: Create New Vercel Project**
1. Go to https://vercel.com/dashboard
2. Click **"New Project"**
3. Import from GitHub: `TheDotProtocol/tauos`
4. Set **Root Directory**: `vercel-tauos-mail`
5. Set **Framework**: Other (not Node.js)
6. Set **Install Command**: `npm install`
7. Set **Build Command**: `npm start`
8. Set **Output Directory**: `public`

### **Step 2: Add All Environment Variables**
Copy and paste ALL the variables above into the new project's environment variables.

### **Step 3: Deploy**
1. Click **"Deploy"**
2. Wait for deployment to complete
3. Configure custom domain: `mail.tauos.org`

## **✅ What This Will Give You:**
- ✅ Fresh deployment limit reset
- ✅ All environment variables properly configured
- ✅ Working SMTP authentication
- ✅ Sovereign email delivery
- ✅ No deployment limits for now

## **📧 Expected Result:**
- ✅ Email sending should work immediately
- ✅ Status should show "sent" instead of "database_only"
- ✅ Gmail should receive emails from your sovereign infrastructure

---

**Ready to create the new deployment with all variables!** 🚀 