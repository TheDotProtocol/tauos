'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Fingerprint } from 'lucide-react';
import TauIDAppShell from '@/components/tauid/shared/TauIDAppShell';
import { createIdentityProfile, deleteIdentityProfile, fetchTauIdProfile } from '@/lib/tauid/api-client';
import type { IdentityProfile } from '@/lib/tauid/api-client';

export default function TauIDProfilesPage() {
  const [profiles, setProfiles] = useState<IdentityProfile[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newProfile, setNewProfile] = useState({ profile_name: '', profile_type: 'personal' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () =>
    fetchTauIdProfile().then((data) => {
      if (data) setProfiles(data.profiles);
    });

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const result = await createIdentityProfile(newProfile);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Create failed');
      return;
    }
    setNewProfile({ profile_name: '', profile_type: 'personal' });
    setShowCreate(false);
    load();
  };

  const handleDelete = async (id: string) => {
    const result = await deleteIdentityProfile(id);
    if (!result.ok) {
      setError(result.error || 'Delete failed');
      return;
    }
    load();
  };

  return (
    <TauIDAppShell active="profiles">
      <div className="space-y-6 p-4 lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#71717a]">{profiles.length} profile{profiles.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-lg bg-[#ffb800] px-4 py-2 text-sm font-semibold text-[#0d0d0f]"
          >
            <Plus className="h-4 w-4" />
            New profile
          </button>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
        ) : null}

        {profiles.length === 0 ? (
          <div className="rounded-xl border border-[#222228] bg-[#16161b] py-16 text-center">
            <Fingerprint className="mx-auto h-12 w-12 text-[#71717a]" />
            <p className="mt-4 text-[#a1a1aa]">No identity profiles yet</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <div key={profile.id} className="rounded-xl border border-[#222228] bg-[#16161b] p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white">{profile.profile_name}</h3>
                    <p className="mt-1 capitalize text-sm text-[#71717a]">{profile.profile_type}</p>
                  </div>
                  {profile.is_primary ? (
                    <span className="rounded-full bg-[rgba(255,184,0,0.12)] px-2 py-0.5 text-[10px] font-semibold text-[#ffb800]">
                      Primary
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDelete(profile.id)}
                      className="text-[#71717a] hover:text-red-400"
                      aria-label="Delete profile"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="mt-3 text-[11px] text-[#71717a]">
                  Created {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {showCreate ? (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
            <div className="w-full max-w-md rounded-[20px] border border-[#222228] bg-[#16161b] p-6">
              <h3 className="text-lg font-semibold text-white">Create profile</h3>
              <form onSubmit={handleCreate} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#a1a1aa]">Profile name</label>
                  <input
                    value={newProfile.profile_name}
                    onChange={(e) => setNewProfile({ ...newProfile, profile_name: e.target.value })}
                    required
                    className="mt-2 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-3 text-sm text-white outline-none"
                    placeholder="Work, Personal…"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#a1a1aa]">Type</label>
                  <select
                    value={newProfile.profile_type}
                    onChange={(e) => setNewProfile({ ...newProfile, profile_type: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-3 text-sm text-white outline-none"
                  >
                    <option value="personal">Personal</option>
                    <option value="business">Business</option>
                    <option value="developer">Developer</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="flex-1 rounded-lg border border-[#222228] py-2.5 text-sm text-[#a1a1aa]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-[#ffb800] py-2.5 text-sm font-semibold text-[#0d0d0f] disabled:opacity-60"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </TauIDAppShell>
  );
}
