'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { TauMailAuthLayout, TauMailAuthHeader } from '@/components/taumail/auth/TauMailAuthPages';
import { verifyTauMail2fa } from '@/lib/taumail/api-client';

function TwoFactorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fromQuery = searchParams.get('token');
    const fromSession = typeof window !== 'undefined' ? sessionStorage.getItem('taumail_mfa_token') : null;
    setMfaToken(fromQuery || fromSession || '');
  }, [searchParams]);

  const handleVerify = async () => {
    if (!mfaToken || code.length < 6) {
      setError('Enter your 6-digit authenticator code');
      return;
    }
    setLoading(true);
    setError('');
    const result = await verifyTauMail2fa(mfaToken, code);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Verification failed');
      return;
    }
    sessionStorage.removeItem('taumail_mfa_token');
    router.push('/taumail/inbox');
  };

  return (
    <TauMailAuthLayout>
      <TauMailAuthHeader title="Two-Factor Authentication" subtitle="Enter the 6-digit code from your authenticator app." />
      {error ? <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p> : null}
      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: 6 }).map((_, i) => {
          const digit = code[i] || '';
          return (
            <div
              key={i}
              className={`flex size-12 items-center justify-center rounded-lg border text-lg font-semibold ${
                digit ? 'border-[#d4a843] bg-[rgba(212,168,67,0.08)] text-white' : 'border-[rgba(255,255,255,0.05)] bg-[#0b0810] text-[#71717a]'
              }`}
            >
              {digit || '•'}
            </div>
          );
        })}
      </div>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        className="sr-only"
        autoFocus
        inputMode="numeric"
      />
      <button
        type="button"
        onClick={handleVerify}
        disabled={loading || code.length < 6}
        className="mt-8 w-full rounded-lg bg-[#d4a843] py-3 text-sm font-semibold text-[#070708] disabled:opacity-60"
      >
        {loading ? 'Verifying…' : 'Verify Code'}
      </button>
      <Link href="/taumail/login" className="mt-4 block text-center text-[13px] font-semibold text-[#d4a843] underline">
        Back to Sign In
      </Link>
    </TauMailAuthLayout>
  );
}

export function TauMailTwoFactorPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#070708] text-[#71717a]">Loading…</div>}>
      <TwoFactorForm />
    </Suspense>
  );
}
