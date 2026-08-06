'use client';

import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import { inter } from '@/lib/website/fonts';
import { tauIdAssets, tauIdNavItems, type TauIdNavId } from '@/lib/tauid/assets';
import TauIDUserAvatar from '@/components/tauid/shared/TauIDUserAvatar';
import { Home, Fingerprint, Shield, Settings, LogOut } from 'lucide-react';

const iconMap = {
  dashboard: Home,
  profiles: Fingerprint,
  security: Shield,
  settings: Settings,
} as const;

type TauIDSidebarProps = {
  active: TauIdNavId;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string | null;
  onLogout?: () => void;
};

export default function TauIDSidebar({
  active,
  userName = 'Account',
  userEmail = '',
  avatarUrl,
  onLogout,
}: TauIDSidebarProps) {
  return (
    <aside
      className={`${inter.className} hidden h-full w-[240px] shrink-0 flex-col gap-8 border-r border-[#222228] bg-[#09090b] px-4 py-6 lg:flex`}
    >
      <div className="flex h-16 items-center justify-center">
        <Image src={tauIdAssets.brand.logo} alt="Tau ID" width={160} height={64} className="h-14 w-auto object-contain" />
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {tauIdNavItems.map((item) => {
          const Icon = iconMap[item.id];
          const isActive = item.id === active;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={clsx(
                'relative flex items-center gap-3.5 rounded-lg px-3.5 py-3 text-sm transition-colors',
                isActive
                  ? 'border border-[rgba(255,184,0,0.3)] bg-[rgba(255,184,0,0.12)] font-semibold text-[#ffb800]'
                  : 'border border-transparent font-medium text-[#a1a1aa] hover:text-white'
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span>{item.label}</span>
              {isActive ? <span className="absolute right-3 h-4 w-[3px] rounded-sm bg-[#ffb800]" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 rounded-xl border border-[#222228] bg-[rgba(22,22,27,0.8)] p-3">
        <Link href="/tauid/settings" className="flex min-w-0 flex-1 items-center gap-3 transition-opacity hover:opacity-90">
          <TauIDUserAvatar name={userName} email={userEmail} imageUrl={avatarUrl} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white">{userName}</p>
            <p className="truncate text-[11px] text-[#71717a]">Tau ID Account</p>
          </div>
        </Link>
        <button type="button" onClick={onLogout} aria-label="Sign out" className="shrink-0 text-[#71717a] hover:text-white">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
