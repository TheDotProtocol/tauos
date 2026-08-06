'use client';

import { inter, outfit } from '@/lib/website/fonts';

type TauIDHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function TauIDHeader({ title, subtitle }: TauIDHeaderProps) {
  return (
    <header className={`${inter.className} shrink-0 border-b border-[#222228] bg-[#0d0d0f] px-4 py-5 lg:px-8`}>
      <h1 className={`${outfit.className} text-[22px] font-bold text-white`}>{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-[#71717a]">{subtitle}</p> : null}
    </header>
  );
}
