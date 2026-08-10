'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TauMailAppShell from '@/components/taumail/shared/TauMailAppShell';
import { searchTauMailEmails } from '@/lib/taumail/api-client';
import type { TauMailEmail } from '@/lib/taumail/types';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<TauMailEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    searchTauMailEmails(q, 'all')
      .then(setResults)
      .catch(() => setError('Search failed'))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <TauMailAppShell active="inbox">
      <div className="flex h-full min-h-0 flex-col p-6">
        <h1 className="text-xl font-semibold text-white">Search results</h1>
        <p className="mt-1 text-sm text-[#a1a1aa]">
          {q ? `Showing matches for “${q}”` : 'Enter a query from the top bar'}
        </p>

        {loading ? <p className="mt-8 text-sm text-[#71717a]">Searching…</p> : null}
        {error ? <p className="mt-8 text-sm text-red-300">{error}</p> : null}

        {!loading && !error && results.length === 0 && q ? (
          <p className="mt-8 text-sm text-[#71717a]">No messages matched your search.</p>
        ) : null}

        <ul className="mt-6 space-y-3 overflow-y-auto">
          {results.map((email) => (
            <li key={String(email.id)}>
              <Link
                href={`/taumail/inbox?selected=${email.id}`}
                className="block rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214] p-4 hover:border-[rgba(212,168,67,0.25)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-white">{email.sender}</span>
                  <span className="text-xs text-[#71717a]">{email.time}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-[#d4d4d8]">{email.subject}</p>
                <p className="mt-1 line-clamp-2 text-xs text-[#a1a1aa]">{email.preview}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </TauMailAppShell>
  );
}

export default function TauMailSearchPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#070708] text-[#71717a]">Loading…</div>}>
      <SearchResults />
    </Suspense>
  );
}
