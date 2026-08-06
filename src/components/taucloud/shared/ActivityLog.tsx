'use client';

import { useEffect, useMemo, useState } from 'react';
import { inter } from '@/lib/website/fonts';
import { fetchTauCloudActivity } from '@/lib/taucloud/api-client';
import type { TauCloudActivityItem } from '@/lib/taucloud/types';

const toneColor = {
  green: 'bg-[#22c55e]',
  gold: 'bg-[#ffb800]',
} as const;

const filters = [
  { id: 'all', label: 'All Events' },
  { id: 'upload', label: 'Uploads' },
  { id: 'share', label: 'Shares' },
  { id: 'delete', label: 'Trash' },
  { id: 'security', label: 'Security' },
] as const;

type ActivityLogProps = {
  limit?: number;
  compact?: boolean;
};

function matchesFilter(item: TauCloudActivityItem, filter: string) {
  if (filter === 'all') return true;
  if (filter === 'upload') return item.action === 'upload';
  if (filter === 'share') return item.action === 'share' || item.action === 'revoke_share';
  if (filter === 'delete') return ['delete', 'restore', 'permanent_delete'].includes(item.action);
  if (filter === 'security') return ['2fa_enable', '2fa_disable'].includes(item.action);
  return true;
}

export default function ActivityLog({ limit = 100, compact = false }: ActivityLogProps) {
  const [items, setItems] = useState<TauCloudActivityItem[]>([]);
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTauCloudActivity(limit)
      .then(setItems)
      .catch(() => setError('Could not load activity'));
  }, [limit]);

  const visible = useMemo(() => items.filter((item) => matchesFilter(item, filter)), [items, filter]);

  return (
    <div className="rounded-xl border border-[#222228] bg-[#16161b]">
      <div className="border-b border-[#222228] px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className={`${inter.className} text-lg font-semibold text-white`}>Real-Time Sync Terminal</h3>
            {!compact ? <p className="mt-1 text-sm text-[#71717a]">Authorization and sync events across your vault.</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setFilter(entry.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  filter === entry.id
                    ? 'bg-[rgba(255,184,0,0.12)] text-[#ffb800]'
                    : 'border border-[#222228] text-[#a1a1aa] hover:text-white'
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-h-[640px] overflow-y-auto p-5">
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {!error && visible.length === 0 ? (
          <p className="text-sm text-[#71717a]">No events in this filter yet.</p>
        ) : (
          <div className="space-y-3">
            {visible.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-lg border border-[#222228] bg-[#121214] px-4 py-3">
                <span className={`mt-1.5 size-2 shrink-0 rounded-full ${toneColor[item.tone]}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs text-[#71717a]">{item.meta}</p>
                </div>
                <span className="shrink-0 text-xs text-[#71717a]">{item.timeLabel}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
