'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getStoredUser, clearSession, storeSession, getStoredToken } from '@/lib/tau-ide/auth-client';
import { getActiveProjectId, loadProjects } from '@/lib/tau-ide/projects';
import { apiFetch } from '@/lib/tau-ide/sync-client';
import { tauAuthHeaders, tauFetchCredentials } from '@/lib/tau-auth-client';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { tauDev } from '@/lib/tau-developer/theme';

type SecretMeta = { id: string; key: string; created_at: string };
type Version = { id: string; label: string; created_at: string; summary?: string };

const SUB_NAV = [
  { id: 'profile', label: 'Profile Setup', active: true },
  { id: 'team', label: 'Team Permissions' },
  { id: 'security', label: 'Security & Credentials' },
  { id: 'webhooks', label: 'Webhook Notifications' },
  { id: 'integrations', label: 'Platform Integrations' },
  { id: 'danger', label: 'Danger Zone', danger: true },
];

const DEFAULT_AVATAR = '/tau-developer/avatars/default.png';

export default function DeveloperSettingsContent() {
  const [user, setUser] = useState<{ email?: string; username?: string; fullName?: string } | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [timezone] = useState('UTC-5 (EST) Eastern Standard');
  const [twoFa, setTwoFa] = useState(true);
  const [secrets, setSecrets] = useState<SecretMeta[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [projectId, setProjectId] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [webhooks, setWebhooks] = useState<{ id: string; url: string; events: string[]; active: boolean }[]>([]);
  const [integrations, setIntegrations] = useState<{ id: string; provider: string; connected_at: string }[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [twoFaCode, setTwoFaCode] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const u = getStoredUser();
    setUser(u);
    if (u?.fullName) setDisplayName(u.fullName);
    if (u?.email) setEmail(u.email);

    fetch('/api/tauid/user/profile', {
      credentials: tauFetchCredentials,
      headers: tauAuthHeaders(),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        const profile = data.user;
        if (!profile) return;
        setDisplayName(profile.full_name ?? profile.username ?? '');
        setEmail(profile.email ?? '');
        setAvatarUrl(profile.avatar_url ?? null);
        setTwoFa(Boolean(profile.mfa_enabled));
        setUser({
          email: profile.email,
          username: profile.username,
          fullName: profile.full_name,
        });
      })
      .catch(() => {
        /* fall back to local session */
      });

    loadProjects().then(() => {
      const id = getActiveProjectId();
      setProjectId(id);
      if (id && id !== 'default' && !id.startsWith('proj_')) {
        loadSecrets(id);
        loadVersions(id);
      }
    });

    fetch('/api/tau-ide/teams', { credentials: tauFetchCredentials, headers: tauAuthHeaders() })
      .then((r) => (r.ok ? r.json() : { teams: [] }))
      .then((d) => setTeams(d.teams ?? []));
    fetch('/api/developers/webhooks', { credentials: tauFetchCredentials, headers: tauAuthHeaders() })
      .then((r) => (r.ok ? r.json() : { webhooks: [] }))
      .then((d) => setWebhooks(d.webhooks ?? []));
    fetch('/api/developers/integrations', { credentials: tauFetchCredentials, headers: tauAuthHeaders() })
      .then((r) => (r.ok ? r.json() : { connected: [] }))
      .then((d) => setIntegrations(d.connected ?? []));
  }, []);

  const loadSecrets = async (id: string) => {
    try {
      const data = await apiFetch<{ secrets: SecretMeta[] }>(`/api/tau-ide/projects/${id}/secrets`);
      setSecrets(data.secrets ?? []);
    } catch {
      /* skip */
    }
  };

  const loadVersions = async (id: string) => {
    try {
      const data = await apiFetch<{ versions: Version[] }>(`/api/tau-ide/projects/${id}/versions`);
      setVersions(data.versions ?? []);
    } catch {
      /* skip */
    }
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

  const onAvatarPick = () => fileInputRef.current?.click();

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingAvatar(true);
    setSaveMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/taucloud/profile/avatar', {
        method: 'POST',
        credentials: tauFetchCredentials,
        headers: tauAuthHeaders(),
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      setAvatarUrl(data.avatarUrl ?? null);
      const stored = getStoredUser();
      if (stored) {
        storeSession(getStoredToken() ?? '', {
          ...stored,
          fullName: displayName || stored.fullName,
        });
      }
      setSaveMessage('Profile photo updated.');
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : 'Could not upload photo.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveProfile = async () => {
    if (!user) {
      router.push('/developers/login');
      return;
    }
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/tauid/user/profile', {
        method: 'PUT',
        credentials: tauFetchCredentials,
        headers: { 'Content-Type': 'application/json', ...tauAuthHeaders() },
        body: JSON.stringify({ full_name: displayName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Save failed');
      const stored = getStoredUser();
      if (stored && data.user) {
        storeSession(getStoredToken() ?? '', {
          ...stored,
          fullName: data.user.full_name ?? displayName,
          username: data.user.username ?? stored.username,
          email: data.user.email ?? stored.email,
        });
      }
      setUser((prev) => ({
        ...prev,
        fullName: data.user?.full_name ?? displayName,
      }));
      setSaveMessage('Profile saved.');
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  const toggle2Fa = async () => {
    if (!user) return;
    const enabling = !twoFa;
    if (enabling && !twoFaCode) {
      const setup = await fetch('/api/tauid/profile/2fa', {
        method: 'POST',
        credentials: tauFetchCredentials,
        headers: { 'Content-Type': 'application/json', ...tauAuthHeaders() },
        body: JSON.stringify({ action: 'setup' }),
      });
      const setupData = await setup.json();
      if (setup.ok) {
        setSaveMessage('Scan the OTP URI in your authenticator, then enter the 6-digit code below and toggle again.');
        if (setupData.otpauthUrl) window.open(setupData.otpauthUrl, '_blank');
      } else {
        setSaveMessage(setupData.error ?? '2FA setup failed');
      }
      return;
    }
    const code = twoFaCode || window.prompt(enabling ? 'Enter 6-digit authenticator code' : 'Confirm with authenticator code') || '';
    if (!code) return;
    const res = await fetch('/api/tauid/profile/2fa', {
      method: 'POST',
      credentials: tauFetchCredentials,
      headers: { 'Content-Type': 'application/json', ...tauAuthHeaders() },
      body: JSON.stringify({ action: enabling ? 'enable' : 'disable', code }),
    });
    const data = await res.json();
    if (res.ok) {
      setTwoFa(Boolean(data.enabled));
      setTwoFaCode('');
      setSaveMessage(enabling ? '2FA enabled.' : '2FA disabled.');
    } else {
      setSaveMessage(data.error ?? '2FA update failed');
    }
  };

  const createTeam = async () => {
    if (!newTeamName.trim()) return;
    await fetch('/api/tau-ide/teams', {
      method: 'POST',
      credentials: tauFetchCredentials,
      headers: { 'Content-Type': 'application/json', ...tauAuthHeaders() },
      body: JSON.stringify({ name: newTeamName.trim() }),
    });
    setNewTeamName('');
    const d = await fetch('/api/tau-ide/teams', { credentials: tauFetchCredentials, headers: tauAuthHeaders() }).then((r) => r.json());
    setTeams(d.teams ?? []);
  };

  const addWebhook = async () => {
    if (!webhookUrl.trim()) return;
    await fetch('/api/developers/webhooks', {
      method: 'POST',
      credentials: tauFetchCredentials,
      headers: { 'Content-Type': 'application/json', ...tauAuthHeaders() },
      body: JSON.stringify({ url: webhookUrl.trim(), events: ['deploy', 'build'] }),
    });
    setWebhookUrl('');
    const d = await fetch('/api/developers/webhooks', { credentials: tauFetchCredentials, headers: tauAuthHeaders() }).then((r) => r.json());
    setWebhooks(d.webhooks ?? []);
  };

  const logout = () => {
    clearSession();
    router.push('/developers/login');
  };

  const avatarSrc = avatarUrl || DEFAULT_AVATAR;

  return (
    <div className={`${geistSans.className} flex gap-5 p-8`}>
      <nav
        className="hidden w-[240px] shrink-0 flex-col gap-1 rounded-xl border p-4 md:flex"
        style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
      >
        {SUB_NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveSection(item.id)}
            className={`rounded-md p-2.5 text-left text-[13px] ${
              activeSection === item.id
                ? 'font-semibold text-[#f5a623]'
                : item.danger
                  ? 'font-medium text-[#ef4444]'
                  : 'font-medium text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
            style={activeSection === item.id ? { backgroundColor: tauDev.goldMuted } : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex min-w-0 flex-1 flex-col gap-5">
        {(activeSection === 'profile' || activeSection === 'security') && (
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
        >
          <p className="mb-5 text-sm font-semibold text-[#fafafa]">Personal Profile Credentials</p>
          <div className="mb-5 flex items-center gap-4">
            <div className="relative size-12 overflow-hidden rounded-full" style={{ backgroundColor: tauDev.goldMuted }}>
              <Image
                src={avatarSrc}
                alt="Profile"
                fill
                className="object-cover"
                unoptimized={avatarSrc.startsWith('http') || avatarSrc.includes('blob')}
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/heic"
              className="hidden"
              onChange={onAvatarChange}
            />
            <button
              type="button"
              onClick={onAvatarPick}
              disabled={uploadingAvatar || !user}
              className="rounded-md border px-3.5 py-2 text-xs font-semibold text-[#fafafa] disabled:opacity-50"
              style={{ backgroundColor: tauDev.surfaceElevated, borderColor: tauDev.border }}
            >
              {uploadingAvatar ? 'Uploading…' : 'Change photo'}
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <Field label="Display Name" value={displayName} onChange={setDisplayName} />
            <Field label="Work Email Address" value={email} onChange={setEmail} readOnly />
            <Field label="Developer Timezone" value={timezone} readOnly />
          </div>
          {!user && (
            <p className="mt-4 text-xs text-[#a1a1aa]">
              Not signed in.{' '}
              <Link href="/developers/login" className="text-[#f5a623] hover:underline">
                Sign in
              </Link>{' '}
              to sync projects.
            </p>
          )}
        </div>
        )}

        {(activeSection === 'profile' || activeSection === 'security') && (
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
        >
          <p className="mb-4 text-sm font-semibold text-[#fafafa]">Security Credentials & 2FA</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[#fafafa]">Two-Factor Authentication (2FA)</p>
              <p className="text-xs text-[#a1a1aa]">Enforce secondary authenticator validation.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={twoFa}
              onClick={toggle2Fa}
              className="relative h-6 w-11 rounded-full transition-colors"
              style={{ backgroundColor: twoFa ? tauDev.success : tauDev.textDim }}
            >
              <span
                className="absolute top-0.5 size-5 rounded-full bg-white transition-transform"
                style={{ left: twoFa ? '22px' : '2px' }}
              />
            </button>
          </div>
          <input
            value={twoFaCode}
            onChange={(e) => setTwoFaCode(e.target.value)}
            placeholder="6-digit authenticator code (after setup)"
            className="mt-3 w-full rounded-md border bg-transparent px-3 py-2 text-xs text-[#fafafa]"
            style={{ borderColor: tauDev.border, backgroundColor: tauDev.surfaceElevated }}
          />
        </div>
        )}

        {activeSection === 'team' && (
          <div className="rounded-xl border p-5" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
            <p className="mb-3 text-sm font-semibold text-[#fafafa]">Team Permissions</p>
            <ul className="mb-3 flex flex-col gap-2">
              {teams.map((t) => (
                <li key={t.id} className="text-sm text-[#a1a1aa]">{t.name}</li>
              ))}
              {teams.length === 0 && <li className="text-xs text-[#52525b]">No teams yet</li>}
            </ul>
            <div className="flex gap-2">
              <input value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="Team name" className="flex-1 rounded-md border bg-transparent px-3 py-2 text-xs text-[#fafafa]" style={{ borderColor: tauDev.border, backgroundColor: tauDev.surfaceElevated }} />
              <button type="button" onClick={createTeam} className="rounded-md px-4 py-2 text-xs font-semibold text-[#060608]" style={{ backgroundColor: tauDev.gold }}>Create</button>
            </div>
          </div>
        )}

        {activeSection === 'webhooks' && (
          <div className="rounded-xl border p-5" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
            <p className="mb-3 text-sm font-semibold text-[#fafafa]">Webhook Notifications</p>
            <ul className="mb-3 flex flex-col gap-2">
              {webhooks.map((w) => (
                <li key={w.id} className={`${geistMono.className} text-xs text-[#f5a623]`}>{w.url}</li>
              ))}
              {webhooks.length === 0 && <li className="text-xs text-[#52525b]">No webhooks configured</li>}
            </ul>
            <div className="flex gap-2">
              <input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://hooks.example.com/tau" className="flex-1 rounded-md border bg-transparent px-3 py-2 text-xs text-[#fafafa]" style={{ borderColor: tauDev.border, backgroundColor: tauDev.surfaceElevated }} />
              <button type="button" onClick={addWebhook} className="rounded-md px-4 py-2 text-xs font-semibold text-[#060608]" style={{ backgroundColor: tauDev.gold }}>Add</button>
            </div>
          </div>
        )}

        {activeSection === 'integrations' && (
          <div className="rounded-xl border p-5" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
            <p className="mb-3 text-sm font-semibold text-[#fafafa]">Platform Integrations</p>
            {['github', 'slack', 'datadog', 'vercel'].map((p) => {
              const connected = integrations.some((i) => i.provider === p);
              return (
                <div key={p} className="flex items-center justify-between border-b py-3 last:border-0" style={{ borderColor: tauDev.border }}>
                  <span className="text-sm capitalize text-[#fafafa]">{p}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      if (connected) {
                        await fetch(`/api/developers/integrations?provider=${p}`, { method: 'DELETE', credentials: tauFetchCredentials, headers: tauAuthHeaders() });
                      } else {
                        await fetch('/api/developers/integrations', {
                          method: 'POST',
                          credentials: tauFetchCredentials,
                          headers: { 'Content-Type': 'application/json', ...tauAuthHeaders() },
                          body: JSON.stringify({ provider: p, config: { connected: true } }),
                        });
                      }
                      const d = await fetch('/api/developers/integrations', { credentials: tauFetchCredentials, headers: tauAuthHeaders() }).then((r) => r.json());
                      setIntegrations(d.connected ?? []);
                    }}
                    className="text-xs font-semibold"
                    style={{ color: connected ? '#ef4444' : tauDev.gold }}
                  >
                    {connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeSection === 'danger' && (
          <div className="rounded-xl border p-5" style={{ backgroundColor: tauDev.surface, borderColor: '#ef4444' }}>
            <p className="mb-2 text-sm font-semibold text-[#ef4444]">Danger Zone</p>
            <p className="text-xs text-[#a1a1aa]">Sign out and revoke local session. Account deletion is managed in Tau ID.</p>
            <button type="button" onClick={logout} className="mt-4 rounded-md border border-[#ef4444] px-4 py-2 text-xs font-semibold text-[#ef4444]">Sign out everywhere</button>
          </div>
        )}

        {(activeSection === 'security' || secrets.length > 0) && projectId && !projectId.startsWith('proj_') && projectId !== 'default' && (
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
          >
            <p className="mb-3 text-sm font-semibold text-[#fafafa]">Project Secrets</p>
            <ul className="mb-3 flex flex-col gap-2">
              {secrets.map((s) => (
                <li key={s.id} className={`${geistMono.className} text-xs text-[#f5a623]`}>
                  {s.key}
                </li>
              ))}
              {secrets.length === 0 && <li className="text-xs text-[#52525b]">No secrets yet</li>}
            </ul>
            <div className="flex flex-wrap gap-2">
              <input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="KEY_NAME"
                className="min-w-[120px] flex-1 rounded-md border bg-transparent px-3 py-2 text-xs text-[#fafafa]"
                style={{ borderColor: tauDev.border, backgroundColor: tauDev.surfaceElevated }}
              />
              <input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                type="password"
                placeholder="Value"
                className="min-w-[120px] flex-1 rounded-md border bg-transparent px-3 py-2 text-xs text-[#fafafa]"
                style={{ borderColor: tauDev.border, backgroundColor: tauDev.surfaceElevated }}
              />
              <button
                type="button"
                onClick={addSecret}
                className="rounded-md px-4 py-2 text-xs font-semibold text-[#060608]"
                style={{ backgroundColor: tauDev.gold }}
              >
                Add
              </button>
            </div>
            {versions.length > 0 && (
              <div className="mt-4 border-t pt-4" style={{ borderColor: tauDev.border }}>
                <p className="mb-2 text-xs font-semibold text-[#fafafa]">Version History</p>
                {versions.slice(0, 3).map((v) => (
                  <p key={v.id} className="text-xs text-[#a1a1aa]">
                    {v.label || 'Snapshot'} — {new Date(v.created_at).toLocaleDateString()}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className={`${geistMono.className} text-[11px] text-[#52525b]`}>
            {saveMessage ?? 'Developer Dark Mode Activated Natively'}
          </p>
          <div className="flex gap-3">
            {user && (
              <button type="button" onClick={logout} className="text-xs text-[#a1a1aa] hover:text-[#fafafa]">
                Sign out
              </button>
            )}
            <button
              type="button"
              onClick={saveProfile}
              disabled={saving || !user}
              className="rounded-lg px-6 py-2.5 text-[13px] font-semibold text-[#060608] disabled:opacity-50"
              style={{ backgroundColor: tauDev.gold }}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-[#52525b]">{label}</label>
      {readOnly ? (
        <div
          className="rounded-md border p-2.5 text-[13px] text-[#fafafa]"
          style={{ backgroundColor: tauDev.surfaceElevated, borderColor: tauDev.border }}
        >
          {value || '—'}
        </div>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="rounded-md border bg-transparent p-2.5 text-[13px] text-[#fafafa] focus:outline-none"
          style={{ backgroundColor: tauDev.surfaceElevated, borderColor: tauDev.border }}
        />
      )}
    </div>
  );
}
