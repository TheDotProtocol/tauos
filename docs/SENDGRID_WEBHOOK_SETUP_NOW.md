# 🚀 SendGrid Webhook Setup - URGENT

## ⚠️ IMPORTANT: Before Testing Email Reception

To receive emails at `saleena@tauos.org`, you need to configure SendGrid webhook:

### 1. Go to SendGrid Dashboard
- Visit: https://app.sendgrid.com/
- Login with your SendGrid account

### 2. Configure Inbound Parse
- Go to **Settings** → **Mail Settings** → **Inbound Parse**
- Click **Add Host & URL**
- Fill in:
  - **Hostname:** `tauos.org` (or `mail.tauos.org`)
  - **URL:** `https://tauos.vercel.app/api/taumail/webhook/incoming`
  - **Spam Check:** ✅ Enabled
  - **Send Raw:** ✅ Enabled

### 3. DNS Configuration (CRITICAL)
Add these DNS records to your domain:

```
Type: MX
Name: @
Value: mx.sendgrid.net
Priority: 10
TTL: 3600
```

### 4. Test Email
Once DNS is configured (can take 5-60 minutes):
- Send email from Gmail to: `saleena@tauos.org`
- Subject: "Test Email from Gmail"
- Body: "This is a test email to verify TauOS Mail is working"

### 5. Check Webhook Logs
- Go to Vercel Dashboard → Your Project → Functions
- Check the webhook logs for incoming emails
- Or check: https://tauos.vercel.app/api/taumail/webhook/incoming

## 🔧 Alternative: Test with Webhook Directly

If you want to test immediately without DNS setup:

```bash
curl -X POST https://tauos.vercel.app/api/taumail/webhook/incoming \
  -H "Content-Type: application/json" \
  -d '{
    "from": "test@gmail.com",
    "to": "saleena@tauos.org",
    "subject": "Test Email from Gmail",
    "text": "This is a test email to verify TauOS Mail is working",
    "html": "<p>This is a test email to verify TauOS Mail is working</p>"
  }'
```

## 📧 Expected Result

If everything works, you should see:
- ✅ Webhook receives the email
- ✅ Email saved to database
- ✅ Email appears in TauMail inbox
- ✅ Response: `{"success": true, "message": "Email received and processed"}`

## 🚨 Current Status

- ✅ Webhook is active and ready
- ✅ Database schema is correct
- ⚠️ **DNS MX record needs to be configured**
- ⚠️ **SendGrid inbound parse needs to be set up**

**Go ahead and send the email from Gmail - it will help us test the system!**
