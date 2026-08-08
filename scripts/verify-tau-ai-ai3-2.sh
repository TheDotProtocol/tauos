#!/usr/bin/env bash
# AI-3.2 — verify deterministic model router (shadow mode, no production cutover)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"

echo "=== AI-3.2 Deterministic Router Verification ==="

test -f "$PKG/src/routing/deterministic-router.ts" || { echo "FAIL  deterministic-router.ts"; exit 1; }
test -f "$PKG/src/routing/shadow.ts" || { echo "FAIL  shadow.ts"; exit 1; }
test -f "$ROOT/src/lib/tau-ai/shadow-routing.ts" || { echo "FAIL  shadow-routing.ts"; exit 1; }
echo "PASS  router modules present"

cd "$PKG"
npm install --silent 2>/dev/null || npm install
npm run typecheck
echo "PASS  @tau/ai typecheck"

npx tsx scripts/test-deterministic-router.ts
echo "PASS  deterministic router tests (15 scenarios)"

cd "$ROOT"
npx tsc --noEmit -p tsconfig.json
echo "PASS  root TypeScript"

npx tsx scripts/tau-ai-ai3-2-shadow-test.ts
echo "PASS  shadow routing smoke"

if ! grep -q "runAiChat" "$ROOT/src/app/api/tauai/chat/route.ts"; then
  echo "FAIL  production route altered"
  exit 1
fi
if grep -q "DeterministicModelRouter\|shadowRoute" "$ROOT/src/app/api/tauai/chat/route.ts" 2>/dev/null; then
  echo "FAIL  production route wired to new router"
  exit 1
fi
echo "PASS  production API unchanged"

"$ROOT/scripts/verify-tau-ai-ai3-1.sh"
echo "PASS  AI-3.1 regression intact"

echo ""
echo "=== AI-3.2 verification complete ==="
