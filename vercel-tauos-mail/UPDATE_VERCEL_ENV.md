# 🔄 Update Vercel Environment Variables

## **DNS Records Are Now in Place!**
✅ MX Record: `tauos.org MX 10 mailserver.tauos.org`  
✅ A Record: `mailserver.tauos.org A 34.30.189.200`  
✅ SPF Record: `v=spf1 mx a:mailserver.tauos.org ~all`  

## **Update Vercel Environment Variables:**

### **Step 1: Go to Vercel Dashboard**
1. Visit: https://vercel.com/dashboard
2. Select your **TauMail project**
3. Go to **Settings** → **Environment Variables**

### **Step 2: Update SMTP Configuration**
Change from IP address to domain name:

**OLD (IP Address):**
```
SMTP_HOST=34.30.189.200
SMTP_PORT=587
SMTP_USER=noreply@tauos.org
SMTP_PASS=TauOS2024!Secure
```

**NEW (Domain Name):**
```
SMTP_HOST=mailserver.tauos.org
SMTP_PORT=587
SMTP_USER=noreply@tauos.org
SMTP_PASS=TauOS2024!Secure
```

### **Step 3: Redeploy**
1. Click **Redeploy** button
2. Wait for deployment to complete

### **Step 4: Test Email Delivery**
1. Go to: https://mail.tauos.org/dashboard
2. Send a test email to Gmail
3. Check if email appears in Gmail inbox

## **Expected Result:**
- ✅ DNS propagation should complete within 15-30 minutes
- ✅ Gmail should accept emails from `@tauos.org` domain
- ✅ Emails should appear in inbox instead of being rejected
- ✅ Your sovereign email infrastructure will be fully functional

## **If Still Not Working:**
Run this command on your SSH session to test DNS propagation:
```bash
dig +short @8.8.8.8 tauos.org MX
dig +short @8.8.8.8 mailserver.tauos.org A
```

---

**DNS records are ready - let's switch to domain name!** 🚀 