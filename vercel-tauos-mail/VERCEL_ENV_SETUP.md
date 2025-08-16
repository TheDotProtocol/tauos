# Vercel Environment Variables Setup for TauMail

## 🔧 Fix the "database_only" SMTP Issue

The "database_only" status means SMTP is not working. This is because the environment variables are not set correctly in Vercel.

## 📋 Required Environment Variables

Go to your Vercel dashboard and add these environment variables to your TauMail project:

### **Mailtrap Configuration (Recommended for Testing)**
```
MAILTRAP_USER=e5b253ac8d7940
MAILTRAP_PASS=dd6f3ec509aec7
```

### **Primary SMTP Configuration (Optional)**
```
SMTP_USER=noreply@tauos.org
SMTP_PASS=your_smtp_password_here
```

### **Database Configuration**
```
DATABASE_URL=postgresql://postgres.tviqcormikormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### **JWT Configuration**
```
JWT_SECRET=tauos-secret-key-change-in-production
```

## 🚀 Steps to Fix:

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your TauMail project

2. **Navigate to Settings**
   - Click on "Settings" tab
   - Go to "Environment Variables" section

3. **Add Environment Variables**
   - Click "Add New"
   - Add each variable above
   - Make sure to set them for "Production" environment

4. **Redeploy**
   - After adding variables, trigger a new deployment
   - Or wait for automatic deployment

5. **Test**
   - Check https://mail.tauos.org/api/debug/smtp
   - Send a test email
   - Status should change from "database_only" to "sent"

## 🔍 Verification

After setting the environment variables, check:

1. **SMTP Debug Endpoint**: https://mail.tauos.org/api/debug/smtp
2. **Send a test email** and check if status is "sent"
3. **Check Mailtrap inbox**: https://mailtrap.io/inboxes

## 📧 Mailtrap Setup

If you need fresh Mailtrap credentials:

1. Go to https://mailtrap.io
2. Sign up/login
3. Create a new inbox
4. Go to SMTP Settings
5. Copy username and password
6. Update the environment variables above

## ✅ Expected Result

After setting the environment variables correctly:
- SMTP status should be "sent" instead of "database_only"
- Emails should appear in your Mailtrap inbox
- The debug endpoint should show SMTP as available 