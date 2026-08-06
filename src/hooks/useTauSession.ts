'use client';

import { useCallback, useEffect, useState } from 'react';
import { TAU_TOKEN_KEY, TAU_USER_KEY } from '@/lib/tau-auth-constants';
import {
  hydrateTauSession,
  logoutTauSession,
  persistTauSession as persistClientSession,
  type TauSessionUser,
} from '@/lib/tau-auth-client';

export type { TauSessionUser };

type Options = {
  loginPath?: string;
  requireAuth?: boolean;
};

export function useTauSession(options: Options = {}) {
  const { loginPath = '/tauid/login', requireAuth = false } = options;
  const [user, setUser] = useState<TauSessionUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = await hydrateTauSession();
      if (cancelled) return;
      if (session.user) {
        setUser(session.user);
        setToken(session.token);
      } else if (requireAuth) {
        window.location.href = loginPath;
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [requireAuth, loginPath]);

  const saveSession = useCallback((newToken: string, newUser: TauSessionUser) => {
    persistClientSession(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(
    (redirect = loginPath) => {
      setUser(null);
      setToken(null);
      logoutTauSession(redirect);
    },
    [loginPath]
  );

  return {
    user,
    token,
    isLoggedIn: Boolean(user),
    ready,
    saveSession,
    logout,
  };
}

export { persistClientSession as persistTauSession };
