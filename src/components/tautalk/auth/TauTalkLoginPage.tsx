'use client';

import { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { inter, outfit } from '@/lib/website/fonts';
import { tauTalkAssets, tauTalkRoutes } from '@/lib/tautalk-ui/assets';
import { persistTauSession } from '@/hooks/useTauSession';

function TauTalkLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || tauTalkRoutes.chat;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/tauid/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Sign in failed');
        return;
      }

      if (data.token && data.user) {
        persistTauSession(data.token, {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          fullName: data.user.fullName ?? data.user.full_name,
          avatarUrl: data.user.avatarUrl ?? data.user.avatar_url ?? null,
        });
      }

      router.push(redirectTo.startsWith('/') ? redirectTo : tauTalkRoutes.chat);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${inter.className} relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050508] px-4 py-12`}>
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[rgba(212,175,55,0.12)] blur-[120px]"
        aria-hidden
      />

      <div className="relative w-full max-w-[440px] rounded-[20px] border border-[rgba(212,175,55,0.22)] bg-[#0c0c12] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.55)]">
        <div className="flex flex-col items-center text-center">
          <Image
            src={tauTalkAssets.brand.logoPrimary}
            alt="Tau Talk"
            width={72}
            height={72}
            className="rounded-xl"
            priority
          />
          <h1 className={`${outfit.className} mt-6 text-xl font-semibold text-white`}>Welcome to Tau Talk</h1>
          <p className="mt-2 text-sm text-[#9ca3af]">
            Sign in with your Tau ID for end-to-end encrypted messaging and calls.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          ) : null}

          <div>
            <label className="text-xs font-semibold text-[#9ca3af]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@taumail.org"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-[rgba(212,175,55,0.35)] bg-[#050508] px-3 py-3 text-sm text-white outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#9ca3af]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-[rgba(212,175,55,0.35)] bg-[#050508] px-3 py-3 text-sm text-white outline-none focus:border-[#D4AF37]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#D4AF37] py-3 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#e0bc4a] disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Open Tau Talk'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6b7280]">
          New here?{' '}
          <Link
            href={`/tauid/register?redirect=${encodeURIComponent(redirectTo)}`}
            className="font-medium text-[#D4AF37] hover:text-[#F5C842]"
          >
            Create Tau ID
          </Link>
        </p>

        <p className="mt-4 text-center">
          <Link href={tauTalkRoutes.home} className="text-xs text-[#6b7280] hover:text-[#9ca3af]">
            ← Back to Tau Talk
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function TauTalkLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050508] text-[#9ca3af]">
          Loading…
        </div>
      }
    >
      <TauTalkLoginForm />
    </Suspense>
  );
}
