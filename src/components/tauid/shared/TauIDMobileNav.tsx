'use client';

import Link from 'next/link';
import { clsx } from 'clsx';
import { inter } from '@/lib/website/fonts';
import { tauIdNavItems, type TauIdNavId } from '@/lib/tauid/assets';
import { Home, Fingerprint, Shield, Settings, LogOut } from 'lucide-react';

const iconMap = {
  dashboard: Home,
  profiles: Fingerprint,
  security: Shield,
  settings: Settings,
} as const;

type TauIDMobileNavProps = {
  active: TauIdNavId;
  onLogout?: () => void;
};

export default function TauIDMobileNav({ active, onLogout }: TauIDMobileNavProps) {
  return (
    <nav
      className={`${inter.className} fixed inset-x-0 bottom-0 z-40 border-t border-[#222228] bg-[#09090b]/95 backdrop-blur-md lg:hidden`}
    >
      <div className="mx-auto flex max-w-[430px] items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {tauIdNavItems.map((item) => {
          const Icon = iconMap[item.id];
          const isActive = item.id === active;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={clsx(
                'flex min-w-0 flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors',
                isActive ? 'text-[#ffb800]' : 'text-[#71717a]'
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.25 : 1.75} />
              <span>{item.mobileLabel}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onLogout}
          className="flex min-w-0 flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium text-[#71717a]"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign out</span>
        </button>
      </div>
    </nav>
  );
}
