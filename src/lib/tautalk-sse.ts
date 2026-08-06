'use client';

import { refreshTauSession } from '@/lib/tau-auth-client';

export const isTauNativeClient =
  typeof navigator !== 'undefined' &&
  /ReactNative|TauTalkMobile|TauIDMobile/i.test(navigator.userAgent);

export type TauTalkSseHandlers = {
  onMessage: (data: unknown) => void | Promise<void>;
  onConnected?: (data: unknown) => void;
  onError?: (data: unknown) => void;
};

function buildStreamUrl(conversationId: string, token: string | null): string {
  const params = new URLSearchParams({ conversationId });
  if (isTauNativeClient && token) {
    params.set('token', token);
  }
  return `/api/tautalk/messages/stream?${params.toString()}`;
}

/** Cookie-based SSE for web; Bearer token query param only for native mobile. */
export function connectTauTalkSse(
  conversationId: string,
  token: string | null,
  handlers: TauTalkSseHandlers
): () => void {
  let es: EventSource | null = null;
  let stopped = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let refreshing = false;

  const clearReconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  const connect = () => {
    if (stopped) return;
    es?.close();
    es = new EventSource(buildStreamUrl(conversationId, token));

    es.addEventListener('connected', (ev) => {
      try {
        handlers.onConnected?.(JSON.parse(ev.data));
      } catch {
        /* ignore */
      }
    });

    es.addEventListener('message', (ev) => {
      void (async () => {
        try {
          await handlers.onMessage(JSON.parse(ev.data));
        } catch {
          /* ignore */
        }
      })();
    });

    es.addEventListener('error', (ev) => {
      try {
        handlers.onError?.(JSON.parse((ev as MessageEvent).data));
      } catch {
        /* ignore */
      }
    });

    es.addEventListener('auth_expired', async () => {
      if (stopped || refreshing) return;
      refreshing = true;
      es?.close();
      const ok = await refreshTauSession();
      refreshing = false;
      if (stopped) return;
      if (ok) {
        connect();
      } else {
        handlers.onError?.({ message: 'Session expired. Sign in again.' });
      }
    });

    es.onerror = () => {
      if (stopped) return;
      es?.close();
      clearReconnect();
      reconnectTimer = setTimeout(async () => {
        if (stopped) return;
        if (!isTauNativeClient) {
          await refreshTauSession();
        }
        connect();
      }, 2000);
    };
  };

  connect();

  return () => {
    stopped = true;
    clearReconnect();
    es?.close();
    es = null;
  };
}
