# TauOS — Launch Readiness Sheet

**Date:** June 15, 2026  
**Purpose:** Full inventory of what exists, what each product needs for real-world use, backend requirements, and cross-platform strategy.  
**Launch bar:** Nothing ships until it passes a real test — boot, send/receive, signup, download, install.

**Governance footer (canonical):**  
© 2026 Tau Foundation and Tau LLC, a Unit of AR Holdings Group Corporation, All Rights Reserved.  
Legal/compliance pages: © 2026 Tau Foundation & Tau LLC

---

## Strategic model

TauOS is **four layers** plus **cross-platform apps**:

| Layer | Role |
|-------|------|
| **Tau Core OS** | Bootable privacy-first desktop (Linux-based) |
| **Cloud platform** | Auth, APIs, web apps on Vercel + Supabase |
| **Cross-platform apps** | Mail, Cloud, Messenger, Browser — **usable on Windows, macOS, Linux, iOS, Android**, not only Tau Core |
| **Developer platform** | Tau Forge (custom Forgejo), TauStudio (VSCodium fork), TauScript toolchain, agents (local + TauAI) |

**Cross-platform rule:** Every user-facing app ships as **Web (PWA) + Desktop (Electron/Tauri) + Mobile (React Native)** against the **same backend API**. Tau Core pre-installs them; other OS users download installers or use the web.

---

## Master inventory

