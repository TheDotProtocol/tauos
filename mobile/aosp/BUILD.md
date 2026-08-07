# AOSP Build Guide — Milestone 3

## Host requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| OS (full build) | Ubuntu 22.04 LTS | Ubuntu 22.04 x86_64 |
| OS (emulator dev) | macOS 13+ Apple Silicon | macOS + Android Studio |
| RAM | 16 GB | 32 GB |
| Disk (workspace) | 250 GB free | 350 GB SSD |
| CPU | 8 cores | 16+ cores |

## Directory layout

```
tauos/mobile/aosp/          ← scripts + docs (in git)
~/tau-aosp-workspace/       ← AOSP source (NOT in git)
```

## Step 1 — Validate

```bash
cd mobile/aosp
chmod +x scripts/*.sh
./scripts/validate-environment.sh
```

## Step 2 — Install `repo`

**Linux:** `setup-host-linux.sh`  
**macOS:** `setup-host-macos.sh`

## Step 3 — Sync source

```bash
export AOSP_WORKSPACE=~/tau-aosp-workspace
./scripts/sync-aosp.sh
```

## Step 4 — Build (Linux only)

```bash
./scripts/build-aosp.sh
```

After build:

```bash
cd ~/tau-aosp-workspace
source build/envsetup.sh
lunch aosp_arm64-eng
emulator -verbose
```

## Step 5 — Emulator without full build (macOS)

Use Android Studio **AOSP** system image (not Google Play):

```bash
./scripts/configure-emulator.sh
```

Success = AVD boots to Android setup wizard, no Play Store.

## Milestone 3 success checklist

- [ ] `validate-environment.sh` — 0 failures
- [ ] `repo sync` complete
- [ ] `m` build complete (Linux) **or** AVD boots (macOS interim)
- [ ] Emulator reaches setup wizard
- [ ] No Tau code in AOSP tree

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `repo not found` | Run setup-host-*.sh, reload shell |
| Disk full | `AOSP_WORKSPACE` on external SSD |
| Mac build fails | Expected — use Linux for `build-aosp.sh` |
| Sync slow | `repo sync -j8`, stable network |

## Upgrade impact

Changing `AOSP_BRANCH` in `config/aosp-version.env` requires full re-sync. Document in commit message.
