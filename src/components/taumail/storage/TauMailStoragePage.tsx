'use client';

import { useEffect, useState } from 'react';
import { geistMono, geistSans, outfit } from '@/lib/website/fonts';
import { tauMailAssets } from '@/lib/taumail/assets';
import TauMailAppShell from '@/components/taumail/shared/TauMailAppShell';
import { MailIcon } from '@/components/taumail/shared/MailIcon';
import { fetchTauMailStorage, type TauMailStorageData } from '@/lib/taumail/api-client';
import { useTauMailSession } from '@/hooks/useTauMailSession';

export default function TauMailStoragePage() {
  const { ready, isLoggedIn } = useTauMailSession();
  const [data, setData] = useState<TauMailStorageData | null>(null);

  useEffect(() => {
    if (!ready || !isLoggedIn) return;
    fetchTauMailStorage().then(setData).catch(console.error);
  }, [ready, isLoggedIn]);

  if (!ready || !isLoggedIn) {
    return <div className={`${geistSans.className} flex min-h-screen items-center justify-center bg-[#070708] text-[#a1a1aa]`}>Loading...</div>;
  }

  const breakdown = data?.breakdown ?? [];
  const totalUsed = data?.usedGb ?? 0;
  const totalGb = data?.totalGb ?? 250;

  return (
    <TauMailAppShell active="storage">
      <div className={`${geistSans.className} flex min-h-0 flex-1 flex-col p-8`}>
        <h1 className={`${outfit.className} text-[28px] font-bold text-white`}>Storage Analytics</h1>
        <p className="mt-1 text-sm text-[#a1a1aa]">
          {totalUsed} GB used of {totalGb} GB on Tau Cloud node
        </p>

        <div className="mt-8 rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-6">
          <div className="flex items-end justify-between">
            <p className={`${outfit.className} text-4xl font-bold text-white`}>
              {totalUsed} <span className="text-lg font-normal text-[#71717a]">GB</span>
            </p>
            <p className={`${geistMono.className} text-sm text-[#71717a]`}>{totalGb} GB total</p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#1e1e24]">
            <div className="h-full rounded-full bg-gradient-to-r from-[#d4a843] to-[#e8c547]" style={{ width: `${Math.min(100, (totalUsed / totalGb) * 100)}%` }} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {breakdown.map((item) => (
            <div key={item.label} className="rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-5">
              <div className="flex items-center gap-2">
                <MailIcon src={tauMailAssets.icons.database} size={16} />
                <p className="text-sm font-semibold text-white">{item.label}</p>
              </div>
              <p className={`${geistMono.className} mt-3 text-2xl font-bold text-white`}>{item.used} GB</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1e1e24]">
                <div className="h-full rounded-full" style={{ width: `${(item.used / item.total) * 100}%`, backgroundColor: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </TauMailAppShell>
  );
}
