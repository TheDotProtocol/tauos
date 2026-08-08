'use client';

import { useEffect, useState } from 'react';
import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import { TauAiPageHeader } from '@/components/tau-ai-app/shared/TauAiTopBar';
import TauAiToggle from '@/components/tau-ai-app/shared/TauAiToggle';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';
import {
  fetchProductSubstrates,
  type ProductSubstrateStatus,
} from '@/lib/tau-ai-app/substrate-client';

function availabilityLabel(availability: string, configured: boolean): string {
  if (!configured) return 'NOT_CONFIGURED';
  return availability;
}

function statusDotColor(availability: string, configured: boolean): string {
  if (!configured || availability === 'NOT_CONFIGURED') return 'bg-[#666]';
  if (availability === 'AVAILABLE' || availability === 'DEGRADED') return 'bg-[#d4a843]';
  return 'bg-[#666]';
}

export default function TauAiLocalAiPage() {
  const [substrates, setSubstrates] = useState<ProductSubstrateStatus[]>([]);
  const [cloudFallback, setCloudFallback] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductSubstrates()
      .then(setSubstrates)
      .catch(() => setSubstrates([]))
      .finally(() => setLoading(false));
  }, []);

  const foundationSubstrate = substrates.find((s) => s.isTauFoundation);

  return (
    <TauAiAppShell active="local-ai">
      <TauAiPageHeader
        title="Local AI Engine"
        subtitle="Private intelligence running on your hardware"
      />

      <div className="flex w-full flex-col gap-[32px] overflow-y-auto">
        <div className="flex w-full items-center justify-between rounded-[12px] border border-[rgba(212,168,67,0.16)] bg-[#111] p-[20px]">
          <div className="flex items-center gap-[16px]">
            <div className="flex size-[32px] items-center justify-center rounded-[16px] bg-[rgba(212,168,67,0.16)]">
              <TauAiIcon src={tauAiAssets.icons.shield} size={16} />
            </div>
            <div>
              <p className="text-[16px] font-bold text-white">On-Device Computing Active</p>
              <p className="text-[13px] text-[#999]">
                All processing is happening on-device with zero data leak vectors.
              </p>
            </div>
          </div>
          <span className="rounded-[20px] bg-[rgba(212,168,67,0.16)] px-[12px] py-[6px] text-[12px] font-bold text-[#d4a843]">
            ENG-ACTIVE
          </span>
        </div>

        <section className="flex w-full flex-col gap-[16px]">
          <h2 className="text-[18px] font-bold text-[#d4a843]">Model Substrates</h2>
          <p className="text-[12px] text-[#666]">
            Substrate status from ai-gateway registry. Third-party models are substrates — not
            Tau-owned weights. Tau Foundation Model track:{' '}
            {foundationSubstrate?.availability ?? 'NOT_CONFIGURED'}.
          </p>
          {loading ? (
            <p className="text-[14px] text-[#999]">Loading substrate registry…</p>
          ) : (
            <div className="flex flex-col gap-[12px]">
              {substrates.map((substrate) => (
                <div
                  key={substrate.id}
                  className="flex w-full items-center justify-between rounded-[12px] border border-[#222] bg-[#111] p-[20px]"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-[24px]">
                    <div className="flex items-center gap-[12px]">
                      <span
                        className={`size-[8px] shrink-0 rounded-[4px] ${statusDotColor(substrate.availability, substrate.configured)}`}
                      />
                      <div>
                        <p className="text-[16px] font-semibold text-white">{substrate.label}</p>
                        {substrate.isTauFoundation ? (
                          <p className="text-[11px] text-[#d4a843]">Tau Foundation Model track — weights not available</p>
                        ) : null}
                      </div>
                    </div>
                    <p className="hidden text-[13px] text-[#999] sm:block">{substrate.kind}</p>
                    <p className="text-[13px] text-[#999]">
                      {availabilityLabel(substrate.availability, substrate.configured)}
                    </p>
                    {substrate.defaultModel ? (
                      <p className="hidden text-[13px] text-[#666] md:block">{substrate.defaultModel}</p>
                    ) : null}
                    <div className="hidden h-[4px] w-[200px] overflow-hidden rounded-[2px] bg-[#1a1a1a] lg:block">
                      <div
                        className="h-full bg-[#d4a843]"
                        style={{ width: substrate.configured ? '100%' : '0%' }}
                      />
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-[12px]">
                    {substrate.configured ? (
                      <button
                        type="button"
                        className="rounded-[20px] border border-[#d4a843] px-[20px] py-[10px] text-[13px] font-semibold text-[#d4a843]"
                      >
                        Active
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="rounded-[22px] bg-gradient-to-r from-[#f0d78c] via-[#d4a843] to-[#b8922e] px-[24px] py-[12px] text-[14px] font-bold text-black opacity-50"
                        title="Configure credentials or local infrastructure"
                      >
                        Configure
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex w-full flex-col gap-[16px]">
          <h2 className="text-[18px] font-bold text-[#d4a843]">Hardware Utilisation</h2>
          <div className="grid w-full grid-cols-1 gap-[16px] md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'CPU Load', value: '42%', sub: '16 Cores', ring: tauAiAssets.icons.ringActive },
              { label: 'Memory allocation', value: '6.2 / 16 GB', sub: 'DDR5 System RAM', bar: 38 },
              { label: 'GPU Load', value: '78%', sub: '8 GB VRAM', ring: tauAiAssets.icons.ringActiveGpu },
              { label: 'Model Storage', value: '—', sub: 'From substrate registry', bar: 5 },
            ].map((metric) => (
              <div
                key={metric.label}
                className="flex flex-col items-center gap-[12px] rounded-[12px] border border-[#222] bg-[#111] p-[20px]"
              >
                {metric.ring ? (
                  <div className="relative flex size-[72px] items-center justify-center">
                    <TauAiIcon src={tauAiAssets.icons.ringBg} size={72} />
                    <span className="absolute text-[16px] font-bold text-white">{metric.value}</span>
                  </div>
                ) : (
                  <>
                    <p className="w-full text-[14px] font-semibold text-white">{metric.label}</p>
                    <p className="w-full text-[24px] font-bold text-[#d4a843]">{metric.value}</p>
                    {'bar' in metric && metric.bar != null ? (
                      <div className="h-[4px] w-full overflow-hidden rounded-[2px] bg-[#1a1a1a]">
                        <div className="h-full bg-[#d4a843]" style={{ width: `${metric.bar}%` }} />
                      </div>
                    ) : null}
                  </>
                )}
                {metric.ring ? (
                  <div className="text-center">
                    <p className="text-[14px] font-semibold text-white">{metric.label}</p>
                    <p className="text-[12px] text-[#999]">{metric.sub}</p>
                  </div>
                ) : (
                  <p className="w-full text-[11px] text-[#999]">{metric.sub}</p>
                )}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#666]">
            Hardware metrics: UI demo values until hardware detector product API ships (AI-3.3
            boundary).
          </p>
        </section>

        <div className="flex w-full flex-col gap-[16px] rounded-[12px] border border-[#222] bg-[#111] p-[24px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[16px] font-bold text-[#d4a843]">Cloud Fallback</p>
              <p className="text-[13px] text-[#999]">Use cloud when local models cannot handle request</p>
            </div>
            <TauAiToggle checked={cloudFallback} onChange={setCloudFallback} />
          </div>
          <p className="text-[12px] leading-[18px] text-[#666]">
            When enabled, complex tasks may be routed to configured remote substrates via
            DeterministicModelRouter. Content governed by Tau Constitution v0.1.
          </p>
        </div>
      </div>
    </TauAiAppShell>
  );
}
