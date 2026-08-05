'use client';

import Image from 'next/image';
import Link from 'next/link';
import { inter } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';
import { websiteRoutes } from '@/lib/website/routes';

export default function CompanyFooter() {
  const columns = [
    {
      title: 'Platform',
      links: [
        { label: 'Technology', href: websiteRoutes.tauCore },
        { label: 'Open Source', href: websiteRoutes.projectGrayscale },
        { label: 'Whitepaper', href: websiteRoutes.docs },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: websiteRoutes.docs },
        { label: 'Careers', href: websiteRoutes.careers },
        { label: 'Press & Media', href: websiteRoutes.press },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'Twitter', href: websiteRoutes.community },
        { label: 'GitHub', href: 'https://github.com/TheDotProtocol/tauos' },
        { label: 'Discord', href: websiteRoutes.community },
      ],
    },
  ] as const;

  return (
    <footer className={`${inter.className} border-t border-[#2a2820] px-6 pb-10 pt-20 md:px-20`}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5">
            <Image src={marketingAssets.shared.logoIcon} alt="" width={28} height={28} className="rounded" />
            <span className="text-base font-bold">TAU</span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-[#a0a0a0]">
            Architecting the next generation of decentralized, secure, and resilient computing systems.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="min-w-[120px]">
            <p className="text-sm font-semibold text-white">{col.title}</p>
            <ul className="mt-4 space-y-4">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[#a0a0a0] transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-16 flex max-w-[1280px] flex-wrap items-center justify-between gap-4 text-[13px] text-[#666]">
        <p>© 2026 Tau Association. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href={websiteRoutes.privacy} className="hover:text-[#a0a0a0]">Privacy Policy</Link>
          <Link href={websiteRoutes.terms} className="hover:text-[#a0a0a0]">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
