'use client';

import Link from 'next/link';
import { useState } from 'react';
import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { TauAiEngineStatus } from '@/components/tau-ai-app/shared/TauAiTopBar';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';
import { tauAiConversationHistory, tauAiHistoryFilters } from '@/lib/tau-ai-app/demo-data';

export default function TauAiConversationHistoryPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <TauAiAppShell active="chat" fullHeight>
      <div className="flex min-h-0 flex-1 flex-col gap-[24px] px-[40px] py-[32px]">
        <div className="flex w-full shrink-0 items-center justify-between">
          <div className="flex flex-col gap-[4px]">
            <h1 className="text-[28px] font-bold text-white">Conversation History</h1>
            <p className="text-[14px] text-[#999]">Browse and resume past conversations</p>
          </div>
          <div className="flex items-center gap-[16px]">
            <Link
              href="/tau-ai-app/chat/new"
              className="flex items-center gap-[8px] rounded-[30px] bg-gradient-to-r from-[#f0d78c] via-[#d4a843] to-[#b8922e] px-[20px] py-[10px] text-[13px] font-bold text-black"
            >
              <TauAiIcon src={tauAiAssets.icons.plus} size={14} />
              New Chat
            </Link>
            <TauAiEngineStatus />
          </div>
        </div>

        <div className="flex w-full items-center gap-[12px] rounded-[8px] border border-[#222] bg-[#111] px-[16px] py-[12px]">
          <TauAiIcon src={tauAiAssets.icons.search} size={16} />
          <input
            type="search"
            placeholder="Search conversations..."
            className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-[#999]"
          />
        </div>

        <div className="flex flex-wrap gap-[8px]">
          {tauAiHistoryFilters.map((filter) => (
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

        <div className="flex min-h-0 flex-1 flex-col gap-[32px] overflow-y-auto">
          {tauAiConversationHistory.map((section) => (
            <section key={section.section} className="flex flex-col gap-[12px]">
              <h2 className="text-[14px] font-bold uppercase tracking-wide text-[#666]">{section.section}</h2>
              <div className="flex flex-col gap-[8px]">
                {section.items.map((item) => (
                  <Link
                    key={item.title}
                    href="/tau-ai-app/chat"
                    className="flex items-start gap-[16px] rounded-[12px] border border-[#222] bg-[#111] p-[16px] hover:border-[rgba(212,168,67,0.16)]"
                  >
                    <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[20px] bg-[rgba(212,168,67,0.08)]">
                      <TauAiIcon src={tauAiAssets.icons.messageCircle} size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-[12px]">
                        <p className="text-[15px] font-semibold text-white">{item.title}</p>
                        <span className="shrink-0 text-[12px] text-[#666]">{item.time}</span>
                      </div>
                      <p className="mt-[4px] truncate text-[13px] text-[#999]">{item.snippet}</p>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <span className="rounded-[4px] bg-[#1a1a1a] px-[6px] py-[2px] text-[10px] font-bold text-[#999]">
                          {item.substrate}
                        </span>
                        <TauAiIcon src={tauAiAssets.icons.clock} size={12} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </TauAiAppShell>
  );
}
