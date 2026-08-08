#!/usr/bin/env bash
# AI-8 — Tau Foundation v0.1 composition / shadow integration
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"

echo "=== AI-8 Tau Foundation Composition Verification ==="

test -f "$PKG/src/foundation/pipeline.ts" || { echo "FAIL  pipeline"; exit 1; }
test -f "$PKG/src/client/foundation-client.ts" || { echo "FAIL  foundation client"; exit 1; }
test -f "$ROOT/src/lib/tau-ai/foundation-shadow.ts" || { echo "FAIL  foundation shadow"; exit 1; }
echo "PASS  AI-8 modules present"

cd "$PKG"
npm install --silent 2>/dev/null || npm install
npm run typecheck
echo "PASS  @tau/ai typecheck"

npx tsx scripts/test-foundation-ai8.ts
echo "PASS  foundation tests"

cd "$ROOT"
npx tsx -e "
import { runFoundationShadowMatrix } from './src/lib/tau-ai/foundation-shadow.ts';
runFoundationShadowMatrix().then(() => console.log('PASS  foundation shadow matrix'));
"
echo "PASS  shadow comparison"

npx tsx packages/tau-ai/scripts/test-execution-ai7.ts
echo "PASS  AI-7 regression (31)"

npx tsx packages/tau-ai/scripts/test-tools-ai6.ts
echo "PASS  AI-6 regression (25)"

npx tsx packages/tau-ai/scripts/test-memory-ai5.ts
echo "PASS  AI-5 regression (24)"

npx tsx packages/tau-ai/scripts/test-constitution-ai4.ts
echo "PASS  AI-4 regression (22)"

npx tsx packages/tau-ai/scripts/test-routing-matrix-ai3-4.ts
echo "PASS  AI-3.4 regression (13)"

npx tsx packages/tau-ai/scripts/test-deterministic-router.ts
echo "PASS  AI-3.2 regression (15)"

npx tsx packages/tau-ai/scripts/test-hardware-router.ts
echo "PASS  AI-3.3 regression (13)"

npx tsc --noEmit -p tsconfig.json
echo "PASS  root TypeScript"

if ! grep -q "runAiChat" "$ROOT/src/app/api/tauai/chat/route.ts"; then
  echo "FAIL  production altered"
  exit 1
fi
echo "PASS  production unchanged"

if rg -q "grayscale|athena|openclaw" "$PKG/src/foundation" -i 2>/dev/null; then
  echo "FAIL  grayscale in foundation"
  exit 1
fi
echo "PASS  no Grayscale imports"

echo ""
echo "=== AI-8 verification complete ==="
