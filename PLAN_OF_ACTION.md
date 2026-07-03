# TauOS — Plan of Action

**Saved:** June 2026  
**Status:** Ready to execute — start Phase 1 tomorrow morning  
**Owner:** TauOS / The Dot Protocol team

---

## Strategic Overview

TauOS is four products in one repo:

| Layer | What it is | Priority |
|-------|------------|----------|
| **Native OS** | Linux-based bootable system, ISO, USB install | Phase 1 |
| **Cloud platform** | Website, TauMail, TauCloud, TauID, TauStore (Vercel + Supabase) | Phase 2 |
| **Desktop distribution** | Electron installer, downloadable artifacts | Phase 1 → ongoing |
| **Developer platform** | TauScript, SDK, Developer Hub | Phase 5 |

**Rule:** Nothing ships until it passes a real test (boot test for OS, E2E for web, send/receive for mail).

---

## Phase 1 — Real OS (Start Here Tomorrow)

**Goal:** TauOS is a working operating system, not a demo.

### Prerequisites (Mac)
- [x] Docker Desktop installed
- [ ] Run validation: `docker run hello-world`
- [ ] Optional: QEMU — `brew install qemu`

### Steps

| # | Task | Exit criteria |
|---|------|----------------|
| 1 | Code review — boot chain, no shell-script kernels, no fake installers | `scripts/validate-os-artifacts.sh` logic clean |
| 2 | Strengthen build pipeline if gaps found | `scripts/build-tauos.sh` + `build-tauos-native.sh` ready |
| 3 | Run ISO build | `docker` / `./scripts/build-tauos.sh --docker` |
| 4 | Validate artifacts | `./scripts/validate-os-artifacts.sh` passes |
| 5 | QEMU smoke test | ISO boots, shell/login, network |
| 6 | USB test (optional same day) | Electron wizard writes bootable USB |
| 7 | Disk install test (VM) | `installer/install.sh` produces bootable install |

### Commands (Phase 1 kickoff)

```bash
cd /Users/mac/Downloads/tauos

# Verify Docker
docker run hello-world

# Build bootable ISO (first run: long — kernel compile)
./scripts/build-tauos.sh --docker

# Validate
./scripts/validate-os-artifacts.sh

# Test in QEMU (after ISO exists)
qemu-system-x86_64 -m 4096 -cdrom release-files/TauOS-Desktop-v1.0.0.iso
```

### Phase 1 — Not blocking first boot (Phase 1.5 later)
- Full GTK desktop polish
- OTA updates wired end-to-end
- TauMail/TauID baked into OS image
- Mobile OS

---

## Phase 2 — Cloud Live (DNS, Supabase, Mail, Redis, Vercel)

**Goal:** Production URLs work — signup, login, email, sessions.

**Start after:** Phase 1 ISO boots in QEMU (or parallel if team split).

### Infrastructure map

| Service | Provider | Notes |
|---------|----------|--------|
| Website + APIs | Vercel (`the-dot-protocol-co-ltds-projects/tauos`) | Already linked; env via `vercel env pull` |
| Database | Supabase | Migrations in `supabase/` — audit schema vs API |
| Redis | **Upstash** (recommended) or new VPS | Sessions; avoid blocking on Vultr |
| Outbound email | SendGrid or Resend | API key in Vercel |
| Inbound / `@tauos.org` mail | TBD — see mail decision below | Was Vultr `136.244.83.147` — **cancelled** |

### Vultr / mail decision (decide early in Phase 2)

| Option | Cost | Use when |
|--------|------|----------|
| **SendGrid + Upstash + no VPS** | ~$0–30/mo | Fastest go-live |
| **New Hetzner CX11 (~€4/mo)** | Low | Self-hosted SMTP; rewrite/adapt Vultr scripts |
| **New Vultr VPS** | ~$6–12/mo | Same as old setup; new IP + DNS |

**Note:** Cancelled Vultr = likely lost IP. Plan for **new instance + DNS update**, not “renew same box.”

### Phase 2 tasks

