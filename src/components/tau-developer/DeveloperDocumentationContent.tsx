'use client';

import { useState } from 'react';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { tauDev } from '@/lib/tau-developer/theme';

const NAV_GROUPS = [
  {
    title: 'Getting Started',
    items: [
      { id: 'intro', label: 'Introduction', active: true },
      { id: 'quick', label: 'Quick Start Guide' },
      { id: 'arch', label: 'Core Architecture' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { id: 'auth', label: 'Endpoint Authentication' },
      { id: 'telemetry', label: 'Telemetry Gateway' },
      { id: 'webhooks', label: 'Webhooks & WebSockets' },
    ],
  },
];

const TOC = ['Introduction', 'Client Setup', 'Client Core Methods'];

const ENDPOINTS = [
  { method: 'GET' as const, url: 'https://api.tau.dev/v1/telemetry' },
  { method: 'POST' as const, url: 'https://api.tau.dev/v1/cluster/deploy' },
];

export default function DeveloperDocumentationContent() {
  const [activeSection, setActiveSection] = useState('intro');

  return (
    <div className={`${geistSans.className} flex min-h-0 flex-1`}>
      <aside
        className="w-[240px] shrink-0 border-r p-6"
        style={{ backgroundColor: tauDev.sidebar, borderColor: tauDev.border }}
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-5 flex flex-col gap-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#52525b]">{group.title}</p>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`text-left text-[13px] ${
                  activeSection === item.id ? 'font-semibold text-[#f5a623]' : 'font-normal text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-auto p-10">
        <div className="flex flex-col gap-2">
          <p className={`${geistMono.className} text-xs font-semibold text-[#f5a623]`}>GETTING STARTED</p>
          <h2 className="text-[28px] font-bold text-[#fafafa]">Introduction to Tau</h2>
        </div>
        <p className="max-w-2xl text-sm leading-[22px] text-[#a1a1aa]">
          Tau Developer Platform provides a highly optimized compute layer, global event broker, and telemetry
          dashboard designed for lightning-fast network services.
        </p>

        <div className="flex gap-3">
          <span
            className={`${geistMono.className} flex size-6 shrink-0 items-center justify-center rounded-xl border text-[11px] font-semibold text-[#f5a623]`}
            style={{ backgroundColor: tauDev.goldMuted, borderColor: tauDev.gold }}
          >
            1
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-[#fafafa]">Initialize Client Instance</p>
            <p className="text-[13px] text-[#a1a1aa]">
              Pull down client credentials from your secret vault and bootstrap Tau connection.
            </p>
          </div>
        </div>

        <div
          className="rounded-[10px] border p-5"
          style={{ backgroundColor: tauDev.surfaceElevated, borderColor: tauDev.border }}
        >
          <div className="mb-3 flex items-start justify-between text-[11px]">
            <span className={`${geistMono.className} text-[#52525b]`}>main.ts</span>
            <button type="button" className="text-[#f5a623] hover:underline">
              Copy Code
            </button>
          </div>
          <div className={`${geistMono.className} flex flex-col gap-1 text-xs text-[#a1a1aa]`}>
            <p>
              <span className="text-[#f5a623]">const</span> client = <span className="text-[#f5a623]">new</span>{' '}
              <span className="text-[#fafafa]">TauClient</span>({'{'} token:{' '}
              <span className="text-[#10b981]">&quot;tau_sec_abc123&quot;</span> {'}'});
            </p>
            <p>
              <span className="text-[#f5a623]">await</span> client.<span className="text-[#f5a623]">connect</span>();
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-[#fafafa]">Inline Endpoint Interface</p>
          {ENDPOINTS.map((ep) => (
            <div
              key={ep.url}
              className="flex items-center gap-3 rounded-lg border p-3"
              style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
            >
              <span
                className={`${geistMono.className} rounded border px-2 py-1 text-[10px] font-semibold ${
                  ep.method === 'GET' ? 'border-[#10b981] text-[#10b981]' : 'border-[#f5a623] text-[#f5a623]'
                }`}
                style={{
                  backgroundColor: ep.method === 'GET' ? tauDev.successBg : tauDev.goldMuted,
                }}
              >
                {ep.method}
              </span>
              <span className={`${geistMono.className} text-xs text-[#fafafa]`}>{ep.url}</span>
            </div>
          ))}
        </div>
      </div>

      <aside className="hidden w-[200px] shrink-0 flex-col gap-4 p-6 xl:flex" style={{ backgroundColor: tauDev.bg }}>
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#52525b]">On This Page</p>
        {TOC.map((item, i) => (
          <p key={item} className={`text-xs ${i === 0 ? 'font-semibold text-[#f5a623]' : 'text-[#a1a1aa]'}`}>
            {item}
          </p>
        ))}
      </aside>
    </div>
  );
}
