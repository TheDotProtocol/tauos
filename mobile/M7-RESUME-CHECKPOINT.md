# M7 Resume Checkpoint — 2026-08-07

**Pause point:** Gradle cannot download on your Mac network. Everything else is saved in git.

---

## Why the build fails

The error is **`java.net.ConnectException: Operation timed out`** when Gradle tries to reach:

`https://services.gradle.org/distributions/gradle-8.6-all.zip`

This is **not** a code bug. Your Mac cannot open a TCP connection to Gradle’s servers right now. Common causes:

- Unstable Wi‑Fi or ISP routing
- VPN / corporate firewall blocking `services.gradle.org`
- Proxy required but not configured for Java (`HTTP_PROXY` / `HTTPS_PROXY`)
- Temporary outage on your network path

Increasing `networkTimeout` only helps **slow** downloads. It does **not** fix **cannot connect**.

**Local state:**

| Item | Status |
|------|--------|
| JS bundle (`index.android.bundle`) | ✅ Updated (bundle step works) |
| Debug APK (`app-debug.apk`) | ⚠️ From earlier build (~13:53) — may not include latest bundle |
| Gradle 8.6 in `~/.gradle/wrapper/dists/` | ❌ Incomplete (`.part` / `.lck` only) |

---

## When you return (~1 hour)

### Terminal 1 — Emulator (keep open)

```bash
cd /Users/mac/Downloads/tauos
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"
emulator -avd Pixel_7
```

Wait until boot completes (`adb shell getprop sys.boot_completed` → `1`).

### Terminal 2 — Option A: Full build (preferred once network works)

```bash
cd /Users/mac/Downloads/tauos
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/platform-tools"

# Test network first
curl -I --connect-timeout 10 https://services.gradle.org/distributions/gradle-8.6-all.zip

# If curl succeeds, bootstrap Gradle then install
./scripts/mobile/bootstrap-gradle.sh
./scripts/mobile/install-tau-launcher.sh
```

### Terminal 2 — Option B: Install existing APK (no Gradle, works offline)

Use this to see **something** on the emulator while Gradle is blocked. UI may be slightly older than latest bundle.

```bash
cd /Users/mac/Downloads/tauos
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/platform-tools"

./scripts/mobile/install-tau-launcher.sh --install-only
```

### Terminal 2 — Option C: Manual Gradle download (if curl works but gradlew fails)

```bash
./scripts/mobile/bootstrap-gradle.sh
cd mobile/apps/tau-launcher/android && ./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.tau.launcher/.MainActivity
```

---

## Verify M7.1 on emulator

Compare to Figma **Section 2 → Launcher → Home**:

- Black background
- Gold `#c9a84c` app icons, 4×2 grid
- “Search apps” bar at top
- No widgets, no bottom tabs on this frame

```bash
M7_BATCH=M7.1 ./scripts/mobile/verify-tau-launcher.sh
```

---

## What’s saved in git (this checkpoint)

- M7.0 scaffold + M7.1 Figma-aligned home screen
- `@tau/mobile-design` tokens
- `scripts/mobile/install-tau-launcher.sh` (retry + `--install-only`)
- `scripts/mobile/bootstrap-gradle.sh`
- Gradle wrapper timeout 120s
- `PROJECT_STATUS.md`

---

## Next after successful install

1. Review home screen vs Figma
2. Export Figma vector icons → `mobile/apps/tau-launcher/assets/figma/`
3. **STOP** — await approval before M7.2 (widgets screen)

---

## If network still fails after break

1. Try phone hotspot or different Wi‑Fi
2. Disable VPN temporarily
3. Use Android Studio: **File → Settings → Build → Gradle** — set Gradle user home and let Studio download
4. Copy complete `~/.gradle/wrapper/dists/gradle-8.6-all/` from another machine via USB
