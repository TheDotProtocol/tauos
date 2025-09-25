# Fix DNS Records for Email Receiving

## Current Issue
The SPF record is pointing to `mailserver.tauos.org` instead of SendGrid, which prevents emails from being routed through SendGrid's Inbound Parse.

## Required DNS Changes

### 1. Update SPF Record
**Current:** `v=spf1 mx a:mailserver.tauos.org ~all`
**Change to:** `v=spf1 include:sendgrid.net ~all`

### 2. Verify MX Record
**Current:** `tauos.org. 900 IN MX 10 mx.sendgrid.net.`
**Status:** ✅ Correct (already pointing to SendGrid)

### 3. Add DKIM Records (if not already present)
You may need to add DKIM records for SendGrid. Check your SendGrid dashboard for the specific DKIM records.

## Steps to Fix

1. **Log into your domain registrar (Squarespace/DNS provider)**
2. **Update the SPF record:**
   - Find the TXT record for `tauos.org`
   - Change from: `v=spf1 mx a:mailserver.tauos.org ~all`
   - Change to: `v=spf1 include:sendgrid.net ~all`

3. **Wait for DNS propagation (5-15 minutes)**

4. **Test email receiving:**
   ```bash
   # Test the webhook directly
   curl -X POST "https://tauos-47am.vercel.app/api/webhook/incoming-email" \
     -H "Content-Type: application/json" \
     -d '{"from": "test@gmail.com", "to": "saleena@tauos.org", "subject": "Test Email", "text": "This is a test email"}'
   ```

5. **Send a real email from Gmail to saleena@tauos.org**

## Verification Commands

```bash
# Check MX record
dig MX tauos.org

# Check SPF record
dig TXT tauos.org

# Test webhook
curl -X POST "https://tauos-47am.vercel.app/api/webhook/incoming-email" \
  -H "Content-Type: application/json" \
  -d '{"from": "test@gmail.com", "to": "saleena@tauos.org", "subject": "Test Email", "text": "This is a test email"}'
```

## Expected Result
After updating the SPF record, emails sent to `@tauos.org` addresses should be routed through SendGrid and forwarded to our webhook at `https://tauos-47am.vercel.app/api/webhook/incoming-email`.
