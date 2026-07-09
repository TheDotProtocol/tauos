# Tau Mail — Production Setup (Option A)

**Plan:** Vultr VPS as the public mail edge now. Phone (Termux) as dev/backup node next week.

**Scale:** 7 domains × ~5 mailboxes ≈ **35 users**, plus **Gmail/Yahoo/Outlook** deliverability required.

---

## Architecture

```
Internet (Gmail, etc.)
        │
        ▼
┌───────────────────────────────────────┐
│  Vultr VPS (always on)                │
│  • Postfix :25 receive, :587 send     │
│  • DKIM signing per domain            │
│  • Rspamd spam filter                 │
│  • Pipe inbound → Tau Mail API        │
└───────────────┬───────────────────────┘
                │ HTTPS POST
                ▼
┌───────────────────────────────────────┐
│  Vercel — www.tauos.org               │
│  /taumail UI + /api/taumail/*         │
└───────────────┬───────────────────────┘
                │
                ▼
┌───────────────────────────────────────┐
│  Supabase PostgreSQL                  │
│  users, incoming_emails, sent_emails  │
└───────────────────────────────────────┘

Next week (optional):
  Redmi Note 9 Pro + Termux → Tailscale → VPS admin / failover
```

**Web-only for now.** Dovecot/IMAP on VPS is Phase 2 if users need Apple Mail/Outlook desktop clients.

**SendGrid:** Keep as **fallback** for the first 2 weeks while SPF/DKIM/DMARC reputation builds. Set `SENDGRID_API_KEY` on Vercel; primary path is Vultr SMTP.

---

## Hosted domains

| Domain | MX host | Org |
|--------|---------|-----|
| `tauos.org` | `mail.tauos.org` | Tau Core Inc. |
| `taumail.com` | `mail.taumail.com` | Tau Mail |
| `thearholdings.group` | `mail.thearholdings.group` | AR Holdings Group |
| `estayshotels.com` | `mail.estayshotels.com` | eStays Hotels |
| `globaldotbank.com` | `mail.globaldotbank.com` | Global Dot Bank |
| `onenumbr.com` | `mail.onenumbr.com` | One Numbr |
| `kibouor.com` | `mail.kibouor.com` | Kibouor |

---

## Phase 1 — You do this (Vultr + DNS)

### Step 1 — Create Vultr account & VPS

