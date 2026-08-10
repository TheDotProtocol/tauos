import { jsonAuthHeaders } from '../session';
import { tauMobileFetch } from '../network';
import type { TauMailStorageData } from '../types';

export async function fetchStorage(): Promise<TauMailStorageData> {
  const res = await tauMobileFetch('/api/taumail/storage', { headers: await jsonAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load storage');
  return res.json() as Promise<TauMailStorageData>;
}
