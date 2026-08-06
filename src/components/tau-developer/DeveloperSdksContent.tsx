'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Copy, PackageOpen } from 'lucide-react';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { tauDev } from '@/lib/tau-developer/theme';

const OFFICIAL_SDKS = [
  {
    name: 'JavaScript/TypeScript',
    version: 'v3.1.2',
    install: 'npm i @tau/core-js',
    downloads: '234k downloads',
  },
  {
    name: 'Rust',
    version: 'v0.4.8',
    install: 'cargo add tau-sdk',
    downloads: '42k downloads',
  },
  {
    name: 'Python',
    version: 'v1.9.4',
    install: 'pip install tau-python',
    downloads: '112k downloads',
  },
  {
    name: 'Go',
    version: 'v2.0.1',
    install: 'go get github.com/tau/tau-go',
    downloads: '89k downloads',
  },
];

const COMMUNITY = [
  { name: 'Java-Tau-SDK', version: 'v0.1.2' },
  { name: 'Swift-Tau', version: 'v1.0.0-beta' },
];

export default function DeveloperSdksContent() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className={`${geistSans.className} flex flex-col gap-7 p-8`}>
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[22px] font-bold text-[#fafafa]">Official Platform SDKs</h2>
        <p className="text-[13px] text-[#a1a1aa]">
          Access the full speed of Tau compute clusters natively in the language of your choice.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {OFFICIAL_SDKS.map((sdk) => (
          <div
            key={sdk.name}
            className="flex w-full max-w-[460px] flex-col gap-4 rounded-xl border p-6"
            style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PackageOpen className="size-5 text-[#f5a623]" />
                <span className="text-[15px] font-semibold text-[#fafafa]">{sdk.name}</span>
              </div>
              <span className={`${geistMono.className} text-[11px] text-[#a1a1aa]`}>{sdk.version}</span>
            </div>

            <div
              className="flex items-center justify-between rounded-md border px-3 py-2.5"
              style={{ backgroundColor: tauDev.surfaceElevated, borderColor: tauDev.border }}
            >
              <code className={`${geistMono.className} text-xs text-[#f5a623]`}>{sdk.install}</code>
              <button
                type="button"
                onClick={() => copy(sdk.install)}
                className="text-[#a1a1aa] hover:text-[#f5a623]"
                aria-label={`Copy ${sdk.install}`}
              >
                <Copy className="size-3" />
              </button>
            </div>
            {copied === sdk.install && (
              <span className={`${geistMono.className} text-[10px] text-[#10b981]`}>Copied</span>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#52525b]">{sdk.downloads}</span>
              <div className="flex gap-3 font-semibold">
                <span className="text-[#a1a1aa]">GitHub</span>
                <Link href="/developers/docs" className="text-[#f5a623]">
                  Docs
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t pt-5" style={{ borderColor: tauDev.border }}>
        <p className="text-[15px] font-semibold text-[#fafafa]">Community Maintained</p>
        <div className="flex flex-wrap gap-4">
          {COMMUNITY.map((c) => (
            <div
              key={c.name}
              className="flex w-[300px] items-center gap-3 rounded-lg border p-4"
              style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
            >
              <PackageOpen className="size-4 text-[#a1a1aa]" />
              <span className="flex-1 text-[13px] text-[#fafafa]">{c.name}</span>
              <span className={`${geistMono.className} text-[11px] text-[#52525b]`}>{c.version}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
