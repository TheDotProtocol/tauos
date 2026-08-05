'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DEMO_USER,
  isDemoSession,
} from '@/lib/taumail-demo';

type StoredUser = {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
};

type UseTauMailSessionOptions = {
  required?: boolean;
};

export function useTauMailSession(options: UseTauMailSessionOptions = {}) {
  const { required = true } = options;
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('tauos_user');
    const storedToken = localStorage.getItem('tauos_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      setIsDemo(isDemoSession(storedToken));
    } else if (required) {
      router.replace('/taumail/login');
    }
    setReady(true);
  }, [required, router]);

  const logout = () => {
    localStorage.removeItem('tauos_user');
    localStorage.removeItem('tauos_token');
    localStorage.removeItem('tauos_demo_mode');
    router.replace('/taumail/login');
  };

  return { user, isLoggedIn, isDemo, ready, logout, demoUser: DEMO_USER };
}
