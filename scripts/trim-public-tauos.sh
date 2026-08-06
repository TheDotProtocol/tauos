#!/usr/bin/env bash
# Remove private paths from public tauos repo (keeps local files with --cached).
# Usage: ./scripts/trim-public-tauos.sh
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

REMOVE_PATHS=(
  os os-code kernel-build bootloader hal initrd-fix release-files
  audit hardware-validation qemu-vms infrastructure database developerhub
  website website-replit new-website newebsite mobileosui TauTalkMobile
  ci build output images macos_iso_build marketing_iso_build
  driver-integration flatpak-integration gui core pkgmgr sandboxd ota-system
  monitoring examples export finaldocumentation design apps installer
)

REMOVE_SCRIPTS=(
  scripts/build-tauos.sh scripts/build-tauos-native.sh scripts/configure-tauos-rootfs.sh
  scripts/Dockerfile.tauos-build scripts/build-all-artifacts.sh
  scripts/build-linux-deb-docker.sh scripts/validate-os-artifacts.sh
  scripts/run-release-tests.sh scripts/deploy_launch_ready.sh scripts/split-tauos-repos.sh
)

REMOVE_DOCS=(
  TAUOS-PROJECT-STATUS-REPORT.md COMPREHENSIVE_TEST_SUITE.md COMPREHENSIVE_TEST_RESULTS.md
  PRODUCTION_DEPLOYMENT.md PRODUCTION_READINESS_COMPLETE.md REDIS_SETUP_COMPLETE.md
  PRIVACY_IMPLEMENTATION_COMPLETE.md TERMINAL_IMPLEMENTATION.md LAUNCH.md STATUS.md
  PLAN_OF_ACTION.md README_EXPORTS.md
)

echo "=== Trim public tauos (git rm --cached, keep local files) ==="
for p in "${REMOVE_PATHS[@]}"; do
  [[ -e "$p" ]] && git rm -r --cached "$p" 2>/dev/null || true
done
for s in "${REMOVE_SCRIPTS[@]}"; do
  [[ -f "$s" ]] && git rm --cached "$s" 2>/dev/null || true
done
for d in "${REMOVE_DOCS[@]}"; do
  [[ -f "$d" ]] && git rm --cached "$d" 2>/dev/null || true
done

# Keep public-facing scripts
git add README.md public/downloads/manifest.json scripts/publish-os-release.sh \
  scripts/generate-download-manifest.sh scripts/push-tauos-core-lean.sh .gitignore 2>/dev/null || true

echo "✓ Staged removals. Run: git commit -m 'Move OS internals to private tauos-core repo'"
