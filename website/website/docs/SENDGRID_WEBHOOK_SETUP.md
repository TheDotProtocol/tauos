# SendGrid Webhook Setup for TauOS Mail

## Overview
This guide explains how to configure SendGrid webhooks to handle incoming emails for TauOS Mail.

## Webhook Configuration

### 1. Webhook URL
```
https://tauos.vercel.app/api/taumail/webhook/incoming
```

### 2. SendGrid Dashboard Setup
1. Go to [SendGrid Dashboard](https://app.sendgrid.com/)
2. Navigate to **Settings** → **Mail Settings** → **Inbound Parse**
3. Click **Add Host & URL**
4. Configure the following:

**Hostname:** `mail.tauos.org` (or your domain)
**URL:** `https://tauos.vercel.app/api/taumail/webhook/incoming`
**Spam Check:** ✅ Enabled
**Send Raw:** ✅ Enabled

### 3. DNS Configuration
Add these DNS records to your domain:

**MX Record:**
```
Type: MX
Name: @
Value: mx.sendgrid.net
Priority: 10
TTL: 3600
```

**CNAME Record:**
```
Type: CNAME
Name: mail.tauos.org
Value: mx.sendgrid.net
TTL: 3600
```

### 4. Webhook Event Configuration
In SendGrid Dashboard → **Settings** → **Webhooks** → **Event Webhook**:

**HTTP POST URL:** `https://tauos.vercel.app/api/taumail/webhook/incoming`
**Events to Send:**
- ✅ Delivered
- ✅ Processed
- ✅ Inbound Parse

### 5. Testing the Webhook

#### Test with curl:
```bash
curl -X POST https://tauos.vercel.app/api/taumail/webhook/incoming \
  -H "Content-Type: application/json" \
  -d '{
    "from": "test@example.com",
    "to": "saleena@tauos.org",
    "subject": "Test Email",
    "text": "This is a test email",
    "html": "<p>This is a test email</p>"
  }'
```

#### Test with SendGrid:
1. Send a test email to `saleena@tauos.org` from any external email
2. Check the webhook logs in Vercel dashboard
3. Verify the email appears in TauMail inbox

## Database Schema
The webhook expects the following table structure:

```sql
CREATE TABLE incoming_emails (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  from_email TEXT NOT NULL,
  sender_name TEXT,
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_spam BOOLEAN DEFAULT FALSE,
  headers JSONB,
  attachments JSONB
);
```

## Environment Variables Required
```bash
DATABASE_URL=postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405_HIDDEN@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require
SENDGRID_API_KEY=SG.YOUR_SENDGRID_API_KEY_HERE.e6ZWQceUGnGkI9C9xQu4zmd0NbI5Zh1WZiG7a3phM6I
```

## Troubleshooting

### Common Issues:
1. **Webhook not receiving emails**: Check DNS MX records
2. **Database errors**: Verify user exists in database
3. **Authentication errors**: Check SendGrid API key
4. **CORS issues**: Ensure webhook URL is correct

### Debug Commands:
```bash
# Check webhook status
curl https://tauos.vercel.app/api/taumail/webhook/incoming

# Test email sending
curl -X POST https://tauos.vercel.app/api/taumail/emails/send \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test",
    "body": "Test email"
  }'
```

## Security Notes
- The webhook validates user existence before saving emails
- Basic spam detection is implemented
- All email data is sanitized before database insertion
- JWT tokens are required for sending emails

## Next Steps
1. Configure DNS records
2. Set up SendGrid webhook
3. Test with real emails
4. Monitor webhook logs
5. Implement advanced spam filtering if needed
