'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { geistMono, geistSans, outfit } from '@/lib/website/fonts';
import { tauMailAssets } from '@/lib/taumail/assets';
import TauMailAppShell from '@/components/taumail/shared/TauMailAppShell';
import { MailIcon } from '@/components/taumail/shared/MailIcon';
import { useTauMailSession } from '@/hooks/useTauMailSession';
import { DEMO_USER } from '@/lib/taumail-demo';
import { fetchTauMailProfile, saveTauMailProfile, type TauMailProfile } from '@/lib/taumail/api-client';

const settingsSections = [
  'Profile',
  'Theme',
  'Language',
  'Notifications',
  'Security & Keys',
  'Privacy',
  'Devices',
  'Connected Apps',
  'Email Signature',
  'Aliases',
  'Auto Reply',
  'Forwarding',
  'Filters & Rules',
] as const;

const profileFields = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'displayName', label: 'Display Name' },
  { key: 'email', label: 'Email Address' },
  { key: 'organization', label: 'Organization' },
  { key: 'title', label: 'Title' },
] as const;

type ProfileForm = TauMailProfile;

const connectedServices = ['Tau ID Core', 'Tau Cloud Storage', 'Tau Talk Terminal'];

export default function TauMailSettingsPage() {
  const { ready, isLoggedIn, user, logout, isDemo } = useTauMailSession();
  const [activeSection, setActiveSection] = useState<(typeof settingsSections)[number]>('Profile');
  const [serverStatus, setServerStatus] = useState<string>('checking...');
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [profile, setProfile] = useState<ProfileForm>({
    fullName: '',
    displayName: '',
    email: '',
    organization: '',
    title: '',
    timezone: '(UTC-05:00) Eastern Time (US & Canada)',
  });

  useEffect(() => {
    if (!ready || !user) return;

    if (isDemo) {
      setProfile({
        fullName: user.fullName || DEMO_USER.fullName,
        displayName: user.username || DEMO_USER.username,
        email: user.email || DEMO_USER.email,
        organization: 'Tau Core Laboratories',
        title: 'Senior System Protocol Engineer',
        timezone: '(UTC-05:00) Eastern Time (US & Canada)',
      });
      return;
    }

    fetchTauMailProfile()
      .then((apiProfile) => {
        if (!apiProfile) return;
        setProfile(apiProfile);
      })
      .catch(() => {
        setProfile({
          fullName: user.fullName || '',
          displayName: user.username || '',
          email: user.email || '',
          organization: '',
          title: '',
          timezone: '(UTC-05:00) Eastern Time (US & Canada)',
        });
      });
  }, [ready, user, isDemo]);

  useEffect(() => {
    fetch('/api/taumail/server/status')
      .then((r) => r.json())
      .then((d) => setServerStatus(d.status || d.message || 'online'))
      .catch(() => setServerStatus('offline'));
  }, []);

  const handleSave = async () => {
    setSaveError('');
    if (isDemo) {
      localStorage.setItem('tauos_user', JSON.stringify({
        ...user,
        fullName: profile.fullName,
        email: profile.email,
        username: profile.displayName,
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return;
    }

    const result = await saveTauMailProfile(profile);
    if (!result.ok) {
      setSaveError(result.error || 'Failed to save profile');
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!ready || !isLoggedIn) {
    return <div className={`${geistSans.className} flex min-h-screen items-center justify-center bg-[#070708] text-[#a1a1aa]`}>Loading...</div>;
  }

  return (
    <TauMailAppShell active="settings" userName={profile.displayName} userEmail={profile.email}>
      <div className={`${geistSans.className} flex min-h-0 flex-1`}>
        <aside className="w-[240px] shrink-0 overflow-y-auto border-r border-[rgba(255,255,255,0.05)] p-6">
          <p className={`${geistMono.className} text-[10px] font-bold uppercase text-[#71717a]`}>App Settings</p>
          <div className="mt-3 space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={clsx(
                  'w-full rounded-md px-3 py-2 text-left text-[13px]',
                  activeSection === section
                    ? 'border border-[rgba(212,168,67,0.15)] bg-[rgba(212,168,67,0.08)] font-semibold text-[#d4a843]'
                    : 'font-medium text-[#a1a1aa] hover:text-white',
                )}
              >
                {section}
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0 flex-1 overflow-y-auto p-8">
          {activeSection === 'Profile' ? (
            <>
              <h1 className={`${outfit.className} text-[28px] font-bold text-white`}>Profile Settings</h1>
              <p className="mt-1 text-sm text-[#a1a1aa]">
                Manage your personal metadata, cryptographic signatures, and platform identification.
              </p>

              <div className="mt-8 flex items-center gap-6">
                <div className="relative">
                  <Image src={tauMailAssets.avatars.userSidebar} alt="" width={96} height={96} className="size-24 rounded-full object-cover" />
                  <button type="button" className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-xs font-semibold text-white">
                    CHANGE
                  </button>
                </div>
                <p className="text-xs text-[#71717a]">Recommended 256×256px · PNG, JPG, WEBP</p>
              </div>

              <div className="mt-8 divide-y divide-[rgba(255,255,255,0.05)] rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#121214]">
                {profileFields.map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#71717a]">{label}</p>
                      <input
                        value={profile[key]}
                        onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                        className="mt-1 w-full bg-transparent text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label className="text-xs text-[#71717a]">Timezone</label>
                <select
                  value={profile.timezone}
                  onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
                  className="mt-2 w-full max-w-md rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214] px-3 py-2.5 text-sm text-white outline-none"
                >
                  <option value="(UTC-05:00) Eastern Time (US & Canada)">(UTC-05:00) Eastern Time (US & Canada)</option>
                  <option value="(UTC+00:00) UTC">(UTC+00:00) UTC</option>
                  <option value="(UTC+05:30) India Standard Time">(UTC+05:30) India Standard Time</option>
                </select>
              </div>

              <div className="mt-8">
                <p className="text-sm font-semibold text-white">Connected Tau Services</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {connectedServices.map((svc) => (
                    <span key={svc} className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.05)] bg-[#121214] px-3 py-1.5 text-xs text-[#a1a1aa]">
                      <MailIcon src={tauMailAssets.icons.statusSuccess} size={6} />
                      {svc}
                    </span>
                  ))}
                </div>
                <p className={`${geistMono.className} mt-4 text-[11px] text-[#71717a]`}>
                  Mail server: {serverStatus} {isDemo ? '· demo session' : ''}
                </p>
              </div>

              <div className="mt-8 flex gap-3">
                <button type="button" onClick={handleSave} className="rounded-lg bg-[#d4a843] px-5 py-2.5 text-sm font-semibold text-[#070708]">
                  {saved ? 'Saved' : 'Save Changes'}
                </button>
                <button type="button" onClick={logout} className="rounded-lg border border-[rgba(255,255,255,0.05)] px-5 py-2.5 text-sm font-medium text-white">
                  Sign Out
                </button>
              </div>
              {saveError ? <p className="mt-3 text-xs text-red-400">{saveError}</p> : null}

              <div className="mt-10 rounded-xl border border-red-500/30 bg-red-500/5 p-6">
                <p className="text-sm font-semibold text-red-400">Danger Zone</p>
                <p className="mt-1 text-xs text-[#a1a1aa]">
                  Irreversibly delete your entire telemetry data, cryptography nodes, and email archives.
                </p>
                <button type="button" className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white">
                  Delete Account
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className={`${outfit.className} text-[28px] font-bold text-white`}>{activeSection}</h1>
              <p className="mt-2 text-sm text-[#a1a1aa]">Settings for {activeSection.toLowerCase()} will be available in a future release.</p>
            </>
          )}
        </div>
      </div>
    </TauMailAppShell>
  );
}
