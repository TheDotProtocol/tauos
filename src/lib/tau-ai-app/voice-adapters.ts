/**
 * AI-10 — Governed STT/TTS adapters for Tau Foundation voice.
 * Uses existing SPEECH_TO_TEXT / TEXT_TO_SPEECH capabilities.
 * Third-party substrates only — keys stay server-side.
 */

import type { VoiceVerificationLevel } from '@/lib/tau-ai-app/voice-types';

export type SttResult = {
  transcription: string;
  level: VoiceVerificationLevel;
  substrate?: string;
  useClientStt: boolean;
  language?: string;
};

export type TtsHint = {
  /** Server does not synthesize audio in v0.1 — client uses SpeechSynthesis */
  useClientTts: true;
  level: VoiceVerificationLevel;
  substrate?: string;
};

/** OpenAI Whisper — third-party STT substrate when OPENAI_API_KEY is configured */
export async function transcribeAudio(audio: Blob): Promise<SttResult> {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    return {
      transcription: '',
      level: 'ADAPTER_VERIFIED',
      useClientStt: true,
      substrate: 'browser-speech-recognition',
    };
  }

  const whisperForm = new FormData();
  whisperForm.append('file', audio, 'voice.webm');
  whisperForm.append('model', 'whisper-1');
  whisperForm.append('language', 'en');

  const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${openaiKey}` },
    body: whisperForm,
  });

  if (!whisperRes.ok) {
    return {
      transcription: '',
      level: 'ADAPTER_VERIFIED',
      useClientStt: true,
      substrate: 'openai-whisper',
    };
  }

  const data = (await whisperRes.json()) as { text?: string };
  const transcription = data.text?.trim() ?? '';

  if (!transcription) {
    return {
      transcription: '',
      level: 'ADAPTER_VERIFIED',
      useClientStt: true,
      substrate: 'openai-whisper',
    };
  }

  return {
    transcription,
    level: 'LIVE_MODEL_VERIFIED',
    useClientStt: false,
    substrate: 'openai-whisper',
    language: 'en-US',
  };
}

export function ttsHintForResponse(): TtsHint {
  return {
    useClientTts: true,
    level: 'ADAPTER_VERIFIED',
    substrate: 'browser-speech-synthesis',
  };
}
