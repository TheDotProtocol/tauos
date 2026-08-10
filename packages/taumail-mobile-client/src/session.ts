import {
  TAU_REFRESH_KEY,
  TAU_TOKEN_KEY,
  TAU_USER_KEY,
  TAUMAIL_MOBILE_USER_AGENT,
} from './constants';
import { getTauMailMobileConfig, resolveApiUrl } from './config';
import type { TauSessionUser } from './types';

export async function getStoredToken(): Promise<string | null> {
  return getTauMailMobileConfig().storage.getItem(TAU_TOKEN_KEY);
}

export async function getStoredUser(): Promise<TauSessionUser | null> {
  const raw = await getTauMailMobileConfig().storage.getItem(TAU_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TauSessionUser;
  } catch {
    return null;
  }
}

export async function persistSession(
  token: string,
  user: TauSessionUser,
  refreshToken?: string,
): Promise<void> {
  const { storage } = getTauMailMobileConfig();
  await storage.setItem(TAU_USER_KEY, JSON.stringify(user));
  if (token) await storage.setItem(TAU_TOKEN_KEY, token);
  if (refreshToken) await storage.setItem(TAU_REFRESH_KEY, refreshToken);
}

export async function clearSession(): Promise<void> {
  const { storage } = getTauMailMobileConfig();
  await storage.removeItem(TAU_TOKEN_KEY);
  await storage.removeItem(TAU_USER_KEY);
  await storage.removeItem(TAU_REFRESH_KEY);
}

export async function authHeaders(): Promise<Record<string, string>> {
  const token = await getStoredToken();
  const headers: Record<string, string> = {
    'User-Agent': TAUMAIL_MOBILE_USER_AGENT,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function jsonAuthHeaders(): Promise<Record<string, string>> {
  return { ...(await authHeaders()), 'Content-Type': 'application/json' };
}

export async function refreshSession(): Promise<boolean> {
  const { storage, fetchImpl = fetch } = getTauMailMobileConfig();
  const refreshToken = await storage.getItem(TAU_REFRESH_KEY);
  try {
    const res = await fetchImpl(resolveApiUrl('/api/auth/session'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': TAUMAIL_MOBILE_USER_AGENT,
        ...(refreshToken ? { Authorization: `Bearer ${await getStoredToken()}` } : {}),
      },
      body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as {
      token?: string;
      refreshToken?: string;
      user?: TauSessionUser;
    };
    if (data.token) await storage.setItem(TAU_TOKEN_KEY, data.token);
    if (data.refreshToken) await storage.setItem(TAU_REFRESH_KEY, data.refreshToken);
    if (data.user) await storage.setItem(TAU_USER_KEY, JSON.stringify(data.user));
    return Boolean(data.token);
  } catch {
    return false;
  }
}

export async function hydrateSession(): Promise<{
  user: TauSessionUser | null;
  token: string | null;
}> {
  const user = await getStoredUser();
  const token = await getStoredToken();
  if (user && token) return { user, token };
  return { user: null, token: null };
}
