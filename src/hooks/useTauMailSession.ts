'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DEMO_USER,
  isDemoSession,
} from '@/lib/taumail-demo';
import { hydrateTauSession, logoutTauSession, type TauSessionUser } from '@/lib/tau-auth-client';

type UseTauMailSessionOptions = {
  required?: boolean;
};

export function useTauMailSession(options: UseTauMailSessionOptions = {}) {
  const { required = true } = options;
  const router = useRouter();
  const [user, setUser] = useState<TauSessionUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = await hydrateTauSession();
      if (cancelled) return;
      if (session.user) {
        setUser(session.user);
        setIsLoggedIn(true);
        setIsDemo(isDemoSession(session.token));
      } else if (required) {
        router.replace('/taumail/login');
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
    setIsDemo(false);
    localStorage.removeItem('tauos_demo_mode');
    logoutTauSession('/taumail/login');
  };

  return { user, isLoggedIn, isDemo, ready, logout, demoUser: DEMO_USER };
}
