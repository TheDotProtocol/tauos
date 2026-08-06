'use client';

import Link from 'next/link';
import { Menu, Search, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { getStoredUser } from '@/lib/tau-ide/auth-client';
import { tauDev } from '@/lib/tau-developer/theme';

type Props = {
  title: string;
  onMenuClick: () => void;
};

export default function DeveloperTopBar({ title, onMenuClick }: Props) {
  const [user, setUser] = useState<{ username?: string; fullName?: string } | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handle = user?.username ?? user?.fullName?.toLowerCase().replace(/\s+/g, '_') ?? 'tau_dev_1';

  return (
    <header
      className={`${geistSans.className} flex h-16 shrink-0 items-center justify-between border-b px-8`}
      style={{ borderColor: tauDev.border }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-[#a1a1aa] hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <h1 className="truncate text-lg font-semibold text-[#fafafa]">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="hidden w-[260px] items-center gap-2 rounded-md border px-3 py-2 sm:flex"
          style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
        >
          <Search className="size-3.5 shrink-0 text-[#52525b]" />
          <span className="text-xs text-[#52525b]">Search files, commands...</span>
        </div>

        <Link
          href="/developers/settings"
          className="flex size-8 items-center justify-center rounded-md border text-[#a1a1aa] hover:text-white"
          style={{ borderColor: tauDev.border }}
          aria-label="Notifications"
        >
          <Bell className="size-3.5" />
        </Link>

        <Link href="/developers/settings" className="flex items-center gap-2">
          <img
            src="/tau-developer/avatars/default.png"
            alt=""
            className="size-7 rounded-[14px] object-cover"
            width={28}
            height={28}
          />
          <span className={`${geistMono.className} hidden text-xs font-semibold text-[#a1a1aa] sm:inline`}>
            {handle}
          </span>
        </Link>
      </div>
    </header>
  );
}
