'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { geistMono, geistSans, outfit } from '@/lib/website/fonts';
import { tauMailAssets } from '@/lib/taumail/assets';
import { persistTauSession, tauFetchCredentials } from '@/lib/tau-auth-client';
import { MailIcon } from '@/components/taumail/shared/MailIcon';

type TauMailAuthLayoutProps = {
  children: React.ReactNode;
  cardWidth?: 'sm' | 'md' | 'lg';
};

export function TauMailAuthLayout({ children, cardWidth = 'md' }: TauMailAuthLayoutProps) {
  const widthClass = cardWidth === 'lg' ? 'w-[520px]' : cardWidth === 'sm' ? 'w-[440px]' : 'w-[440px]';

  return (
    <div className={`${geistSans.className} relative flex min-h-screen items-center justify-center bg-[#070708] px-4 py-10`}>
      <Image
        src={tauMailAssets.auth.glowBackdrop}
        alt=""
        width={900}
        height={700}
        className="pointer-events-none absolute left-1/2 top-[calc(50%-30px)] h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2"
      />
      <Image src={tauMailAssets.auth.nodesTl} alt="" width={124} height={8} className="pointer-events-none absolute left-[60px] top-[60px]" />
      <Image src={tauMailAssets.auth.nodesBr} alt="" width={164} height={8} className="pointer-events-none absolute bottom-[60px] right-[60px]" />
      <div className={`relative z-10 ${widthClass} rounded-[20px] border border-[rgba(255,255,255,0.05)] bg-[#121214] p-10 shadow-[0px_12px_32px_0px_rgba(0,0,0,0.5)]`}>
        {children}
      </div>
    </div>
  );
}

export function TauMailAuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex items-center gap-3">
        <Image src={tauMailAssets.brand.logoIcon} alt="" width={36} height={36} className="rounded-lg" />
        <span className={`${outfit.className} text-[26px] font-bold text-white`}>
          Tau <span className="text-[#d4a843]">Mail</span>
        </span>
      </div>
      <div>
        <h1 className={`${outfit.className} text-[22px] font-semibold text-white`}>{title}</h1>
        <p className="mt-1.5 text-[13px] text-[#a1a1aa]">{subtitle}</p>
      </div>
    </div>
  );
}

export function TauMailRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <TauMailAuthLayout cardWidth="lg">
      <TauMailAuthHeader title="Create your Tau ID" subtitle="Join the decentralized Tau secure mailing network." />
      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError('');
          const form = e.currentTarget;
          const fd = new FormData(form);
          try {
            const res = await fetch('/api/taumail/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: tauFetchCredentials,
              body: JSON.stringify({
                email: String(fd.get('email') || ''),
                password: String(fd.get('password') || ''),
                username: String(fd.get('username') || ''),
                fullName: String(fd.get('fullName') || ''),
              }),
            });
            const data = await res.json();
            if (!res.ok) {
              setError(data.error || 'Registration failed');
              setLoading(false);
              return;
            }
            if (data.token) {
              persistTauSession(data.token, data.user);
            }
            router.push('/taumail/verify-email');
          } catch {
            setError('Registration failed');
            setLoading(false);
          }
        }}
      >
        {error ? <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p> : null}
        {[
          { label: 'Full Name', name: 'fullName', value: 'Cassiel Vance' },
          { label: 'Backup Email Address', name: 'email', value: 'cassiel@vance.io' },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-[13px] font-semibold text-[#a1a1aa]">{field.label}</label>
            <input name={field.name} defaultValue={field.value} className="mt-2 w-full rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#0b0810] px-3 py-3 text-sm text-white outline-none" />
          </div>
        ))}
        <div>
          <label className="text-[13px] font-semibold text-[#a1a1aa]">Choose Tau ID Handle</label>
          <div className="mt-2 flex items-center justify-between rounded-lg border border-[rgba(212,168,67,0.15)] bg-[#0b0810] px-3 py-3 text-sm">
            <input name="username" defaultValue="cassiel" className="flex-1 bg-transparent text-white outline-none" />
            <span className="font-semibold text-[#d4a843]">@tau.net</span>
          </div>
        </div>
        <div>
          <label className="text-[13px] font-semibold text-[#a1a1aa]">Password</label>
          <input name="password" type="password" defaultValue="••••••••••••••" className="mt-2 w-full rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#0b0810] px-3 py-3 text-sm text-white outline-none" />
          <div className="mt-2 flex gap-1">
            <span className="h-1 flex-1 rounded-sm bg-[#d4a843]" />
            <span className="h-1 flex-1 rounded-sm bg-[#d4a843]" />
            <span className="h-1 flex-1 rounded-sm bg-[rgba(255,255,255,0.05)]" />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px]">
            <span className="text-[#d4a843]">Strong Password</span>
            <span className="text-[#71717a]">At least 8 chars</span>
          </div>
        </div>
        <div>
          <label className="text-[13px] font-semibold text-[#a1a1aa]">Confirm Password</label>
          <input type="password" defaultValue="••••••••••••••" className="mt-2 w-full rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#0b0810] px-3 py-3 text-sm text-white outline-none" />
        </div>
        <label className="flex items-start gap-2.5 text-xs text-[#a1a1aa]">
          <span className="mt-0.5 flex size-4 items-center justify-center rounded border-[1.5px] border-[#d4a843] bg-[rgba(212,168,67,0.15)]">
            <MailIcon src={tauMailAssets.auth.checkmark} size={10} />
          </span>
          I agree to the Tau Network <span className="text-[#d4a843] underline">Terms of Service</span> and <span className="text-[#d4a843] underline">Privacy Policy</span>
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#d4a843] py-3 text-sm font-semibold text-[#070708] disabled:opacity-60">
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        <Image src={tauMailAssets.shared.line} alt="" width={440} height={1} className="h-px w-full" />
        <p className="text-center text-[13px] text-[#a1a1aa]">
          Already have a Tau ID?{' '}
          <Link href="/taumail/login" className="font-semibold text-[#d4a843]">
            Sign In
          </Link>
        </p>
      </form>
    </TauMailAuthLayout>
  );
}

