'use client';

import Link from 'next/link';
import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import { TauAiPageHeader } from '@/components/tau-ai-app/shared/TauAiTopBar';
import { TAU_AI_SCREENS } from '@/lib/tau-ai-app/screens';

const statusColors: Record<string, string> = {
  implemented: 'text-[#4ade80]',
  'ui-only': 'text-[#d4a843]',
  deferred: 'text-[#666]',
};

export default function TauAiScreensIndexPage() {
  const batches = [1, 2, 3] as const;

  return (
    <TauAiAppShell active="home">
      <TauAiPageHeader
        title="Screen Index"
        subtitle="Figma handoff registry — all desktop screens"
      />

      <div className="flex min-h-0 flex-1 flex-col gap-[32px] overflow-y-auto">
        {batches.map((batch) => {
          const screens = TAU_AI_SCREENS.filter((s) => s.batch === batch);
          return (
            <section key={batch} className="flex flex-col gap-[12px]">
              <h2 className="text-[18px] font-bold text-[#d4a843]">Batch {batch}</h2>
              <div className="overflow-hidden rounded-[12px] border border-[#222]">
                <table className="w-full text-left text-[13px]">
                  <thead className="border-b border-[#222] bg-[#111]">
                    <tr>
                      <th className="px-[16px] py-[12px] font-semibold text-[#999]">Screen</th>
                      <th className="px-[16px] py-[12px] font-semibold text-[#999]">Figma</th>
                      <th className="px-[16px] py-[12px] font-semibold text-[#999]">Route</th>
                      <th className="px-[16px] py-[12px] font-semibold text-[#999]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {screens.map((screen) => (
                      <tr key={screen.route} className="border-b border-[#222] bg-black last:border-0">
                        <td className="px-[16px] py-[12px] font-medium text-white">{screen.name}</td>
                        <td className="px-[16px] py-[12px] text-[#666]">{screen.figmaNode}</td>
                        <td className="px-[16px] py-[12px]">
                          <Link href={screen.route} className="text-[#d4a843] hover:underline">
                            {screen.route}
                          </Link>
                        </td>
                        <td className={`px-[16px] py-[12px] font-semibold ${statusColors[screen.status]}`}>
                          {screen.status}
                          {screen.note ? (
                            <span className="ml-[8px] font-normal text-[#666]">— {screen.note}</span>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </TauAiAppShell>
  );
}
