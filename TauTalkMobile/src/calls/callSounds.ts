import SoundPlayer from 'react-native-sound-player';
import { API_BASE } from '../config';

const INCOMING_URL = `${API_BASE}/sounds/tautalk-incoming.wav`;
const RINGBACK_URL = `${API_BASE}/sounds/tautalk-ringback.wav`;

let activeLoop: ReturnType<typeof setInterval> | null = null;
let activeKind: 'incoming' | 'ringback' | null = null;

function playUrl(url: string) {
  try {
    SoundPlayer.playUrl(url);
  } catch {
    /* native module unavailable */
  }
}

function startLoop(kind: 'incoming' | 'ringback') {
  stopCallSounds();
  activeKind = kind;
  const url = kind === 'incoming' ? INCOMING_URL : RINGBACK_URL;
  const intervalMs = kind === 'incoming' ? 4000 : 3000;
  playUrl(url);
  activeLoop = setInterval(() => playUrl(url), intervalMs);
}

export function startIncomingRing() {
  startLoop('incoming');
}

export function startOutgoingRingback() {
  startLoop('ringback');
}

export function stopCallSounds() {
  if (activeLoop) {
    clearInterval(activeLoop);
    activeLoop = null;
  }
  activeKind = null;
  try {
    SoundPlayer.stop();
  } catch {
    /* ignore */
  }
}

export function isCallSoundPlaying() {
  return activeKind !== null;
}
