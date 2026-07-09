'use client';

import { useEffect, useState } from 'react';
import {
  clearDemoSession,
  DEMO_USER,
  isDemoSession,
  type DemoUser,
} from '@/lib/taumail-demo';

type StoredUser = {
  id: number;
  username: string;
  email: string;
  fullName: string;
};

export function useTauMailSession() {
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
    } else {
      window.location.href = '/taumail';
    }
    setReady(true);
  }, []);

  const logout = () => {
    clearDemoSession();
    window.location.href = '/taumail';
  };

  return { user, isLoggedIn, isDemo, ready, logout, demoUser: DEMO_USER };
}
