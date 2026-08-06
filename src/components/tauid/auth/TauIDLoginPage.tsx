'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import TauIDAuthLayout from '@/components/tauid/shared/TauIDAuthLayout';
import TauIdOAuthButtons from '@/components/tauid/auth/TauIdOAuthButtons';
import { loginTauId, verifyTauId2fa } from '@/lib/tauid/api-client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/tauid/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const result = await loginTauId(email, password);
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
    router.push(redirectTo.startsWith('/') ? redirectTo : '/tauid/dashboard');
  };

  const handle2fa = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const result = await verifyTauId2fa(mfaToken, code);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Verification failed');
      return;
    }
    router.push(redirectTo.startsWith('/') ? redirectTo : '/tauid/dashboard');
  };

  return (
    <TauIDAuthLayout
      title={step === '2fa' ? 'Two-Factor Verification' : 'Welcome back'}
      subtitle={
        step === '2fa'
          ? 'Enter the 6-digit code from your authenticator app.'
          : 'Sign in with your Tau ID to access Mail, Cloud, Talk, and more.'
      }
      backHref="/tauid"
      backLabel="← Tau ID"
      footer={
        step === 'login' ? (
          <p className="text-center text-sm text-[#71717a]">
            New to Tau?{' '}
            <Link href="/tauid/register" className="font-medium text-[#ffb800] hover:underline">
              Create Tau ID
            </Link>
          </p>
        ) : null
      }
    >
      {step === 'login' ? (
        <>
          <form onSubmit={handleLogin} className="space-y-5">
          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
          ) : null}
          <div>
            <label className="text-xs font-semibold text-[#a1a1aa]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@taumail.org"
              required
              className="mt-2 w-full rounded-lg border border-[rgba(255,184,0,0.35)] bg-[#0d0d0f] px-3 py-3 text-sm text-white outline-none focus:border-[#ffb800]"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#a1a1aa]">Password</label>
              <Link href="/tauid/forgot-password" className="text-xs text-[#ffb800] hover:underline">
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-3 text-sm text-white outline-none focus:border-[#ffb800]"
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
        <div className="mt-6">
          <TauIdOAuthButtons redirectTo={redirectTo.startsWith('/') ? redirectTo : '/tauid/dashboard'} />
        </div>
        </>
      ) : (
        <form onSubmit={handle2fa} className="space-y-5">
          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
          ) : null}
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
    </TauIDAuthLayout>
  );
}

export default function TauIDLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0d0d0f] text-[#71717a]">Loading…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
