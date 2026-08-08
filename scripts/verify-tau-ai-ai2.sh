#!/usr/bin/env bash
# AI-2 — verify model substrate integration + gateway refactor
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"
GATEWAY="$ROOT/src/lib/ai-gateway"

echo "=== AI-2 Tau AI Substrate Integration Verification ==="

# 1. Package + contracts
if [[ ! -d "$PKG/src" ]]; then
  echo "FAIL  packages/tau-ai/ not found"
  exit 1
fi
echo "PASS  packages/tau-ai/ exists"

# 2. AI-2 gateway additions
REQUIRED=(
  "substrate-bridge.ts"
  "substrate-registry.ts"
  "prompts.ts"
  "providers/vllm-stub.ts"
)
for f in "${REQUIRED[@]}"; do
  if [[ ! -f "$GATEWAY/$f" ]]; then
    echo "FAIL  missing ai-gateway/$f"
    exit 1
  fi
done
echo "PASS  ai-gateway substrate layer present"

REQUIRED_TAU=(
  "src/lib/tau-ai/intelligence-service.ts"
  "src/lib/tau-ai/passthrough-router.ts"
  "src/lib/tau-ai/gateway-client.ts"
)
for f in "${REQUIRED_TAU[@]}"; do
  if [[ ! -f "$ROOT/$f" ]]; then
    echo "FAIL  missing $f"
    exit 1
  fi
done
echo "PASS  tau-ai integration layer present"

# 3. @tau/ai typecheck
cd "$PKG"
npm install --silent 2>/dev/null || npm install
npm run typecheck
echo "PASS  @tau/ai typecheck"

# 4. Root typecheck (gateway + tau-ai layer)
cd "$ROOT"
npx tsc --noEmit -p tsconfig.json
echo "PASS  root TypeScript"

# 5. API routes unchanged (still use ai-gateway directly)
for route in \
  "src/app/api/tauai/chat/route.ts" \
  "src/app/api/taumail/ai/route.ts"; do
  if ! grep -q "ai-gateway" "$ROOT/$route"; then
    echo "FAIL  $route no longer references ai-gateway"
    exit 1
  fi
  if grep -q "lib/tau-ai" "$ROOT/$route" 2>/dev/null; then
    echo "FAIL  $route prematurely wired to tau-ai layer"
    exit 1
  fi
done
echo "PASS  API routes still use ai-gateway (no premature cutover)"

# 6. Legacy preserved
if [[ ! -d "$ROOT/tauai-core" ]]; then
  echo "FAIL  tauai-core/ deleted"
  exit 1
fi
echo "PASS  tauai-core/ preserved"

# 7. No Grayscale implementation in tau-ai package (comments in contracts are OK)
if grep -rqE "from ['\"].*(grayscale|athena|openclaw)" "$PKG/src" 2>/dev/null; then
  echo "FAIL  Grayscale/ATHENA/OpenClaw imports in packages/tau-ai"
  exit 1
fi
echo "PASS  no Grayscale/ATHENA/OpenClaw imports in packages/tau-ai"

# 8. Behaviour regression (fallback provider — no credentials)
cd "$ROOT"
npx tsx scripts/tau-ai-ai2-regression.ts
echo "PASS  gateway vs intelligence behaviour parity"

echo ""
echo "=== AI-2 verification complete ==="
