'use client';

import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import { inter } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';
import { websiteRoutes } from '@/lib/website/routes';

type CompanyNavProps = {
  active: 'careers' | 'press' | 'contact';
};

const links = [
  { id: 'careers' as const, label: 'Careers', href: websiteRoutes.careers },
  { id: 'press' as const, label: 'Press', href: websiteRoutes.press },
  { id: 'contact' as const, label: 'Contact', href: websiteRoutes.contact },
];

export default function CompanyNav({ active }: CompanyNavProps) {
  return (
    <header className={`${inter.className} sticky top-0 z-50 flex h-20 items-center justify-between border-b border-[#2a2820] bg-[#0f0f0f] px-6 md:px-20`}>
      <Link href={websiteRoutes.home} className="flex items-center gap-2.5">
        <Image src={marketingAssets.shared.logoIcon} alt="" width={36} height={36} className="rounded-md" />
        <span className="text-lg font-bold">TAU</span>
      </Link>

      <nav className="hidden items-center gap-10 md:flex" aria-label="Company">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={clsx(
              'text-[15px] transition',
              link.id === active ? 'font-semibold text-[#d4af37]' : 'text-[#a0a0a0] hover:text-white',
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link
        href={websiteRoutes.login}
        className="rounded bg-[#d4af37] px-5 py-2.5 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#e0bc4a]"
      >
        Launch App
      </Link>
    </header>
  );
}
