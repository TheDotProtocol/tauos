'use client';

import { useCallback, useEffect, useState } from 'react';
import { TAU_TOKEN_KEY, TAU_USER_KEY } from '@/lib/tau-auth-constants';

export type TauSessionUser = {
  id: string | number;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string | null;
};

type Options = {
  /** Redirect here when no session (default: no redirect) */
  loginPath?: string;
  requireAuth?: boolean;
};

export function useTauSession(options: Options = {}) {
  const { loginPath = '/tauid/login', requireAuth = false } = options;
  const [user, setUser] = useState<TauSessionUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem(TAU_USER_KEY);
    const storedToken = localStorage.getItem(TAU_TOKEN_KEY);

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } else if (requireAuth) {
      window.location.href = loginPath;
    }
    setReady(true);
  }, [requireAuth, loginPath]);

  const saveSession = useCallback((newToken: string, newUser: TauSessionUser) => {
    localStorage.setItem(TAU_TOKEN_KEY, newToken);
    localStorage.setItem(
      TAU_USER_KEY,
      JSON.stringify({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
      })
    );
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(
    (redirect = loginPath) => {
      localStorage.removeItem(TAU_TOKEN_KEY);
      localStorage.removeItem(TAU_USER_KEY);
      window.location.href = redirect;
    },
    [loginPath]
  );

  return {
    user,
    token,
    isLoggedIn: Boolean(token && user),
    ready,
    saveSession,
    logout,
  };
}

/** Persist SSO session after Tau ID login/register */
export function persistTauSession(
  token: string,
  user: { id: string | number; username: string; email: string; fullName?: string; avatarUrl?: string | null }
) {
  localStorage.setItem(TAU_TOKEN_KEY, token);
  localStorage.setItem(TAU_USER_KEY, JSON.stringify(user));
}
