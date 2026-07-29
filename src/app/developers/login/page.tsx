'use client';

import { useState } from 'react';
import Link from 'next/link';
import { login } from '@/lib/tau-ide/auth-client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.push('/developers/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="w-full max-w-md glass-strong rounded-2xl p-8 border border-white/10">
        <Link href="/developers" className="flex items-center gap-3 mb-8">
          <img src="/brand/tau-ide-logo.png" alt="Tau IDE" className="w-12 h-12 rounded-lg" />
          <div>
            <h1 className="font-bold text-white">Tau IDE</h1>
            <p className="text-xs text-gray-500">Sign in to your account</p>
          </div>
        </Link>

        <form onSubmit={submit} className="space-y-4">
          {error && <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 glass rounded-lg border border-white/10 text-white focus:border-cyan-500 focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 glass rounded-lg border border-white/10 text-white focus:border-cyan-500 focus:outline-none"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          No account?{' '}
          <Link href="/developers/register" className="text-cyan-400 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
