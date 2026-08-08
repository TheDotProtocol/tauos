/** Browser client for Tau Foundation voice API (AI-10) */

import { tauFetch } from '@/lib/tau-auth-client';
import type { VoicePipelineStatus, VoiceTurnResult } from '@/lib/tau-ai-app/voice-types';

/** Minimal Web Speech API typing (not in all TS lib configs) */
export type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export async function fetchVoicePipelineStatus(): Promise<VoicePipelineStatus & { success: boolean }> {
  const res = await tauFetch('/api/tau-foundation/voice', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load voice status');
  return res.json();
}

export async function sendVoiceTurn(input: {
  audio: Blob;
  transcription?: string;
  threadId?: string;
  privacyMode?: boolean;
}): Promise<VoiceTurnResult & { success: boolean }> {
  const form = new FormData();
  form.append('audio', input.audio, 'voice.webm');
  if (input.transcription) form.append('transcription', input.transcription);
  if (input.threadId) form.append('threadId', input.threadId);
  if (input.privacyMode) form.append('privacyMode', 'true');

  const res = await tauFetch('/api/tau-foundation/voice', {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? 'Voice request failed');
  }
  return data;
}

/** Browser SpeechRecognition fallback when server STT is unavailable */
export function createClientSttRecognizer(): BrowserSpeechRecognition | null {
  if (typeof window === 'undefined') return null;
  const W = window as Window & {
    SpeechRecognition?: new () => BrowserSpeechRecognition;
    webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  };
  const Ctor = W.SpeechRecognition ?? W.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = 'en-US';
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  return rec;
}

export function speakClientTts(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  window.speechSynthesis.speak(utter);
}
