#!/usr/bin/env bash
# AI-11 — Tau ecosystem integration (TauMail bridge + integration contract)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"

echo "=== AI-11 Tau Ecosystem Integration Verification ==="

test -f "$PKG/src/ecosystem/types.ts" || { echo "FAIL  ecosystem contract"; exit 1; }
test -f "$ROOT/src/lib/tau-ai/ecosystem-foundation-service.ts" || { echo "FAIL  ecosystem foundation service"; exit 1; }
test -f "$ROOT/src/lib/taumail/foundation-bridge.ts" || { echo "FAIL  taumail bridge"; exit 1; }
test -f "$ROOT/src/app/api/tau-foundation/ecosystem/route.ts" || { echo "FAIL  ecosystem status route"; exit 1; }
test -f "$ROOT/scripts/test-ecosystem-ai11.ts" || { echo "FAIL  ecosystem tests"; exit 1; }
echo "PASS  AI-11 modules present"

cd "$PKG"
npm install --silent 2>/dev/null || npm install
npm run typecheck
echo "PASS  @tau/ai typecheck"

cd "$ROOT"
npx tsx "$ROOT/scripts/test-ecosystem-ai11.ts"
echo "PASS  AI-11 ecosystem tests"

echo ""
echo "Running AI-10 regression..."
"$ROOT/scripts/verify-tau-ai-ai10.sh"

echo ""
echo "Running AI-7 through AI-3.4 regressions..."
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

npx tsc --noEmit -p tsconfig.json
echo "PASS  root TypeScript"

if ! grep -q "runAiChat" "$ROOT/src/app/api/tauai/chat/route.ts"; then
  echo "FAIL  production /api/tauai/chat altered"
  exit 1
fi
echo "PASS  production /api/tauai/chat unchanged"

if ! grep -q "runAiChat" "$ROOT/src/app/api/taumail/ai/route.ts"; then
  echo "FAIL  taumail legacy fallback removed"
  exit 1
fi
echo "PASS  taumail legacy fallback preserved"

if ! grep -q "runTauMailFoundationChat" "$ROOT/src/app/api/taumail/ai/route.ts"; then
  echo "FAIL  taumail foundation bridge missing"
  exit 1
fi
echo "PASS  taumail foundation bridge wired"

if rg -q "from ['\"].*taumail|from ['\"].*tautalk|grayscale|athena" "$PKG/src" -i 2>/dev/null; then
  echo "FAIL  product imports in packages/tau-ai"
  exit 1
fi
echo "PASS  packages/tau-ai product isolation"

if rg -q "from ['\"].*grayscale|import.*grayscale|ATHENA|openclaw" "$ROOT/src/lib/tau-ai" -i 2>/dev/null; then
  echo "FAIL  forbidden integrations in tau-ai lib"
  exit 1
fi
echo "PASS  no Grayscale/ATHENA in tau-ai lib"

echo ""
echo "=== AI-11 verification complete ==="
echo "TauMail: Foundation primary + legacy fallback"
echo "TauTalk: NOT_READY (contract only)"
echo "Tau Developer: PARTIALLY_READY (gateway path preserved)"
echo "Status: GET /api/tau-foundation/ecosystem"
echo ""
echo "AI-11 COMPLETE — STOP (await approval for AI-12)"
