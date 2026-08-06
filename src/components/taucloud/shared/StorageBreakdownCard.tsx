'use client';

import { inter } from '@/lib/website/fonts';
import type { TauCloudStorageBreakdown } from '@/lib/taucloud/types';

const categoryColors: Record<string, string> = {
  Images: '#ffb800',
  Video: '#f97316',
  Audio: '#a855f7',
  Documents: '#3b82f6',
  Archives: '#22c55e',
  Other: '#71717a',
};

type StorageBreakdownCardProps = {
  breakdown: TauCloudStorageBreakdown[];
};

export default function StorageBreakdownCard({ breakdown }: StorageBreakdownCardProps) {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#16161b] p-5">
      <h3 className={`${inter.className} text-lg font-semibold text-white`}>Allocation by Type</h3>
      <p className="mt-1 text-sm text-[#71717a]">Breakdown of encrypted vault usage across file categories.</p>
      <div className="mt-5 space-y-4">
        {breakdown.length === 0 ? (
          <p className="text-sm text-[#71717a]">No files stored yet.</p>
        ) : (
          breakdown.map((item) => (
            <div key={item.category}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-white">{item.category}</span>
                <span className="text-[#a1a1aa]">
                  {item.sizeLabel} · {item.fileCount} file{item.fileCount === 1 ? '' : 's'}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#222228]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(item.percent, 2)}%`,
                    backgroundColor: categoryColors[item.category] || categoryColors.Other,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
