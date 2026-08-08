#!/usr/bin/env bash
# AI-7 — Tau Execution Foundation verification
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"

echo "=== AI-7 Tau Execution Foundation Verification ==="

test -f "$PKG/src/execution/registry-impl.ts" || { echo "FAIL  registry"; exit 1; }
test -f "$PKG/src/execution/policy.ts" || { echo "FAIL  policy"; exit 1; }
test -f "$PKG/src/execution/executor.ts" || { echo "FAIL  executor"; exit 1; }
test -f "$PKG/src/execution/test-adapters.ts" || { echo "FAIL  test adapters"; exit 1; }
echo "PASS  AI-7 modules present"

cd "$PKG"
npm install --silent 2>/dev/null || npm install
npm run typecheck
echo "PASS  @tau/ai typecheck"

npx tsx scripts/test-execution-ai7.ts
echo "PASS  execution tests"

npx tsx scripts/test-tools-ai6.ts
echo "PASS  AI-6 regression (25)"

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

if rg -q "grayscale|athena|openclaw" "$PKG/src/execution" -i 2>/dev/null; then
  echo "FAIL  grayscale in execution"
  exit 1
fi
echo "PASS  no Grayscale imports"

echo ""
echo "=== AI-7 verification complete ==="