| Product | Code location | Stack | Est. ready | What works today | What's missing for real-world | Backend status |
|---------|---------------|-------|------------|------------------|-------------------------------|----------------|
| **Marketing website** | `website-replit/` (canonical UI), `src/app/` (Next.js app) | Vite/React, Next.js 14 | **70%** | Replit redesign, sub-pages, legal HTML, docs viewer, copyright 2026 | Single deploy root; dedupe `website/` tree; Vercel `rootDirectory` fix | Static + Next on Vercel |
| **Tau Core Desktop (OS)** | `core/`, `kernel-build/`, `scripts/build-tauos*.sh`, `release-files/` | Rust daemons, Linux 6.14, Docker build | **55%** | ISO ~400MB, QEMU live boot, core services, validation scripts | Install-to-disk proof; OTA; apps baked in image; full GTK session | N/A (local OS) |
| **Tau Desktop UI (shell)** | `src/tau-home/`, `public/desktop-ui/`, `gui/`, `apps/desktop-ui/` | Rust GTK4, HTML/JS shell, Python server | **45%** | HTML desktop mock (~1700 LOC), GTK launcher, app grid | Native apps mostly open URLs; not unified session | `src/app/api/desktop/*` (catalog) |
| **Tau Mail** | `src/app/taumail/`, `apps/taumail/backend/`, `tauos-mobile/TauMailMobile/` | Next.js, Express, React Native, PostgreSQL | **65%** | Full web UI (inbox, compose, sent, spam); PG inbox/send; JWT; SendGrid outbound | Inbound mail path; remove hardcoded DB fallbacks; cross-platform Electron build; rotate leaked secrets | **Partial live:** `src/app/api/taumail/*` + Express backend |
| **Tau Cloud** | `src/app/taucloud/`, `apps/taucloud/backend/`, `tauos-mobile/TauCloudMobile/` | Next.js, Express, RN, PG + local FS | **55%** | Login, upload, list, quota checks, share page | S3/Supabase Storage (not local disk on Vercel); delete/sync; E2E encryption story | **Partial:** `src/app/api/taucloud/*`; files on local path in serverless |
| **Tau ID** | `src/app/tauid/`, `apps/tauid/backend/` | Next.js, Express, bcrypt, JWT | **60%** | Register/login, dashboard | SSO wired across all apps; OAuth2/OIDC for Forge + Studio | **Live shape:** `src/app/api/tauid/auth/*` |
| **Tau Store** | `src/app/taustore/`, `apps/taustore/`, `src/tau-store/` | Next.js, Express, Rust stub | **40%** | Store UI, featured API shape | Search API returns **mock apps**; no real install/publish flow | **Mock** in main Next routes |
| **Tau Browser** | `src/tau-browser/`, `src/app/taubrowser/`, `apps/taubrowser/backend/` | Rust GTK + WebKit, Next.js, Express | **35%** | Native WebView shell, web dashboard | Backend **mock**; no sync/history; no Electron download | **Mock** Express backend |
| **Tau AI** | `src/app/tauai/`, `tauai-core/` | Next.js, Express, rule-based NLP | **25%** | Chat UI, keyword replies, voice stub | Real LLM (local + cloud TauAI); not pattern-matching only | **Demo** — no model inference |
| **Tau Mobile (OS + apps)** | `tauos-mobile/`, `mobileosui/`, `src/app/mobile/` | React Native 0.72, HTML mocks | **30%** | RN structure, sub-apps, QEMU scripts | Mobile OS not shippable; inbox uses **mock data** | Catalog API only |
| **Tau Meet / TauConnect** | `tauconnect/clients/tauos/`, `tauconnect/docker-compose.yml` | Rust GTK stub, Docker compose | **10%** | Client entrypoint, compose spec | **No server code** (signaling/media missing) | **Scaffold only** |
| **Tau Messenger** | Docs/marketing only | — | **5%** | Mentioned in docs, mock store entry | **No codebase** — WhatsApp/Telegram clone not built | **None** |
| **Tau Calendar** | Docs + mock store | — | **5%** | Marketing references | No app or API | **None** |
| **TauMedia** | `apps/taumedia/src/main.rs` | Rust GTK + GStreamer | **50%** | Local media player | Not in store/desktop launcher | Local only |
| **Developer Portal (Tau Forge UI)** | `developerhub/frontend/` | Next.js 15, PG, Redis, Docker | **55%** | Dashboard, Git UI, CI UI, terminal, IDE UI, installer | Git/CI not real remotes; auth incomplete in prod | APIs exist; UI-first |
| **TauStudio IDE** | `developerhub/frontend/src/app/ide/` | Next.js UI | **25%** | Tabs, terminal panel, sample `.tau` | No LSP, no VSCodium fork yet | Terminal API only |
| **TauScript** | `developerhub/tauscript/` (Rust), `developerhub/frontend/src/lib/tauscript/` (TS) | Rust CLI + TS evaluator | **45%** | REPL, run, examples, stdlib `.tau` files | Native compiler shippable binary; `tau publish` | Portal terminal route |
| **Tau Forge (Git hosting)** | Planned — custom Forgejo fork | Go (Forgejo upstream) | **0%** | Decision locked | Fork, brand, deploy, SSO, TauPkg registry | Not started |
| **Electron installer / USB** | `os-code/installer-scripts/`, `installer/install.sh` | Electron, electron-builder | **50%** | Win/Mac/Linux scripts, app wrappers in `apps/*` | Fresh ISO pipeline; signed installers | Local Electron |
| **SDK / TauPkg** | `sdk/`, `pkgmgr/`, `tools/sdk/cli/tau/` | Rust CLI | **40%** | Publish commands | Wired to TauStore production | CLI local |

---

## Backend architecture (current vs target)

### Current (fragmented)

```
┌─────────────────────────────────────────────────────────────┐
│  Vercel — root Next.js (src/app)                            │
│    /api/taumail, /api/taucloud, /api/tauid, /api/tauai…     │
│    → Supabase PostgreSQL (when env set)                     │
│    → SendGrid (outbound mail)                               │
│    → Hardcoded fallbacks in some routes ⚠️                  │
├─────────────────────────────────────────────────────────────┤
│  Duplicate Express backends — apps/*/backend/               │
│    (separate Vercel subprojects — mostly redundant)         │
├─────────────────────────────────────────────────────────────┤
│  developerhub — Redis + PG + Docker sandbox                 │
├─────────────────────────────────────────────────────────────┤
│  tauai-core — standalone Express (rules, not LLM)           │
└─────────────────────────────────────────────────────────────┘
```

### Target (single backend plane)

