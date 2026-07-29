import type { IncomingCall } from '@/lib/tautalk-web-api';

let permissionRequested = false;

export async function ensureCallNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted' || Notification.permission === 'denied') return;
  if (permissionRequested) return;
  permissionRequested = true;
  try {
    await Notification.requestPermission();
  } catch {
    /* ignore */
  }
}

export function notifyIncomingCall(call: IncomingCall) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  if (document.visibilityState === 'visible' && document.hasFocus()) return;

  const caller = call.caller?.full_name || call.caller?.username || 'Someone';
  const label = call.mode === 'video' ? 'Video call' : 'Voice call';

  try {
    const n = new Notification(`Incoming ${label}`, {
      body: `${caller} is calling on TauTalk`,
      tag: `tautalk-call-${call.id}`,
      requireInteraction: true,
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {
    /* ignore */
  }
}
