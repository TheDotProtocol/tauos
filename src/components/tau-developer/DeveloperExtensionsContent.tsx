'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { tauAuthHeaders, tauFetchCredentials } from '@/lib/tau-auth-client';
import { tauDev } from '@/lib/tau-developer/theme';

type Extension = {
  id: string;
  slug: string;
  name: string;
  version: string;
  permissions: string[];
  auto_update: boolean;
  enabled: boolean;
  config: Record<string, string>;
  config_schema?: { key: string; label: string; type: string; default?: string }[];
};

export default function DeveloperExtensionsContent() {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [selected, setSelected] = useState<Extension | null>(null);
  const [configDraft, setConfigDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/developers/extensions', {
      credentials: tauFetchCredentials,
      headers: tauAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      setExtensions(data.extensions ?? []);
      if (data.extensions?.[0] && !selected) {
        setSelected(data.extensions[0]);
        setConfigDraft(data.extensions[0].config ?? {});
      }
    }
  }, [selected]);

  useEffect(() => {
    load();
  }, [load]);

  const uninstall = async (id: string) => {
    await fetch(`/api/developers/extensions?id=${id}`, {
      method: 'DELETE',
      credentials: tauFetchCredentials,
      headers: tauAuthHeaders(),
    });
    setSelected(null);
    load();
  };

  const saveConfig = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await fetch('/api/developers/extensions', {
        method: 'POST',
        credentials: tauFetchCredentials,
        headers: { 'Content-Type': 'application/json', ...tauAuthHeaders() },
        body: JSON.stringify({ action: 'configure', installId: selected.id, config: configDraft }),
      });
      load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${geistSans.className} flex flex-col gap-6 p-8`}>
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-[#fafafa]">Manage Integrations</p>
        <Link href="/developers/marketplace" className="text-[13px] text-[#f5a623] hover:underline">
          Browse Marketplace →
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
        {extensions.length === 0 && (
          <p className="p-6 text-sm text-[#52525b]">No extensions installed. Browse the marketplace to add one.</p>
        )}
        {extensions.map((ext) => (
          <div key={ext.id} className="flex flex-wrap items-center border-b p-4 last:border-0 sm:flex-nowrap" style={{ borderColor: tauDev.border }}>
            <div className="flex w-[180px] shrink-0 items-center gap-2.5">
              <div className="flex size-6 items-center justify-center rounded text-[10px] font-bold text-[#f5a623]" style={{ backgroundColor: tauDev.goldMuted }}>τ</div>
              <span className="text-[13px] font-semibold text-[#fafafa]">{ext.name}</span>
            </div>
            <span className={`${geistMono.className} w-[80px] shrink-0 text-xs text-[#a1a1aa]`}>v{ext.version}</span>
            <div className="w-[100px] shrink-0">
              <span className="rounded-md border px-2 py-0.5 text-[11px] font-semibold text-[#10b981]" style={{ backgroundColor: tauDev.successBg, borderColor: tauDev.success }}>
                {ext.enabled ? 'Active' : 'Disabled'}
              </span>
            </div>
            <span className="w-[120px] shrink-0 text-[13px] text-[#a1a1aa]">{ext.auto_update ? 'ON' : 'OFF'}</span>
            <div className="flex w-[240px] shrink-0 flex-wrap gap-1.5">
              {(ext.permissions ?? []).map((p) => (
                <span key={p} className="rounded-md border px-2 py-0.5 text-[11px] font-semibold text-[#a1a1aa]" style={{ backgroundColor: '#16161c', borderColor: '#27272a' }}>{p}</span>
              ))}
            </div>
            <div className="flex min-w-0 flex-1 justify-end gap-3 text-xs font-semibold">
              <button type="button" onClick={() => { setSelected(ext); setConfigDraft(ext.config ?? {}); }} className="text-[#a1a1aa] hover:text-[#fafafa]">Configure</button>
              <button type="button" onClick={() => uninstall(ext.id)} className="text-[#ef4444]">Uninstall</button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="rounded-xl border p-6" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
          <p className="mb-4 text-sm font-semibold text-[#fafafa]">Extension Settings: {selected.name}</p>
          <div className="grid gap-5 md:grid-cols-2">
            {(selected.config_schema?.length ? selected.config_schema : [{ key: 'API_KEY', label: 'API Key', type: 'secret' }]).map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5">
                <p className={`${geistMono.className} text-[11px] text-[#a1a1aa]`}>{field.label ?? field.key}</p>
                <input
                  type={field.type === 'secret' ? 'password' : 'text'}
                  value={configDraft[field.key] ?? field.default ?? ''}
                  onChange={(e) => setConfigDraft({ ...configDraft, [field.key]: e.target.value })}
                  className="rounded-md border bg-transparent p-3 text-xs text-[#fafafa]"
                  style={{ backgroundColor: tauDev.surfaceElevated, borderColor: tauDev.border }}
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={saveConfig} disabled={saving} className="mt-4 rounded-lg px-5 py-2 text-sm font-semibold text-[#060608] disabled:opacity-50" style={{ backgroundColor: tauDev.gold }}>
            {saving ? 'Saving…' : 'Save Configuration'}
          </button>
        </div>
      )}
    </div>
  );
}
