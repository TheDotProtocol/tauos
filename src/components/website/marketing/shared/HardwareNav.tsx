'use client';

import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import { inter } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';
import { websiteRoutes } from '@/lib/website/routes';

type HardwareNavProps = {
  active: 'hardware' | 'future' | 'store';
};

const links = [
  { id: 'hardware' as const, label: 'Hardware', href: websiteRoutes.tauPhone },
  { id: 'future' as const, label: 'Future Vision', href: websiteRoutes.tauTablet },
  { id: 'store' as const, label: 'Store', href: websiteRoutes.tauStore },
];

export default function HardwareNav({ active }: HardwareNavProps) {
  return (
    <header className={`${inter.className} flex items-center justify-between border-b border-[#262628] px-6 py-6 md:px-20`}>
      <Link href={websiteRoutes.home}>
        <Image src={marketingAssets.hardware.devicesLogo} alt="Tau Devices" width={120} height={36} className="h-9 w-auto object-contain" />
      </Link>

      <nav className="hidden items-center gap-8 md:flex" aria-label="Hardware">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={clsx(
              'text-sm font-semibold uppercase transition',
              link.id === active ? 'text-[#d4af37]' : 'text-[#a4a4a6] hover:text-white',
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <span className="hidden text-[13px] text-[#a4a4a6] sm:block">Cart (0)</span>
        <button type="button" className="rounded bg-[#d4af37] px-4 py-2 text-xs font-bold uppercase text-[#0f0f0f]">
          Order Now
        </button>
      </div>
    </header>
  );
}
