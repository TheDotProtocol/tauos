'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { inter } from '@/lib/website/fonts';
import { tauIdPageMeta, type TauIdNavId } from '@/lib/tauid/assets';
import { fetchTauIdProfile, logoutTauId } from '@/lib/tauid/api-client';
import type { TauIdProfile } from '@/lib/tauid/api-client';
import { useTauSession } from '@/hooks/useTauSession';
import TauIDSidebar from '@/components/tauid/shared/TauIDSidebar';
import TauIDHeader from '@/components/tauid/shared/TauIDHeader';
import TauIDMobileNav from '@/components/tauid/shared/TauIDMobileNav';

type TauIDAppShellProps = {
  active: TauIdNavId;
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export default function TauIDAppShell({ active, children, title, subtitle }: TauIDAppShellProps) {
  const { user, ready, isLoggedIn } = useTauSession({
    requireAuth: true,
    loginPath: '/tauid/login?redirect=/tauid/dashboard',
  });
  const [profile, setProfile] = useState<TauIdProfile | null>(null);
  const meta = tauIdPageMeta[active];

  useEffect(() => {
    if (!user || !ready) return;
    const load = () => {
      fetchTauIdProfile()
        .then((data) => data && setProfile(data.user))
        .catch(() => undefined);
    };
    load();
    window.addEventListener('tauid-profile-updated', load);
    return () => window.removeEventListener('tauid-profile-updated', load);
  }, [user, ready]);

  if (!ready || !isLoggedIn) {
    return (
      <div className={`${inter.className} flex min-h-screen items-center justify-center bg-[#0d0d0f] text-[#a1a1aa]`}>
        Loading…
      </div>
    );
  }

  const displayName = profile?.full_name || user?.fullName || user?.username || 'Account';
  const displayEmail = profile?.email || user?.email || '';

  return (
    <div className={`${inter.className} flex min-h-screen bg-[#0d0d0f] text-white lg:h-screen`}>
      <TauIDSidebar
        active={active}
        userName={displayName}
        userEmail={displayEmail}
        avatarUrl={profile?.avatar_url}
        onLogout={() => logoutTauId()}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <TauIDHeader title={title || meta.title} subtitle={subtitle || meta.subtitle} />
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
      <TauIDMobileNav active={active} onLogout={() => logoutTauId()} />
    </div>
  );
}
