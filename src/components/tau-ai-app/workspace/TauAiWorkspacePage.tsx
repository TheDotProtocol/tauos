'use client';

import Link from 'next/link';
import { useState } from 'react';
import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { TauAiEngineStatus } from '@/components/tau-ai-app/shared/TauAiTopBar';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';
import { tauAiWorkspaceCards, tauAiWorkspaceFilters } from '@/lib/tau-ai-app/demo-data';

export default function TauAiWorkspacePage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered =
    activeFilter === 'All'
      ? tauAiWorkspaceCards
      : tauAiWorkspaceCards.filter((c) => c.category === activeFilter);

  return (
    <TauAiAppShell active="workspace">
      <div className="flex w-full shrink-0 items-center justify-between">
        <h1 className="text-[28px] font-bold text-white">AI Workspace</h1>
        <div className="flex items-center gap-[16px]">
          <div className="flex w-[320px] items-center gap-[12px] rounded-[8px] border border-[#222] bg-[#111] px-[16px] py-[12px]">
            <TauAiIcon src={tauAiAssets.icons.search} size={16} />
            <Link href="/tau-ai-app/search" className="flex-1 text-[14px] text-[#999]">
              Search Tau...
            </Link>
            <span className="rounded-[4px] bg-[#1a1a1a] px-[6px] py-[2px] text-[11px] font-semibold text-[#999]">
              ⌘ K
            </span>
          </div>
          <button type="button" className="flex size-[40px] items-center justify-center rounded-[20px] border border-[#222] bg-[#111]">
            <TauAiIcon src={tauAiAssets.icons.bell} size={18} />
          </button>
          <TauAiEngineStatus />
          <div className="flex gap-[8px] text-[13px]">
            <span className="font-semibold text-[#d4a843]">Grid</span>
            <span className="text-[#666]">List</span>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-[24px] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-white">Your Workspaces</h2>
          <Link
            href="/tau-ai-app/chat/new"
            className="flex items-center gap-[8px] rounded-[30px] bg-gradient-to-r from-[#f0d78c] via-[#d4a843] to-[#b8922e] px-[24px] py-[12px] text-[14px] font-bold text-black"
          >
            <TauAiIcon src={tauAiAssets.icons.plus} size={14} />
            New Workspace
          </Link>
        </div>

        <div className="flex flex-wrap gap-[8px]">
          {tauAiWorkspaceFilters.map((filter) => (
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

        <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((card) => (
            <Link
              key={card.title}
              href="/tau-ai-app/chat"
              className="flex flex-col gap-[12px] rounded-[12px] border border-[#222] bg-[#111] p-[20px]"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-[4px] bg-[rgba(212,168,67,0.08)] px-[8px] py-[4px] text-[11px] font-semibold uppercase text-[#d4a843]">
                  {card.category}
                </span>
                <span className="text-[12px] text-[#666]">{card.time}</span>
              </div>
              <p className="text-[16px] font-semibold text-white">{card.title}</p>
              <p className="text-[13px] leading-[18px] text-[#999]">{card.description}</p>
              <div>
                <div className="mb-[6px] flex justify-between text-[11px] text-[#666]">
                  <span>Sync Progress</span>
                  <span>{card.progress}%</span>
                </div>
                <div className="h-[4px] overflow-hidden rounded-[2px] bg-[#1a1a1a]">
                  <div className="h-full bg-[#d4a843]" style={{ width: `${card.progress}%` }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </TauAiAppShell>
  );
}
