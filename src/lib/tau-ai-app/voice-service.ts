/**
 * AI-10 — Tau Foundation voice orchestration (product layer).
 *
 * VOICE INPUT → STT SUBSTRATE → Tau Foundation Pipeline → TTS hint (client)
 */

import { TAU_CAPABILITIES } from '@tau/ai';
import { createProductFoundationClient } from '@/lib/tau-ai-app/foundation-service';
import { transcribeAudio, ttsHintForResponse } from '@/lib/tau-ai-app/voice-adapters';
import type {
  VoicePipelineStatus,
  VoiceTurnResult,
  VoiceVerificationLevel,
} from '@/lib/tau-ai-app/voice-types';

function endToEndLevel(
  stt: VoiceVerificationLevel,
  foundation: VoiceVerificationLevel,
  tts: VoiceVerificationLevel,
): VoiceVerificationLevel {
  if (
    stt === 'LIVE_MODEL_VERIFIED' &&
    foundation === 'END_TO_END_VERIFIED' &&
    tts === 'ADAPTER_VERIFIED'
  ) {
    return 'END_TO_END_VERIFIED';
  }
  if (stt === 'ADAPTER_VERIFIED' || foundation === 'ADAPTER_VERIFIED') {
    return 'ADAPTER_VERIFIED';
  }
  return 'UI_VERIFIED';
}

export function getVoicePipelineStatus(): VoicePipelineStatus {
  const sttConfigured = Boolean(process.env.OPENAI_API_KEY);
  const sttLevel: VoiceVerificationLevel = sttConfigured ? 'ADAPTER_VERIFIED' : 'ADAPTER_VERIFIED';
  const foundationLevel: VoiceVerificationLevel = 'ADAPTER_VERIFIED';

  const sttStatus = {
    capability: 'SPEECH_TO_TEXT' as const,
    level: sttLevel,
    substrate: sttConfigured ? 'openai-whisper' : 'browser-speech-recognition',
    configured: sttConfigured,
    fallback: sttConfigured ? undefined : ('client-stt' as const),
    note: sttConfigured
      ? 'Server STT via third-party Whisper substrate when audio is uploaded'
      : 'No server STT key — browser SpeechRecognition fallback',
  };

  const ttsStatus = {
    capability: 'TEXT_TO_SPEECH' as const,
    level: 'ADAPTER_VERIFIED' as VoiceVerificationLevel,
    substrate: 'browser-speech-synthesis',
    configured: true,
    fallback: 'client-tts' as const,
    note: 'Client-side SpeechSynthesis — no server TTS substrate in v0.1',
  };

  const e2e = endToEndLevel(sttStatus.level, foundationLevel, ttsStatus.level);

  return {
    pipeline: 'STT → Tau Foundation → TTS',
    ui: 'UI_VERIFIED',
    stt: sttStatus,
    foundation: { level: foundationLevel, path: 'POST /api/tau-foundation/voice → TauFoundationClient' },
    tts: ttsStatus,
    endToEnd: e2e,
    privacyNote: 'API keys remain server-side. Audio sent to STT substrate only when configured.',
    supportedFormats: ['webm', 'wav', 'mp3', 'ogg'],
    maxDurationSec: 30,
  };
}

export async function processVoiceTurn(input: {
  audio: Blob;
  userId: string;
  threadId?: string;
  privacyMode?: boolean;
  /** Pre-transcribed text from client STT fallback */
  clientTranscription?: string;
}): Promise<VoiceTurnResult> {
  const timestamp = new Date().toISOString();
  let sttLevel: VoiceVerificationLevel = 'ADAPTER_VERIFIED';
  let transcription = input.clientTranscription?.trim() ?? '';

  if (!transcription) {
    const stt = await transcribeAudio(input.audio);
    sttLevel = stt.level;
    transcription = stt.transcription;

    if (!transcription && stt.useClientStt) {
      return {
        transcription: '',
        useClientStt: true,
        useClientTts: true,
        sttLevel,
        foundationLevel: 'UI_VERIFIED',
        ttsLevel: 'ADAPTER_VERIFIED',
        endToEndLevel: 'UI_VERIFIED',
        timestamp,
      };
    }
  } else {
    sttLevel = 'ADAPTER_VERIFIED';
  }

  if (!transcription) {
    return {
      transcription: '',
      useClientStt: true,
      sttLevel,
      foundationLevel: 'UI_VERIFIED',
      ttsLevel: 'ADAPTER_VERIFIED',
      endToEndLevel: 'UI_VERIFIED',
      timestamp,
    };
  }

  const client = createProductFoundationClient();
  const result = await client.chat({
    messages: [{ role: 'user', content: transcription }],
    threadId: input.threadId,
    userId: input.userId,
    options: { privacyMode: input.privacyMode },
  });

  const foundationLevel: VoiceVerificationLevel = result.message
    ? sttLevel === 'LIVE_MODEL_VERIFIED'
      ? 'END_TO_END_VERIFIED'
      : 'ADAPTER_VERIFIED'
    : 'ADAPTER_VERIFIED';

  const tts = ttsHintForResponse();
  const e2e = endToEndLevel(sttLevel, foundationLevel, tts.level);

  return {
    transcription,
    response: result.message,
    model: result.model,
    substrateId: result.substrateId,
    capability: result.capability ?? TAU_CAPABILITIES.TEXT_REASONING,
    useClientTts: tts.useClientTts,
    sttLevel,
    foundationLevel,
    ttsLevel: tts.level,
    endToEndLevel: e2e,
    timestamp,
  };
}