1. Sign up at [vultr.com](https://www.vultr.com).
2. **Deploy → Cloud Compute → Regular**
   - **Location:** Mumbai (`bom`) or Singapore (`sgp`) — lowest latency from India
   - **OS:** Ubuntu 22.04 LTS
   - **Plan:** $12/mo (1 vCPU, 2 GB RAM) — comfortable for 35 mailboxes + Postfix
   - **Hostname:** `mail.tauos.org`
3. Add your **SSH key** (recommended) or note the root password.
4. Copy the **public IPv4** — call it `VULTR_IP` (example: `203.0.113.50`).

### Step 2 — Reverse DNS (PTR) — critical for Gmail

1. Vultr panel → **Server → Settings → IPv4 → Reverse DNS**
2. Set PTR to: **`mail.tauos.org`**
3. Without this, Gmail often rejects or spams your outbound mail.

### Step 3 — DNS for **each** of the 7 domains

Replace `VULTR_IP` with your server IP. Repeat at each domain registrar.

#### A record (per domain)

```
mail.tauos.org           A    VULTR_IP
mail.taumail.com         A    VULTR_IP
mail.thearholdings.group A    VULTR_IP
mail.estayshotels.com    A    VULTR_IP
mail.globaldotbank.com   A    VULTR_IP
mail.onenumbr.com        A    VULTR_IP
mail.kibouor.com         A    VULTR_IP
```

#### MX record (per domain)

```
tauos.org                MX   10 mail.tauos.org
taumail.com              MX   10 mail.taumail.com
thearholdings.group      MX   10 mail.thearholdings.group
estayshotels.com         MX   10 mail.estayshotels.com
globaldotbank.com        MX   10 mail.globaldotbank.com
onenumbr.com             MX   10 mail.onenumbr.com
kibouor.com              MX   10 mail.kibouor.com
```

#### SPF (one TXT per domain)

```
tauos.org                TXT  "v=spf1 ip4:VULTR_IP -all"
taumail.com              TXT  "v=spf1 ip4:VULTR_IP -all"
... (same pattern for all 7)
```

#### DMARC (one TXT per domain)

```
_dmarc.tauos.org         TXT  "v=DMARC1; p=quarantine; rua=mailto:postmaster@tauos.org"
... (repeat per domain, adjust rua address)
```

#### DKIM

Generated on the VPS during setup (one selector per domain, e.g. `default._domainkey.tauos.org`). Add TXT records after VPS install.

**DNS propagation:** 15 minutes to 48 hours. Verify with:

```bash
dig MX tauos.org +short
dig TXT tauos.org +short
dig -x VULTR_IP +short   # should return mail.tauos.org
```

### Step 4 — SSH into VPS & base hardening

```bash
ssh root@VULTR_IP

apt update && apt upgrade -y
apt install -y ufw fail2ban curl git

ufw allow OpenSSH
ufw allow 25/tcp
ufw allow 587/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### Step 5 — Install Postfix + inbound pipe to Tau Mail API

We will provide an updated multi-domain install script (`scripts/vultr-production-mail-setup.sh`) that:

- Accepts all 7 domains on port 25
- Relays outbound from Vercel on port 587 (authenticated)
- POSTs parsed inbound mail to `https://www.tauos.org/api/taumail/smtp/incoming`
- Signs outbound with DKIM per domain

**Until that script is ready**, use the existing `configure-postfix-inbound.sh` as reference only — it is single-domain and needs updating.

### Step 6 — TLS certificates

```bash
apt install -y certbot
certbot certonly --standalone -d mail.tauos.org
# Repeat or use SAN cert for all mail.* hostnames
```

### Step 7 — Vercel environment variables

In Vercel → Project → Settings → Environment Variables (Production):

```bash
DATABASE_URL=<your-supabase-url>
JWT_SECRET_TAUMAIL=<strong-secret>

MAIL_TRANSPORT=smtp
SMTP_HOST=VULTR_IP
SMTP_PORT=587
SMTP_USER=taumail-relay
SMTP_PASS=<relay-password-from-vps-setup>
SMTP_SECURE=false

# Fallback while reputation builds
SENDGRID_API_KEY=<optional>

NEXT_PUBLIC_APP_URL=https://www.tauos.org
```

Redeploy after saving.

### Step 8 — Seed organizations in Supabase

From your Mac (with `.env.local` pointing at Supabase):

```bash
npm run mail:setup
```

This creates one `organizations` row per domain so registration works.

### Step 9 — Create mailboxes (~5 per domain)

Two options:

**A — Self-service (recommended):** Users register at `/taumail` and pick their domain.

**B — Admin-created:** Insert rows in Supabase `users` or use register API for each address you need.

Suggested naming per org: `admin`, `hello`, `support`, `info`, plus one personal address each.

---

## Phase 2 — Testing checklist

Run these **before** inviting all 35 users.

| # | Test | Pass criteria |
|---|------|---------------|
| 1 | DNS MX | `dig MX tauos.org` → `mail.tauos.org` |
| 2 | PTR | Reverse DNS = `mail.tauos.org` |
| 3 | Register | Create `test@tauos.org` on `/taumail` |
| 4 | Internal send | `test@tauos.org` → `hello@taumail.com` appears in inbox |
| 5 | Outbound external | Send to your personal Gmail — arrives in Inbox (not Spam) |
| 6 | Inbound external | Reply from Gmail — appears in Tau Mail inbox within 1 min |
| 7 | All 7 domains | Repeat 4–6 for one address on each domain |
| 8 | API health | `GET /api/taumail/server/status` → `ok: true`, transport `smtp` |
| 9 | Spam filter | Send obvious spam test → lands in Spam folder |
| 10 | Load | 5 users send simultaneously — no queue backlog |

**Deliverability tips for Gmail:**

- Start with low volume (5–10 msgs/day) for 3–5 days
- Ensure SPF + DKIM + DMARC all pass ([mail-tester.com](https://www.mail-tester.com))
- Do not send bulk/marketing from the same IP initially

---

## Phase 3 — Local dev tests (Mac, today)

No Vultr required for UI/backend loop testing:

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run mail:server

# Terminal 3
npm run mail:setup
```

- **Preview UI:** `/taumail` → Preview email UI (demo@tauos.org)
- **Real register:** Create account if Supabase is reachable
- **Local relay:** Send between `@tauos.org` and `@taumail.com` addresses on localhost

---

## Phase 4 — Phone backup (next week)

**Do not point public MX to the phone.** Use it as:

1. **Tailscale node** — secure SSH/admin to Vultr from anywhere
2. **Monitoring** — simple cron hitting `/api/taumail/server/status`
3. **Optional warm standby** — if VPS down, manually flip MX (emergency only)

### Termux prep (Redmi Note 9 Pro)

```bash
pkg update && pkg upgrade -y
pkg install nodejs git openssh
```

Copy `scripts/phone-mail-server/` to the phone, set `.env`:

```bash
PHONE_SMTP_PORT=2525
NEXT_APP_URL=https://www.tauos.org
```

Run with Termux:Boot + `termux-wake-lock` if you want it to stay alive on charger.

Full phone runbook will be added in Session 3 after Vultr is live.

---

## What to send us when Vultr is ready

So we can finish the install script and go live:

1. **VULTR_IP** (public IPv4)
2. **SSH access** — your public key added, or confirm you’ll run scripts yourself
3. **Confirmation** DNS A + MX added for at least `tauos.org` first (pilot domain)
4. **List of first 5 pilot mailboxes** (e.g. `admin@tauos.org`, `hello@tauos.org`, …)
5. **SendGrid key** — yes/no for fallback

---

## Timeline suggestion

| Week | Focus |
|------|--------|
| **This week** | Vultr account + VPS + DNS for `tauos.org` + `taumail.com` pilot |
| **This week** | We ship updated multi-domain Vultr script + Vercel env |
| **Next week** | Roll remaining 5 domains + all 35 mailboxes |
| **Next week** | Phone Termux backup + monitoring |
| **Ongoing** | UI overhaul on demo preview while mail stabilizes |

---

## Cost summary

| Item | Cost |
|------|------|
| Vultr VPS (2 GB) | ~$12/mo |
| Vercel | existing |
| Supabase | existing |
| SendGrid free tier | $0 (fallback) |
| Phone | $0 (backup only) |
| **Total new** | **~$12/mo** |

---

## Next implementation (code — after you confirm Vultr IP)

1. `scripts/vultr-production-mail-setup.sh` — 7-domain Postfix + DKIM + API pipe
2. Vercel production env update
3. Remove stale single-domain references in old scripts
4. Phone Termux guide (Session 3)

**Your action now:** Create the Vultr VPS, set PTR, add DNS for `tauos.org`, reply with `VULTR_IP`.
