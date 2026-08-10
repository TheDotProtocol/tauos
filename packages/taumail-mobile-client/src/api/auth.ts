import { jsonAuthHeaders, persistSession, clearSession } from '../session';
import { tauMobileFetch, tauMobileJson } from '../network';
import type { TauSessionUser } from '../types';

export type LoginResult =
  | { ok: true; user: TauSessionUser; requires2fa?: false }
  | { ok: true; requires2fa: true; mfaToken: string; message?: string }
  | { ok: false; error: string };

type LoginResponse = {
  token?: string;
  refreshToken?: string;
  user?: TauSessionUser;
  error?: string;
  requires2fa?: boolean;
  mfaToken?: string;
  message?: string;
};

/** Tau ID login — preferred mobile entry (SSO). */
export async function loginWithTauId(email: string, password: string): Promise<LoginResult> {
  const res = await tauMobileFetch('/api/tauid/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': (await import('../constants')).TAUMAIL_MOBILE_USER_AGENT,
    },
    body: JSON.stringify({ email, password }),
  }, { skipOfflineCheck: false });

  const data = (await res.json()) as LoginResponse;
  if (!res.ok) {
    return { ok: false, error: data.error || 'Login failed' };
  }

  if (data.requires2fa && data.mfaToken) {
    return { ok: true, requires2fa: true, mfaToken: data.mfaToken, message: data.message };
  }

  if (!data.token || !data.user) {
    return { ok: false, error: 'Invalid login response' };
  }

  await persistSession(data.token, data.user, data.refreshToken);
  return { ok: true, user: data.user };
}

export async function verifyTauId2fa(
  mfaToken: string,
  code: string,
): Promise<
  | { ok: true; user: TauSessionUser }
  | { ok: false; error: string }
> {
  const { TAUMAIL_MOBILE_USER_AGENT } = await import('../constants');
  const res = await tauMobileFetch('/api/tauid/auth/verify-2fa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': TAUMAIL_MOBILE_USER_AGENT,
    },
    body: JSON.stringify({ mfaToken, code }),
  }, { skipOfflineCheck: false });

  const data = (await res.json()) as LoginResponse;
  if (!res.ok) {
    return { ok: false, error: data.error || 'Verification failed' };
  }

  if (!data.token || !data.user) {
    return { ok: false, error: 'Invalid verification response' };
  }

  await persistSession(data.token, data.user, data.refreshToken);
  return { ok: true, user: data.user };
}

/** TauMail-specific login endpoint (same SSO session). */
export async function loginWithTauMail(email: string, password: string): Promise<LoginResult> {
  const { TAUMAIL_MOBILE_USER_AGENT } = await import('../constants');
  const res = await tauMobileFetch('/api/taumail/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': TAUMAIL_MOBILE_USER_AGENT,
    },
    body: JSON.stringify({ email, password }),
  });

  const data = (await res.json()) as LoginResponse & { user: TauSessionUser };
  if (!res.ok) {
    return { ok: false, error: data.error || 'Login failed' };
  }

  if (!data.token || !data.user) {
    return { ok: false, error: 'Invalid login response' };
  }

  await persistSession(data.token, {
    id: data.user.id,
    username: data.user.username,
    email: data.user.email,
    fullName: data.user.fullName,
    avatarUrl: data.user.avatarUrl ?? null,
  }, data.refreshToken);

  return { ok: true, user: data.user };
}

export async function logout(): Promise<void> {
  try {
    await tauMobileFetch('/api/auth/session', { method: 'DELETE' });
  } catch {
    /* ignore */
  }
  await clearSession();
}
