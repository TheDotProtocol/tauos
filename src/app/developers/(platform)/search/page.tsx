'use client';

import { useState, useEffect } from 'react';
import PlatformShell from '@/components/tau-ide/PlatformShell';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/tau-ide/sync-client';

type SearchResult = { type: string; label: string; snippet: string; href?: string };

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await apiFetch<{ results: SearchResult[] }>(`/api/tau-ide/search?q=${encodeURIComponent(query)}`);
      setResults(data.results);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => { if (query.length >= 2) search(); }, 400);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <PlatformShell title="Search">
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files, projects, conversations, architecture…"
            className="w-full pl-12 pr-4 py-3 glass rounded-xl border border-white/10 text-white focus:border-cyan-500 focus:outline-none"
            autoFocus
          />
        </div>

        {loading && <p className="text-sm text-gray-500">Searching…</p>}

        <div className="space-y-2">
          {results.map((r, i) => (
            <Link key={i} href={r.href ?? '#'} className="block card hover:border-cyan-500/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-wide text-cyan-400">{r.type}</span>
                <span className="font-medium text-white">{r.label}</span>
              </div>
              <p className="text-sm text-gray-500 truncate">{r.snippet}</p>
            </Link>
          ))}
          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">No results. Sign in to search server-side projects.</p>
          )}
        </div>
      </div>
    </PlatformShell>
  );
}
