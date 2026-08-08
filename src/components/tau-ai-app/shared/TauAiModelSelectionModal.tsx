'use client';

import Link from 'next/link';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';
import { tauAiSubstrateOptions } from '@/lib/tau-ai-app/demo-data';

const optionIcons: Record<string, string> = {
  zap: tauAiAssets.icons.zap,
  brainCircuit: tauAiAssets.icons.brainCircuit,
  microscope: tauAiAssets.icons.microscope,
};

type TauAiModelSelectionModalProps = {
  open: boolean;
  onClose: () => void;
  selectedId?: string;
  onSelect?: (id: string) => void;
};

export default function TauAiModelSelectionModal({
  open,
  onClose,
  selectedId = 'auto',
  onSelect,
}: TauAiModelSelectionModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-[40px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="model-selection-title"
    >
      <div className="flex w-full max-w-[560px] flex-col gap-[24px] rounded-[16px] border border-[#222] bg-[#0a0a0a] p-[32px]">
        <div className="flex items-start justify-between gap-[16px]">
          <div className="flex flex-col gap-[4px]">
            <h2 id="model-selection-title" className="text-[20px] font-bold text-white">
              Select Substrate
            </h2>
            <p className="text-[13px] text-[#999]">
              Third-party models are substrates — not Tau-owned weights.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] font-medium text-[#999] hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="flex flex-col gap-[12px]">
          {tauAiSubstrateOptions.map((option) => {
            const selected = selectedId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect?.(option.id)}
                className={`flex w-full items-start gap-[16px] rounded-[12px] border p-[16px] text-left ${
                  selected
                    ? 'border-[rgba(212,168,67,0.32)] bg-[rgba(212,168,67,0.08)]'
                    : 'border-[#222] bg-[#111]'
                }`}
              >
                <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[20px] bg-[rgba(212,168,67,0.12)]">
                  <TauAiIcon src={optionIcons[option.icon]} size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-[8px]">
                    <span className="text-[15px] font-semibold text-white">{option.label}</span>
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
                  <p className="mt-[4px] text-[12px] leading-[18px] text-[#999]">{option.description}</p>
                </div>
                {selected ? <TauAiIcon src={tauAiAssets.icons.radioSelected} size={18} /> : null}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-[#222] pt-[16px]">
          <Link href="/tau-ai-app/local-ai" className="text-[13px] font-medium text-[#d4a843]">
            Manage substrates
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[20px] bg-gradient-to-r from-[#f0d78c] via-[#d4a843] to-[#b8922e] px-[24px] py-[10px] text-[13px] font-bold text-black"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
