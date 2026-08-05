'use client';

import Image from 'next/image';
import Link from 'next/link';
import { inter } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';
import { websiteRoutes } from '@/lib/website/routes';

export default function HardwareFooter() {
  const columns = [
    {
      title: 'Products',
      links: ['Tau Phone', 'Tau Book Pro', 'Tau Tablet', 'Tau Watch', 'Tau Glass'],
    },
    {
      title: 'Sovereignty',
      links: ['Sovereign OS', 'Hardware Kill Switches', 'Titan M3 Chips', 'Privacy Guarantees', 'Open Source Core'],
    },
    {
      title: 'Company',
      links: ['Our Philosophy', 'Security Audit', 'Hardware Lab', 'Contact Support', 'Press Inquiries'],
    },
  ] as const;

  return (
    <footer className={`${inter.className} border-t border-[#262628] px-6 pb-10 pt-20 md:px-20`}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-12">
        <div className="w-full max-w-xs">
          <div className="flex items-center gap-2.5">
            <Image src={marketingAssets.shared.logoIcon} alt="" width={24} height={24} />
            <span className="text-lg font-extrabold">TAU</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#a4a4a6]">
            Sovereign computing, engineered in titanium and matte gold. Complete digital privacy without compromise.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="min-w-[140px]">
            <p className="text-xs font-bold uppercase text-[#d4af37]">{col.title}</p>
            <ul className="mt-3 space-y-3">
              {col.links.map((label) => (
                <li key={label}>
                  <span className="text-sm text-[#a4a4a6]">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-[1280px] flex-wrap items-center justify-between gap-4 text-xs text-[#555557]">
        <p>© 2026 TAU Hardware Inc. Sovereign computing, zero cloud dependency.</p>
        <div className="flex gap-6 font-semibold uppercase">
          <Link href="https://github.com/TheDotProtocol/tauos" className="hover:text-[#a4a4a6]">Github</Link>
          <Link href={websiteRoutes.community} className="hover:text-[#a4a4a6]">Matrix</Link>
          <Link href={websiteRoutes.contact} className="hover:text-[#a4a4a6]">Signal</Link>
        </div>
      </div>
    </footer>
  );
}
