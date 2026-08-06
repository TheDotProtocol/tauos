'use client';

import { useEffect, useState } from 'react';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { tauAuthHeaders, tauFetchCredentials } from '@/lib/tau-auth-client';
import { tauDev } from '@/lib/tau-developer/theme';

const RANGES = ['24h', '7d', '30d', '90d'] as const;

type Analytics = {
  totalRequests: number;
  totalErrors: number;
  avgLatencyMs: number;
  uptime: string;
  chart: { metric_date: string; calls: string }[];
  topEndpoints: { endpoint: string; calls: string }[];
  regions: { region: string; calls: string }[];
};

export default function DeveloperAnalyticsContent() {
  const [range, setRange] = useState<(typeof RANGES)[number]>('30d');
  const [metrics, setMetrics] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch(`/api/developers/analytics?range=${range}`, {
      credentials: tauFetchCredentials,
      headers: tauAuthHeaders(),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then(setMetrics)
      .catch(() => {});
  }, [range]);

  const errorRate = metrics?.totalRequests
    ? ((metrics.totalErrors / metrics.totalRequests) * 100).toFixed(2)
    : '0.00';

  const bars = (metrics?.chart?.length ? metrics.chart : Array.from({ length: 30 }, (_, i) => ({ calls: String(20 + i * 3) })))
    .map((b, i, arr) => ({
      h: Math.min(120, 20 + Number(b.calls) / 1000),
      peak: i === arr.length - 1,
    }));

  return (
    <div className={`${geistSans.className} flex flex-col gap-6 p-8`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[22px] font-bold text-[#fafafa]">Platform Performance</h2>
        <div className="inline-flex rounded-lg border p-1" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
          {RANGES.map((r) => (
            <button key={r} type="button" onClick={() => setRange(r)} className={`rounded-md px-3 py-1 text-xs ${range === r ? 'font-semibold text-[#f5a623]' : 'text-[#a1a1aa]'}`} style={range === r ? { backgroundColor: tauDev.bg, border: `1px solid ${tauDev.border}` } : undefined}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total API Calls', value: metrics ? `${(metrics.totalRequests / 1_000_000).toFixed(2)}M` : '—' },
          { label: 'Avg Latency', value: metrics ? `${metrics.avgLatencyMs}ms` : '—' },
          { label: 'Error Rate', value: `${errorRate}%` },
          { label: 'Uptime', value: metrics ? `${metrics.uptime}%` : '—', highlight: true },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border p-5" style={{ backgroundColor: tauDev.surface, borderColor: k.highlight ? tauDev.goldBorder : tauDev.border }}>
            <p className="text-xs text-[#a1a1aa]">{k.label}</p>
            <p className={`${geistMono.className} mt-2 text-[28px] font-bold ${k.highlight ? 'text-[#f5a623]' : 'text-[#fafafa]'}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-6" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
        <p className="mb-4 text-sm font-semibold text-[#fafafa]">API Throughput ({range})</p>
        <div className="flex h-24 items-end gap-1">
          {bars.map((b, i) => (
            <div key={i} className="flex-1 rounded-t" style={{ height: b.h, backgroundColor: b.peak ? tauDev.gold : tauDev.goldMuted, maxWidth: 12 }} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border p-6" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
          <p className="mb-4 text-sm font-semibold text-[#fafafa]">Top Endpoints</p>
          {(metrics?.topEndpoints?.length ? metrics.topEndpoints : [{ endpoint: '/api/tau-ide/projects', calls: '0' }]).map((ep) => (
            <div key={ep.endpoint} className="flex justify-between border-b py-2 text-xs last:border-0" style={{ borderColor: tauDev.border }}>
              <span className={`${geistMono.className} text-[#a1a1aa]`}>{ep.endpoint}</span>
              <span className="text-[#52525b]">{Math.round(Number(ep.calls) / 1000)}k reqs</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border p-6" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
          <p className="mb-4 text-sm font-semibold text-[#fafafa]">Regional Traffic</p>
          {(metrics?.regions?.length ? metrics.regions : [{ region: 'Global', calls: String(metrics?.totalRequests ?? 0) }]).map((r) => (
            <div key={r.region} className="flex justify-between py-2 text-xs">
              <span className="text-[#a1a1aa]">{r.region || 'Global'}</span>
              <span className={`${geistMono.className} text-[#fafafa]`}>{Math.round(Number(r.calls) / 1000)}k</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
