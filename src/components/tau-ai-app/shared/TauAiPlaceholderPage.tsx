'use client';

import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import type { TauAiNavId } from '@/lib/tau-ai-app/assets';

type TauAiPlaceholderPageProps = {
  active: TauAiNavId;
  title: string;
  description: string;
  boundary?: string;
};

export default function TauAiPlaceholderPage({
  active,
  title,
  description,
  boundary,
}: TauAiPlaceholderPageProps) {
  return (
    <TauAiAppShell active={active}>
      <div className="flex min-h-0 flex-1 flex-col gap-[12px]">
        <h1 className="text-[32px] font-bold text-white">{title}</h1>
        <p className="max-w-[640px] text-[14px] leading-[22px] text-[#999]">{description}</p>
        {boundary ? (
          <div className="mt-[8px] max-w-[640px] rounded-[8px] border border-[rgba(212,168,67,0.16)] bg-[#111] p-[16px] text-[13px] text-[#d4a843]">
            Integration boundary: {boundary}
          </div>
        ) : null}
      </div>
    </TauAiAppShell>
  );
}
