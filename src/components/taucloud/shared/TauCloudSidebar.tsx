'use client';

import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import { inter } from '@/lib/website/fonts';
import { tauCloudAssets, tauCloudNavItems, type TauCloudNavId } from '@/lib/taucloud/assets';
import CloudIcon from '@/components/taucloud/shared/CloudIcon';
import TauCloudUserAvatar from '@/components/taucloud/shared/TauCloudUserAvatar';

type TauCloudSidebarProps = {
  active: TauCloudNavId;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string | null;
  accountLabel?: string;
  onLogout?: () => void;
};

export default function TauCloudSidebar({
  active,
  userName = 'Account',
  userEmail = '',
  avatarUrl,
  accountLabel = 'Pro Account',
  onLogout,
}: TauCloudSidebarProps) {
  return (
    <aside
      className={`${inter.className} flex h-full w-[240px] shrink-0 flex-col gap-10 border-r border-[#222228] bg-[#09090b] px-4 py-6`}
    >
      <div className="flex h-20 items-center justify-center">
        <Image src={tauCloudAssets.brand.logo} alt="Tau Cloud" width={208} height={80} className="h-20 w-auto object-contain" />
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {tauCloudNavItems.map((item) => {
          const isActive = item.id === active;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={clsx(
                'relative flex items-center gap-3.5 rounded-lg px-3.5 py-3 text-sm transition-colors',
                isActive
                  ? 'border border-[rgba(255,184,0,0.3)] bg-[rgba(255,184,0,0.12)] font-semibold text-[#ffb800]'
                  : 'border border-transparent font-medium text-[#a1a1aa] hover:text-white',
              )}
            >
              <CloudIcon src={item.icon} size={18} />
              <span>{item.label}</span>
              {isActive ? <span className="absolute right-3 h-4 w-[3px] rounded-sm bg-[#ffb800]" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 rounded-xl border border-[#222228] bg-[rgba(22,22,27,0.8)] p-3">
        <Link href="/taucloud/settings" className="flex min-w-0 flex-1 items-center gap-3 transition-opacity hover:opacity-90">
          <TauCloudUserAvatar name={userName} email={userEmail} imageUrl={avatarUrl} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white">{userName}</p>
            <p className="truncate text-[11px] text-[#71717a]">{accountLabel}</p>
          </div>
        </Link>
        <button type="button" onClick={onLogout} aria-label="Sign out" className="shrink-0">
          <CloudIcon src={tauCloudAssets.icons.logOut} size={16} />
        </button>
      </div>
    </aside>
  );
}
