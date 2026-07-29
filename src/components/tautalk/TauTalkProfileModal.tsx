'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Camera } from 'lucide-react';
import TauTalkAvatar from '@/components/tautalk/TauTalkAvatar';
import { fetchProfile, updateProfile, uploadAvatar, type TalkProfile } from '@/lib/tautalk-web-api';
import { TAU_USER_KEY } from '@/lib/tau-auth-constants';

type Props = {
  token: string;
  open: boolean;
  onClose: () => void;
  onUpdated: (profile: TalkProfile) => void;
};

export default function TauTalkProfileModal({ token, open, onClose, onUpdated }: Props) {
  const [profile, setProfile] = useState<TalkProfile | null>(null);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || !token) return;
    setLoading(true);
    setError('');
    fetchProfile(token)
      .then((p) => {
        setProfile(p);
        setUsername(p.username);
        setFullName(p.fullName);
        setAvatarUrl(p.avatarUrl ?? null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load profile'))
      .finally(() => setLoading(false));
  }, [open, token]);

  const persistUser = (p: TalkProfile) => {
    localStorage.setItem(
      TAU_USER_KEY,
      JSON.stringify({
        id: p.id,
        username: p.username,
        email: p.email,
        fullName: p.fullName,
        avatarUrl: p.avatarUrl,
      })
    );
    onUpdated(p);
  };

  const onPickAvatar = async (file: File) => {
    setSaving(true);
    setError('');
    try {
      const p = await uploadAvatar(token, file);
      setAvatarUrl(p.avatarUrl ?? null);
      setProfile(p);
      persistUser(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Avatar upload failed');
    } finally {
      setSaving(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const p = await updateProfile(token, {
        username: username.replace(/^@/, '').trim(),
        fullName: fullName.trim(),
      });
      const merged = { ...p, avatarUrl: p.avatarUrl ?? avatarUrl };
      setProfile(merged);
      persistUser(merged);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Your profile</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {loading ? (
            <p className="text-center text-gray-400 py-8">Loading profile…</p>
          ) : (
            <>
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="relative group"
                  disabled={saving}
                >
                  <TauTalkAvatar name={fullName || username} imageUrl={avatarUrl} size={88} />
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onPickAvatar(f);
                  }}
                />
                <p className="text-xs text-gray-500">Tap photo to change</p>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1.5 w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  placeholder="yourname"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Display name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5 w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  placeholder="Your name"
                />
              </div>

              {profile?.email ? (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
                  <p className="mt-1.5 text-gray-400">{profile.email}</p>
                </div>
              ) : null}

              {error ? <p className="text-sm text-red-400 text-center">{error}</p> : null}

              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="w-full py-3 rounded-xl bg-green-500 text-black font-semibold disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
