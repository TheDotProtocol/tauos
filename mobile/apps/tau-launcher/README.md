# Tau Launcher

**Milestone:** M7 — Tau User Experience (Track A)  
**Design:** [Figma — Tau Core Mobile OS UI](https://www.figma.com/design/SyttNz970dAe4MSnkrCxdw/Tau-Core-Mobile-OS-UI)

Standalone React Native launcher app. Installs on Android Studio emulator via `adb`.

## Design system

All UI consumes tokens from `@tau/mobile-design` — **never hardcode** colors, spacing, typography, radii, shadows, or motion values.

```typescript
import { tauTheme } from '@tau/mobile-design';
```

## M7 batches

| Batch | Status |
|-------|--------|
| M7.0 Scaffold + tokens | ✅ |
| M7.1 TauHomeScreen layout | Pending |
| M7.2 Widget grid + glass | Pending |
| M7.3 FAB + app drawer | Pending |
| M7.4 Bottom nav | Pending |
| M7.5 Verify script + docs | Pending |

## Run on emulator

### Option A — Standalone (recommended; no Metro)

Bundles JavaScript into the APK. Use this when you install via `adb` only:

```bash
cd /Users/mac/Downloads/tauos
./scripts/mobile/install-tau-launcher.sh
```

### Option B — Development (Metro hot reload)

Requires **two terminals** — emulator in terminal 1, Metro in terminal 2:

```bash
# Terminal 2
cd mobile/apps/tau-launcher
npm start

# Terminal 3
adb reverse tcp:8081 tcp:8081
npm run android
```

If you see a red screen **"Unable to load script"** or **"Could not connect to development server"**, Metro is not running — use Option A or start Metro (Option B).

### Which app icon?

| Icon label | Package | Notes |
|------------|---------|-------|
| **Tau Launcher** | `com.tau.launcher` | M7 — use this |
| Tau Talk (old) | `com.tautalkmobile` | Legacy prototype — also needs Metro; ignore for M7 |

Launch Tau Launcher:

```bash
adb shell am start -n com.tau.launcher/.MainActivity
```

## Verify (M7.0)

```bash
./scripts/mobile/verify-tau-launcher.sh
```
