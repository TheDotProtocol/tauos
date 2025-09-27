# SendGrid Setup Guide for TauOS Mail

## 🎯 **Current Status:**
- ✅ **Email Sending**: Configured to use SendGrid SMTP
- ✅ **Database**: Ready for incoming emails
- ✅ **Webhook**: Created for receiving emails
- ❌ **API Key**: Missing - needs to be configured

## 🔧 **Setup Steps:**

### **1. Get SendGrid API Key:**
1. Go to [SendGrid Dashboard](https://app.sendgrid.com/)
2. Navigate to **Settings** → **API Keys**
3. Click **Create API Key**
4. Choose **Full Access** permissions
5. Copy the generated API key

### **2. Set Environment Variables:**
Create a `.env.local` file in the `website/` directory with:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SMTP_PASS=your_sendgrid_api_key_here

# Database Configuration  
DATABASE_URL=postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405_HIDDEN@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable

# JWT Secret
JWT_SECRET=tauos-secret-key-change-in-production

# Node Environment
NODE_ENV=development
```

### **3. Configure SendGrid Webhook (for incoming emails):**
1. Go to **Settings** → **Mail Settings** → **Inbound Parse**
2. Click **Add Host & URL**
3. Set **Hostname**: `mail.tauos.org` (or your domain)
4. Set **URL**: `https://www.tauos.org/api/taumail/webhook/incoming`
5. Set **Spam Check**: Enabled
6. Click **Add**

### **4. Test Email Sending:**
```bash
# Test login
curl -X POST http://localhost:3000/api/taumail/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "saleena@tauos.org", "password": "Saleena@132"}'

# Test email sending (replace TOKEN with actual token)
curl -X POST http://localhost:3000/api/taumail/emails/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email from TauOS Mail",
    "body": "This is a test email sent via SendGrid!"
  }'
```

### **5. Test Incoming Emails:**
Send an email to `saleena@tauos.org` and it should appear in the inbox.

## 🚀 **What's Working:**
- ✅ **SendGrid SMTP**: Configured for sending emails
- ✅ **Database Schema**: Ready for incoming emails
- ✅ **Webhook Endpoint**: `/api/taumail/webhook/incoming`
- ✅ **Email Parsing**: Handles headers, attachments, spam detection
- ✅ **User Authentication**: Login system working

## 📧 **Email Flow:**
1. **Sending**: User composes → SendGrid SMTP → Delivered
2. **Receiving**: External email → SendGrid webhook → Database → Inbox

## 🔍 **Troubleshooting:**
- **"Missing credentials"**: Check SENDGRID_API_KEY in .env.local
- **"User not found"**: Check database user exists
- **"Webhook not receiving"**: Check SendGrid inbound parse settings

## 📞 **Support:**
If you need help with SendGrid configuration, let me know!
