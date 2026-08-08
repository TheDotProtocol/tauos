#!/usr/bin/env bash
# AI-3.3 — verify hardware-aware routing (shadow mode, no production cutover)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"

echo "=== AI-3.3 Hardware-Aware Routing Verification ==="

test -f "$PKG/src/hardware/types.ts" || { echo "FAIL  hardware types"; exit 1; }
test -f "$PKG/src/routing/hardware-filter.ts" || { echo "FAIL  hardware filter"; exit 1; }
echo "PASS  hardware modules present"

cd "$PKG"
npm install --silent 2>/dev/null || npm install
npm run typecheck
echo "PASS  @tau/ai typecheck"

npx tsx scripts/test-hardware-router.ts
echo "PASS  AI-3.3 hardware tests (13 scenarios)"

npx tsx scripts/test-deterministic-router.ts
echo "PASS  AI-3.2 router regression (15 scenarios)"

cd "$ROOT"
npx tsc --noEmit -p tsconfig.json
echo "PASS  root TypeScript"

npx tsx scripts/tau-ai-ai3-2-shadow-test.ts
echo "PASS  shadow routing with metrics"

if ! grep -q "runAiChat" "$ROOT/src/app/api/tauai/chat/route.ts"; then
  echo "FAIL  production route altered"
  exit 1
fi
echo "PASS  production API unchanged"

"$ROOT/scripts/verify-tau-ai-ai3-2.sh" 2>&1 | tail -5
echo "PASS  AI-3.2 full verification chain"

echo ""
echo "=== AI-3.3 verification complete ==="
