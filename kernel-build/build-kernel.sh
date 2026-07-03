#!/bin/bash
# Build real Linux kernel for TauOS
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export TAUOS_ROOT="$ROOT/.."
export TAUOS_ARCH="${1:-x86_64}"
exec "$ROOT/../scripts/build-tauos-native.sh" 2>/dev/null || \
exec "$ROOT/../scripts/build-tauos.sh" --docker --arch="$TAUOS_ARCH"
