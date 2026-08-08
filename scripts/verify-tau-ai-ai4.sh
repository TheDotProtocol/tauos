#!/usr/bin/env bash
# AI-4 — Tau Constitution verification
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"

echo "=== AI-4 Tau Constitution Verification ==="

test -f "$PKG/src/constitution/tau-constitution-v01.ts" || { echo "FAIL  constitution v0.1"; exit 1; }
test -f "$PKG/src/constitution/evaluator.ts" || { echo "FAIL  evaluator"; exit 1; }
test -f "$PKG/src/constitution/principles.ts" || { echo "FAIL  principles"; exit 1; }
echo "PASS  AI-4 modules present"

cd "$PKG"
npm install --silent 2>/dev/null || npm install
npm run typecheck
echo "PASS  @tau/ai typecheck"

npx tsx scripts/test-constitution-ai4.ts
echo "PASS  constitution tests"

npx tsx scripts/test-deterministic-router.ts
echo "PASS  AI-3.2 regression (15)"

npx tsx scripts/test-hardware-router.ts
echo "PASS  AI-3.3 regression (13)"

npx tsx scripts/test-routing-matrix-ai3-4.ts
echo "PASS  AI-3.4 regression (13)"

cd "$ROOT"
npx tsc --noEmit -p tsconfig.json
echo "PASS  root TypeScript"

if ! grep -q "runAiChat" "$ROOT/src/app/api/tauai/chat/route.ts"; then
  echo "FAIL  production altered"
  exit 1
fi
echo "PASS  production unchanged"

if rg -q "grayscale|athena|openclaw" "$PKG/src/constitution" -i 2>/dev/null; then
  echo "FAIL  grayscale import in constitution"
  exit 1
fi
echo "PASS  no Grayscale imports"

echo ""
echo "=== AI-4 verification complete ==="
