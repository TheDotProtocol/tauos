'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { geistSans, outfit } from '@/lib/website/fonts';
import { loginTauMail, verifyTauMail2fa } from '@/lib/taumail/api-client';
import { tauMailAssets } from '@/lib/taumail/assets';
import { MailIcon } from '@/components/taumail/shared/MailIcon';
import Image from 'next/image';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/taumail/inbox';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await loginTauMail(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Sign in failed');
      return;
    }
    if ('requires2fa' in result && result.requires2fa && result.mfaToken) {
      setMfaToken(result.mfaToken);
      setStep('2fa');
      return;
    }
    router.push(redirectTo.startsWith('/') ? redirectTo : '/taumail/inbox');
  };

  const handle2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await verifyTauMail2fa(mfaToken, code);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Verification failed');
      return;
    }
    router.push(redirectTo.startsWith('/') ? redirectTo : '/taumail/inbox');
  };

  return (
    <div className={`${geistSans.className} relative flex min-h-screen items-center justify-center bg-[#070708]`}>
      <Image
        src={tauMailAssets.auth.glowBackdrop}
        alt=""
        width={800}
        height={600}
        className="pointer-events-none absolute left-1/2 top-[calc(50%-50px)] h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2"
      />

      <div className="relative z-10 w-[440px] rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-10 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <Image src={tauMailAssets.brand.logoIcon} alt="" width={36} height={36} className="rounded-lg" />
            <span className={`${outfit.className} text-[22px] font-bold text-white`}>
              Tau <span className="text-[#d4a843]">Mail</span>
            </span>
          </div>
          <div>
            <h1 className={`${outfit.className} text-xl font-semibold text-white`}>
              {step === '2fa' ? 'Two-Factor Authentication' : 'Welcome to Tau Mail'}
            </h1>
            <p className="mt-1.5 text-[13px] text-[#a1a1aa]">
              {step === '2fa'
                ? 'Enter the 6-digit code from your authenticator app.'
                : 'Sign in with your Tau ID to access Core network.'}
            </p>
          </div>
        </div>

        {step === 'login' ? (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            {error ? <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p> : null}

            <div>
              <label className="text-xs font-semibold text-[#a1a1aa]">Email or Tau ID</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@taumail.org"
                autoComplete="email"
                required
                className="mt-2 w-full rounded-lg border-[1.5px] border-[#d4a843] bg-[#070708] px-3 py-3 text-sm text-white outline-none placeholder:text-[#71717a]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#a1a1aa]">Password</label>
              <div className="mt-2 flex items-center justify-between rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#070708] px-3 py-3">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  autoComplete="current-password"
                  required
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#a1a1aa]"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-xs font-semibold text-[#a1a1aa]">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#a1a1aa]">
                <span className="flex size-4 items-center justify-center rounded border-[1.5px] border-[#d4a843] bg-[rgba(212,168,67,0.08)]">
                  {remember ? <MailIcon src={tauMailAssets.auth.checkmark} size={10} /> : null}
                </span>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="sr-only" />
                Remember me
              </label>
              <Link href="/taumail/forgot-password" className="text-[13px] font-medium text-[#d4a843]">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="rounded-lg bg-[#d4a843] py-3 text-sm font-semibold text-[#121214] disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handle2fa} className="mt-8 flex flex-col gap-5">
            {error ? <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p> : null}
            <div>
              <label className="text-xs font-semibold text-[#a1a1aa]">Authenticator Code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                className="mt-2 w-full rounded-lg border border-[rgba(255,184,0,0.35)] bg-[#070708] px-3 py-3 text-center text-lg tracking-[0.3em] text-white outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="rounded-lg bg-[#d4a843] py-3 text-sm font-semibold text-[#121214] disabled:opacity-60"
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
              className="text-sm text-[#71717a] hover:text-white"
            >
              Back to sign in
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-[13px] text-[#a1a1aa]">
          Don&apos;t have a Tau ID?{' '}
          <Link href="/taumail/register" className="font-semibold text-[#d4a843]">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function TauMailLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#070708] text-[#71717a]">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
