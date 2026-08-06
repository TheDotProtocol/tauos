'use client';

import { useEffect, useState } from 'react';
import TauIDAppShell from '@/components/tauid/shared/TauIDAppShell';
import TauIDUserAvatar from '@/components/tauid/shared/TauIDUserAvatar';
import { fetchTauIdProfile, saveTauIdProfile } from '@/lib/tauid/api-client';
import type { TauIdProfile } from '@/lib/tauid/api-client';

export default function TauIDSettingsPage() {
  const [profile, setProfile] = useState<TauIdProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = () =>
    fetchTauIdProfile().then((data) => {
      if (!data) return;
      setProfile(data.user);
      setFullName(data.user.full_name || '');
      setUsername(data.user.username || '');
    });

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const result = await saveTauIdProfile({ full_name: fullName, username });
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Save failed');
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    load();
  };

  const displayName = profile?.full_name || profile?.username || 'Account';

  return (
    <TauIDAppShell active="settings">
      <div className="space-y-6 p-4 lg:p-8">
        <section className="rounded-xl border border-[#222228] bg-[#16161b] p-6">
          <div className="flex items-center gap-4">
            <TauIDUserAvatar name={displayName} email={profile?.email} imageUrl={profile?.avatar_url} size={56} />
            <div>
              <h2 className="text-lg font-semibold text-white">{displayName}</h2>
              <p className="text-sm text-[#71717a]">{profile?.email}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#222228] bg-[#16161b] p-6">
          <h2 className="text-lg font-semibold text-white">Profile details</h2>
          <form onSubmit={handleSave} className="mt-5 space-y-4">
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            {saved ? <p className="text-sm text-[#22c55e]">Profile saved.</p> : null}
            <div>
              <label className="text-xs font-semibold text-[#a1a1aa]">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-3 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#a1a1aa]">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-3 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#a1a1aa]">Email</label>
              <input
                value={profile?.email || ''}
                disabled
                className="mt-2 w-full rounded-lg border border-[#222228] bg-[#0d0d0f]/50 px-3 py-3 text-sm text-[#71717a] outline-none"
              />
              <p className="mt-1 text-[11px] text-[#71717a]">
                {profile?.email_verified ? '✓ Verified' : 'Not verified — verify from Dashboard'}
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#ffb800] px-5 py-2.5 text-sm font-semibold text-[#0d0d0f] disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </section>
      </div>
    </TauIDAppShell>
  );
}
