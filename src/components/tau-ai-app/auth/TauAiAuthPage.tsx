'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { outfit } from '@/lib/website/fonts';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';
import { loginTauId, verifyTauId2fa } from '@/lib/tauid/api-client';
import { useTauAiSession } from '@/lib/tau-ai-app/session-context';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import TauAiLogo from '@/components/tau-ai-app/shared/TauAiLogo';
import TauIdOAuthButtons from '@/components/tauid/auth/TauIdOAuthButtons';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/tau-ai-app/home';
  const { isLoggedIn, ready } = useTauAiSession();

  useEffect(() => {
    if (ready && isLoggedIn) {
      router.replace(redirectTo.startsWith('/') ? redirectTo : '/tau-ai-app/home');
    }
  }, [ready, isLoggedIn, redirectTo, router]);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [code, setCode] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const finishLogin = () => {
    router.push(redirectTo.startsWith('/') ? redirectTo : '/tau-ai-app/home');
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const result = await loginTauId(identifier.trim(), password);
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
    finishLogin();
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
    finishLogin();
  };

  const handleTauIdSso = () => {
    const safeRedirect = redirectTo.startsWith('/') ? redirectTo : '/tau-ai-app/home';
    window.location.href = `/tauid/login?redirect=${encodeURIComponent(safeRedirect)}`;
  };

  return (
    <div
      className={`${outfit.className} flex min-h-screen flex-col items-center justify-center gap-[24px] bg-black p-[24px] text-white`}
      data-name="tau-ai-authentication"
    >
      <div className="flex w-[480px] max-w-full flex-col gap-[32px] rounded-[16px] border border-[#222] bg-[#111] p-[48px] shadow-[0px_8px_16px_rgba(212,168,67,0.05)]">
        <div className="flex w-full flex-col items-center gap-[16px]">
          <TauAiLogo variant="lockup" width={220} height={96} />
          <div className="w-full text-center">
            <h1 className="text-[24px] font-bold text-white">
              {step === '2fa' ? 'Two-Factor Verification' : 'Sign in to Tau AI'}
            </h1>
            <p className="mt-[6px] text-[14px] text-[#999]">
              {step === '2fa'
                ? 'Enter the 6-digit code from your authenticator app.'
                : 'Your intelligent operating companion'}
            </p>
          </div>
        </div>

        {step === 'login' ? (
          <>
            <form onSubmit={handleLogin} className="flex w-full flex-col gap-[18px]">
              {error ? (
                <p className="rounded-[8px] border border-[#991b1b] bg-[rgba(153,27,27,0.12)] px-[12px] py-[10px] text-[13px] text-[#f87171]">
                  {error}
                </p>
              ) : null}

              <label className="flex w-full flex-col gap-[8px]">
                <span className="text-[12px] font-semibold uppercase text-[#999]">Email</span>
                <input
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@taumail.org"
                  autoComplete="email"
                  required
                  className="w-full rounded-[8px] border border-[#222] bg-[#1a1a1a] px-[16px] py-[12px] text-[14px] text-white outline-none placeholder:text-[#666] focus:border-[rgba(212,168,67,0.16)]"
                />
              </label>

              <label className="flex w-full flex-col gap-[8px]">
                <span className="text-[12px] font-semibold uppercase text-[#999]">Password</span>
                <div className="flex w-full items-center justify-between rounded-[8px] border border-[#222] bg-[#1a1a1a] px-[16px] py-[12px] focus-within:border-[rgba(212,168,67,0.16)]">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-[#666]"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password">
                    <TauAiIcon src={tauAiAssets.icons.eye} size={16} />
                  </button>
                </div>
              </label>

              <div className="flex w-full items-center justify-between">
                <label className="flex cursor-pointer items-center gap-[8px]">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={`flex size-[16px] items-center justify-center rounded-[4px] border ${
                      rememberDevice
                        ? 'border-[#d4a843] bg-[rgba(212,168,67,0.08)]'
                        : 'border-[#444] bg-transparent'
                    }`}
                  >
                    {rememberDevice ? <TauAiIcon src={tauAiAssets.icons.check} size={10} /> : null}
                  </span>
                  <span className="text-[13px] text-[#999]">Remember this device</span>
                </label>
                <Link href="/tauid/forgot-password" className="text-[13px] font-medium text-[#d4a843]">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-[30px] bg-gradient-to-r from-[#f0d78c] via-[#d4a843] to-[#b8922e] px-[24px] py-[14px] text-[15px] font-bold text-black disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="flex w-full flex-col gap-[16px]">
              <div className="flex w-full items-center gap-[12px]">
                <div className="h-px flex-1 bg-[#222]" />
                <span className="text-[12px] font-semibold uppercase text-[#666]">or</span>
                <div className="h-px flex-1 bg-[#222]" />
              </div>

              <button
                type="button"
                onClick={handleTauIdSso}
                className="flex w-full items-center justify-center gap-[8px] rounded-[30px] border border-[#d4a843] px-[24px] py-[12px] text-[14px] font-semibold text-[#d4a843]"
              >
                <TauAiLogo variant="emblem" width={20} height={20} alt="" />
                Sign in with Tau ID
              </button>

              <TauIdOAuthButtons
                redirectTo={redirectTo.startsWith('/') ? redirectTo : '/tau-ai-app/home'}
              />
            </div>

            <p className="text-center text-[13px] text-[#999]">
              New to Tau?{' '}
              <Link
                href={`/tauid/register?redirect=${encodeURIComponent(redirectTo.startsWith('/') ? redirectTo : '/tau-ai-app/home')}`}
                className="font-semibold text-[#d4a843]"
              >
                Create your Tau ID
              </Link>
            </p>
          </>
        ) : (
          <form onSubmit={handle2fa} className="flex w-full flex-col gap-[18px]">
            {error ? (
              <p className="rounded-[8px] border border-[#991b1b] bg-[rgba(153,27,27,0.12)] px-[12px] py-[10px] text-[13px] text-[#f87171]">
                {error}
              </p>
            ) : null}

            <label className="flex w-full flex-col gap-[8px]">
              <span className="text-[12px] font-semibold uppercase text-[#999]">Authenticator Code</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                className="w-full rounded-[8px] border border-[rgba(212,168,67,0.16)] bg-[#1a1a1a] px-[16px] py-[12px] text-center text-[18px] tracking-[0.3em] text-white outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="flex w-full items-center justify-center rounded-[30px] bg-gradient-to-r from-[#f0d78c] via-[#d4a843] to-[#b8922e] px-[24px] py-[14px] text-[15px] font-bold text-black disabled:opacity-60"
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
              className="text-[13px] text-[#999] hover:text-white"
            >
              Back to sign in
            </button>
          </form>
        )}
      </div>

      <div className="flex items-center gap-[8px] rounded-[20px] border border-[#222] bg-[#111] px-[20px] py-[10px]">
        <TauAiIcon src={tauAiAssets.icons.lock} size={14} />
        <p className="whitespace-nowrap text-[12px] text-[#999]">
          Protected by Tau Security • End-to-End Encrypted
        </p>
      </div>

      <Link href="/tau-ai-app/welcome" className="text-[13px] text-[#666] hover:text-[#999]">
        ← Back to welcome
      </Link>
    </div>
  );
}

export default function TauAiAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-[#999]">
          Loading…
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
