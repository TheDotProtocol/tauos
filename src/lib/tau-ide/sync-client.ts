import { getStoredToken } from '@/lib/tau-ide/auth-client';

export function authHeaders(): HeadersInit {
  const token = getStoredToken();
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, { ...options, headers: { ...authHeaders(), ...(options.headers ?? {}) } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data as T;
}

export type SyncStatus = 'synced' | 'local' | 'pending' | 'conflict';

export function getSyncMeta(projectId: string) {
  try {
    return JSON.parse(localStorage.getItem(`tau-ide-sync-${projectId}`) ?? '{}');
  } catch {
    return {};
  }
}

export function setSyncMeta(projectId: string, meta: Record<string, unknown>) {
  localStorage.setItem(`tau-ide-sync-${projectId}`, JSON.stringify({ ...meta, lastSync: new Date().toISOString() }));
}
