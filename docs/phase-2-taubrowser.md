# Phase 2 — Tau Browser

Cross-platform privacy-first browser for the TAU CORE ecosystem.

## What shipped

- **Subdomains** — `browser.tauos.org` and `taubrowser.com` → `/taubrowser`
- **SSO auth** — login/register issue 7-day Tau ID tokens
- **Sync APIs** — bookmarks, history, settings, privacy stats
- **Public blocklist** — `/api/taubrowser/privacy/blocklist` for native clients
- **Downloads API** — platform detection + release URLs
- **Account dashboard** — sync hub at `/taubrowser/dashboard`
- **Native app** — Tauri 2 shell in `apps/taubrowser-desktop/`
- **CI builds** — `.github/workflows/taubrowser-build.yml` (tag `taubrowser-v*`)

## Privacy (real, not cosmetic)

| Feature | Status |
|---------|--------|
| Ad domain blocking | ✅ Blocklist + client-side enforcement |
| Tracker blocking | ✅ 40+ domains, expandable via API |
| HTTPS enforcement | ✅ Upgrades http → https |
| Zero telemetry | ✅ No analytics SDKs |
| DNT header | ✅ Settings default on |
| Fingerprint protection | ✅ Settings + WebView hardening (native) |
| Encrypted sync | ✅ JWT-authenticated API sync |

## Setup (one-time)

```bash
npm run browser:setup   # DB tables
```

## DNS (production)

| Domain | CNAME target |
|--------|--------------|
| `browser.tauos.org` | Vercel project (same as tauos.org) |
| `taubrowser.com` | Vercel project |
| `www.taubrowser.com` | Vercel project |

Add both domains in Vercel → Project Settings → Domains.

## Environment

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL |
| `JWT_SECRET_SSO` | Cross-app SSO tokens |
| `TAUBROWSER_RELEASE_BASE` | GitHub release URL prefix for downloads |
| `NEXT_PUBLIC_APP_URL` | `https://www.tauos.org` |

## API

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/taubrowser/downloads` | Public |
| GET | `/api/taubrowser/privacy/blocklist` | Public |
| GET | `/api/taubrowser/sync` | Bearer |
| GET/POST/DELETE | `/api/taubrowser/bookmarks` | Bearer |
| GET/POST/DELETE | `/api/taubrowser/history` | Bearer |
| GET/PUT | `/api/taubrowser/settings` | Bearer |
| GET/POST | `/api/taubrowser/privacy/stats` | Bearer |
| GET | `/api/taubrowser/profile` | Bearer |

## Build native app (local)

Requires [Rust](https://rustup.rs), platform WebView deps, and Node 20+.

```bash
cd apps/taubrowser-desktop
npm install
npm run dev      # development
npm run build    # production installer
```

### Platform notes

| Platform | Output |
|----------|--------|
| macOS | `.dmg` (Intel + Apple Silicon) |
| Windows | `.exe` NSIS installer |
| Linux | `.AppImage`, `.deb` |
| Android | `.apk` via `npx tauri android build` |
| iOS | Requires Xcode + Apple dev account (`npx tauri ios build`) |

## Release

```bash
git tag taubrowser-v1.0.0-beta.1
git push origin taubrowser-v1.0.0-beta.1
```

GitHub Actions builds all platforms and uploads artifacts.

## Test

1. Visit `browser.tauos.org` or `/taubrowser`
2. Register / sign in
3. Open dashboard — toggle privacy settings, add bookmarks
4. Download native app for your platform
5. Sign in with same Tau ID token (localStorage sync)
6. Browse — blocked domains show in shield counter

## Phase 3 preview

**Tau Talk** — encrypted messaging (WhatsApp + Telegram + Signal in one app).