export function TauMailForgotPasswordPage() {
  return (
    <TauMailAuthLayout>
      <TauMailAuthHeader title="Reset your password" subtitle="Enter your Tau ID or email address and we'll send you a secure reset link." />
      <div className="mt-6 flex justify-center">
        <div className="flex size-16 items-center justify-center rounded-[32px] border border-[#d4a843] bg-[rgba(212,168,67,0.15)]">
          <MailIcon src={tauMailAssets.icons.lock} size={28} />
        </div>
      </div>
      <form className="mt-6 space-y-4">
        <div>
          <label className="text-[13px] font-semibold text-[#a1a1aa]">Email or Tau ID</label>
          <input placeholder="cassiel@tau.net" className="mt-2 w-full rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#0b0810] px-3 py-3 text-sm text-[#71717a] outline-none" />
        </div>
        <button type="button" className="w-full rounded-lg bg-[#d4a843] py-3 text-sm font-semibold text-[#070708]">
          Send Reset Link
        </button>
        <Link href="/taumail/login" className="block text-center text-[13px] font-semibold text-[#d4a843] underline">
          Back to Sign In
        </Link>
        <Image src={tauMailAssets.shared.line} alt="" width={360} height={1} className="h-px w-full" />
        <div className="flex items-center justify-center gap-2 text-[11px] text-[#71717a]">
          <MailIcon src={tauMailAssets.icons.shieldAlert} size={14} />
          Protected by Tau Security Protocol
        </div>
      </form>
    </TauMailAuthLayout>
  );
}

export function TauMailWelcomePage() {
  const router = useRouter();

  return (
    <TauMailAuthLayout>
      <div className="flex flex-col items-center text-center">
        <div className="flex size-20 items-center justify-center rounded-full border border-[rgba(212,168,67,0.15)] bg-[rgba(212,168,67,0.08)]">
          <MailIcon src={tauMailAssets.icons.badgeCheck} size={36} />
        </div>
        <h1 className={`${outfit.className} mt-6 text-[28px] font-bold text-white`}>Welcome to Tau Mail</h1>
        <p className="mt-2 text-[13px] text-[#a1a1aa]">
          Your Tau ID <span className="font-semibold text-[#d4a843]">cassiel@tau.net</span> is active on the Core network.
        </p>
        <button type="button" onClick={() => router.push('/taumail/dashboard')} className="mt-8 w-full rounded-lg bg-[#d4a843] py-3 text-sm font-semibold text-[#070708]">
          Enter Dashboard
        </button>
      </div>
    </TauMailAuthLayout>
  );
}

export function TauMailEmailVerificationPage() {
  return (
    <TauMailAuthLayout>
      <TauMailAuthHeader title="Verify your email" subtitle="We sent a verification link to cassiel@vance.io" />
      <div className="mt-6 flex justify-center">
        <div className="flex size-16 items-center justify-center rounded-[32px] border border-[rgba(212,168,67,0.15)] bg-[rgba(212,168,67,0.08)]">
          <MailIcon src={tauMailAssets.icons.mail} size={28} />
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-[#a1a1aa]">Check your inbox and click the verification link to activate your account.</p>
      <button type="button" className="mt-6 w-full rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214] py-3 text-sm font-semibold text-white">
        Resend Verification Email
      </button>
      <Link href="/taumail/welcome" className="mt-4 block text-center text-[13px] font-semibold text-[#d4a843]">
        Continue to Welcome
      </Link>
    </TauMailAuthLayout>
  );
}
