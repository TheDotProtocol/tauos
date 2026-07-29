import { TAU_TOKEN_KEY, TAU_USER_KEY } from '@/lib/tau-auth-constants';

export type TauIdeUser = {
  id: number | string;
  email: string;
  username: string;
  fullName?: string;
};

export function getStoredUser(): TauIdeUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(TAU_USER_KEY);
    return raw ? (JSON.parse(raw) as TauIdeUser) : null;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TAU_TOKEN_KEY);
}

export function storeSession(token: string, user: TauIdeUser) {
  localStorage.setItem(TAU_TOKEN_KEY, token);
  localStorage.setItem(TAU_USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TAU_TOKEN_KEY);
  localStorage.removeItem(TAU_USER_KEY);
}

export async function login(email: string, password: string) {
  const res = await fetch('/api/tauid/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  storeSession(data.token, data.user);
  return data.user as TauIdeUser;
}

export async function register(fields: {
  email: string;
  password: string;
  username: string;
  fullName: string;
}) {
  const res = await fetch('/api/tauid/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  storeSession(data.token, data.user);
  return data.user as TauIdeUser;
}
