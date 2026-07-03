#!/bin/bash
# TauOS Real ISO Build — wrapper for unified build pipeline
set -euo pipefail
ARCH="${1:-x86_64}"
export TAUOS_ARCH="$ARCH"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "TauOS Real ISO Builder (arch=$ARCH)"
echo "Delegating to scripts/build-tauos.sh ..."

if [[ "$OSTYPE" == "darwin"* ]]; then
  exec "$ROOT/scripts/build-tauos.sh" --docker --arch="$ARCH"
else
  exec "$ROOT/scripts/build-tauos.sh" --arch="$ARCH"
fi
