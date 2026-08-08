'use client';

import Link from 'next/link';
import { clsx } from 'clsx';
import { outfit } from '@/lib/website/fonts';
import { tauAiAssets, tauAiNavItems, type TauAiNavId } from '@/lib/tau-ai-app/assets';
import { useTauAiSession } from '@/lib/tau-ai-app/session-context';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import TauAiLogo from '@/components/tau-ai-app/shared/TauAiLogo';

type TauAiSidebarProps = {
  active: TauAiNavId;
};

function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        width={36}
        height={36}
        className="size-[36px] shrink-0 rounded-[18px] object-cover"
      />
    );
  }

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex size-[36px] shrink-0 items-center justify-center rounded-[18px] bg-[rgba(212,168,67,0.16)] text-[12px] font-bold text-[#d4a843]">
      {initials || 'T'}
    </div>
  );
}

export default function TauAiSidebar({ active }: TauAiSidebarProps) {
  const { profile, logout } = useTauAiSession();

  return (
    <aside
      className={`${outfit.className} flex h-full w-[240px] shrink-0 flex-col justify-between border-r border-[#222] bg-[#0a0a0a] px-[24px] pb-[24px] pt-[32px]`}
      data-name="sidebar"
    >
      <div className="flex w-full flex-col gap-[40px]">
        <Link href="/tau-ai-app/home" className="flex shrink-0 items-center gap-[12px]">
          <TauAiLogo variant="emblem" width={28} height={28} />
          <span className="text-[20px] font-bold text-white">TAU AI</span>
        </Link>

        <nav className="flex w-full flex-col gap-[8px]">
          {tauAiNavItems.map((item) => {
            const isActive = active === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={clsx(
                  'flex w-full items-center gap-[12px] rounded-[8px] px-[12px] py-[10px]',
                  isActive ? 'bg-[rgba(212,168,67,0.08)]' : 'bg-transparent',
                )}
                data-name={`nav-item-${item.label}`}
              >
                <TauAiIcon src={item.icon} size={18} />
                <span
                  className={clsx(
                    'min-w-0 flex-1 text-[14px] leading-normal',
                    isActive ? 'font-semibold text-[#d4a843]' : 'font-normal text-[#999]',
                  )}
                >
                  {item.label}
                </span>
                {isActive ? <span className="size-[4px] shrink-0 rounded-[2px] bg-[#d4a843]" /> : null}
              </Link>
            );
          })}
        </nav>
      </div>

      {profile ? (
        <div className="flex w-full flex-col gap-[12px] border-t border-[#222] pt-[16px]">
          <div className="flex w-full items-center gap-[12px]">
            <UserAvatar name={profile.displayName} avatarUrl={profile.avatarUrl} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-white">{profile.displayName}</p>
              <p className="truncate text-[11px] font-medium text-[#d4a843]">TAU ID: {profile.tauId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-[8px] border border-[#222] bg-[#111] px-[12px] py-[8px] text-[12px] font-medium text-[#999] hover:border-[#333] hover:text-white"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </aside>
  );
}
