# PUBLIC_REPOSITORY_AUDIT.md
## tauos — Public Community Edition Audit

**Date:** 2026-08-06  
**Tracked files:** 1,103  
**Build status:** ✅ `npm run build` passes  
**Vercel status:** ✅ Prebuild check passes  

---

## Summary by Category

| Category | Files | Safe to Expose |
|----------|-------|----------------|
| Source Code (`src/`) | 686 | Website + product UIs; no infra secrets; env via `.env` only |
| Public Assets (`public/`) | 353 | Marketing, Tau Core UI, product icons, download manifest |
| Developer SDK (`sdk/`) | 37 | Public contributor SDK + hello-world |
| Build Scripts (`scripts/`) | 6 | Vercel check, manifest, release upload, smoke tests only |
| Community / Config | 20 | LICENSE, README, CONTRIBUTING, package.json, etc. |
| GitHub Actions | 1 | `deploy-vercel.yml` only |

---

## Explicitly Removed (Proprietary)

These were removed from public git index during migration:

- `os/`, `os-code/` — OS kernel and installer source
- `target/` — Rust build artifacts (1,889 files)
- `docs/` — 270 internal deployment/status documents
- `scripts/` — ~120 internal build/deploy scripts
- Investor materials (xlsx, pdf, financial PNGs, pitch deck)
- Internal docs: Production Readiness Audit, GTM Strategy, Project Overview
- Investor API routes with revenue/funding metrics
- Internal CI workflows

---

## Vercel / Production Safety

All remaining public files are either:

1. Required for Next.js build and Vercel deploy
2. Static assets served by tauos.org
3. Community documentation with no infrastructure credentials
4. `.env.example` (placeholders only, no secrets)

No Terraform, Supabase migrations, DNS configs, or deployment credentials remain tracked.

---

## Complete Public File Inventory

