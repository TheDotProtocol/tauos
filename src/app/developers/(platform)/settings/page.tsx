'use client';

import { useState, useEffect } from 'react';
import PlatformShell from '@/components/tau-ide/PlatformShell';
import { getStoredUser, clearSession } from '@/lib/tau-ide/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [user, setUser] = useState<{ email?: string; username?: string; fullName?: string } | null>(null);
  const [mode, setMode] = useState<'professional' | 'beginner'>('professional');
  const router = useRouter();

  useEffect(() => {
    setUser(getStoredUser());
    const saved = localStorage.getItem('tau-ide-mode');
    if (saved === 'beginner' || saved === 'professional') setMode(saved);
  }, []);

  const saveMode = (m: 'professional' | 'beginner') => {
    setMode(m);
    localStorage.setItem('tau-ide-mode', m);
  };

  const logout = () => {
    clearSession();
    router.push('/developers/login');
  };

  return (
    <PlatformShell title="Settings">
      <div className="p-6 max-w-2xl mx-auto space-y-8">
        <section className="card">
          <h3 className="font-semibold mb-4">Account</h3>
          {user ? (
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> {user.fullName}</p>
              <p><span className="text-gray-500">Email:</span> {user.email}</p>
              <p><span className="text-gray-500">Username:</span> {user.username}</p>
              <button onClick={logout} className="btn-secondary text-sm mt-4">Sign out</button>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              Not signed in. <Link href="/developers/login" className="text-cyan-400 hover:underline">Sign in</Link> to sync projects.
            </p>
          )}
        </section>

        <section className="card">
          <h3 className="font-semibold mb-4">IDE Mode</h3>
          <div className="flex gap-3">
            {(['professional', 'beginner'] as const).map((m) => (
              <button
                key={m}
                onClick={() => saveMode(m)}
                className={`px-4 py-2 rounded-lg text-sm capitalize ${
                  mode === m ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'glass text-gray-400'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Beginner mode emphasizes Tau Architect. Professional mode shows full IDE controls.
          </p>
        </section>

        <section className="card">
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-sm text-gray-400">Tau IDE v1.0 — Developer Platform</p>
        </section>
      </div>
    </PlatformShell>
  );
}
