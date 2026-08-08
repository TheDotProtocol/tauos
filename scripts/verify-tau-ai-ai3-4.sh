#!/usr/bin/env bash
# AI-3.4 — substrate enrichment + routing validation
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"

echo "=== AI-3.4 Substrate Enrichment Verification ==="

test -f "$PKG/src/catalog/open-models.ts" || { echo "FAIL  catalog"; exit 1; }
test -f "$ROOT/src/lib/ai-gateway/inference-requirements.ts" || { echo "FAIL  inference-requirements"; exit 1; }
test -f "$PKG/src/hardware/macos-detector.ts" || { echo "FAIL  macos detector"; exit 1; }
echo "PASS  AI-3.4 modules present"

cd "$PKG"
npm install --silent 2>/dev/null || npm install
npm run typecheck
echo "PASS  @tau/ai typecheck"

npx tsx scripts/test-routing-matrix-ai3-4.ts
echo "PASS  expanded routing matrix"

npx tsx scripts/test-deterministic-router.ts
echo "PASS  AI-3.2 regression (15)"

npx tsx scripts/test-hardware-router.ts
echo "PASS  AI-3.3 regression (13)"

cd "$ROOT"
npx tsc --noEmit -p tsconfig.json
echo "PASS  root TypeScript"

npx tsx scripts/tau-ai-ai3-4-shadow-matrix.ts
echo "PASS  shadow comparison matrix"

if ! grep -q "runAiChat" "$ROOT/src/app/api/tauai/chat/route.ts"; then
  echo "FAIL  production altered"
  exit 1
fi
echo "PASS  production unchanged"

"$ROOT/scripts/verify-tau-ai-ai3-1.sh" >/dev/null
echo "PASS  AI-3.1 regression"

echo ""
echo "=== AI-3.4 verification complete ==="
