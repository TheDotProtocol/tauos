'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { geistMono, geistSans, outfit } from '@/lib/website/fonts';
import { tauMailAssets, tauMailNavItems, type TauMailNavId } from '@/lib/taumail/assets';
import { MailIcon } from '@/components/taumail/shared/MailIcon';

type TauMailSidebarProps = {
  active: TauMailNavId;
  userName?: string;
  userEmail?: string;
};

export default function TauMailSidebar({ active, userName = 'Cassiel V', userEmail = 'admin@tau.net' }: TauMailSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`${geistSans.className} flex h-full min-h-0 w-[240px] shrink-0 flex-col self-stretch border-r border-[rgba(255,255,255,0.05)] bg-[#121214] p-5`}
    >
      <Link href="/taumail/inbox" className="mb-6 flex shrink-0 items-center gap-3">
        <Image
          src={tauMailAssets.brand.logoIcon}
          alt=""
          width={32}
          height={32}
          className="rounded-lg shadow-[0px_2px_8px_0px_rgba(212,168,67,0.25)]"
        />
        <span className={`${outfit.className} text-lg font-bold text-white`}>
          Tau<span className="text-[#d4a843]">Mail</span>
        </span>
      </Link>

      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
        {tauMailNavItems.map((item) => {
          const isActive = active === item.id || pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={clsx(
                'flex shrink-0 items-center gap-3 rounded-lg border px-3 py-2.5 text-[13px] transition',
                isActive
                  ? 'border-[rgba(212,168,67,0.15)] bg-[rgba(212,168,67,0.08)] font-semibold text-white'
                  : 'border-transparent font-medium text-[#a1a1aa] hover:bg-[rgba(255,255,255,0.03)]',
              )}
            >
              <MailIcon src={item.icon} size={16} />
              <span className="flex-1">{item.label}</span>
              {isActive ? <MailIcon src={tauMailAssets.icons.ellipseGold} size={6} /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 flex shrink-0 flex-col gap-4">
        <Image src={tauMailAssets.shared.dividerLine} alt="" width={200} height={1} className="h-px w-full opacity-60" />
        <div className="flex items-center gap-3">
          <Image src={tauMailAssets.avatars.userSidebar} alt="" width={32} height={32} className="size-8 rounded-2xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white">{userName}</p>
            <p className={`${geistMono.className} truncate text-[11px] text-[#71717a]`}>{userEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
