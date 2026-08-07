#!/usr/bin/env bash
# Validate host readiness for AOSP sync/build (Milestone 3)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck source=/dev/null
source "$ROOT/config/aosp-version.env"

PASS=0
WARN=0
FAIL=0

ok()   { echo "[OK]   $*"; PASS=$((PASS + 1)); }
warn() { echo "[WARN] $*"; WARN=$((WARN + 1)); }
fail() { echo "[FAIL] $*"; FAIL=$((FAIL + 1)); }

echo "=== Tau AOSP Environment Validation ==="
echo "Host: $(uname -s) $(uname -m)"
echo "Workspace: $AOSP_WORKSPACE"
echo ""

# Disk (need ≥250 GB free at workspace mount)
WS_PARENT="$(dirname "$AOSP_WORKSPACE")"
if [[ -d "$WS_PARENT" ]]; then
  FREE_KB=$(df -k "$WS_PARENT" | awk 'NR==2 {print $4}')
  FREE_GB=$((FREE_KB / 1024 / 1024))
  if [[ "$FREE_GB" -ge 250 ]]; then ok "Disk free: ${FREE_GB} GB (≥250 GB)"
  elif [[ "$FREE_GB" -ge 230 ]]; then warn "Disk free: ${FREE_GB} GB (250+ GB recommended)"
  else fail "Disk free: ${FREE_GB} GB (need ≥230 GB)"; fi
else
  warn "Workspace parent missing; will create $AOSP_WORKSPACE"
fi

# RAM
if [[ "$(uname -s)" == "Darwin" ]]; then
  RAM_B=$(sysctl -n hw.memsize 2>/dev/null || echo 0)
  RAM_GB=$((RAM_B / 1024 / 1024 / 1024))
  [[ "$RAM_GB" -ge 16 ]] && ok "RAM: ${RAM_GB} GB" || warn "RAM: ${RAM_GB} GB (16+ GB recommended; could not verify in sandbox)"
fi

# Tools
command -v git >/dev/null && ok "git: $(git --version)" || fail "git not found"
command -v python3 >/dev/null && ok "python3: $(python3 --version 2>&1)" || fail "python3 not found"
command -v curl >/dev/null && ok "curl present" || fail "curl not found"
command -v repo >/dev/null && ok "repo present" || fail "repo not found (install: mobile/aosp/BUILD.md)"

if [[ "$(uname -s)" == "Darwin" ]]; then
  xcode-select -p >/dev/null 2>&1 && ok "Xcode CLI tools installed" || fail "Xcode CLI tools missing"
  warn "Full AOSP platform build: use Ubuntu 22.04 x86_64/ARM64 Linux (see BUILD.md). macOS = emulator dev only for M3."
fi

if [[ "$(uname -s)" == "Linux" ]]; then
  for pkg in git curl python3 bc flex bison build-essential; do
    dpkg -l "$pkg" &>/dev/null && ok "deb: $pkg" || warn "deb missing: $pkg (run setup-host-linux.sh)"
  done
fi

# Workspace state
if [[ -d "$AOSP_WORKSPACE/.repo" ]]; then
  ok "AOSP workspace initialized ($AOSP_WORKSPACE/.repo)"
  if [[ -f "$AOSP_WORKSPACE/build/make/core/main.mk" ]]; then
    ok "AOSP tree present (build/make found)"
  else
    warn "repo initialized but tree incomplete — run sync-aosp.sh"
  fi
else
  warn "AOSP not synced yet — run sync-aosp.sh"
fi

# Emulator
if command -v emulator >/dev/null; then
  ok "Android emulator CLI on PATH"
elif [[ -d "${ANDROID_HOME:-}/emulator" ]]; then
  warn "emulator not on PATH; set ANDROID_HOME and PATH (see configure-emulator.sh)"
else
  warn "Android Studio / emulator not detected"
fi

echo ""
echo "=== Summary: $PASS passed, $WARN warnings, $FAIL failures ==="
[[ "$FAIL" -eq 0 ]]
