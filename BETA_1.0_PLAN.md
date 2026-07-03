# TauOS Beta 1.0 — Hour Plan (not days)

**Target:** Public beta download for x86_64 PCs with honest scope.  
**Clock starts:** When build + test pipeline is green.

---

## Hour 0–2 — Prove it boots

| Hour | Task | Done when |
|------|------|-----------|
| 0–0.5 | Install QEMU on Mac (`brew install qemu`) | `qemu-system-x86_64` works |
| 0.5–1.5 | `./scripts/qemu-smoke-test.sh` — GUI boot | GRUB → live → TauOS desktop visible |
| 1.5–2 | Fix any boot blocker (initramfs, service, display) | Second boot succeeds |

**Owner:** Dev + you (watch the screen).

---

## Hour 2–4 — Prove it installs

| Hour | Task | Done when |
|------|------|-----------|
| 2–2.5 | Flash ISO to USB (Etcher) | Bootable stick |
| 2.5–3.5 | Boot spare PC/VM → **Install to Disk** or `tauos-install` | Installed to internal drive |
| 3.5–4 | Reboot from disk → desktop loads; Wi‑Fi/browser smoke test | Daily-use sanity check |

**Owner:** Anyone with a PC + USB.

---

## Hour 4–6 — Beta product polish (code)

| Hour | Task | Done when |
|------|------|-----------|
| 4–4.5 | Beta branding in OS (`VERSION_CODENAME=beta`, welcome text) | `/etc/os-release` says Beta |
| 4.5–5 | First-login password change (no shipping `tau/tauos` silently) | Install or first boot forces new password |
| 5–5.5 | `/beta` known issues + install guide pages on site | Links from `/download` |
| 5.5–6 | Bundle fresh ISO into Electron USB wizard resources | `build-all-artifacts.sh` produces updated `.dmg`/`.exe` |

**Owner:** Dev (automated in repo).

---

## Hour 6–8 — Ship the bits

| Hour | Task | Done when |
|------|------|-----------|
| 6–6.5 | Host ISO (R2/S3/GitHub Release) — `scripts/upload-beta-iso.sh` | Public HTTPS URL |
| 6.5–7 | Point manifest + download page at hosted URL (or `/downloads/` on Vercel if size allows) | Download works off-site |
| 7–7.5 | `./scripts/run-release-tests.sh` — all green | Log archived |
| 7.5–8 | Deploy website to Vercel (no full app suite required) | tauos.org/download live |

**Owner:** Dev + whoever has cloud credentials.

---

## Hour 8–10 — Beta launch pack

| Hour | Task | Done when |
|------|------|-----------|
| 8–8.5 | Beta announcement copy + support email visible | `/beta` page complete |
| 8.5–9 | SHA256 on download page matches hosted ISO | User can verify |
| 9–9.5 | Internal smoke: download → checksum → USB doc | Checklist signed off |
| 9.5–10 | **Tag `beta-1.0.0`** + limited invite (team, 5–10 testers) | Feedback channel open |

**Owner:** You + team.

---

## Hour 10–12 — Buffer / hotfix

| Hour | Task | Done when |
|------|------|-----------|
| 10–12 | Fix top 1–3 tester blockers; rebuild ISO if needed | Beta 1.0.1 optional |

---

## Explicitly NOT in Beta 1.0 hours

- Mobile OS UI
- macOS-as-main-OS / Apple Silicon native installer
- Windows ARM installer
- Full offline TauMail/TauCloud in image
- Enterprise MDM / SLA

---

## Success criteria (Beta 1.0)

1. Real 400MB ISO hosted with published SHA256  
2. Website download page accurate (auto-detect + manifest)  
3. At least one verified: **live boot** + **disk install** + **desktop UI**  
4. Known issues documented; default passwords not silent in production install  
5. Support contact published  

---

## Commands cheat sheet

```bash
# Rebuild corporate ISO (M1)
TAUOS_REBUILD_ROOTFS=1 ./scripts/build-tauos.sh --docker

# Release gate
./scripts/run-release-tests.sh

# Manifest
./scripts/generate-download-manifest.sh

# QEMU (Mac)
brew install qemu && ./scripts/qemu-smoke-test.sh

# Full artifacts (ISO + installers)
./scripts/build-all-artifacts.sh
```
