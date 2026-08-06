'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { sidebarNavForPath } from '@/lib/tau-developer/nav';
import { tauDev } from '@/lib/tau-developer/theme';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DeveloperSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const navItems = sidebarNavForPath(pathname);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} aria-hidden />
      )}
      <aside
        className={`${geistSans.className} fixed inset-y-0 left-0 z-50 flex w-[240px] shrink-0 flex-col gap-8 border-r p-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: tauDev.sidebar, borderColor: tauDev.border }}
      >
        <div className="flex items-center justify-between">
          <Link href="/developers/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <img
              src="/tau-developer/brand/logo.png"
              alt="TAU_DEV"
              className="size-7 rounded-md object-cover"
              width={28}
              height={28}
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-base font-bold text-[#fafafa]">TAU_DEV</span>
              <span className={`${geistMono.className} text-[10px] font-semibold tracking-[1px] text-[#f5a623]`}>
                v2.0.4-beta
              </span>
            </div>
          </Link>
          <button type="button" onClick={onClose} className="text-[#a1a1aa] hover:text-white lg:hidden" aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>

        <nav className="tau-dev-scroll flex flex-1 flex-col gap-1.5 overflow-y-auto" aria-label="Developer platform">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-colors ${
                  active
                    ? 'border font-semibold text-[#f5a623]'
                    : 'border border-transparent font-medium text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
                style={
                  active
                    ? { backgroundColor: tauDev.goldMuted, borderColor: tauDev.goldBorder }
                    : undefined
                }
              >
                <Icon className="size-4 shrink-0" strokeWidth={active ? 2.25 : 2} />
                {item.label}
                {active && (
                  <span
                    className="absolute right-[11px] top-1/2 size-1 -translate-y-1/2 rounded-full bg-[#f5a623]"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div
          className="mt-auto rounded-lg border p-3"
          style={{ backgroundColor: tauDev.surfaceElevated, borderColor: tauDev.border }}
        >
          <div className="flex items-center gap-2">
            <span className="size-1.5 shrink-0 rounded-full bg-[#10b981]" aria-hidden />
            <p className="text-[11px] font-semibold text-[#fafafa]">All services operational</p>
          </div>
          <p className={`${geistMono.className} mt-2 text-[10px] text-[#52525b]`}>Uptime: 99.98% • US-East</p>
        </div>
      </aside>
    </>
  );
}
