'use client';

import Link from 'next/link';
import { geistMono, geistSans, outfit } from '@/lib/website/fonts';
import { tauMailAssets } from '@/lib/taumail/assets';
import { MailIcon } from '@/components/taumail/shared/MailIcon';
import TauMailUserAvatar from '@/components/taumail/shared/TauMailUserAvatar';

type TauMailTopBarProps = {
  userName?: string;
  avatarUrl?: string | null;
};

export default function TauMailTopBar({ userName = 'Account', avatarUrl }: TauMailTopBarProps) {
  return (
    <header
      className={`${geistSans.className} flex h-[72px] shrink-0 items-center justify-between border-b border-[rgba(255,255,255,0.05)] px-8 py-4`}
    >
      <div className="flex w-[400px] items-center gap-2.5 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214] px-4 py-2">
        <MailIcon src={tauMailAssets.icons.search} size={14} />
        <span className="flex-1 text-[13px] text-[#a1a1aa]">Search emails, commands, and cohorts...</span>
        <span className={`${geistMono.className} rounded bg-[#070708] px-1.5 py-0.5 text-[10px] text-[#71717a]`}>⌘ K</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 rounded-md border border-[rgba(212,168,67,0.15)] bg-[rgba(212,168,67,0.08)] px-2 py-1">
          <MailIcon src={tauMailAssets.icons.ellipseStatus} size={6} />
          <span className={`${geistMono.className} text-[11px] font-semibold text-[#d4a843]`}>TAUNET ACTIVE</span>
        </div>
        <Link
          href="/taumail/notifications"
          className="flex size-8 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#121214]"
          aria-label="Notifications"
        >
          <MailIcon src={tauMailAssets.icons.bellDot} size={16} />
        </Link>
        <Link href="/taumail/settings">
          <TauMailUserAvatar name={userName} imageUrl={avatarUrl} size={32} rounded="2xl" />
        </Link>
      </div>
    </header>
  );
}

export function TauMailComposeTopBar({ userName = 'Account', avatarUrl }: TauMailTopBarProps) {
  return (
    <header
      className={`${geistSans.className} flex h-[72px] shrink-0 items-center justify-between border-b border-[rgba(255,255,255,0.05)] px-8 py-4`}
    >
      <h1 className={`${outfit.className} text-[22px] font-bold text-white`}>New Message</h1>
      <div className="flex items-center gap-4">
        <Link href="/taumail/inbox" className="flex items-center justify-center rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214] p-2">
          <MailIcon src={tauMailAssets.icons.xCircle} size={14} />
        </Link>
        <div className="flex items-center gap-1.5 rounded-md border border-[rgba(212,168,67,0.15)] bg-[rgba(212,168,67,0.08)] px-2 py-1">
          <MailIcon src={tauMailAssets.icons.ellipseStatus} size={6} />
          <span className={`${geistMono.className} text-[11px] font-semibold text-[#d4a843]`}>TAUNET ACTIVE</span>
        </div>
        <Link href="/taumail/settings">
          <TauMailUserAvatar name={userName} imageUrl={avatarUrl} size={32} rounded="2xl" />
        </Link>
      </div>
    </header>
  );
}
