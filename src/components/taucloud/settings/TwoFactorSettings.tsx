'use client';

import { useEffect, useState } from 'react';
import { inter } from '@/lib/website/fonts';
import {
  disableTauCloud2fa,
  enableTauCloud2fa,
  fetchTauCloud2faStatus,
  setupTauCloud2fa,
} from '@/lib/taucloud/api-client';

export default function TwoFactorSettings() {
  const [enabled, setEnabled] = useState(false);
  const [email, setEmail] = useState('');
  const [setupSecret, setSetupSecret] = useState('');
  const [otpauthUrl, setOtpauthUrl] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () =>
    fetchTauCloud2faStatus()
      .then((status) => {
        setEnabled(status.enabled);
        setEmail(status.email);
      })
      .catch(() => setError('Could not load 2FA status'));

  useEffect(() => {
    load();
  }, []);

  const handleSetup = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    const result = await setupTauCloud2fa();
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Setup failed');
      return;
    }
    setSetupSecret(result.secret);
    setOtpauthUrl(result.otpauthUrl);
    setMessage('Scan the setup key in your authenticator app, then enter the 6-digit code.');
  };

  const handleEnable = async () => {
    setLoading(true);
    setError('');
    const result = await enableTauCloud2fa(code);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Could not enable 2FA');
      return;
    }
    setEnabled(true);
    setSetupSecret('');
    setOtpauthUrl('');
    setCode('');
    setMessage('Two-factor authentication is now enabled.');
  };

  const handleDisable = async () => {
    setLoading(true);
    setError('');
    const result = await disableTauCloud2fa(code);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Could not disable 2FA');
      return;
    }
    setEnabled(false);
    setCode('');
    setMessage('Two-factor authentication has been disabled.');
  };

  return (
    <section className="rounded-xl border border-[#222228] bg-[#16161b] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className={`${inter.className} text-lg font-semibold text-white`}>Two-Factor Authentication</h2>
          <p className="mt-2 max-w-xl text-sm text-[#71717a]">
            Protect your Tau Cloud vault with a time-based code from Google Authenticator, 1Password, or Authy.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            enabled ? 'bg-[rgba(34,197,94,0.12)] text-[#22c55e]' : 'bg-[rgba(255,184,0,0.12)] text-[#ffb800]'
          }`}
        >
          {enabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>

      {message ? <p className="mt-4 text-sm text-[#ffb800]">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

      {!enabled ? (
        <div className="mt-5 space-y-4">
          {!setupSecret ? (
            <button
              type="button"
              disabled={loading}
              onClick={handleSetup}
              className="rounded-lg bg-[#ffb800] px-4 py-2.5 text-sm font-semibold text-[#0d0d0f] disabled:opacity-60"
            >
              Set Up Authenticator
            </button>
          ) : (
            <div className="space-y-4 rounded-lg border border-[#222228] bg-[#0d0d0f] p-4">
              <div>
                <p className="text-xs text-[#71717a]">Account</p>
                <p className="text-sm text-white">{email}</p>
              </div>
              <div>
                <p className="text-xs text-[#71717a]">Setup key</p>
                <p className="break-all font-mono text-sm text-[#ffb800]">{setupSecret}</p>
              </div>
              <div>
                <p className="text-xs text-[#71717a]">Authenticator URI</p>
                <p className="break-all text-xs text-[#a1a1aa]">{otpauthUrl}</p>
              </div>
              <div>
                <label className="text-xs text-[#71717a]">Verification code</label>
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="mt-1 w-full max-w-xs rounded-lg border border-[#222228] bg-[#16161b] px-3 py-2.5 text-sm text-white outline-none"
                />
              </div>
              <button
                type="button"
                disabled={loading || code.length < 6}
                onClick={handleEnable}
                className="rounded-lg bg-[#ffb800] px-4 py-2.5 text-sm font-semibold text-[#0d0d0f] disabled:opacity-60"
              >
                Enable 2FA
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-[#a1a1aa]">Enter a current authenticator code to disable 2FA.</p>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="000000"
            maxLength={6}
            className="w-full max-w-xs rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-2.5 text-sm text-white outline-none"
          />
          <button
            type="button"
            disabled={loading || code.length < 6}
            onClick={handleDisable}
            className="rounded-lg border border-red-500/40 px-4 py-2.5 text-sm font-medium text-red-400 disabled:opacity-60"
          >
            Disable 2FA
          </button>
        </div>
      )}
    </section>
  );
}
