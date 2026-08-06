'use client';

import { useState } from 'react';
import { Play, Shield, Brain, Zap } from 'lucide-react';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { TAUSCRIPT_VERSION } from '@/lib/tau-ide/tauscript-docs';
import { tauDev } from '@/lib/tau-developer/theme';

const SAMPLE_CODE = `print("Tau telemetry broker online");

let throughput = 14200;
print("Throughput: " + throughput + " reqs/s");

fn route_event(payload) {
  print("Routing: " + payload);
}

route_event("stream-001");
`;

const FEATURES = [
  { icon: Shield, title: 'Type Safe', desc: 'No runtime class exceptions.' },
  { icon: Brain, title: 'AI Native', desc: 'Co-pilot generation friendly.' },
  { icon: Zap, title: 'Edge Ready', desc: 'Ultra low overhead execution.' },
];

const STATS = [
  { label: 'Weekly Downloads', value: '1.42M+', delta: '+14.2% w/w' },
  { label: 'GitHub Stars', value: '18.3k', delta: '420 today' },
  { label: 'Open Contributors', value: '348', delta: '24 active PRs' },
];

export default function DeveloperTauScriptContent() {
  const [code] = useState(SAMPLE_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    if (running) return;
    setRunning(true);
    setOutput([]);
    try {
      const res = await fetch('/api/developers/tauscript/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOutput([`Parse error: ${data.error ?? 'Invalid TauScript syntax'}`]);
        return;
      }
      if (data.error) {
        setOutput([`Runtime: ${data.error}`]);
        return;
      }
      setOutput(data.output?.length ? data.output : ['// executed (no output)']);
    } catch {
      setOutput(['Network error — could not reach playground.']);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className={`${geistSans.className} flex flex-col gap-6 p-8`}>
      <div
        className="flex flex-wrap items-center justify-between gap-6 rounded-xl border p-7"
        style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
      >
        <div className="max-w-xl flex flex-col gap-3">
          <span
            className={`${geistMono.className} w-fit rounded border px-2 py-1 text-[11px] font-semibold text-[#f5a623]`}
            style={{ backgroundColor: tauDev.goldMuted, borderColor: tauDev.gold }}
          >
            v{TAUSCRIPT_VERSION} — Latest Stable
          </span>
          <h2 className="text-[32px] font-bold text-[#fafafa]">The language built for Tau</h2>
          <p className="text-sm leading-[22px] text-[#a1a1aa]">
            An edge-native, memory-isolated compiler target specifically modeled for lightning-fast distributed
            cluster orchestration. Fully type-safe and compilation-optimized for sub-millisecond edge start-up.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-[#060608] disabled:opacity-50"
            style={{ backgroundColor: tauDev.gold }}
          >
            <Play className="size-3.5" />
            {running ? 'Running…' : 'Try in Playground'}
          </button>
          <p className={`${geistMono.className} text-[11px] text-[#52525b]`}>npm install -g @tau/tauscript</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 xl:flex-row">
        <div
          className="flex min-w-0 flex-1 flex-col rounded-xl border"
          style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
        >
          <div className="flex items-start justify-between border-b p-4" style={{ borderColor: tauDev.border }}>
            <p className={`${geistMono.className} text-xs font-semibold text-[#f5a623]`}>telemetry_broker.tau</p>
            <p className={`${geistMono.className} text-[11px] text-[#52525b]`}>TauScript Core v2</p>
          </div>
          <pre
            className={`${geistMono.className} min-h-[240px] flex-1 overflow-auto p-5 text-[13px] leading-5 text-[#a1a1aa]`}
            style={{ backgroundColor: tauDev.surfaceElevated }}
          >
            {code}
          </pre>
          {output.length > 0 && (
            <div className="border-t p-4" style={{ borderColor: tauDev.border }}>
              <pre className={`${geistMono.className} text-xs text-[#10b981]`}>{output.join('\n')}</pre>
            </div>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-5 xl:w-[360px]">
          <div className="flex flex-col gap-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-lg border p-4"
                style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
              >
                <div
                  className="flex size-8 items-center justify-center rounded-md"
                  style={{ backgroundColor: tauDev.goldMuted }}
                >
                  <Icon className="size-4 text-[#f5a623]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#fafafa]">{title}</p>
                  <p className="text-xs text-[#a1a1aa]">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-lg border p-5"
            style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
          >
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[1px] text-[#52525b]">
              Global Ecosystem Metrics
            </p>
            <div className="flex flex-col gap-3">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <span className="text-[#a1a1aa]">{s.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`${geistMono.className} font-semibold text-[#fafafa]`}>{s.value}</span>
                    <span className={`${geistMono.className} text-[10px] text-[#10b981]`}>{s.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
