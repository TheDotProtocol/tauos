'use client';

import { useState } from 'react';
import TauCloudAppShell from '@/components/taucloud/shared/TauCloudAppShell';
import { FileSection } from '@/components/taucloud/shared/FileCard';
import { searchTauCloudFiles } from '@/lib/taucloud/api-client';
import type { TauCloudFile } from '@/lib/taucloud/types';
import { tauCloudAssets } from '@/lib/taucloud/assets';
import CloudIcon from '@/components/taucloud/shared/CloudIcon';

export default function TauCloudSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TauCloudFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const rows = await searchTauCloudFiles(query.trim());
      setResults(rows);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TauCloudAppShell active="search">
      <div className="space-y-8 p-8">
        <div className="rounded-xl border border-[#222228] bg-[#16161b] p-4">
          <div className="flex items-center gap-3">
            <CloudIcon src={tauCloudAssets.icons.search} size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSearch()}
              placeholder="Search your vault with AI-assisted semantic lookup..."
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#71717a]"
            />
            <button
              type="button"
              onClick={runSearch}
              disabled={loading}
              className="rounded-lg bg-[#ffb800] px-4 py-2 text-sm font-semibold text-[#0d0d0f] disabled:opacity-60"
            >
              {loading ? 'Searching…' : 'Search Vault'}
            </button>
          </div>
        </div>

        {searched ? (
          results.length ? (
            <FileSection title={`Results for “${query}”`} actionLabel={`${results.length} matches`} files={results} />
          ) : (
            <p className="text-sm text-[#71717a]">No files matched your search.</p>
          )
        ) : (
          <p className="text-sm text-[#71717a]">Try searching by filename or file type.</p>
        )}
      </div>
    </TauCloudAppShell>
  );
}
