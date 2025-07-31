# Tau OS App Store (TauStore) & Core Apps

## Core Default Apps
Tau OS ships with a minimal, privacy-respecting set of default apps, written in C or Rust for speed and safety:

- **Terminal Emulator:** xterm or Alacritty-based
- **Text Editor:** nano or micro clone
- **File Manager:** ranger-style TUI (with future GUI)
- **Media Player:** VLC-style, minimal dependencies
- **Web Browser:** NetSurf (upgradeable to WebKitGTK/Servo)
- **Settings Panel:** Wi-Fi, updates, users, power
- **Messaging Hub:** Wrapper for Matrix, WhatsApp Web, Telegram Web

## Tau App Store (TauStore)
- Written in Rust or Go
- Supports native `tau-pkg` packages (lightweight binary format)
- Supports containerized apps via Flatpak backend
- UI: GTK frontend, backend REST API
- Features: app reviews, changelogs, install/update/remove, background downloads

### Architecture
- **pkgd:** CLI and daemon for package management (Rust or Go)
- **TauStore Backend:** REST API for app metadata, reviews, updates
- **TauStore UI:** GTK-based frontend for browsing/installing apps
- **Flatpak Integration:** Sandboxed app support

### App Manifest (JSON Spec)
Each app must provide a manifest (e.g., `tau-app.json`):

```json
{
  "id": "org.tauos.editor",
  "name": "Tau Editor",
  "version": "1.0.0",
  "description": "A lightweight text editor for Tau OS.",
  "author": "Tau Team",
  "license": "MIT",
  "arch": ["arm64", "x86_64"],
  "category": "Utilities",
  "icon": "icon.png",
  "exec": "/apps/editor",
  "sandbox": true,
  "permissions": ["network", "filesystem:ro"]
}
```

### Package Format
- **tau-pkg:** Compressed tarball with manifest, binary, and resources
- **Flatpak:** Supported for containerized apps

### Example Directory Structure
```
/apps/editor/
  tau-app.json
  editor (binary)
  icon.png
```

## Package Management CLI (`core/pkgd.rs` or `pkgd.go`)
- Install, remove, update, list packages
- Query app metadata
- Integrate with TauStore backend for app discovery

---

## Future Plans
- Delta updates for apps
- App sandboxing and permission management
- User ratings and reviews
- Developer portal for app submissions 