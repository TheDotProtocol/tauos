# Tau OS Privacy, Sandboxing & Security Model

Tau OS is designed from the ground up to be ultra-secure and privacy-first. This document outlines the core models and enforcement mechanisms.

## 🔐 Security Model
- **Least Privilege:** All system services run as unprivileged users wherever possible.
- **Mandatory Access Control (MAC):** AppArmor or a lightweight SELinux alternative restricts process capabilities.
- **No Root Login:** Root login is disabled. Privilege escalation is only via `sudo` with full logging.
- **Encrypted Home:** User home directories are encrypted by default (e.g., via eCryptfs or fscrypt).

## 🔒 Privacy Model
- **No Telemetry:** Tau OS collects no usage data or tracking information.
- **User Consent:** Apps must request explicit user consent for network access and sensitive permissions.
- **Secure Networking:** DNS-over-HTTPS is default; Tor networking is available for all apps.
- **Sandboxed Apps:** All App Store apps run in sandboxes with permission prompts.

## 🏗 Sandboxing System
- **Namespaces:** User, PID, and network namespaces isolate apps from the system and each other.
- **Seccomp:** System call filtering via seccomp profiles for each app.
- **Minimal Flatpak-Inspired:** Sandboxing is inspired by Flatpak but is lightweight and native to Tau OS.
- **Manifest-Driven:** Apps declare required permissions (camera, net, files, etc.) in a `manifest.tau` file.
- **Permission Prompts:** Users are prompted to grant or deny permissions at install and runtime.

## Example App Manifest (`manifest.tau`)
```json
{
  "id": "org.tauos.media",
  "permissions": ["network", "camera", "microphone", "filesystem:ro"]
}
```

## Enforcement
- **sandboxd:** Dedicated service that enforces sandboxing at runtime (see `sandboxd/`)
- **AppArmor/SELinux:** MAC policies loaded at boot and per-app
- **No root by default:** All user sessions and apps run as non-root

## Future Plans
- Per-app VPN and Tor routing
- User-facing permission manager
- Automated security updates
- Hardware-backed key storage

---

**Tau OS: Minimal, Secure, and Private by Design** 