```
┌─────────────────────────────────────────────────────────────┐
│  api.tauos.org (or tauos.org/api)                           │
│    Auth (Tau ID) — JWT + refresh, SSO for all apps          │
│    Mail service — SendGrid + inbound webhook                │
│    Cloud service — Supabase Storage / S3, signed URLs       │
│    Store service — real catalog DB                          │
│    Messenger service — Matrix or custom (Phase 2)           │
│    AI gateway — local agent config + TauAI cloud opt-in       │
├─────────────────────────────────────────────────────────────┤
│  Supabase PostgreSQL — users, mail metadata, files meta    │
│  Supabase Storage / S3 — blob storage                       │
│  Upstash Redis — sessions, rate limits                      │
│  SendGrid / Resend — transactional + inbound parse          │
├─────────────────────────────────────────────────────────────┤
│  developer.tauos.org — Custom Forgejo + CI runners          │
└─────────────────────────────────────────────────────────────┘
```

### Backend must-do (before “real world”)

| # | Task | Blocks |
|---|------|--------|
| 1 | Remove all hardcoded DB/JWT secrets from repo; env-only | Security / investor due diligence |
| 2 | Supabase migrations applied; schema matches every API route | Mail, Cloud, ID |
| 3 | Upstash Redis for sessions | Auth persistence on Vercel |
| 4 | Mail: outbound + inbound (SendGrid Inbound Parse or new VPS SMTP) | Tau Mail real use |
| 5 | Cloud: move uploads off local FS → Supabase Storage or S3 | Tau Cloud on serverless |
| 6 | Tau ID as central auth; same JWT across mail/cloud/store/portal | Cross-app login |
| 7 | `/api/health` + monitoring | Ops credibility |
| 8 | DNS: MX, SPF, DKIM, DMARC for `@tauos.org` | Mail deliverability |

---

## Cross-platform delivery matrix

Every major app should ship on **all columns**; Tau Core column = preinstalled.

| App | Web (any OS browser) | Windows | macOS | Linux | iOS | Android | Tau Core preinstall |
|-----|-------------------|---------|-------|-------|-----|---------|---------------------|
| **Tau Mail** | `tauos.org/taumail` ✅ | Electron `os-code/.../taumail` 🔧 | Electron 🔧 | .AppImage/deb 🔧 | RN app 🔧 | RN app 🔧 | Phase 1.5 |
| **Tau Cloud** | `tauos.org/taucloud` ✅ | Electron 🔧 | Electron 🔧 | deb 🔧 | RN 🔧 | RN 🔧 | Phase 1.5 |
| **Tau Messenger** | Not built ❌ | Not built ❌ | Not built ❌ | Not built ❌ | Not built ❌ | Not built ❌ | Future |
| **Tau Browser** | Web dashboard only | Electron/Tauri 📋 | .dmg 📋 | .deb 📋 | — | — | Optional |
| **Tau ID** | `tauos.org/tauid` ✅ | PWA 🔧 | PWA 🔧 | PWA 🔧 | RN 🔧 | RN 🔧 | Yes |
| **TauStudio** | Playground/demo | VSCodium fork 📋 | .dmg 📋 | .AppImage 📋 | — | — | Bundled later |

Legend: ✅ exists · 🔧 code exists, needs packaging/test · 📋 planned · ❌ not started

**Fastest cross-platform path for EOD-adjacent launch:**  
1. **PWA** — mail/cloud/id work in Chrome/Safari/Firefox today via web routes  
2. **Electron rebuild** — `os-code/installer-scripts/apps/{taumail,taucloud,...}` wrap same URLs or API  
3. **Mobile** — RN apps point to production API (after backend fixed)

---

## Product-by-product: path to real-world ready

### 1. Marketing website (`website-replit`)
- **Have:** Full redesign, legal pages, docs, developers, tauscript, copyright 2026
- **Need:** Deploy to Vercel; fix project root; all links 200; download page with real artifact links
- **EOD:** ✅ Deployable

