"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hydrateTauSession, logoutTauSession, type TauSessionUser } from '@/lib/tau-auth-client';

type UseTauCloudSessionOptions = {
  required?: boolean;
};

export function useTauCloudSession(options: UseTauCloudSessionOptions = {}) {
  const { required = true } = options;
  const router = useRouter();
  const [user, setUser] = useState<TauSessionUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = await hydrateTauSession();
      if (cancelled) return;
      if (session.user) {
        setUser(session.user);
        setIsLoggedIn(true);
      } else if (required) {
        router.replace('/taucloud/login');
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [required, router]);

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    logoutTauSession('/taucloud/login');
  };

  return { user, isLoggedIn, ready, logout };
}
