'use client';

import { useEffect, useState } from 'react';
import TauCloudAppShell from '@/components/taucloud/shared/TauCloudAppShell';
import StorageGaugeCard from '@/components/taucloud/shared/StorageGaugeCard';
import StorageBreakdownCard from '@/components/taucloud/shared/StorageBreakdownCard';
import { fetchTauCloudStorageStats } from '@/lib/taucloud/api-client';
import type { TauCloudStorageBreakdown } from '@/lib/taucloud/types';
import { mapApiStorage } from '@/lib/taucloud/types';

export default function TauCloudStoragePage() {
  const [storage, setStorage] = useState(mapApiStorage({ used: 0, limit: 0 }));
  const [breakdown, setBreakdown] = useState<TauCloudStorageBreakdown[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTauCloudStorageStats()
      .then((stats) => {
        setStorage(stats.storage);
        setBreakdown(stats.breakdown);
      })
      .catch(() => setError('Could not load storage stats'));
  }, []);

  const totalFiles = breakdown.reduce((sum, item) => sum + item.fileCount, 0);

  return (
    <TauCloudAppShell active="storage" title="Storage Usage" subtitle="Monitor allocation across your quantum vault.">
      <div className="space-y-6 p-8">
        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#222228] bg-[#16161b] p-5">
            <p className="text-xs uppercase tracking-wide text-[#71717a]">Used</p>
            <p className="mt-2 text-2xl font-bold text-white">{storage.usedLabel}</p>
          </div>
          <div className="rounded-xl border border-[#222228] bg-[#16161b] p-5">
            <p className="text-xs uppercase tracking-wide text-[#71717a]">Plan Limit</p>
            <p className="mt-2 text-2xl font-bold text-white">{storage.limitLabel}</p>
          </div>
          <div className="rounded-xl border border-[#222228] bg-[#16161b] p-5">
            <p className="text-xs uppercase tracking-wide text-[#71717a]">Vault Files</p>
            <p className="mt-2 text-2xl font-bold text-white">{totalFiles}</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <StorageGaugeCard storage={storage} />
          <StorageBreakdownCard breakdown={breakdown} />
        </div>
      </div>
    </TauCloudAppShell>
  );
}