### 2. Tau Core OS
- **Have:** ISO in `release-files/`, QEMU boot
- **Need:** Install-to-disk test; honest system requirements; signed checksum on GitHub Releases
- **EOD:** ⚠️ Offer ISO download if checksum verified; label Beta

### 3. Tau Mail
- **Have:** UI + API + SendGrid outbound
- **Need:** Inbound mail; env secrets; E2E test send/receive; PWA manifest; Electron wrapper build
- **EOD:** ⚠️ Web live if Vercel env + DNS configured; desktop installer = next sprint

### 4. Tau Cloud
- **Have:** UI + upload/list
- **Need:** Cloud storage backend (not local FS); delete/download; quota in DB
- **EOD:** ⚠️ Web MVP if storage migrated to Supabase Storage

### 5. Tau ID
- **Have:** Register/login
- **Need:** SSO token shared with mail/cloud; password reset; session via Redis
- **EOD:** ✅ Web auth if Supabase + Redis live

### 6. Tau Store
- **Have:** UI + mock catalog
- **Need:** Real DB catalog; 10 curated apps; install deep-links
- **EOD:** ❌ Not credible for launch — hide or label Preview

### 7. Tau Browser
- **Have:** GTK shell + mock backend
- **Need:** Electron v1 with tracker block + Tau start page
- **EOD:** ❌ Not EOD — Phase 4

### 8. Tau AI
- **Have:** Rule-based chat
- **Need:** Local model path + TauAI cloud toggle; honest marketing copy
- **EOD:** ⚠️ Ship as “Assistant Preview” or wire to API

### 9. Tau Mobile OS
- **Have:** RN apps, mocks
- **Need:** Real API integration; app store builds
- **EOD:** ❌ Not EOD

### 10. Tau Messenger / Meet
- **Have:** Docs + docker-compose without servers
- **Need:** Full greenfield — recommend Matrix/Signal-protocol fork or build on existing stack
- **EOD:** ❌ Not EOD — major project (2–4 weeks minimum for MVP)

### 11. Developer Portal + TauStudio + TauScript
- **Have:** UI demos, TS interpreter, Rust CLI prototype
- **Need:** Custom Forgejo deploy; VSCodium fork; shippable `tauscript` binary; agent extension
- **EOD:** ❌ Portal demo only; binaries not EOD

---

## Documentation vs reality ⚠️

These docs **overstate** completion — do not cite to investors until code matches:

| Doc | Claims | Reality |
|-----|--------|---------|
| `docs/INTEGRATION_STATUS.md` | TauMessenger, TauCalendar, TauConnect complete | **No messenger/calendar code** |
| `docs/projectcompletion.md` | Full communication suite | Mostly UI + APIs for mail only |
| `PRODUCTION_READY_STATUS.md` | 80% production ready | Accurate for dev hub; not whole platform |

---

## End-of-day launch tiers (June 15, 2026)

Full platform go-live in one day is **not feasible** for messenger, Forgejo, VSCodium, and mobile OS. Use **tiers**:

### Tier 1 — Ship tonight (credibility foundation)

| Item | Action | Verify |
|------|--------|--------|
| Website | Deploy `website-replit` + Next app routes; fix Vercel config | Every nav/footer link 200 |
| Legal | © 2026 footers (done) | Manual check |
| Downloads page | ISO + honest Beta labels + checksums | File downloads |
| Tau ID | Supabase + Redis + register/login | New user can sign up |
| Tau Mail | Outbound send works; inbound via SendGrid parse OR “send only” Beta | Send test email |
| Docs | `/docs`, API reference, tauscript pages | All load |

### Tier 2 — This week (usable cross-platform)

| Item | Action |
|------|--------|
| Tau Cloud | Supabase Storage migration |
| Mail inbound | SendGrid Inbound Parse or Hetzner SMTP |
| Electron apps | Build taumail + taucloud wrappers for Win/Mac/Linux |
| Secrets | Rotate all leaked credentials |
| Tau Store | Replace mock search with 10 real entries |
| PWA | Manifest + service worker for mail/cloud |

### Tier 3 — Before investor-grade “full platform” demo

