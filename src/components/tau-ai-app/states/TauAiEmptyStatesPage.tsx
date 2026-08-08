'use client';

import Link from 'next/link';
import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { TauAiPageHeader } from '@/components/tau-ai-app/shared/TauAiTopBar';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';

const EMPTY_STATES = [
  {
    title: 'No Conversations Yet',
    description: 'Start a new chat to begin your first conversation with Tau AI.',
    icon: tauAiAssets.icons.emptyConv,
    cta: { label: 'Start Chat', href: '/tau-ai-app/chat/new' },
  },
  {
    title: 'No Files Uploaded',
    description: 'Upload documents to analyze them with Tau AI locally.',
    icon: tauAiAssets.icons.emptyFiles,
    cta: { label: 'Browse Files', href: '/tau-ai-app/files' },
  },
  {
    title: 'No Workspaces',
    description: 'Create a workspace to organize your AI projects.',
    icon: tauAiAssets.icons.emptyWorkspace,
    cta: { label: 'Create Workspace', href: '/tau-ai-app/workspace' },
  },
] as const;

export default function TauAiEmptyStatesPage() {
  return (
    <TauAiAppShell active="home">
      <TauAiPageHeader title="Empty States" subtitle="Figma empty state patterns" />

      <div className="grid grid-cols-1 gap-[24px] md:grid-cols-3">
        {EMPTY_STATES.map((state) => (
          <div
            key={state.title}
            className="flex flex-col items-center gap-[16px] rounded-[12px] border border-[#222] bg-[#111] p-[32px] text-center"
          >
            <TauAiIcon src={state.icon} size={48} />
            <h2 className="text-[16px] font-bold text-white">{state.title}</h2>
            <p className="text-[13px] leading-[20px] text-[#999]">{state.description}</p>
            <Link
              href={state.cta.href}
              className="rounded-[20px] bg-gradient-to-r from-[#f0d78c] via-[#d4a843] to-[#b8922e] px-[20px] py-[10px] text-[13px] font-bold text-black"
            >
              {state.cta.label}
            </Link>
          </div>
        ))}
      </div>
    </TauAiAppShell>
  );
}
