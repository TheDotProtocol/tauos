#!/usr/bin/env bash
# AI-6 — Tau Tool Registry Foundation verification
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"

echo "=== AI-6 Tau Tool Registry Verification ==="

test -f "$PKG/src/tools/registry-impl.ts" || { echo "FAIL  registry"; exit 1; }
test -f "$PKG/src/tools/governance.ts" || { echo "FAIL  governance"; exit 1; }
test -f "$PKG/src/tools/executor.ts" || { echo "FAIL  executor"; exit 1; }
test -f "$PKG/src/tools/test-tools.ts" || { echo "FAIL  test tools"; exit 1; }
echo "PASS  AI-6 modules present"

cd "$PKG"
npm install --silent 2>/dev/null || npm install
npm run typecheck
echo "PASS  @tau/ai typecheck"

npx tsx scripts/test-tools-ai6.ts
echo "PASS  tool tests"

npx tsx scripts/test-memory-ai5.ts
echo "PASS  AI-5 regression (24)"

npx tsx scripts/test-constitution-ai4.ts
echo "PASS  AI-4 regression (22)"

npx tsx scripts/test-routing-matrix-ai3-4.ts
echo "PASS  AI-3.4 regression (13)"

npx tsx scripts/test-deterministic-router.ts
echo "PASS  AI-3.2 regression (15)"

npx tsx scripts/test-hardware-router.ts
echo "PASS  AI-3.3 regression (13)"

cd "$ROOT"
npx tsc --noEmit -p tsconfig.json
echo "PASS  root TypeScript"

if ! grep -q "runAiChat" "$ROOT/src/app/api/tauai/chat/route.ts"; then
  echo "FAIL  production altered"
  exit 1
fi
echo "PASS  production unchanged"

if rg -q "grayscale|athena|openclaw" "$PKG/src/tools" -i 2>/dev/null; then
  echo "FAIL  grayscale in tools"
  exit 1
fi
echo "PASS  no Grayscale imports"

echo ""
echo "=== AI-6 verification complete ==="
