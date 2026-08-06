'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { inter, outfit } from '@/lib/website/fonts';
import { loginTauCloud, verifyTauCloud2fa } from '@/lib/taucloud/api-client';
import { tauCloudAssets } from '@/lib/taucloud/assets';

export default function TauCloudLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const result = await loginTauCloud(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Sign in failed');
      return;
    }
    if (result.requires2fa && result.mfaToken) {
      setMfaToken(result.mfaToken);
      setStep('2fa');
      return;
    }
    router.push('/taucloud/dashboard');
  };

  const handleVerify2fa = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const result = await verifyTauCloud2fa(mfaToken, code);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Verification failed');
      return;
    }
    router.push('/taucloud/dashboard');
  };

  return (
    <div className={`${inter.className} flex min-h-screen items-center justify-center bg-[#0d0d0f] px-4`}>
      <div className="w-full max-w-[440px] rounded-[20px] border border-[#222228] bg-[#16161b] p-10 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center text-center">
          <Image src={tauCloudAssets.brand.logo} alt="Tau Cloud" width={120} height={48} className="h-12 w-auto" />
          <h1 className={`${outfit.className} mt-6 text-xl font-semibold text-white`}>
            {step === '2fa' ? 'Two-Factor Verification' : 'Welcome to Tau Cloud'}
          </h1>
          <p className="mt-2 text-sm text-[#71717a]">
            {step === '2fa'
              ? 'Enter the 6-digit code from your authenticator app.'
              : 'Sign in with your Tau ID to access your secure vault.'}
          </p>
        </div>

        {step === 'login' ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error ? <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p> : null}
            <div>
              <label className="text-xs font-semibold text-[#a1a1aa]">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@taumail.org"
                required
                className="mt-2 w-full rounded-lg border border-[rgba(255,184,0,0.35)] bg-[#0d0d0f] px-3 py-3 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#a1a1aa]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-3 text-sm text-white outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#ffb800] py-3 text-sm font-semibold text-[#0d0d0f] disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify2fa} className="mt-8 space-y-5">
            {error ? <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p> : null}
            <div>
              <label className="text-xs font-semibold text-[#a1a1aa]">Authenticator Code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                required
                className="mt-2 w-full rounded-lg border border-[rgba(255,184,0,0.35)] bg-[#0d0d0f] px-3 py-3 text-center text-lg tracking-[0.3em] text-white outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full rounded-lg bg-[#ffb800] py-3 text-sm font-semibold text-[#0d0d0f] disabled:opacity-60"
            >
              {loading ? 'Verifying…' : 'Verify & Continue'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('login');
                setCode('');
                setMfaToken('');
                setError('');
              }}
              className="w-full text-sm text-[#71717a] hover:text-white"
            >
              Back to sign in
            </button>
          </form>
        )}

        {step === 'login' ? (
          <p className="mt-6 text-center text-sm text-[#71717a]">
            New to Tau?{' '}
            <Link href="/developers/register" className="text-[#ffb800] hover:underline">
              Create Tau ID
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
