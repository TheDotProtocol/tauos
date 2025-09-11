# 🔐 **SECURE ENVIRONMENT VARIABLES**

## ⚠️ **SECURITY NOTICE:**
- The Supabase secret key is showing as leaked in GitHub security scanning
- You need to **regenerate** the Supabase secret key
- **Never commit** real API keys to GitHub

---

## 📋 **ENVIRONMENT VARIABLES TO COPY & PASTE**

### **1. MAIN WEBSITE (tauos.org)**
```bash
DATABASE_URL=postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=edf9e560c8ed0cdb589b1b3a34f6fed13aa704fd8c9b58756e9c1a9d3488ffae02234472ba200f434701e835958241110feb9920006852a7da0b78096a738469
LOG_LEVEL=info
NODE_ENV=production
```

### **2. MAIL BACKEND (tauos-cbh3.vercel.app)**
```bash
DATABASE_URL=postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=edf9e560c8ed0cdb589b1b3a34f6fed13aa704fd8c9b58756e9c1a9d3488ffae02234472ba200f434701e835958241110feb9920006852a7da0b78096a738469
SENDGRID_API_KEY=SG.REPLACE_WITH_YOUR_ACTUAL_SENDGRID_API_KEY
SENDGRID_FROM_EMAIL=noreply@tauos.org
SENDGRID_FROM_NAME=TauOS Mail
SMTP_HOST=136.244.83.147
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=admin@tauos.org
SMTP_PASS=TauOS@132
MAX_FILE_SIZE=10485760
LOG_LEVEL=info
NODE_ENV=production
```

### **3. CLOUD BACKEND (New Deployment)**
```bash
DATABASE_URL=postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=edf9e560c8ed0cdb589b1b3a34f6fed13aa704fd8c9b58756e9c1a9d3488ffae02234472ba200f434701e835958241110feb9920006852a7da0b78096a738469
MAX_FILE_SIZE=104857600
UPLOAD_DIR=uploads
LOG_LEVEL=info
NODE_ENV=production
```

---

## 🔑 **HOW TO GET YOUR SENDGRID API KEY:**

1. Go to [SendGrid Dashboard](https://app.sendgrid.com/)
2. Login to your account
3. Go to **Settings** → **API Keys**
4. Click **"Create API Key"**
5. Choose **"Full Access"** or **"Restricted Access"** (recommended)
6. Give it a name like "TauOS Mail Production"
7. Click **"Create & View"**
8. **Copy the API key** (starts with `SG.`)
9. **Replace** `SG.REPLACE_WITH_YOUR_ACTUAL_SENDGRID_API_KEY` in the mail backend environment variables

---

## 🚨 **URGENT: FIX SUPABASE SECURITY ISSUE**

### **Step 1: Regenerate Supabase Secret Key**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Click **"Reset"** next to the secret key
5. **Copy the new secret key**

### **Step 2: Update Database URL**
Replace the `DATABASE_URL` in all environment files with the new one that includes the new secret key.

### **Step 3: Update Vercel Deployments**
1. Go to each Vercel project
2. Update the `DATABASE_URL` environment variable
3. Redeploy all projects

---

## ✅ **VERIFICATION CHECKLIST:**

- [ ] TypeScript error fixed (TauBrowser dashboard)
- [ ] SendGrid API key obtained and added
- [ ] Supabase secret key regenerated
- [ ] All environment variables updated in Vercel
- [ ] All projects redeployed
- [ ] GitHub security scanning shows no leaked secrets

---

## 🚀 **NEXT STEPS:**

1. **Fix the TypeScript error** (already done)
2. **Get your SendGrid API key** from SendGrid dashboard
3. **Regenerate Supabase secret key** for security
4. **Update all environment variables** in Vercel
5. **Redeploy all projects**
6. **Test email functionality**

**The build should now succeed after fixing the TypeScript error!**
