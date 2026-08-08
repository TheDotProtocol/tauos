'use client';

import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import { TauAiPageHeader } from '@/components/tau-ai-app/shared/TauAiTopBar';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';

const AGENTS = [
  {
    name: 'Research Agent',
    description: 'Deep literature synthesis and structured brief generation.',
    status: 'Idle',
    icon: tauAiAssets.icons.research,
  },
  {
    name: 'Code Agent',
    description: 'Write, debug, and explain code with governed tool execution.',
    status: 'Ready',
    icon: tauAiAssets.icons.terminal,
  },
  {
    name: 'Analysis Agent',
    description: 'Extract patterns and anomalies from documents and datasets.',
    status: 'Idle',
    icon: tauAiAssets.icons.analyse,
  },
  {
    name: 'Writing Agent',
    description: 'Draft technical specs, copy, and executive summaries.',
    status: 'Ready',
    icon: tauAiAssets.icons.pen,
  },
] as const;

export default function TauAiAgentsPage() {
  return (
    <TauAiAppShell active="agents">
      <TauAiPageHeader title="Agents" subtitle="Governed autonomous task runners" />

      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
        {AGENTS.map((agent) => (
          <div
            key={agent.name}
            className="flex flex-col gap-[12px] rounded-[12px] border border-[#222] bg-[#111] p-[20px]"
          >
            <div className="flex items-center gap-[12px]">
              <div className="flex size-[36px] items-center justify-center rounded-[8px] border border-[rgba(212,168,67,0.16)] bg-[#1a1a1a]">
                <TauAiIcon src={agent.icon} size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-white">{agent.name}</p>
                <p className="text-[12px] text-[#999]">{agent.status}</p>
              </div>
              <span className="size-[6px] rounded-[3px] bg-[#4ade80]" />
            </div>
            <p className="text-[13px] leading-[18px] text-[#999]">{agent.description}</p>
            <button
              type="button"
              className="self-start rounded-[20px] border border-[#d4a843] px-[16px] py-[8px] text-[13px] font-semibold text-[#d4a843]"
              title="UI only — GovernedToolExecutor product wiring pending"
            >
              Launch
            </button>
          </div>
        ))}
      </div>

      <p className="mt-[16px] text-[12px] text-[#666]">
        Integration boundary: agent orchestration via GovernedToolExecutor + execution adapters (AI-6/AI-7).
      </p>
    </TauAiAppShell>
  );
}
