'use client';

import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import { inter } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';
import { websiteRoutes } from '@/lib/website/routes';

type JourneyNavProps = {
  active: 'roadmap' | 'download' | 'startup';
};

const links = [
  { id: 'roadmap' as const, label: 'Roadmap', href: websiteRoutes.roadmap },
  { id: 'download' as const, label: 'Download Center', href: websiteRoutes.download },
  { id: 'startup' as const, label: 'Tau Startup', href: websiteRoutes.tauStartup },
];

export default function JourneyNav({ active }: JourneyNavProps) {
  return (
    <header className={`${inter.className} sticky top-0 z-50 flex h-20 items-center justify-between border-b border-[#2a2a2a] bg-[#0f0f0f] px-6 md:px-20`}>
      <Link href={websiteRoutes.home} className="flex items-center gap-2.5">
        <Image src={marketingAssets.shared.logoIcon} alt="" width={36} height={36} className="rounded-md" />
        <span className="text-xl font-bold tracking-tight">TAU</span>
      </Link>

      <nav className="hidden items-center gap-10 md:flex" aria-label="Journey">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={clsx(
              'text-sm transition',
              link.id === active
                ? 'font-semibold text-[#d4af37] underline decoration-[#d4af37] underline-offset-4'
                : 'text-[#8e8e93] hover:text-white',
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link
        href={websiteRoutes.register}
        className="rounded bg-[#d4af37] px-4 py-2 text-[13px] font-semibold text-[#0f0f0f] transition hover:bg-[#e0bc4a]"
      >
        Join Beta
      </Link>
    </header>
  );
}