| # | Task | Exit criteria |
|---|------|----------------|
| 1 | `vercel env pull .env.local` | Local dev matches production |
| 2 | Supabase migrations + schema audit | APIs match tables |
| 3 | Upstash Redis (or equivalent) | Sessions persist across refresh |
| 4 | DNS audit — A, MX, SPF, DKIM, DMARC for `tauos.org` | Mail auth passes checkers |
| 5 | Mail path live (chosen stack) | Send + receive on `@tauos.org` or documented alias |
| 6 | Rotate secrets leaked in git | No credentials in repo |
| 7 | `/api/health` green on production | Monitoring baseline |

---

## Phase 3 — TauCloud + TauStore (MVP)

**Goal:** Logged-in users can use cloud storage and app catalog.

**Start after:** Phase 2 auth + mail baseline.

### TauCloud MVP
- Login → upload → list → download → delete
- Quota + storage backend (Supabase Storage or S3-compatible)
- Clear security story (access control v1; encryption roadmap documented)

### TauStore MVP
- Curated catalog (start with ~10 apps)
- Install flow or deep-link — not full Flatpak competitor on day one
- Real metadata, not placeholder entries

---

## Phase 4 — TauBrowser (Standalone Download)

**Goal:** Downloadable browser app, privacy-focused, TauID integration.

**Start after:** Phase 3 or parallel if separate owner.

### Scope
- **v1:** Electron or Tauri wrapper — tracker blocking, TauID login, Tau start page
- **v2:** Custom engine only if traction justifies (not blocking OS/cloud)

### Deliverables
- `.dmg` / `.exe` / `.deb` in `public/downloads/`
- Separate from OS ISO; optional bundling later

---

## Phase 5 — Corporate UI + Platform Maturity

- Single website source of truth (**candidate:** `newebsite/`)
- Corporate design system + honest download page (real ISO only)
- TauScript stable v0.1 spec + Developer Hub
- CI: ISO build + Vercel deploy on release tags
- Repo hygiene: dedupe `website/website/`, one deploy root

---

## Software to Install (Mac)

### Essential
```bash
# Homebrew (if needed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install git node@22 qemu xorriso jq redis libpq terraform gh
brew install supabase/tap/supabase
brew tap homebrew/cask && # Docker Desktop if not installed

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
npm i -g vercel
```

### Project setup
```bash
cd /Users/mac/Downloads/tauos
vercel link --yes --scope the-dot-protocol-co-ltds-projects --project tauos
cd os-code/installer-scripts && npm install
```

---

## Exit Criteria — “Move Ahead” Checklist

- [ ] **OS:** ISO boots in QEMU; network works; seen TauOS shell/desktop
- [ ] **Cloud:** Signup + login on `tauos.org`; outbound email; Redis session survives refresh
- [ ] **TauCloud:** Upload/download cycle for logged-in user
- [ ] **TauStore:** At least one real listable/installable app
- [ ] **TauBrowser:** Standalone installer opens; basic privacy features work

---

## What We Are NOT Doing (Yet)

- Enabling all 400+ `env.production` flags (mostly aspirational)
- Custom Chromium fork before v1 wrapper ships
- Reviving old Vultr IP without new provisioning plan
- Maintaining three parallel website codebases indefinitely

---

## Tomorrow Morning — Start Here

1. Open this file: `PLAN_OF_ACTION.md`
2. Confirm Docker: `docker run hello-world`
3. Phase 1: code review → `./scripts/build-tauos.sh --docker`
4. Report build output + QEMU result
5. Phase 2 planning: choose **managed mail (fast)** vs **new VPS (sovereign)**

---

## Key Paths

| Item | Path |
|------|------|
| Master OS build | `scripts/build-tauos.sh` |
| Docker buildfile | `scripts/Dockerfile.tauos-build` |
| Artifact validation | `scripts/validate-os-artifacts.sh` |
| Release ISO output | `release-files/TauOS-Desktop-v1.0.0.iso` |
| Electron installer | `os-code/installer-scripts/` |
| Vercel project | `the-dot-protocol-co-ltds-projects/tauos` |
| New website candidate | `newebsite/` |
| TauScript | `developerhub/tauscript/` |

---

*This plan aligns with CTO sequencing: **OS proof → cloud live → store/cloud MVP → browser → polish.***
