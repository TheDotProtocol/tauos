/**
 * AI-10 — Tau AI voice capability tests.
 * Run: npx tsx scripts/test-voice-ai10.ts
 */

import fs from 'node:fs';
import path from 'node:path';
import { getVoicePipelineStatus } from '../src/lib/tau-ai-app/voice-service';
import { TAU_CAPABILITIES } from '@tau/ai';

const ROOT = path.resolve(__dirname, '..');

function assert(condition: boolean, label: string) {
  if (!condition) throw new Error(`FAIL: ${label}`);
}

function read(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

console.log('=== AI-10 Tau AI Voice Tests ===');

// Capability registry unchanged
assert(TAU_CAPABILITIES.SPEECH_TO_TEXT === 'SPEECH_TO_TEXT', 'SPEECH_TO_TEXT capability');
assert(TAU_CAPABILITIES.TEXT_TO_SPEECH === 'TEXT_TO_SPEECH', 'TEXT_TO_SPEECH capability');

// Product voice layer present
assert(read('src/lib/tau-ai-app/voice-service.ts').includes('processVoiceTurn'), 'voice service');
assert(read('src/lib/tau-ai-app/voice-adapters.ts').includes('transcribeAudio'), 'STT adapter');
assert(read('src/lib/tau-ai-app/voice-adapters.ts').includes('ttsHintForResponse'), 'TTS hint');
assert(read('src/app/api/tau-foundation/voice/route.ts').includes('Authentication required'), 'voice API auth');
assert(read('src/lib/tau-ai-app/voice-client.ts').includes('tauFetch'), 'voice client uses tauFetch');
assert(read('src/lib/tau-ai-app/useTauAiVoice.ts').includes('sendVoiceTurn'), 'voice hook wired');

// Foundation path — not legacy runAiChat on product voice route
assert(
  read('src/lib/tau-ai-app/voice-service.ts').includes('createProductFoundationClient'),
  'voice uses TauFoundationClient',
);
assert(
  !read('src/app/api/tau-foundation/voice/route.ts').includes('runAiChat'),
  'product voice does not call runAiChat',
);

// Legacy production voice API unchanged
assert(read('src/app/api/tauai/voice/route.ts').includes('runAiChat'), 'legacy /api/tauai/voice unchanged');

// UI wired
assert(read('src/components/tau-ai-app/shared/TauAiVoiceOverlay.tsx').includes('useTauAiVoice'), 'overlay wired');
assert(!read('src/components/tau-ai-app/shared/TauAiVoiceOverlay.tsx').includes('backend integration pending'), 'no stale placeholder');

// Pipeline status
const status = getVoicePipelineStatus();
assert(status.pipeline === 'STT → Tau Foundation → TTS', 'pipeline label');
assert(status.stt.capability === 'SPEECH_TO_TEXT', 'STT capability label');
assert(status.tts.capability === 'TEXT_TO_SPEECH', 'TTS capability label');
assert(status.ui === 'UI_VERIFIED', 'UI verified');
assert(status.stt.substrate !== 'tau-owned', 'no fake tau STT');

console.log('PASS  AI-10 voice tests (capabilities, adapters, API, UI, pipeline status)');
