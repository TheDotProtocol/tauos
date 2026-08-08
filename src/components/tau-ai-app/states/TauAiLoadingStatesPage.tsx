'use client';

import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { TauAiPageHeader } from '@/components/tau-ai-app/shared/TauAiTopBar';
import TauAiLogo from '@/components/tau-ai-app/shared/TauAiLogo';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';

const LOADING_STATES = [
  {
    title: 'Thinking',
    description: 'Tau is processing your request…',
    icon: tauAiAssets.icons.dotsSequence,
  },
  {
    title: 'Loading Substrates',
    description: 'Fetching substrate registry from ai-gateway…',
    icon: tauAiAssets.icons.spinner,
  },
  {
    title: 'Syncing Knowledge',
    description: 'Indexing local knowledge base…',
    icon: tauAiAssets.icons.spinner,
  },
] as const;

export default function TauAiLoadingStatesPage() {
  return (
    <TauAiAppShell active="home">
      <TauAiPageHeader title="Loading States" subtitle="Figma loading state patterns" />

      <div className="grid grid-cols-1 gap-[24px] md:grid-cols-3">
        {LOADING_STATES.map((state) => (
          <div
            key={state.title}
            className="flex flex-col items-center gap-[16px] rounded-[12px] border border-[#222] bg-[#111] p-[32px] text-center"
          >
            <TauAiIcon src={state.icon} size={state.icon === tauAiAssets.icons.dotsSequence ? 24 : 32} />
            <h2 className="text-[16px] font-bold text-white">{state.title}</h2>
            <p className="text-[13px] leading-[20px] text-[#999]">{state.description}</p>
            <div className="flex items-center gap-[8px]">
              <TauAiLogo variant="emblem" width={24} height={24} className="rounded-[12px]" />
              <span className="text-[12px] font-medium text-[#d4a843]">Please wait…</span>
            </div>
          </div>
        ))}
      </div>
    </TauAiAppShell>
  );
}
