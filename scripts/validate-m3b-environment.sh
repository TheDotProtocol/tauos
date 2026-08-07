#!/usr/bin/env bash
# M3B — validate Mac host + Docker (run from tauos root)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
pass=0 fail=0 warn=0

ok()   { echo "  PASS  $*"; pass=$((pass+1)); }
no()   { echo "  FAIL  $*"; fail=$((fail+1)); }
warn() { echo "  WARN  $*"; warn=$((warn+1)); }

echo "=== Tau M3B Host Validation (macOS) ==="

command -v docker >/dev/null && ok "docker $(docker --version)" || no "docker"
docker compose version >/dev/null 2>&1 && ok "docker compose $(docker compose version --short 2>/dev/null || docker compose version)" || no "docker compose"
docker info >/dev/null 2>&1 && ok "Docker daemon running" || no "Docker daemon not running — open Docker Desktop"

command -v git >/dev/null && ok "git $(git --version)" || no "git"
command -v java >/dev/null && ok "java $(java -version 2>&1 | head -1)" || no "java"
command -v python3 >/dev/null && ok "python3 $(python3 --version)" || no "python3"
command -v node >/dev/null && ok "node $(node -v)" || no "node"
command -v rustc >/dev/null && ok "rustc $(rustc --version)" || warn "rustc (optional on host — in container)"
command -v clang >/dev/null && ok "clang $(clang --version | head -1)" || warn "clang"

SDK="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
[[ -x "$SDK/platform-tools/adb" ]] && ok "adb $(adb version 2>&1 | head -1)" || no "adb — install Android Studio SDK"
[[ -x "$SDK/platform-tools/fastboot" ]] && ok "fastboot" || warn "fastboot"
[[ -x "$SDK/emulator/emulator" ]] && ok "Android emulator binary" || warn "Android emulator — install via SDK Manager"
command -v qemu-system-aarch64 >/dev/null && ok "qemu-system-aarch64" || warn "qemu (brew install qemu)"

command -v repo >/dev/null && ok "repo" || warn "repo not on host (OK — available in Docker)"

FREE_GB=$(($(df -k "$ROOT" | awk 'NR==2 {print $4}') / 1024 / 1024))
[[ "$FREE_GB" -ge 50 ]] && ok "Disk free: ${FREE_GB} GB (project volume)" || warn "Low disk: ${FREE_GB} GB"

[[ -f "$ROOT/docker/docker-compose.yml" ]] && ok "docker/docker-compose.yml" || no "missing docker compose"

echo ""
if [[ -f "$ROOT/docker/Dockerfile" ]]; then
  echo "=== Container validation ==="
  if docker compose -f "$ROOT/docker/docker-compose.yml" run --rm tau-dev tau-validate 2>/dev/null; then
    ok "Container toolchain validation"
  else
    warn "Container not built yet — run: cd docker && docker compose build"
  fi
fi

echo ""
echo "Result: $pass pass, $warn warn, $fail fail"
[[ "$fail" -eq 0 ]]