| File | Category | Why Safe |
|------|----------|----------|
| `.env.example` | Community / Config | Community edition; no proprietary engineering secrets |
| `.github/workflows/deploy-vercel.yml` | GitHub Actions | Community edition; no proprietary engineering secrets |
| `.gitignore` | Community / Config | Community edition; no proprietary engineering secrets |
| `.vercelignore` | Community / Config | Community edition; no proprietary engineering secrets |
| `CHANGELOG.md` | Community / Config | Community edition; no proprietary engineering secrets |
| `CODE_OF_CONDUCT.md` | Community / Config | Community edition; no proprietary engineering secrets |
| `CONTRIBUTING.md` | Community / Config | Community edition; no proprietary engineering secrets |
| `LICENSE` | Community / Config | Community edition; no proprietary engineering secrets |
| `README.md` | Community / Config | Community edition; no proprietary engineering secrets |
| `REPOSITORY_MIGRATION_PLAN.md` | Community / Config | Community edition; no proprietary engineering secrets |
| `SECURITY.md` | Community / Config | Community edition; no proprietary engineering secrets |
| `design-tokens.json` | Community / Config | Community edition; no proprietary engineering secrets |
| `next-env.d.ts` | Community / Config | Community edition; no proprietary engineering secrets |
| `next.config.js` | Community / Config | Community edition; no proprietary engineering secrets |
| `package-lock.json` | Community / Config | Community edition; no proprietary engineering secrets |
| `package.json` | Community / Config | Community edition; no proprietary engineering secrets |
| `postcss.config.js` | Community / Config | Community edition; no proprietary engineering secrets |
| `public/apple-touch-icon.png` | Community / Config | Community edition; no proprietary engineering secrets |
| `public/brand/brand/tauos-logo.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/brand/brand/tauos-logo.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/brand/tau-ide-logo.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/brand/tau-phone-lock.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/brand/tauos-logo.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/brand/tauos-logo.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/brand/tautalk-icon.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/brand/tautalk-logo.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/desktop-ui/desktop.js` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/desktop-ui/icons/taubrowser-icon.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/desktop-ui/icons/taucloud-icon.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/desktop-ui/icons/tauid-icon.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/desktop-ui/icons/taumail-icon.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/desktop-ui/icons/taustore-icon.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/desktop-ui/icons/terminal-icon.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/desktop-ui/index.html` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/desktop-ui/mobile.css` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/desktop-ui/mobile.html` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/desktop-ui/styles.css` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/desktop-ui/tauos-logo.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/docs/API.md` | Public Documentation | Community edition; no proprietary engineering secrets |
| `public/docs/CODE_OF_CONDUCT.md` | Public Documentation | Community edition; no proprietary engineering secrets |
| `public/docs/CONTRIBUTING.md` | Public Documentation | Community edition; no proprietary engineering secrets |
| `public/docs/GOVERNANCE.md` | Public Documentation | Community edition; no proprietary engineering secrets |
| `public/docs/SECURITY.md` | Public Documentation | Community edition; no proprietary engineering secrets |
| `public/docs/answers.md` | Public Documentation | Community edition; no proprietary engineering secrets |
| `public/docs/building.md` | Public Documentation | Community edition; no proprietary engineering secrets |
| `public/docs/desktop.md` | Public Documentation | Community edition; no proprietary engineering secrets |
| `public/docs/license.md` | Public Documentation | Community edition; no proprietary engineering secrets |
| `public/docs/mobileosfeatures.md` | Public Documentation | Community edition; no proprietary engineering secrets |
| `public/docs/setup.md` | Public Documentation | Community edition; no proprietary engineering secrets |
| `public/docs/tau-store.md` | Public Documentation | Community edition; no proprietary engineering secrets |
| `public/docs/taucloud.md` | Public Documentation | Community edition; no proprietary engineering secrets |
| `public/docs/taumail.md` | Public Documentation | Community edition; no proprietary engineering secrets |
| `public/docs/troubleshooting.md` | Public Documentation | Community edition; no proprietary engineering secrets |
| `public/downloads/manifest.json` | Public Documentation (downloads) | Community edition; no proprietary engineering secrets |
| `public/favicon-32x32.png` | Community / Config | Community edition; no proprietary engineering secrets |
| `public/favicon.ico` | Community / Config | Community edition; no proprietary engineering secrets |
| `public/images/browser-interface.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/images/desktop-dashboard.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/images/mobile-interface.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/images/settings-interface.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/images/store-interface.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/images/taucloud-interface.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/images/taumail-interface.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/manifest.json` | Community / Config | Community edition; no proprietary engineering secrets |
| `public/mobile-ui/brand/tauos-logo.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/mobile-ui/icons/camera-icon.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/mobile-ui/icons/messages-icon.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/mobile-ui/icons/phone-icon.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/mobile-ui/icons/terminal-icon.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/mobile-ui/index.html` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/mobile-ui/script.js` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/mobile-ui/styles.css` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/mobile-ui/terminal.html` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/sounds/tautalk-incoming.wav` | Community / Config | Community edition; no proprietary engineering secrets |
| `public/sounds/tautalk-ringback.wav` | Community / Config | Community edition; no proprietary engineering secrets |
| `public/tau-core/assets/ambient-glow-1.svg` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/assets/ambient-glow-2.svg` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/assets/arrow-right.svg` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/assets/icon-chat.svg` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/assets/icon-folder.svg` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/assets/icon-globe.svg` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/assets/icon-grid.svg` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/assets/icon-mail.svg` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/assets/icon-settings.svg` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/assets/icon-store.svg` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/assets/icon-terminal.svg` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/assets/tau-logo-nav.png` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/assets/tau-logomark.png` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/assets/waveform.svg` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/desktop/desktop.css` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/desktop/desktop.js` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/desktop/index.html` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/index.html` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/legal/TauCore-EULA.md` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/setup/index.html` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/setup/setup.css` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/setup/setup.js` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-core/shared/tokens.css` | Public Assets (Tau Core UI) | Community edition; no proprietary engineering secrets |
| `public/tau-developer/avatars/default.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tau-developer/brand/logo.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tau-developer/icons/active-pulse.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tau-developer/icons/bell.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tau-developer/icons/book-open.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tau-developer/icons/code.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tau-developer/icons/dot-gold.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tau-developer/icons/dot-red.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tau-developer/icons/folder-code.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tau-developer/icons/layout-dashboard.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tau-developer/icons/package-open.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tau-developer/icons/plus.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tau-developer/icons/pulse-warn.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tau-developer/icons/pulse.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tau-developer/icons/search.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tau-developer/icons/terminal.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tauai/enhanced-tauai.html` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tauai/index.html` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tauai/real-tauai.html` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tauai/tauai-landing.html` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tauai/tauai.html` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tauai/tauguard.html` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tauai/taumind.html` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tauai/tausync.html` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tauai/tauvision.html` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/avatars/default-user.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/brand/logo.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/bell.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/chart-network.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/file-archive.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/file-doc.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/file-video.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/file.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/folder-open.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/folder-plus.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/history.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/layout-dashboard.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/log-out.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/search.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/settings.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/star-off.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/star.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/sync-indicator.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/trash-2.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/icons/upload.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/images/hero-banner.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taucloud/images/sample-render.jpg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tauid/brand/logo.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/auth/checkmark.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/auth/glow-backdrop.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/auth/nodes-br.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/auth/nodes-tl.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/avatars/sender-1.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/avatars/sender-2.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/avatars/sender-3.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/avatars/sender-4.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/avatars/sender-large.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/avatars/user-sidebar.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/avatars/user-topbar.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/brand/logo-icon.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/align-center.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/align-left.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/align-right.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/arrow-up-left.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/arrow-up-right.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/badge-check.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/bell-dot.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/bell-ring.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/bold.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/calendar-plus.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/calendar.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/chart-column.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/check-square.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/chevron-down.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/chevron-left.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/chevron-right.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/clock.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/database.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/edit-3.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/edit.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/ellipse-gold.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/ellipse-status.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/file.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/image.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/italic.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/link.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/list-checks.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/list-ordered.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/list.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/lock.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/mail.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/package.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/paperclip.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/plus.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/search.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/send.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/settings.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/shield-alert.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/sparkles.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/star-off.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/star.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/status-danger.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/status-success.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/strikethrough.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/toggle.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/trash.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/underline.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/users-round.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/wand-sparkles.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/icons/x-circle.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/shared/divider-line.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/taumail/shared/line.svg` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tauos-tokens.css` | Community / Config | Community edition; no proprietary engineering secrets |
| `public/tautalk/brand/icon.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tautalk/brand/logo-primary.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/tautalk/brand/logo.png` | Public Product Assets | Community edition; no proprietary engineering secrets |
| `public/website/icons/developers/book-open.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/developers/chart-network.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/developers/code.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/developers/copy.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/developers/github.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/developers/window-dots.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/ecosystem/brain.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/ecosystem/building.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/ecosystem/circle-x.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/ecosystem/cloud-upload.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/ecosystem/code.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/ecosystem/compass.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/ecosystem/cpu.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/ecosystem/database.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/ecosystem/laptop.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/ecosystem/mail.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/ecosystem/mic.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/ecosystem/network.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/ecosystem/rocket.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/ecosystem/smartphone.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/footer/circle-x.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/footer/github.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/footer/globe.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/footer/instagram.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/footer/moon.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/footer/sun.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/footer/twitter.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/mega-menu/ai.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/mega-menu/book.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/mega-menu/browser.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/mega-menu/cloud.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/mega-menu/developer.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/mega-menu/glass.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/mega-menu/grayscale.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/mega-menu/id.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/mega-menu/mail.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/mega-menu/phone.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/mega-menu/store.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/mega-menu/tablet.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/mega-menu/talk.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/mega-menu/watch.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/business/circle-x.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/business/laptop-minimal.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/business/rocket.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/business/shield-half.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/community/calendar-range.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/community/git-branch.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/community/message-square-text.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/community/video.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/everyone/book-open.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/everyone/briefcase.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/everyone/chevron-right.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/everyone/code.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/everyone/heart.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/everyone/sparkles.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/eye.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/join/apple.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/join/arrow-up-right.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/join/circle-x.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/join/download.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/join/send.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/join/terminal.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/lock.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/icons/sections/shield-check.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/footer/gold-divider.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/glow/business-left.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/glow/business-right.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/glow/chapter-1.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/glow/chapter-2.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/glow/community-ambient.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/glow/developers-center.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/glow/everyone-left.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/glow/experience-br.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/glow/experience-tl.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/glow/floating-dust.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/glow/footer-glow.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/glow/join-ambient.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/glow/privacy-center.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/glow/privacy-divider.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/hero/backglow.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/opening/ambient-glow.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/images/opening/singularity-point.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/logos/project-grayscale/logo-primary.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/logos/tau-ai/logo-primary.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/logos/tau-browser/logo-primary.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/logos/tau-cloud/logo-primary.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/logos/tau-core/logo-nav.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/logos/tau-core/logo-primary.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/logos/tau-core/logo-source.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/logos/tau-core/logo.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/logos/tau-developer/logo-primary.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/logos/tau-id/logo-primary.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/logos/tau-mail/logo-primary.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/logos/tau-talk/logo-primary.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/careers/hero.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/careers/icon-activity.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/careers/icon-arrow-right.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/careers/icon-book-open.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/careers/icon-lock.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/careers/icon-network.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/careers/icon-ruler.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/careers/icon-trending-up.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/careers/icon-users.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/contact/globe-map.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/contact/icon-chevron-down.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/contact/icon-github.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/contact/icon-linkedin.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/contact/icon-twitter.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/download/icon-check.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/download/icon-circle-x.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/download/icon-database.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/download/icon-download.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/download/icon-globe.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/download/icon-message-lock.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/download/icon-package.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/download/icon-terminal.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/hardware/divider.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/hardware/glass-render.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/hardware/laptop-render.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/hardware/phone-render.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/hardware/tablet-render.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/hardware/tau-devices-logo.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/hardware/watch-render.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/press/featured.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/press/icon-arrow-right.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/press/icon-download.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/roadmap/check.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/roadmap/ellipse.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/roadmap/marker-current.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/roadmap/marker-upcoming.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/roadmap/timeline-line.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/shared/github.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/shared/logo-icon.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/shared/message-square.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/shared/twitter.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/startup/founder-alina.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/startup/founder-devon.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/startup/hero.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/startup/icon-check.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/startup/icon-database.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/startup/icon-microchip.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/startup/icon-shield-check.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/startup/icon-target.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/store/accessory-1.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/store/accessory-2.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/store/accessory-3.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/store/accessory-4.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/store/icon-plus.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/store/icon-shield-check.svg` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/store/product-accessories-hero.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/store/product-book.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/store/product-glass.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/store/product-phone.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/store/product-tablet.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/store/product-watch.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `public/website/marketing/store/tau-devices-logo.png` | Public Assets (marketing) | Community edition; no proprietary engineering secrets |
| `scripts/e2e-smoke.mjs` | Build Scripts (public) | Community edition; no proprietary engineering secrets |
| `scripts/generate-download-manifest.sh` | Build Scripts (public) | Community edition; no proprietary engineering secrets |
| `scripts/migrate-keep-paths.txt` | Build Scripts (public) | Community edition; no proprietary engineering secrets |
| `scripts/publish-os-release.sh` | Build Scripts (public) | Community edition; no proprietary engineering secrets |
| `scripts/vercel-prebuild-check.mjs` | Build Scripts (public) | Community edition; no proprietary engineering secrets |
| `scripts/verify-downloads.mjs` | Build Scripts (public) | Community edition; no proprietary engineering secrets |
| `sdk/Cargo.lock` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/Cargo.toml` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/examples/hello-world/Cargo.toml` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/examples/hello-world/src/main.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/examples/hello-world/tauapp.toml` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/gui-test/.gitignore` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/gui-test/Cargo.toml` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/gui-test/src/main.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/hello-tau/.gitignore` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/hello-tau/Cargo.toml` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/hello-tau/src/main.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/src/build.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/src/commands.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/src/config.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/src/main.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/src/manifest.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/src/package.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/src/publish.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/src/run.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/src/tauui.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/src/templates.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/src/test.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/src/utils.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/tau-sdk.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/tauos-demo/.gitignore` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/tauos-demo/Cargo.toml` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/tauos-demo/src/main.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/tauui_output/com_example_tau-sdk.html` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/templates/c-template/Makefile` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/templates/c-template/main.c` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/templates/python-template/main.py` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/templates/python-template/setup.py` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/templates/rust-template/Cargo.toml` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/templates/rust-template/src/main.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/test-tauui/.gitignore` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/test-tauui/Cargo.toml` | Developer SDK | Community edition; no proprietary engineering secrets |
| `sdk/test-tauui/src/main.rs` | Developer SDK | Community edition; no proprietary engineering secrets |
| `src/app/about/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/ai-gateway/status/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/auth/oauth/[provider]/callback/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/auth/oauth/[provider]/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/auth/session/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/auth/verify/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/check-schema/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/create-user/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/desktop/apps/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/desktop/system/status/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/analytics/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/api-keys/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/billing/checkout/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/billing/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/extensions/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/integrations/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/marketplace/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/monitoring/health/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/pipelines/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/tauscript/compile/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/tauscript/debug/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/tauscript/doc/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/tauscript/format/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/tauscript/lint/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/tauscript/lsp/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/tauscript/run/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/tauscript/test/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/developers/webhooks/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/email/setup-addresses/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/email/welcome/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/enterprise/compliance-status/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/fix-tauMail/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/health/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/list-users/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/middleware/metrics.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/mobile/apps/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/mobile/device/status/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/monitoring/metrics/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/platform/status/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/privacy/account/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/privacy/export/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/storage/health/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/architect/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/architect/validate/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/jobs/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/notifications/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/projects/[id]/conversations/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/projects/[id]/dashboard/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/projects/[id]/files/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/projects/[id]/git/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/projects/[id]/knowledge/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/projects/[id]/memory/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/projects/[id]/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/projects/[id]/secrets/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/projects/[id]/sync/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/projects/[id]/tasks/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/projects/[id]/versions/[versionId]/restore/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/projects/[id]/versions/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/projects/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/search/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/status/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tau-ide/teams/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tauai/chat/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tauai/models/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tauai/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tauai/status/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tauai/voice/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taubrowser/auth/login/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taubrowser/auth/register/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taubrowser/bookmarks/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taubrowser/downloads/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taubrowser/history/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taubrowser/privacy/blocklist/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taubrowser/privacy/stats/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taubrowser/profile/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taubrowser/settings/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taubrowser/spaces/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taubrowser/sync/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taubrowser/tabs/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/activity/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/auth/login/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/auth/register/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/auth/verify-2fa/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/files/delete/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/files/detail/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/files/download/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/files/list/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/files/restore/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/files/share/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/files/star/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/files/upload/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/folders/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/profile/2fa/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/profile/avatar/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/profile/password/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/profile/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/search/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/shared/[token]/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/shares/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taucloud/storage/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tauid/auth/login/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tauid/auth/register/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tauid/auth/verify-2fa/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tauid/auth/verify-email/confirm/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tauid/auth/verify-email/send/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tauid/identity-profiles/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tauid/profile/2fa/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tauid/profile/password/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tauid/user/profile/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/ai/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/auth/login/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/auth/register/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/calendar/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/contacts/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/demo/simulate-incoming/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/domains/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/emails/[emailId]/attachments/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/emails/actions/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/emails/attachments/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/emails/attachments/upload/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/emails/drafts/[id]/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/emails/drafts/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/emails/inbox/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/emails/mark-read/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/emails/send/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/emails/sent/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/emails/spam/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/emails/trash/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/middleware/security.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/notifications/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/profile/avatar/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/profile/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/server/status/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/smtp/incoming/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/storage/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/tasks/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/webhook/incoming/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taumail/welcome/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taustore/apps/featured/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taustore/apps/search/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taustore/download/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/taustore/search/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/attachments/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/auth/login/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/auth/otp/send/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/auth/register/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/calls/[sessionId]/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/calls/[sessionId]/signals/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/calls/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/contacts/label/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/conversations/keys/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/conversations/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/conversations/typing/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/identity/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/messages/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/messages/stream/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/profile/avatar/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/tautalk/profile/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/test-db/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/test-user/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/test-webhook/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/api/webhooks/stripe/route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/apps/cloud/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/apps/mail/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/beta/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/careers/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/contact/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/demo/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/design-system/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/desktop/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/analytics/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/api-keys/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/architect/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/automation/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/billing/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/cicd/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/dashboard/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/deployments/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/docs/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/extensions/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/git/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/layout.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/marketplace/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/projects/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/sdks/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/search/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/settings/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/tauscript/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/terminal/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/(platform)/workspace/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/ide/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/layout.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/login/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/developers/register/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/docs/02_TauCore_Technical_Whitepaper.md` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/docs/03_TauCore_Product_Guide.md` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/docs/04_TauCore_Privacy_Security_Documentation.md` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/docs/05_TauCore_Developer_Documentation.md` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/docs/06_TauCore_Installation_Guides.md` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/docs/07_TauCore_SLA_Disaster_Recovery_Policy.md` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/docs/08_TauCore_FAQ_Knowledge_Base.md` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/docs/11_TauCore_Release_Notes_v1.0.md` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/docs/README.md` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/docs/[slug]/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/docs/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/download/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/downloads/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/enterprise/mdm/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/enterprise/ota/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/enterprise/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/enterprise/security/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/globals.css` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/governance/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/help/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/investors/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/layout.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/legal/acceptable-use/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/legal/cookies/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/legal/data-protection/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/legal/dpa/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/legal/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/legal/privacy/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/legal/terms/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/login/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/mobile/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/monitoring/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/press/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/pricing/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/products/[slug]/ProductPageClient.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/products/[slug]/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/products/project-grayscale/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/products/tau-book-pro/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/products/tau-core/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/products/tau-desktop-os/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/products/tau-mobile-os/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/products/tau-phone/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/products/tau-startup/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/products/tau-tablet/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/resources/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/roadmap/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/status/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/tauai/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taubrowser/dashboard/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taubrowser/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taucloud/activity/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taucloud/dashboard/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taucloud/files/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taucloud/login/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taucloud/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taucloud/preview/[id]/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taucloud/recent/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taucloud/search/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taucloud/settings/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taucloud/shared/[token]/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taucloud/shares/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taucloud/sharing/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taucloud/storage/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taucloud/trash/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taucloud/upload/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/tauid/dashboard/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/tauid/login/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/tauid/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/tauid/profiles/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/tauid/register/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/tauid/security/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/tauid/settings/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/ai/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/calendar/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/compose/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/contacts/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/dashboard/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/drafts/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/inbox/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/login/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/notifications/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/read/[id]/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/register/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/sent/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/settings/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/spam/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/storage/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/tasks/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/trash/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/two-factor/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/verify-email/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/welcome/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taumail/workspace/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taustore/dashboard/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/taustore/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/tautalk/chat/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/tautalk/login/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/tautalk/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/app/test/page.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/DownloadPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/InstallWizard.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/apps/AppShell.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/apps/DashboardShell.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/apps/TauMailAttachmentList.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/apps/TauMailDemoBanner.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/apps/TauMailSubNav.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/dashboard/RepositoryCard.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/dashboard/StatsCard.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/docs/MarkdownDocViewer.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/email/email-list.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/layout/header.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/layout/sidebar.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/AnimatedTauPhone.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/AuthPageShell.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/Cursor.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/DeveloperPlatform.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/Enterprise.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/Footer.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/Hero.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/Logo.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/MarketingChrome.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/MarketingHome.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/MarketingPageShell.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/Navigation.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/OpenLetter.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/PrivacySafety.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/Roadmap.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/TauAI.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/TauMobile.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/TauOSDesktop.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/TauTalkMarketing.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/WhatIsTau.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/marketing/WhyTauExists.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperAnalyticsContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperApiKeysContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperArchitectContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperBillingContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperCicdContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperDashboardContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperDeploymentsContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperDocumentationContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperExtensionsContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperGitContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperIdeContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperMarketplaceContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperProjectsContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperSdksContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperSettingsContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperSidebar.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperTauScriptContent.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-developer/DeveloperTopBar.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-ide/CodeEditor.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-ide/ConnectionStatusBar.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-ide/Header.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-ide/PlatformShell.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-ide/Sidebar.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-ide/architect/AgentStatus.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-ide/architect/ArchitectureDiagram.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-ide/architect/PhaseNav.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tau-ide/architect/ProgressTracker.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/activity/TauCloudActivityPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/auth/TauCloudLoginPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/dashboard/TauCloudDashboardPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/files/TauCloudFilesPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/preview/TauCloudPreviewPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/search/TauCloudSearchPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/settings/TauCloudSettingsPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/settings/TwoFactorSettings.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/shared/ActivityFeed.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/shared/ActivityLog.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/shared/CloudIcon.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/shared/FileCard.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/shared/FolderBrowser.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/shared/HeroBanner.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/shared/StorageBreakdownCard.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/shared/StorageGaugeCard.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/shared/TauCloudAppShell.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/shared/TauCloudHeader.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/shared/TauCloudSidebar.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/shared/TauCloudUserAvatar.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/shared/UploadDropZone.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/sharing/TauCloudSharingPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/storage/TauCloudStoragePage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taucloud/upload/TauCloudUploadPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tauid/auth/TauIDLoginPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tauid/auth/TauIDRegisterPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tauid/auth/TauIdOAuthButtons.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tauid/dashboard/TauIDDashboardPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tauid/profiles/TauIDProfilesPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tauid/security/TauIDSecurityPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tauid/settings/TauIDSettingsPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tauid/settings/TauIDTwoFactorSettings.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tauid/shared/TauIDAppShell.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tauid/shared/TauIDAuthLayout.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tauid/shared/TauIDHeader.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tauid/shared/TauIDMobileNav.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tauid/shared/TauIDSidebar.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tauid/shared/TauIDUserAvatar.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/ai/TauMailAiPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/auth/TauMailAuthPages.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/auth/TauMailLoginPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/calendar/TauMailCalendarPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/compose/TauMailComposePage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/contacts/TauMailContactsPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/dashboard/TauMailDashboardPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/notifications/TauMailNotificationsPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/reader/TauMailEmailReaderPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/settings/TauMailSettingsPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/shared/EmailReaderPane.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/shared/MailFolderView.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/shared/MailIcon.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/shared/TauMailAppShell.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/shared/TauMailSidebar.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/shared/TauMailTopBar.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/shared/TauMailUserAvatar.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/storage/TauMailStoragePage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/taumail/tasks/TauMailTasksPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tautalk/TauTalkAttachSheet.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tautalk/TauTalkAvatar.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tautalk/TauTalkCallOverlay.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tautalk/TauTalkChatClient.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tautalk/TauTalkContactModal.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tautalk/TauTalkEmojiPicker.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tautalk/TauTalkIncomingCall.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tautalk/TauTalkMessageBubble.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tautalk/TauTalkMessageContextMenu.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tautalk/TauTalkProfileModal.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tautalk/auth/TauTalkLoginPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/tautalk/marketing/TauTalkHeroMockup.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/theme/ThemeToggle.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/ui/button.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/ui/card.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/ui/input.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/ui/toast.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/ui/toaster.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/ui/tooltip.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/TauWebsiteHome.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/layout/Footer.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/layout/Navigation.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/layout/ProductsMegaMenu.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/layout/WebsiteShell.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/CareersPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/ContactPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/DownloadCenterPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/MarketingWebsitePage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/PressPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/RoadmapPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/TauPhoneBookProPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/TauStartupPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/TauStoreMarketingPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/TauTabletWatchGlassPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/shared/CompanyFooter.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/shared/CompanyNav.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/shared/HardwareFooter.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/shared/HardwareNav.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/shared/JourneyFooter.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/shared/JourneyNav.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/shared/MarketingIcon.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/marketing/shared/SectionLabel.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/opening/OpeningExperience.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/ProjectGrayscalePage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/TauAiProductPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/TauBrowserProductPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/TauCloudProductPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/TauCoreProductPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/TauDeveloperPlatformPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/TauIdProductPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/TauMailProductPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/TauOsProductPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/TauTalkProductPage.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/shared/AppsSuiteFooter.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/shared/AppsSuiteNav.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/shared/CloudSuiteFooter.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/shared/CloudSuiteNav.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/shared/ProductPageLayout.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/product/shared/ProductSectionHeader.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/sections/ExperienceSection.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/sections/HeroSection.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/sections/HomeSections.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/ui/DeveloperCodeEditor.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/ui/GlowBackground.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/ui/SectionBadge.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/ui/TauLogo.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/components/website/website.css` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/config/mail-domains.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/content/site.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/content/txp/navigation.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/content/txp/product-routes.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/content/txp/products.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/content/txp/story.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/data/taustore-catalog.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/hooks/use-toast.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/hooks/useTauCloudSession.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/hooks/useTauMailSession.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/hooks/useTauSession.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/ai-gateway.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/ai-gateway/index.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/ai-gateway/providers/anthropic.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/ai-gateway/providers/azure-openai.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/ai-gateway/providers/deepseek.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/ai-gateway/providers/fallback.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/ai-gateway/providers/gemini.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/ai-gateway/providers/ollama.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/ai-gateway/providers/openai.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/ai-gateway/providers/openrouter.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/ai-gateway/providers/tau-ai.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/ai-gateway/registry.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/ai-gateway/types.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/ai-gateway/usage.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/audit-log.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/auth-server.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/db-pool.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/design-system.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/downloads.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/mail-transport.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/monitoring/error-reporting.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/oauth/config.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/oauth/service.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/oauth/state.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/rate-limit.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/redis-backend.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/security/enterprise-auth.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/security/input-validation.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/security/universal-security.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/supabase-storage.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-auth-client.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-auth-constants.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-auth.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-developer/nav.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-developer/server/platform-db.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-developer/server/route-auth.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-developer/server/stripe-billing.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-developer/theme.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-docs.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/architect-prompt.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/architect/agents.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/architect/memory.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/architect/phases.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/architect/project-generator.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/auth-client.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/connection-status.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/docs/BACKUP-DR.md` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/docs/ENV-SETUP.md` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/projects.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/api-guard.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/auth.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/crypto.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/db.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/env.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/git-remote.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/jobs.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/knowledge.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/memory.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/metrics.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/projects.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/rate-limit.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/route-guard.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/secrets.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/security.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/tasks.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/server/teams.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/sync-client.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/tauscript-docs.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-ide/tauscript-v1-spec.md` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tau-session.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taubrowser-blocklist.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taubrowser-data.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taubrowser-downloads.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taucloud-files.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taucloud-profile.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taucloud/api-client.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taucloud/assets.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taucloud/format.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taucloud/tokens.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taucloud/types.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauid/api-client.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauid/assets.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauid/otp.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauid/rate-limit.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauid/tokens.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauid/validation.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail-attachment-storage.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail-attachments.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail-compose.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail-demo.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail-inbound.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail/api-client.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail/api-route.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail/assets.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail/avatar.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail/inbound-html.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail/inbound-store.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail/profile-server.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail/schema.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail/tokens.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail/types.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taumail/ui-demo-data.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/taupm/index.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/ast.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/compiler/diagnostics.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/compiler/ir.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/compiler/pipeline.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/compiler/semantic.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/compiler/types.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/debugger.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/docgen.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/evaluator.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/formatter.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/index.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/lexer.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/linter.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/lsp/server.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/parser.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/stdlib.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tauscript/test-runner.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-call-constants.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-call-notify.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-call-sounds.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-calls.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-conversation-utils.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-crypto.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-data.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-emojis.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-ice-config.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-message-payload.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-otp.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-profile.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-sse.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-ui/assets.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-ui/tokens.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-web-api.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/tautalk-web-call.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/theme-script.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/totp.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/utils.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/website/fonts.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/website/marketing-assets.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/website/mega-menu.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/website/routes.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/website/tokens.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/website/useMotionReady.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/lib/website/utils.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/middleware.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/styles/tau-developer.css` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/styles/tau-ide.css` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-browser/Cargo.toml` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-browser/browser_ui.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-browser/main.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-browser/privacy_features.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-browser/theme.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-explorer/Cargo.toml` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-explorer/cloud_integration.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-explorer/explorer_ui.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-explorer/file_operations.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-explorer/main.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-explorer/theme.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-home/Cargo.toml` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-home/desktop.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-home/launcher.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-home/main.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-home/privacy_indicators.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-home/theme.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-home/wallpapers.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-home/widgets.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-settings/Cargo.toml` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-settings/main.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-settings/privacy_settings.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-settings/settings_ui.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-settings/system_config.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-store/Cargo.toml` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-store/app_catalog.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-store/download_manager.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-store/main.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-store/store_ui.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/tau-store/theme.rs` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/txp/components/TauLogoPulse.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/txp/components/TauPhoneHero.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/txp/components/primitives.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/txp/motion/variants.ts` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/txp/pages/TxpHome.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/txp/patterns/ProductPageTemplate.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/txp/patterns/TxpFooter.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/txp/patterns/TxpNavigation.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/txp/patterns/TxpShell.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/txp/sections/ContentSections.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/txp/sections/DownloadSection.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/txp/sections/EcosystemSection.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/txp/sections/TxpHero.tsx` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `src/txp/tokens.css` | Source Code (website + products) | Community edition; no proprietary engineering secrets |
| `tailwind.config.js` | Community / Config | Community edition; no proprietary engineering secrets |
| `tailwind.config.ts` | Community / Config | Community edition; no proprietary engineering secrets |
| `tsconfig.json` | Community / Config | Community edition; no proprietary engineering secrets |
| `vercel.json` | Community / Config | Community edition; no proprietary engineering secrets |

---

## Verification Checklist

- [x] No investor financial data in tracked files
- [x] No internal deployment guides in tracked files
- [x] No OS/kernel source in tracked files
- [x] No Rust target/ build artifacts
- [x] Build passes locally
- [x] Vercel prebuild check passes
- [ ] Public commit pushed to GitHub (pending user approval)
- [ ] Vercel production deploy verified post-push
