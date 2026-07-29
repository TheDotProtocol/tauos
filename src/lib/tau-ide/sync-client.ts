import { getStoredToken } from '@/lib/tau-ide/auth-client';
import {
  setConnectionStatus, type ConnectionState
} from '@/lib/tau-ide/connection-status';

export function authHeaders(): HeadersInit {
  const token = getStoredToken();
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const hasToken = Boolean(getStoredToken());
  try {
    const res = await fetch(path, { ...options, headers: { ...authHeaders(), ...(options.headers ?? {}) } });
    const data = await res.json();

    if (res.status === 401) {
      setConnectionStatus({ state: 'auth-required', message: 'Sign in required for cloud features.', authenticated: false });
      throw new ApiError(data.error || 'Authentication required', 401);
    }
    if (res.status === 429) {
      throw new ApiError(data.error || 'Rate limit exceeded', 429);
    }
    if (!res.ok) {
      if (hasToken) {
        setConnectionStatus({
          state: 'sync-failed',
          message: data.error || `Request failed (${res.status})`,
          lastError: data.error || String(res.status),
        });
      }
      throw new ApiError(data.error || `Request failed: ${res.status}`, res.status);
    }
    return data as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    const msg = e instanceof Error ? e.message : 'Network error';
    if (hasToken) {
      setConnectionStatus({
        state: navigator.onLine ? 'cloud-unavailable' : 'offline',
        message: msg,
        lastError: msg,
      });
    }
    throw new ApiError(msg, 0);
  }
}

export type SyncStatus = 'synced' | 'local' | 'pending' | 'conflict' | 'failed';

export function getSyncMeta(projectId: string) {
  try {
    return JSON.parse(localStorage.getItem(`tau-ide-sync-${projectId}`) ?? '{}');
  } catch {
    return {};
  }
}

export function setSyncMeta(projectId: string, meta: Record<string, unknown>) {
  localStorage.setItem(`tau-ide-sync-${projectId}`, JSON.stringify({ ...meta, lastSync: new Date().toISOString() }));
  const status = meta.status as SyncStatus | undefined;
  if (status === 'pending' || status === 'failed') {
    setConnectionStatus({
      state: status === 'pending' ? 'sync-pending' : 'sync-failed',
      message: status === 'pending' ? 'Changes waiting to sync…' : 'Last sync failed. Retrying…',
    });
  } else if (status === 'synced') {
    setConnectionStatus({ state: 'connected', message: 'All changes synced.' });
  }
}
