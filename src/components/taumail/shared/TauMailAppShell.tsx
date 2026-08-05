'use client';

import type { ReactNode } from 'react';
import { geistSans } from '@/lib/website/fonts';
import type { TauMailNavId } from '@/lib/taumail/assets';
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
  const { user } = useTauMailSession({ required: false });

  const displayName = userName || user?.fullName || user?.username || 'Cassiel V';
  const displayEmail = userEmail || user?.email || 'admin@tau.net';

  return (
    <div className={`${geistSans.className} flex h-screen min-h-0 bg-[#070708] text-white`}>
      <TauMailSidebar active={active} userName={displayName} userEmail={displayEmail} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {header === 'compose' ? <TauMailComposeTopBar /> : <TauMailTopBar />}
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
