'use client';

import { useState } from 'react';
import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { TauAiPageHeader } from '@/components/tau-ai-app/shared/TauAiTopBar';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';

const API_ENDPOINTS = [
  { method: 'POST', path: '/api/tau-foundation/chat', description: 'Tau Foundation product chat' },
  { method: 'GET', path: '/api/tau-foundation/substrates', description: 'Substrate registry status' },
  { method: 'POST', path: '/api/tauai/chat', description: 'Production Tau AI chat (unchanged)' },
] as const;

const SDK_SNIPPET = `import { sendTauFoundationChat } from '@/lib/tau-ai-app/api-client';

const result = await sendTauFoundationChat({
  messages: [{ role: 'user', content: 'Hello Tau' }],
});`;

export default function TauAiDeveloperPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SDK_SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <TauAiAppShell active="developer">
      <TauAiPageHeader
        title="Developer"
        subtitle="API access and integration tools for Tau AI"
      />

      <div className="flex min-h-0 flex-1 flex-col gap-[32px] overflow-y-auto">
        <div className="rounded-[12px] border border-[rgba(212,168,67,0.16)] bg-[rgba(212,168,67,0.06)] p-[20px]">
          <p className="text-[13px] text-[#999]">
            API keys and webhook configuration are UI-only. Production path remains{' '}
            <code className="text-[#d4a843]">POST /api/tauai/chat</code>. Product path uses{' '}
            <code className="text-[#d4a843]">POST /api/tau-foundation/chat</code>.
          </p>
        </div>

        <section className="flex flex-col gap-[16px]">
          <h2 className="text-[18px] font-bold text-[#d4a843]">API Key</h2>
          <div className="flex flex-col gap-[12px] rounded-[12px] border border-[#222] bg-[#111] p-[24px]">
            <div className="flex items-center justify-between gap-[16px]">
              <div>
                <p className="text-[14px] font-semibold text-white">Production Key</p>
                <p className="text-[12px] text-[#999]">Use for server-side integrations</p>
              </div>
              <span className="rounded-[20px] bg-[#1a1a1a] px-[12px] py-[6px] text-[11px] font-bold text-[#666]">
                UI ONLY
              </span>
            </div>
            <div className="flex items-center gap-[12px] rounded-[8px] border border-[#222] bg-black px-[16px] py-[12px]">
              <code className="min-w-0 flex-1 truncate text-[13px] text-[#999]">
                tau_sk_live_••••••••••••••••••••••••
              </code>
              <button type="button" className="text-[12px] font-medium text-[#d4a843]" title="UI only">
                Reveal
              </button>
            </div>
            <button
              type="button"
              className="w-fit rounded-[20px] border border-[#222] bg-[#1a1a1a] px-[20px] py-[10px] text-[13px] font-semibold text-[#999]"
              title="UI only — not functional"
            >
              Generate New Key
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-[16px]">
          <h2 className="text-[18px] font-bold text-[#d4a843]">Endpoints</h2>
          <div className="flex flex-col gap-[8px]">
            {API_ENDPOINTS.map((endpoint) => (
              <div
                key={endpoint.path}
                className="flex items-center gap-[16px] rounded-[12px] border border-[#222] bg-[#111] p-[16px]"
              >
                <span className="rounded-[4px] bg-[rgba(212,168,67,0.12)] px-[8px] py-[4px] text-[11px] font-bold text-[#d4a843]">
                  {endpoint.method}
                </span>
                <code className="min-w-0 flex-1 text-[13px] text-white">{endpoint.path}</code>
                <span className="text-[12px] text-[#999]">{endpoint.description}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-[16px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#d4a843]">Quick Start</h2>
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="flex items-center gap-[8px] rounded-[6px] border border-[#222] bg-[#111] px-[12px] py-[6px] text-[12px] font-medium text-[#999]"
            >
              <TauAiIcon src={tauAiAssets.icons.copy} size={12} />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-[12px] border border-[#222] bg-black p-[20px] text-[13px] leading-[20px] text-[#999]">
            {SDK_SNIPPET}
          </pre>
        </section>
      </div>
    </TauAiAppShell>
  );
}
