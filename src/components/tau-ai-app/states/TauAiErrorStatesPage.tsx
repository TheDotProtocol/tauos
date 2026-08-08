'use client';

import Link from 'next/link';
import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { TauAiPageHeader } from '@/components/tau-ai-app/shared/TauAiTopBar';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';

const ERROR_STATES = [
  {
    title: 'Connection Failed',
    description: 'Unable to reach Tau Foundation. Check substrate configuration.',
    icon: tauAiAssets.icons.triangleAlert,
    action: { label: 'Retry', href: '/tau-ai-app/chat' },
  },
  {
    title: 'Substrate Unavailable',
    description: 'The selected substrate is not configured or offline.',
    icon: tauAiAssets.icons.alertCircle,
    action: { label: 'Local AI Settings', href: '/tau-ai-app/local-ai' },
  },
  {
    title: 'File Upload Failed',
    description: 'The file could not be processed. Supported formats: PDF, TXT, MD.',
    icon: tauAiAssets.icons.fileX,
    action: { label: 'Try Again', href: '/tau-ai-app/files' },
  },
] as const;

export default function TauAiErrorStatesPage() {
  return (
    <TauAiAppShell active="home">
      <TauAiPageHeader title="Error States" subtitle="Figma error state patterns" />

      <div className="grid grid-cols-1 gap-[24px] md:grid-cols-3">
        {ERROR_STATES.map((state) => (
          <div
            key={state.title}
            className="flex flex-col items-center gap-[16px] rounded-[12px] border border-[rgba(248,113,113,0.16)] bg-[rgba(248,113,113,0.04)] p-[32px] text-center"
          >
            <TauAiIcon src={state.icon} size={40} />
            <h2 className="text-[16px] font-bold text-white">{state.title}</h2>
            <p className="text-[13px] leading-[20px] text-[#999]">{state.description}</p>
            <Link
              href={state.action.href}
              className="rounded-[20px] border border-[#991b1b] px-[20px] py-[10px] text-[13px] font-semibold text-[#f87171]"
            >
              {state.action.label}
            </Link>
          </div>
        ))}
      </div>
    </TauAiAppShell>
  );
}
