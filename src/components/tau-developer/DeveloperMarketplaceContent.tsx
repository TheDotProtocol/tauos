'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { tauAuthHeaders, tauFetchCredentials } from '@/lib/tau-auth-client';
import { tauDev } from '@/lib/tau-developer/theme';

const CATEGORIES = ['All', 'CI/CD', 'Monitoring', 'Testing', 'Database', 'Auth', 'AI'] as const;

type Item = {
  id: string;
  slug: string;
  name: string;
  author: string;
  description: string;
  category: string;
  install_count: number;
  featured?: boolean;
};

export default function DeveloperMarketplaceContent() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [items, setItems] = useState<Item[]>([]);
  const [featured, setFeatured] = useState<Item | null>(null);
  const [installing, setInstalling] = useState<string | null>(null);

  const load = useCallback(async () => {
    const q = category === 'All' ? '' : `?category=${encodeURIComponent(category)}`;
    const res = await fetch(`/api/developers/marketplace${q}`);
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.items ?? []);
    setFeatured(data.featured ?? null);
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  const install = async (slug: string) => {
    setInstalling(slug);
    try {
      await fetch('/api/developers/extensions', {
        method: 'POST',
        credentials: tauFetchCredentials,
        headers: { 'Content-Type': 'application/json', ...tauAuthHeaders() },
        body: JSON.stringify({ action: 'install', slug }),
      });
    } finally {
      setInstalling(null);
    }
  };

  return (
    <div className={`${geistSans.className} flex flex-col gap-5 p-8`}>
      {featured && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-6" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.goldBorder }}>
          <div className="max-w-xl flex flex-col gap-2">
            <span className="w-fit rounded-md border px-2 py-1 text-[11px] font-semibold text-[#10b981]" style={{ backgroundColor: tauDev.successBg, borderColor: tauDev.success }}>
              FEATURED EXTENSION
            </span>
            <p className="text-[22px] font-bold text-[#fafafa]">{featured.name}</p>
            <p className="text-[13px] text-[#a1a1aa]">{featured.description}</p>
          </div>
          <button
            type="button"
            disabled={installing === featured.slug}
            onClick={() => install(featured.slug)}
            className="rounded-lg px-5 py-2.5 text-[13px] font-semibold text-[#060608] disabled:opacity-50"
            style={{ backgroundColor: tauDev.gold }}
          >
            {installing === featured.slug ? 'Installing…' : 'Install Extension'}
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${category === c ? 'text-[#f5a623]' : 'text-[#a1a1aa]'}`}
            style={{ backgroundColor: category === c ? tauDev.goldMuted : tauDev.surface, borderColor: category === c ? tauDev.gold : tauDev.border }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.filter((i) => !i.featured || category !== 'All').map((ext) => (
          <div key={ext.id} className="flex flex-col gap-4 rounded-xl border p-5" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-bold text-[#f5a623]" style={{ backgroundColor: tauDev.goldMuted }}>τ</div>
              <div>
                <p className="text-sm font-semibold text-[#fafafa]">{ext.name}</p>
                <p className="text-[11px] text-[#52525b]">{ext.author}</p>
              </div>
            </div>
            <p className="text-xs text-[#a1a1aa]">{ext.description}</p>
            <div className="mt-auto flex items-center justify-between">
              <span className={`${geistMono.className} text-[10px] text-[#52525b]`}>{Math.round(ext.install_count / 1000)}k installs</span>
              <button
                type="button"
                disabled={installing === ext.slug}
                onClick={() => install(ext.slug)}
                className="rounded-md border px-3 py-1.5 text-[11px] font-semibold text-[#a1a1aa] hover:text-[#fafafa] disabled:opacity-50"
                style={{ backgroundColor: tauDev.surfaceElevated, borderColor: tauDev.border }}
              >
                Install
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
