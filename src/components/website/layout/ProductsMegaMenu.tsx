'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { productsMegaMenuColumns } from '@/lib/website/mega-menu';
import { geistMono, inter } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';

type ProductsMegaMenuProps = {
  onNavigate?: () => void;
};

export default function ProductsMegaMenu({ onNavigate }: ProductsMegaMenuProps) {
  return (
    <div className={`${inter.className} bg-[#141414]`}>
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-12 pb-10 pt-12 md:grid-cols-2 xl:grid-cols-4">
        {productsMegaMenuColumns.map((col) => (
          <div key={col.title}>
            <p className="mb-5 text-[11px] font-bold uppercase tracking-wide text-[#d4af37]">{col.title}</p>
            <ul className="flex flex-col gap-4">
              {col.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className="group flex gap-3 rounded-lg transition hover:opacity-90"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#1f1f1f]">
                      <Image src={item.icon} alt="" width={20} height={20} className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-white group-hover:text-[#d4af37]">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-[#808080]">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start justify-between gap-4 border-t border-[rgba(255,255,255,0.07)] bg-[#1a1a1a] px-12 py-5 sm:flex-row sm:items-center">
        <Link
          href={websiteRoutes.experience}
          onClick={onNavigate}
          className="flex items-center gap-3 text-sm font-semibold text-[#d4af37] hover:text-[#e5c348]"
        >
          Discover the entire Tau Ecosystem
          <ArrowRight className="size-4" />
        </Link>
        <p className={`${geistMono.className} text-xs text-[#808080]`}>
          All dApps utilize verified ZK-proofs.
        </p>
      </div>
    </div>
  );
}
