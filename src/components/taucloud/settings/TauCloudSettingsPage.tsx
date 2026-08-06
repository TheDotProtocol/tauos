'use client';

import { useEffect, useRef, useState } from 'react';
import TauCloudAppShell from '@/components/taucloud/shared/TauCloudAppShell';
import StorageGaugeCard from '@/components/taucloud/shared/StorageGaugeCard';
import TwoFactorSettings from '@/components/taucloud/settings/TwoFactorSettings';
import TauCloudUserAvatar from '@/components/taucloud/shared/TauCloudUserAvatar';
import {
  changeTauCloudPassword,
  fetchTauCloudProfile,
  removeTauCloudAvatar,
  saveTauCloudProfile,
  uploadTauCloudAvatar,
} from '@/lib/taucloud/api-client';
import type { TauCloudProfile } from '@/lib/taucloud/types';

export default function TauCloudSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<TauCloudProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [avatarError, setAvatarError] = useState('');

  const loadProfile = () =>
    fetchTauCloudProfile()
      .then((p) => {
        if (!p) return;
        setProfile(p);
        setFullName(p.fullName);
        setUsername(p.username);
      })
      .catch(() => setError('Could not load profile'));

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    setError('');
    const result = await saveTauCloudProfile({ fullName, username });
    if (!result.ok) {
      setError(result.error || 'Save failed');
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    loadProfile();
  };

  const handlePasswordSave = async () => {
    setPasswordError('');
    if (!currentPassword || !newPassword) {
      setPasswordError('Enter your current and new password');
      return;
    }
    const result = await changeTauCloudPassword(currentPassword, newPassword);
    if (!result.ok) {
      setPasswordError(result.error || 'Password update failed');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  const handleAvatarPick = () => {
    setAvatarError('');
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploadingAvatar(true);
    setAvatarError('');
    const result = await uploadTauCloudAvatar(file);
    setUploadingAvatar(false);

    if (!result.ok) {
      setAvatarError(result.error || 'Upload failed');
      return;
    }

    setProfile((current) => (current ? { ...current, avatarUrl: result.avatarUrl } : current));
    loadProfile();
  };

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true);
    setAvatarError('');
    const result = await removeTauCloudAvatar();
    setUploadingAvatar(false);

    if (!result.ok) {
      setAvatarError(result.error || 'Could not remove photo');
      return;
    }

    setProfile((current) => (current ? { ...current, avatarUrl: null } : current));
    loadProfile();
  };

  const avatarName = profile?.fullName || profile?.username || profile?.email || 'Account';

  return (
    <TauCloudAppShell active="settings">
      <div className="grid gap-6 p-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-[#222228] bg-[#16161b] p-6">
            <h2 className="text-lg font-semibold text-white">Profile</h2>
            <p className="mt-1 text-sm text-[#71717a]">Personalize your vault identity and account details.</p>

            <div className="mt-6 flex flex-wrap items-center gap-6">
              <TauCloudUserAvatar
                name={avatarName}
                email={profile?.email}
                imageUrl={profile?.avatarUrl}
                size={96}
              />
              <div>
                <p className="text-xs text-[#71717a]">Recommended 256×256px · PNG, JPG, WEBP, HEIC · Max 5 MB</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleAvatarPick}
                    disabled={uploadingAvatar}
                    className="rounded-lg bg-[#ffb800] px-4 py-2 text-xs font-semibold text-[#0d0d0f] disabled:opacity-60"
                  >
                    {uploadingAvatar ? 'Uploading…' : profile?.avatarUrl ? 'Change photo' : 'Upload photo'}
                  </button>
                  {profile?.avatarUrl ? (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={uploadingAvatar}
                      className="rounded-lg border border-[#222228] px-4 py-2 text-xs font-medium text-red-400 hover:text-red-300 disabled:opacity-60"
                    >
                      Remove photo
                    </button>
                  ) : null}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.heic,.heif"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                {!profile?.avatarUrl ? <p className="mt-2 text-xs text-[#a1a1aa]">No profile photo yet</p> : null}
                {avatarError ? <p className="mt-2 text-xs text-red-400">{avatarError}</p> : null}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs text-[#71717a]">Full Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-2.5 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-[#71717a]">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-2.5 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-[#71717a]">Email</label>
                <input
                  value={profile?.email || ''}
                  readOnly
                  className="mt-1 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-2.5 text-sm text-[#71717a] outline-none"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="mt-5 rounded-lg bg-[#ffb800] px-4 py-2.5 text-sm font-semibold text-[#0d0d0f]"
            >
              {saved ? 'Saved' : 'Save Changes'}
            </button>
            {error ? <p className="mt-3 text-xs text-red-400">{error}</p> : null}
          </section>

          <section className="rounded-xl border border-[#222228] bg-[#16161b] p-6">
            <h2 className="text-lg font-semibold text-white">Password</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs text-[#71717a]">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-2.5 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-[#71717a]">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-2.5 text-sm text-white outline-none"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handlePasswordSave}
              className="mt-5 rounded-lg border border-[#222228] px-4 py-2.5 text-sm font-medium text-white"
            >
              {passwordSaved ? 'Password Updated' : 'Update Password'}
            </button>
            {passwordError ? <p className="mt-3 text-xs text-red-400">{passwordError}</p> : null}
          </section>

          <TwoFactorSettings />
        </div>

        {profile ? <StorageGaugeCard storage={profile.storage} /> : null}
      </div>
    </TauCloudAppShell>
  );
}
