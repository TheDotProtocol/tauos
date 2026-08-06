'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { inter, outfit } from '@/lib/website/fonts';
import { tauIdAssets } from '@/lib/tauid/assets';

type TauIDAuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  backHref?: string;
  backLabel?: string;
};

export default function TauIDAuthLayout({
  title,
  subtitle,
  children,
  footer,
  backHref = '/tauid',
  backLabel = '← Back',
}: TauIDAuthLayoutProps) {
  return (
    <div className={`${inter.className} min-h-screen bg-[#0d0d0f] text-white`}>
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 py-6 md:max-w-[480px] md:py-10">
        {backHref ? (
          <Link href={backHref} className="mb-6 text-sm text-[#71717a] transition-colors hover:text-[#ffb800]">
            {backLabel}
          </Link>
        ) : null}

        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-8 flex flex-col items-center text-center">
            <Image
              src={tauIdAssets.brand.logo}
              alt="Tau ID"
              width={140}
              height={56}
              className="h-14 w-auto object-contain"
              priority
            />
            <h1 className={`${outfit.className} mt-6 text-2xl font-semibold text-white`}>{title}</h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#71717a]">{subtitle}</p>
          </div>

          <div className="rounded-[20px] border border-[#222228] bg-[#16161b] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.5)] md:p-8">
            {children}
          </div>

          {footer ? <div className="mt-6">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
