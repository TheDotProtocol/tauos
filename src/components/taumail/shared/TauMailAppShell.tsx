'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { geistSans } from '@/lib/website/fonts';
import type { TauMailNavId } from '@/lib/taumail/assets';
import { fetchTauMailProfile, type TauMailProfile } from '@/lib/taumail/api-client';
import { useTauMailSession } from '@/hooks/useTauMailSession';
import TauMailSidebar from '@/components/taumail/shared/TauMailSidebar';
import TauMailTopBar, { TauMailComposeTopBar } from '@/components/taumail/shared/TauMailTopBar';

type TauMailAppShellProps = {
  active: TauMailNavId;
  children: ReactNode;
  userName?: string;
  userEmail?: string;
  header?: 'default' | 'compose';
};

export default function TauMailAppShell({ active, children, userName, userEmail, header = 'default' }: TauMailAppShellProps) {
  const { user, isDemo } = useTauMailSession({ required: false });
  const [profile, setProfile] = useState<TauMailProfile | null>(null);

  useEffect(() => {
    if (!user || isDemo) return;
    fetchTauMailProfile()
      .then((p) => {
        if (!p) return;
        setProfile(p);
        const storedUser = localStorage.getItem('tauos_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          localStorage.setItem(
            'tauos_user',
            JSON.stringify({
              ...parsed,
              fullName: p.fullName || parsed.fullName,
              email: p.email || parsed.email,
              username: p.displayName || parsed.username,
              avatarUrl: p.avatarUrl ?? parsed.avatarUrl ?? null,
            }),
          );
        }
      })
      .catch(() => undefined);
  }, [user, isDemo]);

  const displayName =
    userName ||
    profile?.displayName ||
    profile?.fullName ||
    user?.fullName ||
    user?.username ||
    'Account';
  const displayEmail = userEmail || profile?.email || user?.email || '';
  const avatarUrl = profile?.avatarUrl ?? user?.avatarUrl ?? null;

  return (
    <div className={`${geistSans.className} flex h-screen min-h-0 bg-[#070708] text-white`}>
      <TauMailSidebar active={active} userName={displayName} userEmail={displayEmail} avatarUrl={avatarUrl} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {header === 'compose' ? (
          <TauMailComposeTopBar userName={displayName} avatarUrl={avatarUrl} />
        ) : (
          <TauMailTopBar userName={displayName} avatarUrl={avatarUrl} />
        )}
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
