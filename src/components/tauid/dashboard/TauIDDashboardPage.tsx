'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, Key, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import TauIDAppShell from '@/components/tauid/shared/TauIDAppShell';
import TauIDUserAvatar from '@/components/tauid/shared/TauIDUserAvatar';
import { fetchTauIdProfile, sendVerifyEmail, confirmVerifyEmail } from '@/lib/tauid/api-client';
import type { TauIdProfile } from '@/lib/tauid/api-client';
import { tauIdConnectedApps } from '@/lib/tauid/assets';

export default function TauIDDashboardPage() {
  const [user, setUser] = useState<TauIdProfile | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [devCode, setDevCode] = useState<string | undefined>();
  const [verifyError, setVerifyError] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const load = () =>
    fetchTauIdProfile().then((data) => {
      if (data) setUser(data.user);
    });

  useEffect(() => {
    load();
  }, []);

  const handleSendVerify = async () => {
    setVerifyLoading(true);
    setVerifyError('');
    const result = await sendVerifyEmail();
    setVerifyLoading(false);
    if (!result.ok) {
      setVerifyError(result.error || 'Could not send code');
      return;
    }
    setDevCode(result.devCode);
    setShowVerify(true);
  };

  const handleConfirmVerify = async () => {
    setVerifyLoading(true);
    setVerifyError('');
    const result = await confirmVerifyEmail(verifyCode);
    setVerifyLoading(false);
    if (!result.ok) {
      setVerifyError(result.error || 'Invalid code');
      return;
    }
    setShowVerify(false);
    setVerifyCode('');
    load();
  };

  const displayName = user?.full_name || user?.username || 'Account';

  return (
    <TauIDAppShell active="dashboard">
      <div className="space-y-6 p-4 lg:p-8">
        {/* Profile hero */}
        <section className="rounded-xl border border-[#222228] bg-[#16161b] p-6">
          <div className="flex items-center gap-4">
            <TauIDUserAvatar name={displayName} email={user?.email} imageUrl={user?.avatar_url} size={64} />
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-bold text-white">{displayName}</h2>
              <p className="truncate text-sm text-[#71717a]">{user?.email}</p>
              <p className="text-xs text-[#a1a1aa]">@{user?.username}</p>
            </div>
            <span className="rounded-full border border-[rgba(255,184,0,0.3)] bg-[rgba(255,184,0,0.12)] px-3 py-1 text-xs font-semibold text-[#ffb800]">
              Tau ID
            </span>
          </div>
        </section>

        {/* Security status cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatusCard
            icon={<Mail className="h-5 w-5" />}
            label="Email"
            value={user?.email_verified ? 'Verified' : 'Unverified'}
            ok={Boolean(user?.email_verified)}
          />
          <StatusCard
            icon={<Shield className="h-5 w-5" />}
            label="Two-Factor"
            value={user?.mfa_enabled ? 'Enabled' : 'Disabled'}
            ok={Boolean(user?.mfa_enabled)}
          />
          <StatusCard
            icon={<Key className="h-5 w-5" />}
            label="SSO Token"
            value="Active"
            ok
          />
        </div>

        {/* Email verification banner */}
        {!user?.email_verified ? (
          <section className="rounded-xl border border-[rgba(255,184,0,0.3)] bg-[rgba(255,184,0,0.08)] p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#ffb800]" />
              <div className="flex-1">
                <h3 className="font-semibold text-white">Verify your email</h3>
                <p className="mt-1 text-sm text-[#a1a1aa]">
                  Secure your account and unlock full access across Tau apps.
                </p>
                {!showVerify ? (
                  <button
                    type="button"
                    onClick={handleSendVerify}
                    disabled={verifyLoading}
                    className="mt-3 rounded-lg bg-[#ffb800] px-4 py-2 text-sm font-semibold text-[#0d0d0f] disabled:opacity-60"
                  >
                    {verifyLoading ? 'Sending…' : 'Send verification code'}
                  </button>
                ) : (
                  <div className="mt-4 space-y-3">
                    {devCode ? (
                      <p className="text-xs text-[#ffb800]">Dev code: <strong>{devCode}</strong></p>
                    ) : null}
                    {verifyError ? <p className="text-xs text-red-400">{verifyError}</p> : null}
                    <input
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full max-w-[200px] rounded-lg border border-[rgba(255,184,0,0.35)] bg-[#0d0d0f] px-3 py-2 text-center tracking-[0.3em] text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleConfirmVerify}
                      disabled={verifyLoading || verifyCode.length < 6}
                      className="rounded-lg bg-[#ffb800] px-4 py-2 text-sm font-semibold text-[#0d0d0f] disabled:opacity-60"
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {/* Connected apps */}
        <section className="rounded-xl border border-[#222228] bg-[#16161b] p-6">
          <h3 className="text-lg font-semibold text-white">Connected Tau Apps</h3>
          <p className="mt-1 text-sm text-[#71717a]">Your Tau ID works across the ecosystem.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {tauIdConnectedApps.map((app) => (
              <Link
                key={app.name}
                href={app.href}
                className="flex items-center justify-between rounded-lg border border-[#222228] bg-[#0d0d0f] px-4 py-3 transition-colors hover:border-[rgba(255,184,0,0.3)]"
              >
                <div>
                  <p className="font-medium text-white">{app.name}</p>
                  <p className="text-xs text-[#71717a]">{app.description}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-[#71717a]" />
              </Link>
            ))}
          </div>
        </section>

        {/* Quick links */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/tauid/security"
            className="rounded-xl border border-[#222228] bg-[#16161b] p-4 text-sm text-[#a1a1aa] hover:border-[rgba(255,184,0,0.3)]"
          >
            <span className="font-semibold text-white">Security Center →</span>
            <p className="mt-1">Password, 2FA, and account protection</p>
          </Link>
          <Link
            href="/tauid/profiles"
            className="rounded-xl border border-[#222228] bg-[#16161b] p-4 text-sm text-[#a1a1aa] hover:border-[rgba(255,184,0,0.3)]"
          >
            <span className="font-semibold text-white">Identity Profiles →</span>
            <p className="mt-1">Manage work, personal, and developer personas</p>
          </Link>
        </div>
      </div>
    </TauIDAppShell>
  );
}

function StatusCard({
  icon,
  label,
  value,
  ok,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  ok: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#16161b] p-4">
      <div className="flex items-center gap-2 text-[#ffb800]">{icon}</div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#71717a]">{label}</p>
      <div className="mt-1 flex items-center gap-1.5">
        {ok ? <CheckCircle2 className="h-3.5 w-3.5 text-[#22c55e]" /> : <AlertCircle className="h-3.5 w-3.5 text-[#ffb800]" />}
        <p className={`text-sm font-medium ${ok ? 'text-[#22c55e]' : 'text-[#ffb800]'}`}>{value}</p>
      </div>
    </div>
  );
}
