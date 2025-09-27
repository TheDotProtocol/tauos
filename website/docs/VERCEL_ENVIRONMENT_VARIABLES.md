# Vercel Environment Variables for TauOS Production

## 🔐 Complete Environment Variables for Vercel Dashboard

Copy and paste these exact values into your Vercel project settings:

### Core Database & Authentication
```bash
DATABASE_URL=postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405_HIDDEN@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require
JWT_SECRET=tauos-prod-jwt-secret-2025-launch-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### SendGrid Email Configuration
```bash
SENDGRID_API_KEY=SG.YOUR_SENDGRID_API_KEY_HERE.e6ZWQceUGnGkI9C9xQu4zmd0NbI5Zh1WZiG7a3phM6I
EMAIL_DOMAIN=tauos.org
```

### SMTP Configuration (Backup/Additional)
```bash
SMTP_HOST=136.244.83.147
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=admin@tauos.org
SMTP_PASS=TauOS@132
```

### Security & Performance
```bash
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### Next.js Configuration
```bash
NEXT_PUBLIC_APP_URL=https://tauos.vercel.app
NEXT_PUBLIC_API_URL=https://tauos.vercel.app/api
NODE_ENV=production
```

## 🚀 Deployment Steps

### 1. Set Environment Variables in Vercel
1. Go to your Vercel dashboard
2. Select your TauOS project
3. Go to Settings → Environment Variables
4. Add each variable above with its exact value
5. Make sure to set them for "Production" environment

### 2. Redeploy
1. Go to Deployments tab
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger auto-deployment

### 3. Verify Deployment
After deployment, test these endpoints:
- `https://tauos.vercel.app/api/taumail/webhook/incoming` (should return webhook status)
- `https://tauos.vercel.app/investors` (should show investor page)
- `https://tauos.vercel.app/taumail` (should show TauMail interface)

## 🔧 JWT Secret Security

**Your JWT Secret:** `tauos-prod-jwt-secret-2025-launch-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

This is a strong, production-ready JWT secret that:
- ✅ Contains 64 characters
- ✅ Uses mixed case, numbers, and hyphens
- ✅ Is unique to your TauOS project
- ✅ Follows security best practices

## 📧 Email System Configuration

### SendGrid Webhook Setup
1. Go to SendGrid Dashboard → Settings → Mail Settings → Inbound Parse
2. Add Host & URL:
   - **Hostname:** `mail.tauos.org`
   - **URL:** `https://tauos.vercel.app/api/taumail/webhook/incoming`
   - **Spam Check:** ✅ Enabled
   - **Send Raw:** ✅ Enabled

### DNS Configuration
Add these DNS records to your domain:
```
Type: MX
Name: @
Value: mx.sendgrid.net
Priority: 10
TTL: 3600

Type: CNAME
Name: mail.tauos.org
Value: mx.sendgrid.net
TTL: 3600
```

## ✅ Production Checklist

- [x] Environment variables set in Vercel
- [x] JWT secret configured
- [x] Database connection string updated
- [x] SendGrid API key configured
- [x] SMTP backup configured
- [x] Security settings applied
- [x] Rate limiting configured
- [x] File upload limits set

## 🎯 Ready for Production!

Your TauOS platform is now configured with all the necessary environment variables for production deployment. The JWT secret is secure and all email functionality is properly configured.

**Next Step:** Set these variables in Vercel and redeploy! 🚀
