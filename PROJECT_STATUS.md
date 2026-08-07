# Tau Core Mobile Beta — Project Status

**Updated:** 2026-08-07 (M7.1 checkpoint — Gradle network blocked on host; see `docs/M7-RESUME-CHECKPOINT.md`)  
**Branch:** `main`  
**Directive:** `docs/ENGINEERING_DIRECTIVE.md` v1.0  
**Strategy:** Parallel tracks — Track A (UX) + Track B (build portability)

---

## Current milestone

**M7 — Tau Launcher** — M7.1 ✅ complete · **M7.2 next** (await approval)  
**Track B — Provider-independent build strategy** 📋 Documented — no cloud deployed

**Previous:** M5.1 ✅ · M6 ✅

---

## Development strategy (60-day cycle)

### Track A — Tau User Experience

| Milestone | Status | Target |
|-----------|--------|--------|
| **M7** Tau Launcher | 🔄 M7.1 ✅ · M7.2 next | Figma → emulator |
| M8 Tau System UI | ⏸ | Not started |
| M9 Tau Settings | ⏸ | Not started |
| M10 Tau Lock Screen | ⏸ | Not started |
| M11 Tau Notifications | ⏸ | Not started |

**Design:** [Figma — Tau Core Mobile OS UI](https://www.figma.com/design/SyttNz970dAe4MSnkrCxdw/Tau-Core-Mobile-OS-UI) — pixel-perfect, no redesigns.

### Track B — Infrastructure Research

| Item | Status |
|------|--------|
| Provider-independent build strategy | ✅ `docs/provider-independent-build-strategy.md` |
| Build server portability guide | ✅ `docs/build-server-portability.md` |
| AWS / cloud deployment | ❌ Not created (by design) |
| CI/CD pipelines | ❌ Not created (by design) |
| M5.2 AOSP Tau ROM build | ⏸ When Ubuntu build host ready |

---

## Completed work

### M5.1 — Compatibility Platform
- Product makefile, overlays, `ro.tau.*` props
- `verify-compatibility-layer.sh`, `apply-compatibility-to-aosp.sh`
- Baseline GMS audit: `docs/m5-baseline-google-audit.md`

### M6 — Core Services Foundation
- `@tau/core` — 12 interfaces, registry, foundation stubs
- `verify-tau-core-services.sh`

### Track B — Build portability (this session)
- AWS cancellation impact analysis
- Artifact + backup strategy
- Docker-identical recreate procedure on any Ubuntu 22.04 host

### Track A — M7
- **M7.0 ✅** — Design system, scaffold, bundled APK install
- **M7.1 ✅** — Static `TauHomeScreen` (status, widgets, dock)
- `docs/m7.1-home-screen.md` · `scripts/mobile/install-tau-launcher.sh`

---

## Overall progress

| Milestone | Status |
|-----------|--------|
| M1–M4 | ✅ |
| M3B Dev environment | ✅ |
| M5 Planning | ✅ |
| M5.1 Compatibility impl | ✅ |
| M6 Core Services foundation | ✅ |
| M5.2 AOSP tau image | ⏸ Track B |
| M7.0 Launcher scaffold | ✅ |
| M7.1 Home screen (static) | ✅ |
| M7.2–M7.5 | ⏸ M7.2 next |
| M8–M11 System UX | ⏸ |

---

## Build status

| Check | Status |
|-------|--------|
| `verify-compatibility-layer.sh` | ✅ |
| `verify-tau-core-services.sh` | ✅ |
| `validate-m3b-environment.sh` | ✅ |
| `npm run build` (website) | ✅ |
| Emulator boot (`Pixel_7`) | ✅ |
| Custom Tau ROM | ⏸ |
| `verify-tau-launcher.sh` (M7.1) | ✅ |
| Tau Launcher home screen | ✅ M7.1 static |

---

## Compatibility layer status

| Asset | Location |
|-------|----------|
| Product | `mobile/compatibility/product/tau_compatibility.mk` |
| Props | `ro.tau.platform=aosp-beta` |
| Docs | `docs/m5.1-compatibility-implementation.md` |

No de-Google yet — intentional until M5.2.

---

## Service foundation status

| Package | Path |
|---------|------|
| `@tau/core` | `packages/tau-core/` |
| Docs | `docs/m6-core-services-foundation.md` |
| Interfaces | 12 defined |
| Stubs | identity, storage, logging |

---

## Infrastructure notes

- **Build host:** Any Ubuntu 22.04 + Docker — AWS, Hetzner, OVH, DO, local, or future Tau server
- **Artifacts:** GitHub Releases (primary); provider object storage optional mirror
- **Signing keys:** Must live outside any cloud VM
- **Mac role:** Cursor, Docker toolchain, Android Studio emulator (Track A)

See `docs/provider-independent-build-strategy.md` and `docs/build-server-portability.md`.

---

## Home screen status (M7.1)

| Element | Status |
|---------|--------|
| Figma black + gold theme | ✅ |
| Search bar (Search apps) | ✅ |
| 4×2 app icon grid | ✅ |
| Empty lower area | ✅ |
| HTML widget layout | ❌ Removed from home |
| Figma vector assets | ⏸ Placeholder glyphs |

---

## Known issues

1. Custom AOSP lunch not tested — awaiting Track B build host  
2. `Pixel_7` AVD uses Google Play image — OK for Track A  
3. Glass blur uses token fallback (no native blur library) — matches M7 plan  
4. Legacy `com.tautalkmobile` may still appear on emulator — uninstall optional

---

## Next recommended step

1. **Review M7.1** on emulator — full home screen vs Figma  
2. **Approve M7.2** — widget glass polish (if separate from M7.1 sign-off)  
3. **Track B:** Ubuntu build host when ready

**STOP — do not start M7.2 until M7.1 approved.**

---

## Verify commands

```bash
cd /Users/mac/Downloads/tauos
./scripts/mobile/verify-compatibility-layer.sh
./scripts/mobile/verify-tau-core-services.sh
M7_BATCH=M7.1 ./scripts/mobile/verify-tau-launcher.sh
./scripts/mobile/install-tau-launcher.sh
./scripts/validate-m3b-environment.sh
```

---

## Workflow

Mac → Docker → Cursor → Android Studio → GitHub → Redmi Note 9 Pro · **60-day releases**
