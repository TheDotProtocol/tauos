#!/usr/bin/env bash
# M7 — Tau Launcher verification (batch-aware)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LAUNCHER="$ROOT/mobile/apps/tau-launcher"
DESIGN="$ROOT/packages/tau-mobile-design"
PASS=0
FAIL=0

ok() { echo "  PASS  $*"; PASS=$((PASS + 1)); }
no() { echo "  FAIL  $*"; FAIL=$((FAIL + 1)); }

BATCH="${M7_BATCH:-all}"

echo "=== M7 Tau Launcher Verification (batch: $BATCH) ==="

# --- M7.1: Tau Home Screen ---
if [[ "$BATCH" == "all" || "$BATCH" == "M7.1" ]]; then
  echo ""
  echo "--- M7.1 home screen ---"

  [[ -f "$LAUNCHER/src/screens/TauHomeScreen.tsx" ]] && ok "TauHomeScreen" || no "TauHomeScreen"
  [[ -f "$LAUNCHER/src/components/StatusBarArea.tsx" ]] && ok "StatusBarArea" || no "StatusBarArea"
  [[ -f "$LAUNCHER/src/components/TauDock.tsx" ]] && ok "TauDock" || no "TauDock"
  [[ -f "$LAUNCHER/src/components/widgets/WidgetGrid.tsx" ]] && ok "WidgetGrid" || no "WidgetGrid"
  [[ -f "$DESIGN/src/tokens/layout.ts" ]] && ok "layout tokens" || no "layout tokens"

  [[ -f "$LAUNCHER/src/components/SearchBar.tsx" ]] && ok "SearchBar" || no "SearchBar"
  [[ -f "$LAUNCHER/src/components/AppIconGrid.tsx" ]] && ok "AppIconGrid" || no "AppIconGrid"

  grep -q 'launcher:' "$DESIGN/src/tokens/colors.ts" && ok "Figma launcher colors" || no "Figma colors"
  grep -q 'TauHomeScreen' "$LAUNCHER/src/App.tsx" && ok "App → TauHomeScreen" || no "App entry"

  cd "$DESIGN" && npm run typecheck && ok "design typecheck" || no "design typecheck"
  cd "$LAUNCHER" && npm run typecheck && ok "launcher typecheck" || no "launcher typecheck"
fi

# --- M7.0 (included in all) ---
if [[ "$BATCH" == "all" || "$BATCH" == "M7.0" ]]; then
  echo ""
  echo "--- M7.0 scaffold ---"

  [[ -f "$LAUNCHER/package.json" ]] && ok "tau-launcher package.json" || no "package.json"
  [[ -f "$LAUNCHER/src/App.tsx" ]] && ok "src/App.tsx" || no "src/App.tsx"
  [[ -f "$LAUNCHER/src/screens/ScaffoldScreen.tsx" ]] && ok "ScaffoldScreen" || no "ScaffoldScreen"
  [[ -f "$DESIGN/src/index.ts" ]] && ok "@tau/mobile-design" || no "design package"

  for token in colors typography spacing radii shadows motion blur; do
    [[ -f "$DESIGN/src/tokens/${token}.ts" ]] && ok "token: $token" || no "token: $token"
  done

  grep -q 'com.tau.launcher' "$LAUNCHER/android/app/build.gradle" \
    && ok "applicationId com.tau.launcher" || no "applicationId"

  cd "$DESIGN"
  npm install --silent 2>/dev/null || npm install
  npm run typecheck && ok "@tau/mobile-design typecheck" || no "design typecheck"

  cd "$LAUNCHER"
  npm install --silent 2>/dev/null || npm install
  npm run typecheck && ok "@tau/launcher typecheck" || no "launcher typecheck"

  # Optional Android assemble when SDK present
  if [[ -n "${ANDROID_HOME:-}" && -d "${ANDROID_HOME}/platform-tools" ]]; then
    if ( cd "$LAUNCHER/android" && ./gradlew assembleDebug -q 2>/dev/null ); then
      ok "android assembleDebug"
    else
      no "android assembleDebug (run: cd mobile/apps/tau-launcher && npm run android)"
    fi
  else
    echo "  SKIP  android build (ANDROID_HOME not set)"
  fi
fi

echo ""
echo "Result: $PASS pass, $FAIL fail"
[[ "$FAIL" -eq 0 ]]
