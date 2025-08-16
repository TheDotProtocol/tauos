# Production Environment Variables for TauOS

## 📋 Copy these variables to Vercel for both TauMail and TauCloud projects:

### **Database Configuration (Supabase PostgreSQL)**
```
DATABASE_URL=postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### **JWT Configuration**
```
JWT_SECRET=tauos-secret-key-change-in-production
```

### **SMTP Configuration (Primary - GCP Server)**
```
SMTP_USER=noreply@tauos.org
SMTP_PASS=your_smtp_password_here
```

### **Mailtrap Configuration (Fallback for testing)**
```
MAILTRAP_USER=e5b253ac8d7940
MAILTRAP_PASS=****aec7
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
TAUCLOUD_DOMAIN=cloud.tauos.org
```

### **Security Configuration**
```
CORS_ORIGIN=https://www.tauos.org,https://mail.tauos.org,https://cloud.tauos.org
```

## 🚀 **Deployment Instructions:**

1. **Create TauMail Project in Vercel:**
   - Root Directory: `vercel-tauos-mail`
   - Framework: Other (not Node.js)
   - Install Command: `npm install`
   - Build Command: `npm start`
   - Output Directory: `public`

2. **Create TauCloud Project in Vercel:**
   - Root Directory: `vercel-tauos-cloud`
   - Framework: Other (not Node.js)
   - Install Command: `npm install`
   - Build Command: `npm start`
   - Output Directory: `public`

3. **Add Environment Variables:**
   - Copy all variables above to both projects
   - Ensure `DATABASE_URL` and `JWT_SECRET` are identical

4. **Configure Custom Domains:**
   - TauMail: `mail.tauos.org`
   - TauCloud: `cloud.tauos.org`

## ✅ **Verification Checklist:**

- [ ] All download files in `website/public/`
- [ ] Checksums verified and correct
- [ ] Navigation links point to subdomains
- [ ] Environment variables configured
- [ ] Custom domains set up
- [ ] SSL certificates active
- [ ] Database connection working
- [ ] Email functionality tested
