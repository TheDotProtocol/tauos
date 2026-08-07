# Tau Core Mobile Beta — AOSP Build (Milestone 3)

Clean AOSP only. **No Tau branding, launcher, or apps.**

| Item | Value |
|------|--------|
| Branch | `android-14.0.0_r67` (see `config/aosp-version.env`) |
| Lunch | `aosp_arm64-eng` |
| Workspace | `~/tau-aosp-workspace` (outside git) |
| Figma (UI, later) | [Tau Core Mobile OS UI](https://www.figma.com/design/SyttNz970dAe4MSnkrCxdw/Tau-Core-Mobile-OS-UI) |

## Quick start

```bash
# 1. Validate host
./scripts/validate-environment.sh

# 2. Linux build host (canonical)
./scripts/setup-host-linux.sh   # Ubuntu 22.04 once
./scripts/sync-aosp.sh          # ~100 GB, 1–3 h
./scripts/build-aosp.sh         # 2–6 h first build

# 3. macOS — emulator path (until Linux build ready)
./scripts/setup-host-macos.sh
./scripts/configure-emulator.sh
```

Full details: **BUILD.md**

## Architecture (future — not M3)

```
Tau Apps → Tau Runtime → Tau Services → Tau Compatibility Layer → AOSP → Linux
```

M3 stops at **bootable clean AOSP**. Tau layers begin at Milestone 5+.

## Rules

- Do **not** modify AOSP framework source in M3/M4 unless documented (overlays preferred).
- AOSP tree never committed to git.
