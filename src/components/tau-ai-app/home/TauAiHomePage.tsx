'use client';

import Link from 'next/link';
import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';
import {
  tauAiContinueConversations,
  tauAiEcosystemNodes,
  tauAiPinnedKnowledge,
  tauAiQuickActions,
} from '@/lib/tau-ai-app/demo-data';
import { useTauAiSession } from '@/lib/tau-ai-app/session-context';

const quickActionIcons: Record<string, string> = {
  research: tauAiAssets.icons.research,
  analyse: tauAiAssets.icons.analyse,
  write: tauAiAssets.icons.write,
  brainstorm: tauAiAssets.icons.brainstorm,
  terminal: tauAiAssets.icons.terminal,
  globe: tauAiAssets.icons.globe,
};

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function TauAiHomePage() {
  const { profile } = useTauAiSession();
  const firstName = profile?.displayName.split(' ')[0] ?? 'there';

  return (
    <TauAiAppShell active="home">
      <div className="flex w-full shrink-0 items-center justify-between">
        <Link
          href="/tau-ai-app/search"
          className="flex w-[480px] shrink-0 items-center gap-[12px] rounded-[8px] border border-[#222] bg-[#111] px-[16px] py-[12px]"
        >
          <TauAiIcon src={tauAiAssets.icons.search} size={16} />
          <span className="min-w-0 flex-1 text-[14px] text-[#999]">Ask Tau anything...</span>
          <span className="rounded-[4px] bg-[#1a1a1a] px-[6px] py-[2px] text-[11px] font-semibold text-[#999]">
            ⌘ K
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-[16px]">
          <button
            type="button"
            className="flex size-[40px] items-center justify-center rounded-[20px] border border-[#222] bg-[#111]"
            aria-label="Notifications"
          >
            <TauAiIcon src={tauAiAssets.icons.bell} size={18} />
          </button>
          <div className="flex items-center gap-[8px] rounded-[20px] border border-[rgba(212,168,67,0.16)] bg-[#111] px-[12px] py-[6px]">
            <span className="size-[6px] shrink-0 rounded-[3px] bg-[#d4a843]" />
            <span className="whitespace-nowrap text-[12px] font-semibold text-[#d4a843]">TAU ENGINE: LOCAL</span>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-[32px]">
        <div className="flex shrink-0 flex-col gap-[6px]">
          <h1 className="text-[32px] font-bold text-white">
            {greeting()}, {firstName}
          </h1>
          <p className="text-[14px] text-[#999]">
            All systems operational. Your personal neural environment is perfectly synced.
          </p>
        </div>

        <div className="flex w-full shrink-0 gap-[24px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[32px]">
            <section className="flex w-full flex-col gap-[12px]">
              <h2 className="text-[12px] font-bold uppercase text-[#d4a843]">Continue Conversations</h2>
              <div className="flex w-full flex-col gap-[12px]">
                {tauAiContinueConversations.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex w-full items-center justify-between rounded-[8px] bg-[#111] p-[16px]"
                  >
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[15px] font-semibold text-white">{item.title}</p>
                      <p className="text-[12px] text-[#999]">{item.category}</p>
                    </div>
                    <p className="text-[12px] text-[#666]">{item.time}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="flex w-full flex-col gap-[12px]">
              <h2 className="text-[12px] font-bold uppercase text-[#d4a843]">Pinned Knowledge</h2>
              <div className="flex w-full flex-col gap-[12px]">
                {tauAiPinnedKnowledge.map((item) => (
                  <div
                    key={item.title}
                    className="flex w-full items-center gap-[12px] rounded-[8px] border border-[#222] bg-[#111] p-[14px]"
                  >
                    <TauAiIcon src={tauAiAssets.icons.file} size={18} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium text-white">{item.title}</p>
                      <p className="text-[11px] text-[#666]">{item.meta}</p>
                    </div>
                    <TauAiIcon src={tauAiAssets.icons.pin} size={14} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="flex w-[480px] shrink-0 flex-col gap-[12px]">
            <h2 className="text-[12px] font-bold uppercase text-[#d4a843]">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-[16px]">
              {tauAiQuickActions.map((action) => (
                <Link
                  key={action.id}
                  href="/tau-ai-app/chat"
                  className="flex h-[100px] flex-col gap-[12px] rounded-[12px] border border-[#222] bg-[#111] p-[20px]"
                >
                  <div className="flex size-[36px] items-center justify-center rounded-[8px] border border-[rgba(212,168,67,0.16)] bg-[#1a1a1a]">
                    <TauAiIcon src={quickActionIcons[action.icon]} size={16} />
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <p className="text-[15px] font-semibold text-white">{action.label}</p>
                    <p className="text-[12px] text-[#999]">{action.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <section className="flex w-full shrink-0 flex-col gap-[12px]">
          <h2 className="text-[12px] font-bold uppercase text-[#d4a843]">Connected Ecosystem Nodes</h2>
          <div className="flex flex-wrap gap-[12px]">
            {tauAiEcosystemNodes.map((node) => (
              <div
                key={node}
                className="flex items-center gap-[8px] rounded-[20px] border border-[#222] bg-[#111] px-[16px] py-[8px]"
              >
                <TauAiIcon src={tauAiAssets.icons.statusOnline} size={8} />
                <span className="text-[13px] font-medium text-white">{node}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </TauAiAppShell>
  );
}
