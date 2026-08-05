'use client';

import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import { inter, outfit } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';

type AppsSuiteNavProps = {
  active: 'tau-ai' | 'tau-browser' | 'tau-mail';
};

const links = [
  { id: 'tau-ai' as const, label: 'Tau AI', href: websiteRoutes.tauAi },
  { id: 'tau-browser' as const, label: 'Tau Browser', href: websiteRoutes.tauBrowser },
  { id: 'tau-mail' as const, label: 'Tau Mail', href: websiteRoutes.tauMail },
];

export default function AppsSuiteNav({ active }: AppsSuiteNavProps) {
  return (
    <header className={`${inter.className} sticky top-0 z-50 flex h-20 items-center justify-between border-b border-[#2a2820] bg-[#0f0f0f] px-6 md:px-20`}>
      <Link href={websiteRoutes.home} className={`${outfit.className} flex items-center gap-3`}>
        <Image src="/website/logos/tau-core/logo-nav.png" alt="" width={32} height={32} className="rounded-md" />
        <span className="text-xl font-extrabold">TAU</span>
      </Link>

      <nav className="hidden items-center gap-8 md:flex" aria-label="Tau apps">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={clsx(
              'text-sm transition',
              link.id === active
                ? 'font-semibold text-[#d4af37] underline decoration-[#d4af37] underline-offset-4'
                : 'text-[#a0a0a0] hover:text-white',
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <Link href={websiteRoutes.home} className="hidden text-sm text-[#a0a0a0] hover:text-white sm:block">
          Ecosystem
        </Link>
        <Link
          href={websiteRoutes.download}
          className="rounded-md bg-[#d4af37] px-4 py-2 text-[13px] font-bold text-[#0f0f0f] transition hover:bg-[#e0bc4a]"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
