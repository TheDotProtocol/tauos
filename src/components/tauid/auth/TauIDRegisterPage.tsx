'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TauIDAuthLayout from '@/components/tauid/shared/TauIDAuthLayout';
import { registerTauId, confirmVerifyEmail } from '@/lib/tauid/api-client';

export default function TauIDRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await registerTauId({
      fullName: form.fullName,
      username: form.username,
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Registration failed');
      return;
    }
    setDevCode(result.devCode);
    setStep('verify');
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const result = await confirmVerifyEmail(code, form.email);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Verification failed');
      return;
    }
    router.push('/tauid/dashboard');
  };

  const skipVerify = () => router.push('/tauid/dashboard');

  return (
    <TauIDAuthLayout
      title={step === 'verify' ? 'Verify your email' : 'Create Tau ID'}
      subtitle={
        step === 'verify'
          ? `We sent a 6-digit code to ${form.email}. Enter it below to secure your account.`
          : 'One sovereign identity for Mail, Cloud, Talk, IDE, and the entire Tau ecosystem.'
      }
      backHref={step === 'form' ? '/tauid/login' : undefined}
      backLabel="← Sign in"
      footer={
        step === 'form' ? (
          <p className="text-center text-sm text-[#71717a]">
            Already have Tau ID?{' '}
            <Link href="/tauid/login" className="font-medium text-[#ffb800] hover:underline">
              Sign in
            </Link>
          </p>
        ) : null
      }
    >
      {step === 'form' ? (
        <form onSubmit={handleRegister} className="space-y-4">
          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
          ) : null}
          {[
            { key: 'fullName', label: 'Full name', type: 'text', placeholder: 'Arun Kumar' },
            { key: 'username', label: 'Username', type: 'text', placeholder: 'arunkumar' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@taumail.org', gold: true },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-xs font-semibold text-[#a1a1aa]">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                required
                className={`mt-2 w-full rounded-lg border bg-[#0d0d0f] px-3 py-3 text-sm text-white outline-none ${
                  field.gold ? 'border-[rgba(255,184,0,0.35)]' : 'border-[#222228]'
                }`}
              />
            </div>
          ))}
          {['password', 'confirmPassword'].map((key) => (
            <div key={key}>
              <label className="text-xs font-semibold text-[#a1a1aa]">
                {key === 'password' ? 'Password' : 'Confirm password'}
              </label>
              <input
                type="password"
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
                className="mt-2 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-3 text-sm text-white outline-none"
              />
            </div>
          ))}
          <p className="text-[11px] text-[#71717a]">At least 8 characters with letters and numbers.</p>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#ffb800] py-3 text-sm font-semibold text-[#0d0d0f] disabled:opacity-60"
          >
            {loading ? 'Creating…' : 'Create Tau ID'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-5">
          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
          ) : null}
          {devCode ? (
            <p className="rounded-lg border border-[rgba(255,184,0,0.3)] bg-[rgba(255,184,0,0.12)] px-3 py-2 text-xs text-[#ffb800]">
              Dev code: <strong>{devCode}</strong>
            </p>
          ) : null}
          <div>
            <label className="text-xs font-semibold text-[#a1a1aa]">Verification code</label>
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
            {loading ? 'Verifying…' : 'Verify Email'}
          </button>
          <button type="button" onClick={skipVerify} className="w-full text-sm text-[#71717a] hover:text-white">
            Skip for now
          </button>
        </form>
      )}
    </TauIDAuthLayout>
  );
}
