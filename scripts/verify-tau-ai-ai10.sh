#!/usr/bin/env bash
# AI-10 — Tau AI Voice (governed STT → Foundation → TTS)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "=== AI-10 Tau AI Voice Verification ==="

test -f "$ROOT/src/lib/tau-ai-app/voice-service.ts" || { echo "FAIL  voice service"; exit 1; }
test -f "$ROOT/src/lib/tau-ai-app/voice-adapters.ts" || { echo "FAIL  voice adapters"; exit 1; }
test -f "$ROOT/src/lib/tau-ai-app/voice-client.ts" || { echo "FAIL  voice client"; exit 1; }
test -f "$ROOT/src/app/api/tau-foundation/voice/route.ts" || { echo "FAIL  voice API"; exit 1; }
test -f "$ROOT/scripts/test-voice-ai10.ts" || { echo "FAIL  voice tests"; exit 1; }
echo "PASS  AI-10 modules present"

npx tsx "$ROOT/scripts/test-voice-ai10.ts"
echo "PASS  AI-10 voice tests"

echo ""
echo "Running AI-9 regression..."
"$ROOT/scripts/verify-tau-ai-ai9.sh"

echo ""
echo "AI-10 BATCH 1 COMPLETE — STOP"
echo "Voice: STT substrate → Tau Foundation → client TTS"
echo "Status: GET /api/tau-foundation/voice"
