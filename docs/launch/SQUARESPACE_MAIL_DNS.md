# Squarespace DNS — Tau Mail (12 domains)

Mail server IP: **149.28.156.7**

Generate full checklist:

```bash
VULTR_MAIL_IP=149.28.156.7 npm run mail:dns-checklist
```

## Per domain (repeat in Squarespace → Settings → Domains → DNS)

For each domain below, add:

| Type | Host | Value |
|------|------|--------|
| A | `mail` | `149.28.156.7` |
| MX | `@` | `mail.YOURDOMAIN.com` (priority **10**) |
| TXT | `@` | `v=spf1 ip4:149.28.156.7 include:sendgrid.net ~all` |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@YOURDOMAIN.com` |

MX host per domain:

- `mail.tauos.org`
- `mail.taumail.org`
- `mail.thearholdings.group`
- `mail.estayshotels.com`
- `mail.globaldotbank.com`
- `mail.onenumbr.com`
- `mail.kibouor.com`
- `mail.tauphones.com`
- `mail.easaanfoundation.com`
- `mail.projectgrayscale.com`
- `mail.thedotprotocol.com`
- `mail.asktrabaajo.com`

DKIM: add `default._domainkey` TXT after OpenDKIM keys are generated on the Vultr mail host.

## Website (taumail.org — Vercel)

Add these in Squarespace DNS for **taumail.org** (separate from mail records above):

| Type | Host | Value |
|------|------|--------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |
| CNAME | `workspace` | `cname.vercel-dns.com` |

Then add **taumail.org**, **www.taumail.org**, and **workspace.taumail.org** as domains in the Vercel project (same as tauos.org).

## Vultr (once)

Reverse DNS for `149.28.156.7` → `mail.tauos.org`

## Verify

```bash
dig MX thearholdings.group +short
dig A mail.thearholdings.group +short
```

Login test: https://taumail.org — any provisioned email + password from secure handoff.
