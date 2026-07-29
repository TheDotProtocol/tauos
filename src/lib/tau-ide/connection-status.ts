/** Client-side connection & sync status — never hide storage mode from users */

export type ConnectionState =
  | 'checking'
  | 'connected'
  | 'local-only'
  | 'offline'
  | 'sync-pending'
  | 'sync-failed'
  | 'cloud-unavailable'
  | 'auth-required';

export type ConnectionStatus = {
  state: ConnectionState;
  message: string;
  database: boolean;
  authenticated: boolean;
  lastChecked: string | null;
  lastError: string | null;
};

const STORAGE_KEY = 'tau-ide-connection-status';

let current: ConnectionStatus = {
  state: 'checking',
  message: 'Checking connection…',
  database: false,
  authenticated: false,
  lastChecked: null,
  lastError: null,
};

const listeners = new Set<(s: ConnectionStatus) => void>();

export function getConnectionStatus(): ConnectionStatus {
  if (typeof window === 'undefined') return current;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ConnectionStatus;
  } catch { /* ignore */ }
  return current;
}

export function setConnectionStatus(partial: Partial<ConnectionStatus>) {
  current = {
    ...current,
    ...partial,
    lastChecked: new Date().toISOString(),
  };
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    listeners.forEach((fn) => fn(current));
    window.dispatchEvent(new CustomEvent('tau-ide:connection', { detail: current }));
  }
}

export function subscribeConnectionStatus(fn: (s: ConnectionStatus) => void): () => void {
  listeners.add(fn);
  fn(getConnectionStatus());
  return () => listeners.delete(fn);
}

export function connectionLabel(state: ConnectionState): string {
  switch (state) {
    case 'connected': return 'Connected';
    case 'local-only': return 'Offline Mode (Local)';
    case 'offline': return 'Offline';
    case 'sync-pending': return 'Sync Pending';
    case 'sync-failed': return 'Sync Failed';
    case 'cloud-unavailable': return 'Cloud Unavailable';
    case 'auth-required': return 'Sign In Required';
    default: return 'Checking…';
  }
}

export async function probeConnection(hasToken: boolean): Promise<ConnectionStatus> {
  if (!hasToken) {
    setConnectionStatus({
      state: 'local-only',
      message: 'Projects stored locally. Sign in to enable cloud sync.',
      database: false,
      authenticated: false,
      lastError: null,
    });
    return getConnectionStatus();
  }

  try {
    const res = await fetch('/api/tau-ide/status');
    const data = await res.json();
    const dbConnected = data.tauIde?.database === 'connected';
    const envValid = data.tauIde?.envValid !== false;

    if (!res.ok || !dbConnected) {
      setConnectionStatus({
        state: 'cloud-unavailable',
        message: 'Cloud storage unavailable. Changes saved locally until reconnected.',
        database: false,
        authenticated: true,
        lastError: data.tauIde?.envErrors?.[0] ?? 'Database not connected',
      });
      return getConnectionStatus();
    }

    setConnectionStatus({
      state: 'connected',
      message: envValid ? 'Connected to Tau Cloud' : 'Connected (configuration warnings)',
      database: true,
      authenticated: true,
      lastError: envValid ? null : (data.tauIde?.envWarnings?.[0] ?? null),
    });
    return getConnectionStatus();
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    setConnectionStatus({
      state: navigator.onLine ? 'cloud-unavailable' : 'offline',
      message: navigator.onLine
        ? 'Cannot reach Tau Cloud. Working in local mode.'
        : 'You are offline. Changes saved locally.',
      database: false,
      authenticated: hasToken,
      lastError: msg,
    });
    return getConnectionStatus();
  }
}
