#!/usr/bin/env bash
# M6 — verify @tau/core service foundation
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PKG="$ROOT/packages/tau-core"

echo "=== M6 Tau Core Services Verification ==="
cd "$PKG"
npm install --silent 2>/dev/null || npm install
npm run typecheck
echo "PASS  @tau/core typecheck"
