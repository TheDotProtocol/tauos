/** WebRTC ICE — STUN + optional TURN (set in native config / build env for production NAT traversal). */

export const ICE_SERVERS: Array<{ urls: string; username?: string; credential?: string }> = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export const SIGNAL_POLL_MS = 800;
