# TauStore GTK Frontend

TauStore is the official app store frontend for Tau OS, providing a beautiful, responsive, and secure way to discover, install, and review apps.

## Features
- Catalog view: browse/search/filter apps (live from backend)
- App detail pages: screenshots, descriptions, reviews (live from backend)
- Install, update, uninstall apps (integrates with TauPkg)
- Review posting UI (uses JWT auth)
- Login form and JWT storage (in memory)
- Notifications for updates and downloads
- Keyboard, mouse, and touch support
- Black & Gold theme, TauKit widgets
- Loading spinners and error messages

## Build & Run
```
cd taustore/frontend
cargo build --release
./target/release/taustore-frontend
```

## Integration
- Communicates with TauStore backend REST API for app data, reviews, uploads, and authentication
- Calls TauPkg CLI for install/update/uninstall
- Uses TauKit for consistent UI/UX

## Usage Notes
- Requires TauStore backend running at http://localhost:8000/
- Login with a registered user to post reviews
- All UI is accessible and responsive

---

**TauStore: Discover, Install, and Enjoy Apps on Tau OS.** 