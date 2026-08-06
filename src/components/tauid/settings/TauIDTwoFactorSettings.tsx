'use client';

import { useEffect, useState } from 'react';
import {
  disableTauId2fa,
  enableTauId2fa,
  fetchTauId2faStatus,
  setupTauId2fa,
} from '@/lib/tauid/api-client';

export default function TauIDTwoFactorSettings() {
  const [enabled, setEnabled] = useState(false);
  const [setupSecret, setSetupSecret] = useState('');
  const [otpauthUrl, setOtpauthUrl] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () =>
    fetchTauId2faStatus()
      .then((status) => {
        if (status) setEnabled(status.enabled);
      })
      .catch(() => setError('Could not load 2FA status'));

  useEffect(() => {
    load();
  }, []);

  const handleSetup = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    const result = await setupTauId2fa();
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Setup failed');
      return;
    }
    setSetupSecret(result.secret || '');
    setOtpauthUrl(result.otpauthUrl || '');
    setMessage('Add this key to your authenticator app, then enter the 6-digit code.');
  };

  const handleEnable = async () => {
    setLoading(true);
    setError('');
    const result = await enableTauId2fa(code);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Could not enable 2FA');
      return;
    }
    setEnabled(true);
    setSetupSecret('');
    setOtpauthUrl('');
    setCode('');
    setMessage('Two-factor authentication is now enabled on your Tau ID.');
  };

  const handleDisable = async () => {
    setLoading(true);
    setError('');
    const result = await disableTauId2fa(code);
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
          <h2 className="text-lg font-semibold text-white">Two-Factor Authentication</h2>
          <p className="mt-2 max-w-xl text-sm text-[#71717a]">
            Protect your Tau ID with a time-based code from Google Authenticator, 1Password, or Authy.
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
              onClick={handleSetup}
              disabled={loading}
              className="rounded-lg bg-[#ffb800] px-5 py-2.5 text-sm font-semibold text-[#0d0d0f] disabled:opacity-60"
            >
              {loading ? 'Preparing…' : 'Set up 2FA'}
            </button>
          ) : (
            <>
              <div className="rounded-lg border border-[#222228] bg-[#0d0d0f] p-4">
                <p className="text-xs font-semibold text-[#a1a1aa]">Setup key</p>
                <p className="mt-2 break-all font-mono text-sm text-[#ffb800]">{setupSecret}</p>
                {otpauthUrl ? (
                  <p className="mt-3 break-all text-[11px] text-[#71717a]">{otpauthUrl}</p>
                ) : null}
              </div>
              <div>
                <label className="text-xs font-semibold text-[#a1a1aa]">Verification code</label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="mt-2 w-full max-w-[200px] rounded-lg border border-[rgba(255,184,0,0.35)] bg-[#0d0d0f] px-3 py-3 text-center tracking-[0.3em] text-white outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleEnable}
                disabled={loading || code.length < 6}
                className="rounded-lg bg-[#ffb800] px-5 py-2.5 text-sm font-semibold text-[#0d0d0f] disabled:opacity-60"
              >
                Enable 2FA
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#a1a1aa]">Enter code to disable</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="mt-2 w-full max-w-[200px] rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-3 text-center tracking-[0.3em] text-white outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleDisable}
            disabled={loading || code.length < 6}
            className="rounded-lg border border-red-500/30 px-5 py-2.5 text-sm font-semibold text-red-300 disabled:opacity-60"
          >
            Disable 2FA
          </button>
        </div>
      )}
    </section>
  );
}
