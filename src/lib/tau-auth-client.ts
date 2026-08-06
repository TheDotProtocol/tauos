'use client';

import { TAU_TOKEN_KEY, TAU_USER_KEY, TAU_REFRESH_KEY } from '@/lib/tau-auth-constants';

export type TauSessionUser = {
  id: string | number;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string | null;
};

const isNativeMobile =
  typeof navigator !== 'undefined' &&
  /ReactNative|TauTalkMobile|TauIDMobile/i.test(navigator.userAgent);

/** Headers for authenticated API calls — Bearer for mobile, cookies for web. */
export function tauAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {};
  if (typeof window === 'undefined') return headers;
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export const tauFetchCredentials: RequestCredentials = isNativeMobile ? 'same-origin' : 'include';

export async function refreshTauSession(): Promise<boolean> {
  try {
    const refreshToken = isNativeMobile ? localStorage.getItem(TAU_REFRESH_KEY) : null;
    const res = await fetch('/api/auth/session', {
      method: 'POST',
      credentials: 'include',
      headers: refreshToken ? { 'Content-Type': 'application/json' } : undefined,
      body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.token) {
      localStorage.setItem(TAU_TOKEN_KEY, data.token);
    }
    if (data.refreshToken && isNativeMobile) {
      localStorage.setItem(TAU_REFRESH_KEY, data.refreshToken);
    }
    if (data.user) {
      localStorage.setItem(TAU_USER_KEY, JSON.stringify(data.user));
    }
    return true;
  } catch {
    return false;
  }
}

export async function logoutTauSession(redirect = '/tauid/login'): Promise<void> {
  try {
    await fetch('/api/auth/session', { method: 'DELETE', credentials: 'include' });
  } catch {
    /* ignore */
  }
  localStorage.removeItem(TAU_TOKEN_KEY);
  localStorage.removeItem(TAU_USER_KEY);
  localStorage.removeItem(TAU_REFRESH_KEY);
  if (typeof window !== 'undefined') {
    window.location.href = redirect;
  }
}

/** Persist session after login — cookies set by server; store user (+ token on mobile). */
export function persistTauSession(
  token: string,
  user: TauSessionUser,
  refreshToken?: string
) {
  localStorage.setItem(TAU_USER_KEY, JSON.stringify(user));
  if (token) {
    localStorage.setItem(TAU_TOKEN_KEY, token);
  }
  if (refreshToken && isNativeMobile) {
    localStorage.setItem(TAU_REFRESH_KEY, refreshToken);
  }
}

export async function tauFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const mergedHeaders = {
    ...tauAuthHeaders(),
    ...(init.headers instanceof Headers
      ? Object.fromEntries(init.headers.entries())
      : (init.headers as Record<string, string>) || {}),
  };

  let res = await fetch(input, {
    ...init,
    credentials: 'include',
    headers: mergedHeaders,
  });

  if (res.status === 401 && !(init.method === 'POST' && String(input).includes('/api/auth/session'))) {
    const refreshed = await refreshTauSession();
    if (refreshed) {
      res = await fetch(input, {
        ...init,
        credentials: 'include',
        headers: {
          ...tauAuthHeaders(),
          ...(init.headers instanceof Headers
            ? Object.fromEntries(init.headers.entries())
            : (init.headers as Record<string, string>) || {}),
        },
      });
    }
  }

  return res;
}

export async function hydrateTauSession(): Promise<{
  user: TauSessionUser | null;
  token: string | null;
}> {
  if (typeof window === 'undefined') return { user: null, token: null };

  try {
    const res = await fetch('/api/auth/session', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        localStorage.setItem(TAU_USER_KEY, JSON.stringify(data.user));
        return { user: data.user, token: localStorage.getItem(TAU_TOKEN_KEY) };
      }
    }
  } catch {
    /* fall through */
  }

  const storedUser = localStorage.getItem(TAU_USER_KEY);
  const storedToken = localStorage.getItem(TAU_TOKEN_KEY);
  if (storedUser && storedToken) {
    return { user: JSON.parse(storedUser), token: storedToken };
  }
  return { user: null, token: null };
}
