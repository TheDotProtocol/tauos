import {
  TAUTALK_INCOMING_RING_URL,
  TAUTALK_RINGBACK_URL,
} from '@/lib/tautalk-call-constants';

let incomingAudio: HTMLAudioElement | null = null;
let ringbackAudio: HTMLAudioElement | null = null;

function playLoop(src: string): HTMLAudioElement {
  const audio = new Audio(src);
  audio.loop = true;
  audio.preload = 'auto';
  void audio.play().catch(() => {});
  return audio;
}

export function startIncomingRing() {
  if (typeof window === 'undefined') return;
  stopCallSounds();
  incomingAudio = playLoop(TAUTALK_INCOMING_RING_URL);
}

export function startOutgoingRingback() {
  if (typeof window === 'undefined') return;
  stopCallSounds();
  ringbackAudio = playLoop(TAUTALK_RINGBACK_URL);
}

export function stopCallSounds() {
  for (const audio of [incomingAudio, ringbackAudio]) {
    if (!audio) continue;
    audio.pause();
    audio.currentTime = 0;
    audio.src = '';
  }
  incomingAudio = null;
  ringbackAudio = null;
}
