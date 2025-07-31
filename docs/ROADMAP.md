# Tau OS Roadmap (MVP)

## Core Goals
- Fast boot (sub-10s on reference hardware)
- Privacy-respecting, encrypted by default
- Built-in app store (TauPkg)
- WhatsApp/Telegram/Web app support (via webview or container)
- Native media player (VLC-like)
- Touch and pen support for tablets
- Minimal, luxury-inspired Black & Gold UI

## Milestones

### Alpha
- Kernel boots on QEMU (ARM64/x86_64)
- GRUB/EFI bootloader integration
- Basic init system and networking
- Minimal GUI (Wayland/GTK launcher)
- TauPkg CLI prototype
- HAL for input/display

### Beta
- OTA update system
- App store UI
- Default apps (media, text, browser shell)
- Installer scripts
- Hardware support for MacBook, Surface, ARM boards

### 1.0
- Full-disk encryption by default
- Battery optimization
- OEM HAL modules
- Polished UI/UX
- CI/CD for image builds 