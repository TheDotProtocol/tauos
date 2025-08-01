# Tau OS GUI Core Components

Tau OS features a modern, responsive, and accessible graphical interface built with GTK and the custom TauKit UI toolkit.

## Architecture
- **Launcher:** App grid, search/filter, recent/favorites, real app discovery, keyboard shortcuts, accessibility, animations
- **Dock:** Pinned/running apps, quick actions, drag-and-drop, auto-hide
- **Settings Panel:** Wi-Fi, display, power, users, privacy (tabbed)
- **TauKit:** Reusable GTK widgets, Black & Gold theme, glassmorphism, app discovery, animated grid

## Tech Stack
- Rust + GTK4 (via `gtk4-rs`)
- CSS for theming (Black & Gold, glassmorphism)
- Responsive layouts for desktop, tablet, and phone
- Accessibility and localization support

## Directory Structure
- `launcher/` — Launcher app source and assets
- `dock/` — Dock bar source
- `settings/` — Settings panel source
- `taukit/` — Reusable GTK widgets and theme

## Build Instructions
1. Install Rust and GTK4 development libraries
2. `cd gui/launcher && cargo build --release`
3. `cd gui/dock && cargo build --release`
4. `cd gui/settings && cargo build --release`
5. Run with `./target/release/launcher` (or dock/settings)

## Usage Notes
- Launcher now supports real app discovery (TauPkg manifests in `/apps/`), search/filter, recent/favorites, and animations
- Keyboard shortcuts for navigation and launching
- Accessibility: screen reader, high contrast mode
- Dock and Settings integrate with Launcher for seamless UX

## Demo/Testing
- Place TauPkg apps with `tau-app.json` manifests in `/apps/`
- Run launcher: `./target/release/launcher`
- Try searching, keyboard navigation, and launching apps

---

**Tau OS: Minimal, Beautiful, and Responsive.** 