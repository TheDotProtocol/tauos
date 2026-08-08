'use client';

import Link from 'next/link';
import { useState } from 'react';
import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import TauAiModelSelectionModal from '@/components/tau-ai-app/shared/TauAiModelSelectionModal';
import { TauAiEngineStatus } from '@/components/tau-ai-app/shared/TauAiTopBar';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';
import { tauAiSubstrateOptions } from '@/lib/tau-ai-app/demo-data';

const optionIcons: Record<string, string> = {
  zap: tauAiAssets.icons.zap,
  brainCircuit: tauAiAssets.icons.brainCircuit,
  microscope: tauAiAssets.icons.microscope,
};

export default function TauAiModelSelectionPage() {
  const [selectedId, setSelectedId] = useState('auto');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <TauAiAppShell active="chat" fullHeight>
      <div className="flex min-h-0 flex-1 flex-col gap-[24px] px-[40px] py-[32px]">
        <div className="flex w-full shrink-0 items-center justify-between">
          <div className="flex flex-col gap-[4px]">
            <h1 className="text-[28px] font-bold text-white">Model Selection</h1>
            <p className="text-[14px] text-[#999]">Choose substrate routing for this conversation</p>
          </div>
          <div className="flex items-center gap-[12px]">
            <Link href="/tau-ai-app/chat" className="text-[13px] font-medium text-[#999] hover:text-white">
              Back to chat
            </Link>
            <TauAiEngineStatus />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-[12px]">
          {tauAiSubstrateOptions.map((option) => {
            const selected = selectedId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedId(option.id)}
                className={`flex w-full items-start gap-[16px] rounded-[12px] border p-[20px] text-left ${
                  selected
                    ? 'border-[rgba(212,168,67,0.32)] bg-[rgba(212,168,67,0.08)]'
                    : 'border-[#222] bg-[#111]'
                }`}
              >
                <div className="flex size-[48px] shrink-0 items-center justify-center rounded-[24px] bg-[rgba(212,168,67,0.12)]">
                  <TauAiIcon src={optionIcons[option.icon]} size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-[8px]">
                    <span className="text-[16px] font-semibold text-white">{option.label}</span>
                    {option.badges.map((badge) => (
                      <span
                        key={badge}
                        className={`rounded-[4px] px-[6px] py-[2px] text-[10px] font-bold ${
                          badge === 'RECOMMENDED'
                            ? 'bg-[rgba(212,168,67,0.16)] text-[#d4a843]'
                            : 'bg-[#1a1a1a] text-[#999]'
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                  <p className="mt-[6px] text-[13px] leading-[20px] text-[#999]">{option.description}</p>
                </div>
                {selected ? <TauAiIcon src={tauAiAssets.icons.radioSelected} size={20} /> : null}
              </button>
            );
          })}
        </div>

        <div className="mx-auto flex w-full max-w-[640px] items-center justify-between border-t border-[#222] pt-[16px]">
          <Link href="/tau-ai-app/local-ai" className="text-[13px] font-medium text-[#d4a843]">
            Manage substrates
          </Link>
          <div className="flex gap-[12px]">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-[20px] border border-[#222] bg-[#111] px-[20px] py-[10px] text-[13px] font-medium text-[#999]"
            >
              Preview modal
            </button>
            <Link
              href="/tau-ai-app/chat"
              className="rounded-[20px] bg-gradient-to-r from-[#f0d78c] via-[#d4a843] to-[#b8922e] px-[24px] py-[10px] text-[13px] font-bold text-black"
            >
              Apply
            </Link>
          </div>
        </div>
      </div>

      <TauAiModelSelectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </TauAiAppShell>
  );
}
