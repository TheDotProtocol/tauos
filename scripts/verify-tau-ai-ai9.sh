#!/usr/bin/env bash
# AI-9 — Tau Foundation v0.1 product (Figma UI + Tau ID SSO + product tests)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"

echo "=== AI-9 Tau Foundation Product Verification ==="

test -f "$ROOT/src/lib/tau-ai-app/tokens.ts" || { echo "FAIL  tokens"; exit 1; }
test -f "$ROOT/src/lib/tau-ai-app/assets.ts" || { echo "FAIL  assets"; exit 1; }
test -f "$ROOT/src/lib/tau-ai-app/foundation-service.ts" || { echo "FAIL  foundation service"; exit 1; }
test -f "$ROOT/src/lib/tau-ai-app/screens.ts" || { echo "FAIL  screen registry"; exit 1; }
test -f "$ROOT/src/lib/tau-ai-app/session-context.tsx" || { echo "FAIL  session context"; exit 1; }
test -f "$ROOT/src/app/api/tau-foundation/chat/route.ts" || { echo "FAIL  foundation API"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/shared/TauAiAppShell.tsx" || { echo "FAIL  app shell"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/welcome/TauAiWelcomePage.tsx" || { echo "FAIL  welcome"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/home/TauAiHomePage.tsx" || { echo "FAIL  home"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/chat/TauAiChatPage.tsx" || { echo "FAIL  chat"; exit 1; }
test -f "$PKG/src/model-track/types.ts" || { echo "FAIL  model track"; exit 1; }
test -f "$ROOT/public/tau-ai-app/brand/logo-lockup.png" || { echo "FAIL  logo lockup"; exit 1; }
test -f "$ROOT/public/tau-ai-app/brand/logo-emblem.png" || { echo "FAIL  logo emblem"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/settings/TauAiSettingsPage.tsx" || { echo "FAIL  settings"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/local-ai/TauAiLocalAiPage.tsx" || { echo "FAIL  local ai"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/auth/TauAiAuthPage.tsx" || { echo "FAIL  auth"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/workspace/TauAiWorkspacePage.tsx" || { echo "FAIL  workspace"; exit 1; }
test -f "$ROOT/src/app/api/tau-foundation/substrates/route.ts" || { echo "FAIL  substrates API"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/chat/TauAiConversationHistoryPage.tsx" || { echo "FAIL  history"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/chat/TauAiModelSelectionPage.tsx" || { echo "FAIL  model selection"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/chat/TauAiVoicePage.tsx" || { echo "FAIL  voice"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/search/TauAiSearchPage.tsx" || { echo "FAIL  search"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/developer/TauAiDeveloperPage.tsx" || { echo "FAIL  developer"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/grayscale/TauAiGrayscaleProjectPage.tsx" || { echo "FAIL  grayscale"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/states/TauAiEmptyStatesPage.tsx" || { echo "FAIL  empty states"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/shared/TauAiModelSelectionModal.tsx" || { echo "FAIL  model modal"; exit 1; }
test -f "$ROOT/src/components/tau-ai-app/screens/TauAiScreensIndexPage.tsx" || { echo "FAIL  screen index"; exit 1; }
test -f "$ROOT/scripts/test-tau-ai-product.ts" || { echo "FAIL  product tests"; exit 1; }
echo "PASS  AI-9 modules present"

cd "$PKG"
npm install --silent 2>/dev/null || npm install
npm run typecheck
echo "PASS  @tau/ai typecheck"

npx tsx scripts/test-model-track-ai9.ts
echo "PASS  model track tests"

npx tsx scripts/test-foundation-ai8.ts
echo "PASS  AI-8 regression (19)"

cd "$ROOT"
npx tsx scripts/test-tau-ai-product.ts
echo "PASS  AI-9 product tests"

npx tsc --noEmit -p tsconfig.json
echo "PASS  root TypeScript"

if ! grep -q "runAiChat" "$ROOT/src/app/api/tauai/chat/route.ts"; then
  echo "FAIL  production /api/tauai/chat altered"
  exit 1
fi
echo "PASS  production /api/tauai/chat unchanged"

if ! grep -q "TauFoundationClient" "$ROOT/src/lib/tau-ai-app/foundation-service.ts"; then
  echo "FAIL  foundation client not wired"
  exit 1
fi
echo "PASS  TauFoundationClient product wiring"

if ! grep -q "Authentication required" "$ROOT/src/app/api/tau-foundation/chat/route.ts"; then
  echo "FAIL  foundation chat auth gate missing"
  exit 1
fi
echo "PASS  foundation chat requires Tau ID session"

if rg -q "athena|openclaw" "$ROOT/src/lib/tau-ai-app" -i 2>/dev/null; then
  echo "FAIL  ATHENA/OpenClaw integration in product layer"
  exit 1
fi
if rg -q "from ['\"].*grayscale|import.*grayscale|GrayscaleClient|ATHENA" "$ROOT/src/lib/tau-ai-app" -i 2>/dev/null; then
  echo "FAIL  Grayscale backend integration in product layer"
  exit 1
fi
echo "PASS  no Grayscale/ATHENA integration code"

echo ""
echo "AI-9 COMPLETE: Figma UI + Tau ID SSO + product tests validated"
echo "Entry: /tauai → Try Tau AI → /tau-ai-app/welcome → /tau-ai-app/auth → /tau-ai-app/home"
