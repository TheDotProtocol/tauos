/** AI-10 — Tau AI voice verification levels (honest status reporting) */

export type VoiceVerificationLevel =
  | 'UI_VERIFIED'
  | 'ADAPTER_VERIFIED'
  | 'LIVE_MODEL_VERIFIED'
  | 'END_TO_END_VERIFIED';

export type VoiceSubstrateStatus = {
  capability: 'SPEECH_TO_TEXT' | 'TEXT_TO_SPEECH';
  level: VoiceVerificationLevel;
  /** Third-party substrate label — never Tau-owned weights */
  substrate?: string;
  configured: boolean;
  fallback?: 'client-stt' | 'client-tts';
  note?: string;
};

export type VoicePipelineStatus = {
  pipeline: 'STT → Tau Foundation → TTS';
  ui: VoiceVerificationLevel;
  stt: VoiceSubstrateStatus;
  foundation: { level: VoiceVerificationLevel; path: string };
  tts: VoiceSubstrateStatus;
  endToEnd: VoiceVerificationLevel;
  privacyNote: string;
  supportedFormats: string[];
  maxDurationSec: number;
};

export type VoiceTurnResult = {
  transcription: string;
  response?: string;
  model?: string;
  substrateId?: string;
  capability?: string;
  useClientStt?: boolean;
  useClientTts?: boolean;
  sttLevel: VoiceVerificationLevel;
  foundationLevel: VoiceVerificationLevel;
  ttsLevel: VoiceVerificationLevel;
  endToEndLevel: VoiceVerificationLevel;
  timestamp: string;
};
