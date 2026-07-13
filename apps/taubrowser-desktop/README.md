# Tau Browser — Native App

Privacy-first cross-platform browser built with [Tauri 2](https://v2.tauri.app).

## Quick start

```bash
# From repo root
npm run browser:setup          # DB tables (once)
cd apps/taubrowser-desktop
npm install
npm run dev                    # Launch in dev mode
```

## Requirements

- **All platforms:** Rust 1.77+, Node 20+
- **macOS:** Xcode Command Line Tools
- **Windows:** WebView2 (auto-installed by installer)
- **Linux:** `webkit2gtk-4.1`, `libappindicator3`, `librsvg2`
- **Android:** JDK 17, Android SDK, NDK
- **iOS:** Xcode 15+, Apple Developer account

## Architecture

```
apps/taubrowser-desktop/
├── index.html          # Browser chrome UI
├── src/main.js         # Navigation, blocklist, sync
└── src-tauri/          # Rust shell + embedded blocklist
    └── src/blocklist.json
```

Syncs with `https://www.tauos.org/api/taubrowser/*` using Tau ID SSO token.

## Privacy

- Embedded tracker/ad blocklist (synced from API on startup)
- HTTPS-only navigation
- Zero telemetry — no crash reporters, no analytics
- Optional encrypted sync (bookmarks, history, settings)

## Build release

```bash
npm run build
# Artifacts in src-tauri/target/release/bundle/
```

Or tag `taubrowser-v*` to trigger GitHub Actions.
