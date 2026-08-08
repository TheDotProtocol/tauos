import { persistTauSession, logoutTauSession, tauAuthHeaders, tauFetchCredentials } from '@/lib/tau-auth-client';

export type TauIdUser = {
  id: string | number;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string | null;
};

export type TauIdProfile = {
  id: string;
  username: string;
  email: string;
  full_name: string;
  email_verified: boolean;
  avatar_url?: string | null;
  mfa_enabled?: boolean;
  created_at?: string;
  last_login_at?: string;
};

export type IdentityProfile = {
  id: string;
  profile_name: string;
  profile_type: string;
  is_primary: boolean;
  created_at: string;
};

function authHeaders(): HeadersInit {
  return tauAuthHeaders();
}

export async function loginTauId(
  email: string,
  password: string
): Promise<{
  ok: boolean;
  error?: string;
  requires2fa?: boolean;
  mfaToken?: string;
  devCode?: string;
}> {
  const res = await fetch('/api/tauid/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: tauFetchCredentials,
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Sign in failed' };
  if (data.requires2fa && data.mfaToken) {
    return { ok: true, requires2fa: true, mfaToken: data.mfaToken };
  }
  if (data.token && data.user) {
    persistTauSession(data.token, {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      fullName: data.user.fullName,
    });
  }
  return { ok: true };
}

export async function verifyTauId2fa(
  mfaToken: string,
  code: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/tauid/auth/verify-2fa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mfaToken, code }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Verification failed' };
  if (data.token && data.user) {
    persistTauSession(data.token, {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      fullName: data.user.fullName,
    });
  }
  return { ok: true };
}

export async function registerTauId(input: {
  email: string;
  password: string;
  username: string;
  fullName: string;
}): Promise<{ ok: boolean; error?: string; needsVerification?: boolean; devCode?: string }> {
  const res = await fetch('/api/tauid/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Registration failed' };
  if (data.token && data.user) {
    persistTauSession(data.token, {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      fullName: data.user.fullName,
    });
  }
  return {
    ok: true,
    needsVerification: !data.user?.emailVerified,
    devCode: data.devCode,
  };
}

export async function sendVerifyEmail(): Promise<{ ok: boolean; error?: string; devCode?: string }> {
  const res = await fetch('/api/tauid/auth/verify-email/send', {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Could not send code' };
  return { ok: true, devCode: data.devCode };
}

export async function confirmVerifyEmail(
  code: string,
  email?: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/tauid/auth/verify-email/confirm', {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, email }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Verification failed' };
  return { ok: true };
}

export async function requestPasswordReset(
  email: string
): Promise<{ ok: boolean; error?: string; devCode?: string }> {
  const res = await fetch('/api/tauid/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Request failed' };
  return { ok: true, devCode: data.devCode };
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/tauid/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Reset failed' };
  return { ok: true };
}

export async function fetchTauIdProfile(): Promise<{
  user: TauIdProfile;
  profiles: IdentityProfile[];
} | null> {
  const res = await fetch('/api/tauid/user/profile', {
    headers: authHeaders(),
    credentials: tauFetchCredentials,
  });
  if (!res.ok) return null;
  return res.json();
}

export async function saveTauIdProfile(input: {
  full_name?: string;
  username?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/tauid/user/profile', {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Save failed' };
  window.dispatchEvent(new Event('tauid-profile-updated'));
  return { ok: true };
}

export async function changeTauIdPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/tauid/profile/password', {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Password update failed' };
  return { ok: true };
}

export async function fetchTauId2faStatus(): Promise<{ enabled: boolean; email: string } | null> {
  const res = await fetch('/api/tauid/profile/2fa', { headers: authHeaders() });
  if (!res.ok) return null;
  const data = await res.json();
  return { enabled: Boolean(data.enabled), email: data.email };
}

export async function setupTauId2fa(): Promise<{
  ok: boolean;
  secret?: string;
  otpauthUrl?: string;
  error?: string;
}> {
  const res = await fetch('/api/tauid/profile/2fa', {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'setup' }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Setup failed' };
  return { ok: true, secret: data.secret, otpauthUrl: data.otpauthUrl };
}

export async function enableTauId2fa(code: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/tauid/profile/2fa', {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'enable', code }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Enable failed' };
  return { ok: true };
}

export async function disableTauId2fa(code: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/tauid/profile/2fa', {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'disable', code }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Disable failed' };
  return { ok: true };
}

export async function createIdentityProfile(input: {
  profile_name: string;
  profile_type?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/tauid/identity-profiles', {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Create failed' };
  return { ok: true };
}

export async function deleteIdentityProfile(id: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`/api/tauid/identity-profiles?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Delete failed' };
  return { ok: true };
}

export function logoutTauId(redirect = '/tauid/login') {
  logoutTauSession(redirect);
}

export async function deleteTauIdAccount(
  confirmEmail: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/privacy/account', {
    method: 'DELETE',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    credentials: tauFetchCredentials,
    body: JSON.stringify({ confirmEmail, password }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Deletion failed' };
  return { ok: true };
}
