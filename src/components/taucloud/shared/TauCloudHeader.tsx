'use client';

import Link from 'next/link';
import { inter } from '@/lib/website/fonts';
import { tauCloudAssets } from '@/lib/taucloud/assets';
import CloudIcon from '@/components/taucloud/shared/CloudIcon';

type TauCloudHeaderProps = {
  title: string;
  subtitle: string;
};

export default function TauCloudHeader({ title, subtitle }: TauCloudHeaderProps) {
  return (
    <header className={`${inter.className} flex items-center justify-between border-b border-[#222228] px-8 py-[18px]`}>
      <div>
        <h1 className="text-[22px] font-bold text-white">{title}</h1>
        <p className="mt-1 text-sm text-[#71717a]">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-[#222228] bg-[rgba(22,22,27,0.8)] px-3 py-1.5">
          <CloudIcon src={tauCloudAssets.icons.syncIndicator} size={8} />
          <span className="text-xs font-semibold tracking-wide text-[#a1a1aa]">CLOUD SYNCED</span>
        </div>
        <button type="button" className="flex size-[38px] items-center justify-center rounded-lg border border-[#222228] bg-[#16161b]">
          <CloudIcon src={tauCloudAssets.icons.bell} size={18} />
        </button>
        <Link
          href="/taucloud/search"
          className="flex h-8 w-[220px] items-center gap-2 rounded-lg border border-[#222228] bg-[#16161b] px-3.5 text-sm text-[#71717a]"
        >
          <CloudIcon src={tauCloudAssets.icons.search} size={14} />
          <span>AI Search (⌘K)...</span>
        </Link>
      </div>
    </header>
  );
}
