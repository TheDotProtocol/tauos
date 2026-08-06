'use client';

import { useCallback, useEffect, useState } from 'react';
import { Copy, KeyRound, Plus, Trash2 } from 'lucide-react';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { tauAuthHeaders, tauFetchCredentials } from '@/lib/tau-auth-client';
import { tauDev } from '@/lib/tau-developer/theme';

type ApiKey = {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  last_used_at?: string;
  created_at: string;
};

export default function DeveloperApiKeysContent() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/developers/api-keys', {
        credentials: tauFetchCredentials,
        headers: tauAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/developers/api-keys', {
        method: 'POST',
        credentials: tauFetchCredentials,
        headers: { 'Content-Type': 'application/json', ...tauAuthHeaders() },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.key?.key) {
        setNewKey(data.key.key);
        setName('');
        load();
      }
    } finally {
      setCreating(false);
    }
  };

  const revoke = async (id: string) => {
    await fetch(`/api/developers/api-keys?id=${id}`, {
      method: 'DELETE',
      credentials: tauFetchCredentials,
      headers: tauAuthHeaders(),
    });
    load();
  };

  return (
    <div className={`${geistSans.className} flex flex-col gap-6 p-8`}>
      <div>
        <h2 className="text-[22px] font-bold text-[#fafafa]">API Gateway Keys</h2>
        <p className="mt-1 text-sm text-[#a1a1aa]">Authenticate programmatic access to Tau Developer APIs.</p>
      </div>

      {newKey && (
        <div className="rounded-xl border p-4" style={{ backgroundColor: tauDev.goldMuted, borderColor: tauDev.gold }}>
          <p className="text-xs font-semibold text-[#f5a623]">Copy your new key — it won&apos;t be shown again</p>
          <div className="mt-2 flex items-center gap-2">
            <code className={`${geistMono.className} flex-1 break-all text-xs text-[#fafafa]`}>{newKey}</code>
            <button type="button" onClick={() => navigator.clipboard.writeText(newKey)} className="text-[#f5a623]">
              <Copy className="size-4" />
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border p-5" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
        <p className="mb-3 text-sm font-semibold text-[#fafafa]">Create Key</p>
        <div className="flex flex-wrap gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Production CI Key"
            className="min-w-[200px] flex-1 rounded-md border bg-transparent px-3 py-2 text-sm text-[#fafafa]"
            style={{ borderColor: tauDev.border, backgroundColor: tauDev.surfaceElevated }}
          />
          <button
            type="button"
            onClick={create}
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[#060608] disabled:opacity-50"
            style={{ backgroundColor: tauDev.gold }}
          >
            <Plus className="size-4" /> {creating ? 'Creating…' : 'Generate Key'}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
        {loading && <p className="p-6 text-sm text-[#52525b]">Loading keys…</p>}
        {!loading && keys.length === 0 && (
          <p className="p-6 text-sm text-[#52525b]">No API keys yet. Generate one above.</p>
        )}
        {keys.map((k) => (
          <div key={k.id} className="flex items-center border-b p-4 last:border-0" style={{ borderColor: tauDev.border }}>
            <KeyRound className="mr-2 size-4 text-[#f5a623]" />
            <span className="flex-1 text-sm font-medium text-[#fafafa]">{k.name}</span>
            <span className={`${geistMono.className} mr-4 text-xs text-[#a1a1aa]`}>{k.key_prefix}…</span>
            <span className="mr-4 text-xs text-[#52525b]">{new Date(k.created_at).toLocaleDateString()}</span>
            <button type="button" onClick={() => revoke(k.id)} className="text-[#ef4444]">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
