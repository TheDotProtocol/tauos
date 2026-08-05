'use client';

import Image from 'next/image';
import Link from 'next/link';
import { inter } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';
import { websiteRoutes } from '@/lib/website/routes';

export default function JourneyFooter() {
  const columns = [
    {
      title: 'Ecosystem',
      links: [
        { label: 'Tau Core', href: websiteRoutes.tauCore },
        { label: 'Tau OS', href: websiteRoutes.tauDesktopOs },
        { label: 'Project Grayscale', href: websiteRoutes.projectGrayscale },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: websiteRoutes.about },
        { label: 'Careers', href: websiteRoutes.careers },
        { label: 'Press Kit', href: websiteRoutes.press },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: websiteRoutes.privacy },
        { label: 'Terms of Use', href: websiteRoutes.terms },
        { label: 'License', href: websiteRoutes.docs },
      ],
    },
  ] as const;

  return (
    <footer className={`${inter.className} border-t border-[#2a2a2a] px-6 pb-10 pt-20 md:px-20`}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-12">
        <div className="w-full max-w-xs">
          <Image src={marketingAssets.shared.logoIcon} alt="" width={36} height={36} className="rounded-md" />
          <div className="mt-4 flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded bg-[#d4af37] text-sm font-extrabold text-[#0f0f0f]">T</span>
            <span className="text-lg font-bold">TAU</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#8e8e93]">
            Building the sovereign operating model of the web. Hardware, software, and tools built for open protocol futures.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="min-w-[120px]">
            <p className="text-[13px] font-bold uppercase text-[#d4af37]">{col.title}</p>
            <ul className="mt-4 space-y-4">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[#8e8e93] transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-16 flex max-w-[1280px] flex-wrap items-center justify-between gap-4 text-xs text-[#555]">
        <p>© 2026 Tau Technologies. All rights reserved. Built for sovereign futures.</p>
        <div className="flex items-center gap-4">
          <Link href="https://github.com/TheDotProtocol/tauos" aria-label="GitHub" className="opacity-70 transition hover:opacity-100">
            <Image src={marketingAssets.shared.github} alt="" width={18} height={18} />
          </Link>
          <Link href={websiteRoutes.community} aria-label="Twitter" className="opacity-70 transition hover:opacity-100">
            <Image src={marketingAssets.shared.twitter} alt="" width={18} height={18} />
          </Link>
          <Link href={websiteRoutes.community} aria-label="Community" className="opacity-70 transition hover:opacity-100">
            <Image src={marketingAssets.shared.messageSquare} alt="" width={18} height={18} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
