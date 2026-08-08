'use client';

import Link from 'next/link';
import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { TauAiPageHeader } from '@/components/tau-ai-app/shared/TauAiTopBar';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';
import { tauAiGrayscaleWorkflows } from '@/lib/tau-ai-app/demo-data';

export default function TauAiGrayscaleProjectPage() {
  return (
    <TauAiAppShell active="grayscale">
      <TauAiPageHeader
        title="Project Grayscale"
        subtitle="Automation workflows — separate product boundary"
      />

      <div className="flex min-h-0 flex-1 flex-col gap-[32px] overflow-y-auto">
        <div className="rounded-[12px] border border-[rgba(212,168,67,0.16)] bg-[rgba(212,168,67,0.06)] p-[20px]">
          <p className="text-[13px] text-[#999]">
            Grayscale is a separate product. This screen matches Figma navigation and project layout
            only — no ATHENA, OpenClaw, or Grayscale backend integration in Tau AI.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-[24px] lg:grid-cols-[1fr_320px]">
          <section className="flex flex-col gap-[16px] rounded-[12px] border border-[#222] bg-[#111] p-[24px]">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-white">Customer Onboarding</h2>
              <span className="rounded-[20px] bg-[rgba(74,222,128,0.12)] px-[12px] py-[4px] text-[11px] font-bold text-[#4ade80]">
                RUNNING
              </span>
            </div>
            <p className="text-[13px] text-[#999]">
              Automated onboarding pipeline with document verification and welcome sequences.
            </p>
            <div className="flex h-[200px] items-center justify-center rounded-[8px] border border-dashed border-[#333] bg-black">
              <p className="text-[13px] text-[#666]">Workflow canvas — UI placeholder</p>
            </div>
            <div className="flex gap-[12px]">
              <button
                type="button"
                className="rounded-[20px] border border-[#222] bg-[#1a1a1a] px-[20px] py-[10px] text-[13px] font-medium text-[#999]"
                title="UI only"
              >
                Pause
              </button>
              <button
                type="button"
                className="rounded-[20px] bg-gradient-to-r from-[#f0d78c] via-[#d4a843] to-[#b8922e] px-[20px] py-[10px] text-[13px] font-bold text-black"
                title="UI only"
              >
                Edit Workflow
              </button>
            </div>
          </section>

          <aside className="flex flex-col gap-[16px]">
            <div className="rounded-[12px] border border-[#222] bg-[#111] p-[20px]">
              <h3 className="mb-[12px] text-[14px] font-bold text-[#d4a843]">All Workflows</h3>
              <div className="flex flex-col gap-[8px]">
                {tauAiGrayscaleWorkflows.map((workflow) => (
                  <div
                    key={workflow.name}
                    className="flex items-center justify-between rounded-[8px] border border-[#222] bg-black px-[12px] py-[10px]"
                  >
                    <span className="truncate text-[13px] text-white">{workflow.name}</span>
                    <span
                      className="shrink-0 text-[10px] font-bold"
                      style={{ color: workflow.color }}
                    >
                      {workflow.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border border-[#222] bg-[#111] p-[20px]">
              <h3 className="mb-[12px] text-[14px] font-bold text-[#d4a843]">Quick Actions</h3>
              <div className="flex flex-col gap-[8px]">
                {['New Workflow', 'Import Template', 'View Logs'].map((action) => (
                  <button
                    key={action}
                    type="button"
                    className="flex items-center gap-[8px] rounded-[8px] border border-[#222] bg-black px-[12px] py-[10px] text-left text-[13px] text-[#999]"
                    title="UI only"
                  >
                    <TauAiIcon src={tauAiAssets.icons.layers} size={14} />
                    {action}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/tau-ai-app/home"
              className="text-center text-[13px] font-medium text-[#d4a843]"
            >
              Back to Tau AI
            </Link>
          </aside>
        </div>
      </div>
    </TauAiAppShell>
  );
}
