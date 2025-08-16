# Gmail SMTP Setup for Real Email Delivery

## 📧 Why Emails Aren't Reaching Gmail

Mailtrap is a **testing service** that captures emails but doesn't deliver them to real addresses. To send emails that actually reach Gmail, you need to use a real SMTP service.

## 🚀 Setup Gmail SMTP (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Gmail account settings
2. Enable 2-Factor Authentication (2FA)

### Step 2: Generate App Password
1. Go to Google Account settings
2. Navigate to "Security" → "2-Step Verification"
3. Click "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### Step 3: Update Vercel Environment Variables
Go to your Vercel dashboard and update these environment variables:

```
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16_character_app_password
```

**Remove or comment out the Mailtrap variables:**
```
# MAILTRAP_USER=e5b253ac8d7940
# MAILTRAP_PASS=dd6f3ec509aec7
```

### Step 4: Test Real Email Delivery
1. Send a test email from TauMail
2. Check your Gmail inbox
3. The email should arrive within a few minutes

## 🔧 Alternative: Use Your Own SMTP Server

If you have your own mail server (like the one at `mailserver.tauos.org`):

```
SMTP_USER=noreply@tauos.org
SMTP_PASS=your_actual_smtp_password
```

## 📋 Current Status

✅ **SMTP Configuration**: Working  
✅ **Email Sending**: Working  
✅ **Database Storage**: Working  
✅ **UUID IDs**: Working  
❌ **Real Email Delivery**: Needs Gmail SMTP setup  

## 🎯 Expected Result

After setting up Gmail SMTP:
- Emails will actually arrive in Gmail inbox
- No more "database_only" status
- Real email delivery to any email address

## 🔍 Verification

1. **Send test email** from TauMail
2. **Check Gmail inbox** (including spam folder)
3. **Check SMTP debug**: https://mail.tauos.org/api/debug/smtp
4. **Email status should be "sent"** in TauMail

## ⚠️ Important Notes

- **Gmail limits**: 500 emails/day for free accounts
- **App passwords**: More secure than regular passwords
- **Spam folder**: Check spam folder if emails don't appear
- **Domain reputation**: New domains might go to spam initially 