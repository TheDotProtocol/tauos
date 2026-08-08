'use client';

import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import { TauAiPageHeader } from '@/components/tau-ai-app/shared/TauAiTopBar';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';
import { tauAiPinnedKnowledge } from '@/lib/tau-ai-app/demo-data';

const FILE_ROWS = [
  ...tauAiPinnedKnowledge,
  { title: 'Q3 Financial Stream Export', meta: '892 KB • CSV' },
  { title: 'Neural Node Benchmark Results', meta: '256 KB • JSON' },
  { title: 'Constitution Alignment Draft v0.1', meta: '64 KB • MARKDOWN' },
] as const;

export default function TauAiFilesPage() {
  return (
    <TauAiAppShell active="files">
      <TauAiPageHeader title="Files" subtitle="Knowledge and document store" />

      <div className="flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto">
        <div className="flex w-[480px] max-w-full items-center gap-[12px] rounded-[8px] border border-[#222] bg-[#111] px-[16px] py-[12px]">
          <TauAiIcon src={tauAiAssets.icons.search} size={16} />
          <span className="text-[14px] text-[#999]">Search files...</span>
        </div>

        <div className="flex flex-col gap-[12px]">
          {FILE_ROWS.map((file) => (
            <div
              key={file.title}
              className="flex items-center gap-[12px] rounded-[8px] border border-[#222] bg-[#111] p-[14px]"
            >
              <TauAiIcon src={tauAiAssets.icons.file} size={18} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium text-white">{file.title}</p>
                <p className="text-[11px] text-[#666]">{file.meta}</p>
              </div>
              <TauAiIcon src={tauAiAssets.icons.pin} size={14} />
            </div>
          ))}
        </div>

        <p className="text-[12px] text-[#666]">
          Integration boundary: file ingestion and Tau Memory Foundation retrieval not yet wired.
        </p>
      </div>
    </TauAiAppShell>
  );
}
