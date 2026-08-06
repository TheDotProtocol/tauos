'use client';

import { inter } from '@/lib/website/fonts';
import type { TauCloudStorage } from '@/lib/taucloud/types';

type StorageGaugeCardProps = {
  storage: TauCloudStorage;
};

export default function StorageGaugeCard({ storage }: StorageGaugeCardProps) {
  const pct = Math.min(100, Math.round(storage.usedPercent));
  const circumference = 2 * Math.PI * 62;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="rounded-xl border border-[#222228] bg-[#16161b] p-5">
      <h3 className={`${inter.className} text-lg font-semibold text-white`}>System Storage</h3>
      <div className="mt-4 flex justify-center">
        <div className="relative size-[140px]">
          <svg viewBox="0 0 140 140" className="size-full -rotate-90">
            <circle cx="70" cy="70" r="62" fill="none" stroke="#222228" strokeWidth="12" />
            <circle
              cx="70"
              cy="70"
              r="62"
              fill="none"
              stroke="#ffb800"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[29px] font-bold text-white">{pct}%</span>
            <span className="text-[11px] tracking-wide text-[#71717a]">ALLOCATED</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between text-sm">
        <div>
          <p className="text-[#71717a]">Used Space</p>
          <p className="font-semibold text-white">{storage.usedLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-[#71717a]">Total Plan</p>
          <p className="font-semibold text-white">{storage.limitLabel}</p>
        </div>
      </div>
    </div>
  );
}
