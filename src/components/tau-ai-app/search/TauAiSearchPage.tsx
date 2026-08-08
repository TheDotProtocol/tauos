'use client';

import Link from 'next/link';
import { useState } from 'react';
import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { TauAiPageHeader } from '@/components/tau-ai-app/shared/TauAiTopBar';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';
import {
  tauAiRecentSearches,
  tauAiSavedKnowledge,
  tauAiSearchFilters,
  tauAiSearchResults,
} from '@/lib/tau-ai-app/demo-data';

export default function TauAiSearchPage() {
  const [query, setQuery] = useState('Region A growth delta');
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <TauAiAppShell active="home">
      <TauAiPageHeader
        title="Search & Knowledge"
        subtitle="Search conversations, files, and knowledge base"
      />

      <div className="flex min-h-0 flex-1 flex-col gap-[24px] overflow-y-auto">
        <div className="flex w-full items-center gap-[12px] rounded-[12px] border border-[rgba(212,168,67,0.16)] bg-[#111] px-[20px] py-[16px]">
          <TauAiIcon src={tauAiAssets.icons.search} size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-[#999]"
            placeholder="Search Tau knowledge..."
          />
          <span className="rounded-[4px] bg-[#1a1a1a] px-[8px] py-[4px] text-[11px] font-semibold text-[#999]">
            ⌘ K
          </span>
        </div>

        <div className="flex flex-wrap gap-[8px]">
          {tauAiSearchFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-[20px] px-[16px] py-[8px] text-[13px] font-medium ${
                activeFilter === filter
                  ? 'border border-[rgba(212,168,67,0.16)] bg-[rgba(212,168,67,0.08)] text-[#d4a843]'
                  : 'border border-[#222] bg-[#111] text-[#999]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-[24px] lg:grid-cols-[1fr_280px]">
          <section className="flex flex-col gap-[12px]">
            <h2 className="text-[16px] font-bold text-white">
              Results for &ldquo;{query}&rdquo;
            </h2>
            {tauAiSearchResults.map((result) => (
              <div
                key={result.title}
                className="flex flex-col gap-[8px] rounded-[12px] border border-[#222] bg-[#111] p-[20px]"
              >
                <div className="flex items-center justify-between gap-[12px]">
                  <span className="rounded-[4px] bg-[rgba(212,168,67,0.12)] px-[8px] py-[2px] text-[10px] font-bold text-[#d4a843]">
                    {result.type}
                  </span>
                  <span className="text-[11px] font-semibold text-[#d4a843]">{result.match}</span>
                </div>
                <Link href="/tau-ai-app/chat" className="text-[16px] font-semibold text-white hover:text-[#d4a843]">
                  {result.title}
                </Link>
                <p className="text-[13px] leading-[20px] text-[#999]">
                  {result.snippet}
                  {result.highlight ? (
                    <span className="font-semibold text-[#f0d78c]">{result.highlight}</span>
                  ) : null}
                </p>
                <p className="text-[12px] text-[#666]">{result.meta}</p>
              </div>
            ))}
          </section>

          <aside className="flex flex-col gap-[24px]">
            <div className="flex flex-col gap-[12px] rounded-[12px] border border-[#222] bg-[#111] p-[20px]">
              <h3 className="text-[14px] font-bold text-[#d4a843]">Recent Searches</h3>
              {tauAiRecentSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="text-left text-[13px] text-[#999] hover:text-white"
                >
                  {term}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-[12px] rounded-[12px] border border-[#222] bg-[#111] p-[20px]">
              <h3 className="text-[14px] font-bold text-[#d4a843]">Saved Knowledge</h3>
              {tauAiSavedKnowledge.map((entry) => (
                <p key={entry} className="text-[13px] text-[#999]">
                  {entry}
                </p>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </TauAiAppShell>
  );
}
