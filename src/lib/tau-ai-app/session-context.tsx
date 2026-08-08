'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { useTauSession } from '@/hooks/useTauSession';
import { fetchTauIdProfile } from '@/lib/tauid/api-client';

export type TauAiSessionProfile = {
  displayName: string;
  tauId: string;
  avatarUrl: string | null;
  email: string;
};

type TauAiSessionContextValue = {
  ready: boolean;
  isLoggedIn: boolean;
  profile: TauAiSessionProfile | null;
  refreshProfile: () => Promise<void>;
  logout: () => void;
};

const TauAiSessionContext = createContext<TauAiSessionContextValue | null>(null);

const PUBLIC_PATHS = new Set(['/tau-ai-app/welcome', '/tau-ai-app/auth']);

function buildProfile(
  user: { username: string; email: string; fullName?: string; avatarUrl?: string | null },
  fullName?: string | null,
  avatarUrl?: string | null,
): TauAiSessionProfile {
  return {
    displayName: fullName || user.fullName || user.username || user.email.split('@')[0] || 'Tau User',
    tauId: user.username,
    avatarUrl: avatarUrl ?? user.avatarUrl ?? null,
    email: user.email,
  };
}

export function TauAiSessionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.has(pathname);
  const { user, ready: sessionReady, logout, isLoggedIn } = useTauSession({
    requireAuth: !isPublic,
    loginPath: '/tau-ai-app/auth',
  });
  const [profile, setProfile] = useState<TauAiSessionProfile | null>(null);
  const [profileReady, setProfileReady] = useState(false);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setProfileReady(true);
      return;
    }

    try {
      const data = await fetchTauIdProfile();
      if (data?.user) {
        setProfile(
          buildProfile(user, data.user.full_name, data.user.avatar_url ?? null),
        );
      } else {
        setProfile(buildProfile(user));
      }
    } catch {
      setProfile(buildProfile(user));
    } finally {
      setProfileReady(true);
    }
  }, [user]);

  useEffect(() => {
    if (!sessionReady) return;
    if (!user) {
      setProfile(null);
      setProfileReady(true);
      return;
    }
    void refreshProfile();
  }, [sessionReady, user, refreshProfile]);

  const ready = sessionReady && (isPublic || profileReady);

  const value = useMemo(
    () => ({
      ready,
      isLoggedIn,
      profile,
      refreshProfile,
      logout: () => logout('/tau-ai-app/auth'),
    }),
    [ready, isLoggedIn, profile, refreshProfile, logout],
  );

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-[#999]">
        Loading Tau AI…
      </div>
    );
  }

  return <TauAiSessionContext.Provider value={value}>{children}</TauAiSessionContext.Provider>;
}

export function useTauAiSession() {
  const ctx = useContext(TauAiSessionContext);
  if (!ctx) {
    throw new Error('useTauAiSession must be used within TauAiSessionProvider');
  }
  return ctx;
}