| Item | Action |
|------|--------|
| Tau Forge | Custom Forgejo fork deployed |
| TauStudio | VSCodium fork + TauScript extension + downloads |
| TauScript CLI | Shippable binary in GitHub Releases |
| Agents | Local + TauAI in TauStudio |
| Tau Messenger | MVP (Matrix bridge or custom E2E chat) |
| OS | Install-to-disk proven on bare metal |
| Mobile | RN apps in TestFlight/Play Internal Testing |

---

## Structured execution plan — today (ordered)

```
09:00–10:00  BACKEND GATE
             • vercel env pull; confirm Supabase + SendGrid + Upstash
             • Run supabase db push / verify tables
             • Remove hardcoded secrets from API routes (grep audit)
             • /api/health green locally + production

10:00–11:30  AUTH + MAIL
             • Tau ID register/login E2E
             • Tau Mail send via SendGrid
             • Document inbound status (working or “Beta: outbound only”)

11:30–13:00  WEBSITE DEPLOY
             • Merge website-replit into deploy path OR two Vercel projects
             • Fix rootDirectory; deploy; smoke test all routes

13:00–14:30  DOWNLOADS HUB
             • /download page: ISO, checksum, system requirements
             • Placeholder sections for TauStudio/TauScript with “Week 1” if not binary-ready

14:30–16:00  CLOUD MVP
             • If storage migration too long: label Tau Cloud “Preview” and hide upload OR
               complete Supabase Storage wiring

16:00–17:30  CROSS-PLATFORM
             • Confirm mail/cloud usable in Chrome on Windows + Mac (web = cross-platform v1)
             • PWA meta tags + install prompts

17:30–19:00  QA + LAUNCH GATE
             • New user journey: land → signup → mail → download ISO
             • Fix 404s; update README; tag release
             • Only push to GitHub/Vercel when Tier 1 checklist passes
```

---

## Launch gate checklist (print and check)

```
TIER 1 — REQUIRED TO PUSH LIVE
[ ] Website live at tauos.org — all pages load
[ ] © 2026 Tau Foundation footers correct
[ ] User can register and log in (Tau ID)
[ ] User can send email (Tau Mail outbound)
[ ] ISO download works with SHA256 checksum
[ ] No secrets in git; all env in Vercel
[ ] /api/health returns OK
[ ] No primary CTA goes to 404 or mock without Beta badge

TIER 2 — WITHIN 7 DAYS
[ ] Mail inbound working
[ ] Cloud upload/download on Supabase Storage
[ ] Electron mail/cloud installers for Win/Mac/Linux
[ ] Tau Store real catalog (10 apps)
[ ] Redis sessions persist

TIER 3 — INVESTOR FULL DEMO
[ ] Tau Forge (Forgejo) live
[ ] TauStudio + TauScript binaries
[ ] Tau Messenger MVP
[ ] OS install-to-disk proof
[ ] Mobile apps in store beta
```

---

## Repo hygiene (parallel, non-blocking)

| Issue | Action |
|-------|--------|
| `website/website/website/` nested duplicates | Archive; single source of truth |
| Two backends per app (Next + Express) | Consolidate on Next API routes for Vercel |
| `newebsite/` vs `website-replit/` | **website-replit** = marketing; deprecate newebsite |
| 400+ env flags in `env.production` | Ignore until feature exists |

---

## Key paths

| Item | Path |
|------|------|
| Canonical marketing site | `website-replit/` |
| Primary web app + APIs | `src/app/` |
| OS build | `scripts/build-tauos.sh` |
| ISO output | `release-files/TauOS-Desktop-v1.0.0.iso` |
| Electron app wrappers | `os-code/installer-scripts/apps/` |
| Developer portal | `developerhub/frontend/` |
| TauScript Rust CLI | `developerhub/tauscript/` |
| Mobile apps | `tauos-mobile/` |
| Master plan | `PLAN_OF_ACTION.md` |

---

*Next step: execute Tier 1 checklist in order. Do not deploy until Tier 1 passes.*
