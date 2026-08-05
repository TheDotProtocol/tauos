'use client';

import { useEffect, useState } from 'react';
import { geistMono, geistSans, outfit } from '@/lib/website/fonts';
import { tauMailAssets } from '@/lib/taumail/assets';
import TauMailAppShell from '@/components/taumail/shared/TauMailAppShell';
import { MailIcon } from '@/components/taumail/shared/MailIcon';
import { fetchTauMailNotifications, type TauMailNotification } from '@/lib/taumail/api-client';
import { useTauMailSession } from '@/hooks/useTauMailSession';

const toneIcon = {
  success: tauMailAssets.icons.statusSuccess,
  danger: tauMailAssets.icons.statusDanger,
  info: tauMailAssets.icons.ellipseStatus,
  warning: tauMailAssets.icons.ellipseGold,
};

export default function TauMailNotificationsPage() {
  const { ready, isLoggedIn } = useTauMailSession();
  const [notifications, setNotifications] = useState<TauMailNotification[]>([]);

  useEffect(() => {
    if (!ready || !isLoggedIn) return;
    fetchTauMailNotifications().then(setNotifications).catch(console.error);
  }, [ready, isLoggedIn]);

  if (!ready || !isLoggedIn) {
    return <div className={`${geistSans.className} flex min-h-screen items-center justify-center bg-[#070708] text-[#a1a1aa]`}>Loading...</div>;
  }

  return (
    <TauMailAppShell active="notifications">
      <div className={`${geistSans.className} flex min-h-0 flex-1 flex-col p-8`}>
        <h1 className={`${outfit.className} text-[28px] font-bold text-white`}>Notifications</h1>
        <p className="mt-1 text-sm text-[#a1a1aa]">Subsystem alerts and mail activity</p>
        <div className="mt-6 space-y-3">
          {notifications.length === 0 ? (
            <p className="text-sm text-[#71717a]">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-4">
                <MailIcon src={toneIcon[n.tone]} size={8} className="mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-white">{n.title}</p>
                  <p className={`${geistMono.className} text-[11px] text-[#71717a]`}>{n.meta}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </TauMailAppShell>
  );
}
