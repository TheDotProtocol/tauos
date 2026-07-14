# Tau Mail deliverability (Gmail / external)

## Why "sent successfully" but not in Gmail inbox?

Tau Mail shows **sent** when our SMTP server **accepts** the message for delivery. Gmail may still **reject**, **delay**, or **spam-filter** it afterward.

## Current DNS (tauos.org)

| Record | Status |
|--------|--------|
| SPF | `v=spf1 include:sendgrid.net ip4:149.28.156.7 ~all` ✓ |
| MX | `mail.tauos.org` ✓ |
| DMARC | `p=none` (monitoring only) |
| DKIM | **Missing or not published** — likely cause of Gmail issues |

## Fix for Gmail delivery (Vultr + Vercel)

1. **Generate DKIM on mail server** (Postfix/OpenDKIM on `149.28.156.7`):
   ```bash
   # On Vultr mail host — publish TXT at mail._domainkey.tauos.org
   ```

2. **Set Vercel env** (align envelope sender):
   ```
   SMTP_ENVELOPE_FROM=relay@mail.tauos.org
   MAIL_FROM=relay@mail.tauos.org
   ```
   Keep user `From:` as `user@tauos.org` — DKIM must sign for tauos.org.

3. **Tighten DMARC** after DKIM works:
   ```
   v=DMARC1; p=quarantine; rua=mailto:dmarc@tauos.org
   ```

4. **Alternative (fastest):** Route outbound via **SendGrid** (already in SPF):
   ```
   MAIL_TRANSPORT=sendgrid
   SENDGRID_API_KEY=...
   ```
   Verify sender domain in SendGrid dashboard.

## User checks

- Gmail **Spam** folder
- Gmail **All Mail**
- Wait 5–10 minutes (greylisting)

## Verify

```bash
npm run mail:smoke -- --base=https://www.tauos.org --to=YOUR@gmail.com
```

Check message headers in Gmail → Show original → look for `spf=pass`, `dkim=pass`.
