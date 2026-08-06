'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type StoredUser = {
  id: string | number;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string | null;
};

type UseTauCloudSessionOptions = {
  required?: boolean;
};

export function useTauCloudSession(options: UseTauCloudSessionOptions = {}) {
  const { required = true } = options;
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('tauos_user');
    const storedToken = localStorage.getItem('tauos_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    } else if (required) {
      router.replace('/taucloud/login');
    }
    setReady(true);
  }, [required, router]);

  const logout = () => {
    localStorage.removeItem('tauos_user');
    localStorage.removeItem('tauos_token');
    router.replace('/taucloud/login');
  };

  return { user, isLoggedIn, ready, logout };
}
