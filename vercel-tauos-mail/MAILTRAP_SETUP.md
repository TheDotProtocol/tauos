# Mailtrap Setup Guide

## 🔧 Fix SMTP Email Sending

The email sending is failing because the Mailtrap credentials are invalid. Here's how to fix it:

### Step 1: Get Fresh Mailtrap Credentials

1. Go to [Mailtrap.io](https://mailtrap.io) and sign up/login
2. Create a new inbox or use an existing one
3. Go to the inbox settings
4. Click on "SMTP Settings"
5. Select "Show Credentials"
6. Copy the username and password

### Step 2: Update Environment Variables

Add these to your Vercel environment variables:

```
MAILTRAP_USER=your_new_mailtrap_username
MAILTRAP_PASS=your_new_mailtrap_password
```

### Step 3: Alternative - Use Gmail SMTP

If you prefer to use Gmail SMTP instead:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Update these environment variables:

```
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password
```

### Step 4: Test Email Sending

After updating the credentials, the email sending should work. You can view test emails in your Mailtrap inbox.

### Current Status

- ✅ Database connection working
- ✅ User authentication working  
- ✅ Email storage working
- ❌ SMTP sending failing (credentials issue)

### Temporary Workaround

The system will now store emails in the database even when SMTP fails, so internal emails between registered users will work. 