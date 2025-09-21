# Tau OS App Sandbox & Permissions

Tau OS apps run in a secure sandbox enforced at runtime by `sandboxd`.

## How It Works
- When you run your app (via session manager, TauStore, or `tau run`), `sandboxd`:
  - Reads your `tau.toml` manifest
  - Generates an AppArmor/SELinux profile based on permissions
  - Applies Linux namespaces for isolation
  - Drops privileges (no-root)
  - Launches your app and monitors for violations

## Manifest-to-Policy Mapping
- Example:
  ```toml
  [permissions]
  network = true
  camera = false
  filesystem = "ro"
  ```
- `network = true` → allows network syscalls
- `filesystem = "ro"` → read-only file access
- `camera = false` → denies access to camera devices

## Troubleshooting
- If your app is denied a permission or terminated:
  - Check the security log for violation messages
  - Review your manifest permissions
  - Adjust permissions as needed and rebuild

## SDK Integration
- `tau run` always launches your app in a sandbox
- You can query granted permissions at runtime via the SDK
- Future: runtime permission prompts and requests

---

**Tau SDK: Secure by Default, Developer Friendly.** 