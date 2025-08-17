# 🚀 Quick SMTP Fix - Use IP Address

## **Current Issue:**
- SMTP server is working perfectly on `34.30.189.200:587`
- DNS `mailserver.tauos.org` not resolving (NXDOMAIN)
- TauMail showing "database_only" status

## **Quick Fix - Update Vercel Environment Variables:**

### **Step 1: Go to Vercel Dashboard**
1. Visit: https://vercel.com/dashboard
2. Select your TauMail project
3. Go to **Settings** → **Environment Variables**

### **Step 2: Update SMTP Configuration**
Replace these environment variables:

```
SMTP_HOST=34.30.189.200
SMTP_PORT=587
SMTP_USER=noreply@tauos.org
SMTP_PASS=your_actual_password_here
```

### **Step 3: Redeploy**
1. Click **Redeploy** button
2. Wait for deployment to complete

### **Step 4: Test Email Sending**
1. Go to: https://mail.tauos.org/dashboard
2. Send a test email
3. Check if status changes from "database_only" to "sent"

## **Expected Result:**
- ✅ Real email delivery via our sovereign SMTP server
- ✅ Status should show "sent" instead of "database_only"
- ✅ Emails actually delivered to recipients

## **Later: Fix DNS Issue**
Once email delivery is working, we can:
1. Fix the DNS record for `mailserver.tauos.org`
2. Switch back to using the domain name
3. Remove this temporary IP-based configuration

---

**The SMTP server is ready - let's connect it!** 🔥 