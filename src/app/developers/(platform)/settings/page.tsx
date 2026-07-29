'use client';

import { useState, useEffect } from 'react';
import PlatformShell from '@/components/tau-ide/PlatformShell';
import { getStoredUser, clearSession } from '@/lib/tau-ide/auth-client';
import { getActiveProjectId, loadProjects } from '@/lib/tau-ide/projects';
import { apiFetch } from '@/lib/tau-ide/sync-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Key, History, RotateCcw, Plus, Trash2 } from 'lucide-react';

type SecretMeta = { id: string; key: string; created_at: string };
type Version = { id: string; label: string; created_at: string; summary?: string };

export default function SettingsPage() {
  const [user, setUser] = useState<{ email?: string; username?: string; fullName?: string } | null>(null);
  const [mode, setMode] = useState<'professional' | 'beginner'>('professional');
  const [secrets, setSecrets] = useState<SecretMeta[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [projectId, setProjectId] = useState('');
  const router = useRouter();

  useEffect(() => {
    setUser(getStoredUser());
    const saved = localStorage.getItem('tau-ide-mode');
    if (saved === 'beginner' || saved === 'professional') setMode(saved);
    loadProjects().then(() => {
      const id = getActiveProjectId();
      setProjectId(id);
      if (id && id !== 'default' && !id.startsWith('proj_')) {
        loadSecrets(id);
        loadVersions(id);
      }
    });
  }, []);

  const loadSecrets = async (id: string) => {
    try {
      const data = await apiFetch<{ secrets: SecretMeta[] }>(`/api/tau-ide/projects/${id}/secrets`);
      setSecrets(data.secrets ?? []);
    } catch { /* unauthenticated or local-only */ }
  };

  const loadVersions = async (id: string) => {
    try {
      const data = await apiFetch<{ versions: Version[] }>(`/api/tau-ide/projects/${id}/versions`);
      setVersions(data.versions ?? []);
    } catch { /* skip */ }
  };

  const addSecret = async () => {
    if (!newKey.trim() || !newValue.trim() || !projectId) return;
    try {
      await apiFetch(`/api/tau-ide/projects/${projectId}/secrets`, {
        method: 'POST',
        body: JSON.stringify({ key: newKey.trim(), value: newValue.trim() }),
      });
      setNewKey('');
      setNewValue('');
      loadSecrets(projectId);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save secret');
    }
  };

  const removeSecret = async (key: string) => {
    if (!projectId || !confirm(`Delete secret "${key}"?`)) return;
    await apiFetch(`/api/tau-ide/projects/${projectId}/secrets`, {
      method: 'DELETE',
      body: JSON.stringify({ key }),
    });
    loadSecrets(projectId);
  };

  const restoreVersion = async (versionId: string) => {
    if (!projectId || !confirm('Restore this version? Current files will be replaced.')) return;
    await apiFetch(`/api/tau-ide/projects/${projectId}/versions/${versionId}/restore`, { method: 'POST' });
    alert('Version restored. Reload workspace to see changes.');
  };

  const saveMode = (m: 'professional' | 'beginner') => {
    setMode(m);
    localStorage.setItem('tau-ide-mode', m);
  };

  const logout = () => {
    clearSession();
    router.push('/developers/login');
  };

  return (
    <PlatformShell title="Settings">
      <div className="p-6 max-w-2xl mx-auto space-y-8">
        <section className="card">
          <h3 className="font-semibold mb-4">Account</h3>
          {user ? (
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> {user.fullName}</p>
              <p><span className="text-gray-500">Email:</span> {user.email}</p>
              <p><span className="text-gray-500">Username:</span> {user.username}</p>
              <button onClick={logout} className="btn-secondary text-sm mt-4">Sign out</button>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              Not signed in. <Link href="/developers/login" className="text-cyan-400 hover:underline">Sign in</Link> to sync projects.
            </p>
          )}
        </section>

        <section className="card">
          <h3 className="font-semibold mb-4">IDE Mode</h3>
          <div className="flex gap-3">
            {(['professional', 'beginner'] as const).map((m) => (
              <button
                key={m}
                onClick={() => saveMode(m)}
                className={`px-4 py-2 rounded-lg text-sm capitalize ${
                  mode === m ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'glass text-gray-400'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Beginner mode emphasizes Tau Architect. Professional mode shows full IDE controls.
          </p>
        </section>

        <section className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Key className="w-4 h-4 text-cyan-400" /> Project Secrets</h3>
          <p className="text-xs text-gray-500 mb-4">Encrypted server-side. Use for GITHUB_TOKEN, API keys, database credentials.</p>
          {projectId && !projectId.startsWith('proj_') && projectId !== 'default' ? (
            <>
              <ul className="space-y-2 mb-4">
                {secrets.map((s) => (
                  <li key={s.id} className="flex items-center justify-between text-sm glass px-3 py-2 rounded-lg">
                    <code className="text-cyan-400">{s.key}</code>
                    <button onClick={() => removeSecret(s.key)} className="text-gray-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </li>
                ))}
                {secrets.length === 0 && <li className="text-xs text-gray-600">No secrets yet</li>}
              </ul>
              <div className="flex gap-2">
                <input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="KEY_NAME" className="flex-1 px-3 py-2 glass rounded-lg border border-white/10 text-sm" />
                <input value={newValue} onChange={(e) => setNewValue(e.target.value)} type="password" placeholder="Value" className="flex-1 px-3 py-2 glass rounded-lg border border-white/10 text-sm" />
                <button onClick={addSecret} className="btn-primary text-sm"><Plus className="w-4 h-4" /></button>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-600">Sign in and select a synced project to manage secrets.</p>
          )}
        </section>

        <section className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><History className="w-4 h-4 text-cyan-400" /> Version History</h3>
          <ul className="space-y-2">
            {versions.map((v) => (
              <li key={v.id} className="flex items-center justify-between text-sm glass px-3 py-2 rounded-lg">
                <div>
                  <p className="text-white">{v.label || 'Snapshot'}</p>
                  <p className="text-xs text-gray-500">{new Date(v.created_at).toLocaleString()}</p>
                  {v.summary && <p className="text-xs text-gray-400 mt-1">{v.summary}</p>}
                </div>
                <button onClick={() => restoreVersion(v.id)} className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Restore
                </button>
              </li>
            ))}
            {versions.length === 0 && <li className="text-xs text-gray-600">No versions yet — snapshots created on sync and architect milestones.</li>}
          </ul>
        </section>

        <section className="card">
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-sm text-gray-400">Tau IDE v1.0 — Developer Platform (Sprint 3 Infrastructure)</p>
        </section>
      </div>
    </PlatformShell>
  );
}
