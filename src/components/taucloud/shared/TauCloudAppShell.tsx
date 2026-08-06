'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { inter } from '@/lib/website/fonts';
import type { TauCloudNavId } from '@/lib/taucloud/assets';
import { tauCloudPageMeta } from '@/lib/taucloud/assets';
import { fetchTauCloudProfile } from '@/lib/taucloud/api-client';
import type { TauCloudProfile } from '@/lib/taucloud/types';
import { useTauCloudSession } from '@/hooks/useTauCloudSession';
import TauCloudSidebar from '@/components/taucloud/shared/TauCloudSidebar';
import TauCloudHeader from '@/components/taucloud/shared/TauCloudHeader';

type TauCloudAppShellProps = {
  active: TauCloudNavId;
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export default function TauCloudAppShell({ active, children, title, subtitle }: TauCloudAppShellProps) {
  const { user, logout, ready, isLoggedIn } = useTauCloudSession();
  const [profile, setProfile] = useState<TauCloudProfile | null>(null);
  const meta = tauCloudPageMeta[active];

  useEffect(() => {
    if (!user || !ready) return;
    const load = () => {
      fetchTauCloudProfile()
        .then((p) => setProfile(p))
        .catch(() => undefined);
    };
    load();
    window.addEventListener('taucloud-profile-updated', load);
    return () => window.removeEventListener('taucloud-profile-updated', load);
  }, [user, ready]);

  if (!ready || !isLoggedIn) {
    return <div className={`${inter.className} flex min-h-screen items-center justify-center bg-[#0d0d0f] text-[#a1a1aa]`}>Loading...</div>;
  }

  const displayName = profile?.fullName || user?.fullName || user?.username || 'Account';
  const displayEmail = profile?.email || user?.email || '';
  const avatarUrl = profile?.avatarUrl ?? user?.avatarUrl ?? null;

  return (
    <div className={`${inter.className} flex h-screen min-h-0 bg-[#0d0d0f] text-white`}>
      <TauCloudSidebar
        active={active}
        userName={displayName}
        userEmail={displayEmail}
        avatarUrl={avatarUrl}
        accountLabel="Pro Account"
        onLogout={logout}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TauCloudHeader title={title || meta.title} subtitle={subtitle || meta.subtitle} />
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
