/** WebRTC ICE servers — STUN + optional TURN via env (required for NAT-restricted networks). */

export function getTautalkIceServers(): RTCIceServer[] {
  const servers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ];

  const turnUrl =
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_TAUTALK_TURN_URL || process.env.TAUTALK_TURN_URL
      : undefined;
  const turnUser =
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_TAUTALK_TURN_USERNAME || process.env.TAUTALK_TURN_USERNAME
      : undefined;
  const turnCred =
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_TAUTALK_TURN_CREDENTIAL || process.env.TAUTALK_TURN_CREDENTIAL
      : undefined;

  if (turnUrl) {
    servers.push({
      urls: turnUrl,
      ...(turnUser && turnCred ? { username: turnUser, credential: turnCred } : {}),
    });
  }

  return servers;
}

export const TAUTALK_SIGNAL_POLL_MS = 1500;
export const TAUTALK_SIGNAL_POLL_SLOW_MS = 1500;
