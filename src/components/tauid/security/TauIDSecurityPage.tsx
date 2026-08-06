'use client';

import { useEffect, useState } from 'react';
import TauIDAppShell from '@/components/tauid/shared/TauIDAppShell';
import TauIDTwoFactorSettings from '@/components/tauid/settings/TauIDTwoFactorSettings';
import { changeTauIdPassword, deleteTauIdAccount } from '@/lib/tauid/api-client';
import { tauFetch, logoutTauSession } from '@/lib/tau-auth-client';

export default function TauIDSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError('');
    setLoading(true);
    const result = await changeTauIdPassword(currentPassword, newPassword);
    setLoading(false);
    if (!result.ok) {
      setPasswordError(result.error || 'Update failed');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  return (
    <TauIDAppShell active="security">
      <div className="space-y-6 p-4 lg:p-8">
        <section className="rounded-xl border border-[#222228] bg-[#16161b] p-6">
          <h2 className="text-lg font-semibold text-white">Change password</h2>
          <p className="mt-1 text-sm text-[#71717a]">Use a strong password with letters and numbers.</p>
          <form onSubmit={handlePasswordSave} className="mt-5 space-y-4">
            {passwordError ? (
              <p className="text-sm text-red-400">{passwordError}</p>
            ) : null}
            {passwordSaved ? (
              <p className="text-sm text-[#22c55e]">Password updated successfully.</p>
            ) : null}
            <div>
              <label className="text-xs font-semibold text-[#a1a1aa]">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-3 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#a1a1aa]">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-3 text-sm text-white outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#ffb800] px-5 py-2.5 text-sm font-semibold text-[#0d0d0f] disabled:opacity-60"
            >
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </section>

        <TauIDTwoFactorSettings />

        <section className="rounded-xl border border-[#222228] bg-[#16161b] p-6">
          <h2 className="text-lg font-semibold text-white">Data & privacy</h2>
          <p className="mt-1 text-sm text-[#71717a]">Export or delete your Tau ID account data.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={async () => {
                const res = await tauFetch('/api/privacy/export');
                if (!res.ok) return;
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'tau-id-export.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="rounded-lg border border-[#222228] px-4 py-2 text-sm text-white hover:border-[rgba(255,184,0,0.3)]"
            >
              Export my data
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm((v) => !v)}
              className="rounded-lg border border-red-500/40 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
            >
              Delete account
            </button>
          </div>
          {showDeleteConfirm ? (
            <form
              className="mt-5 space-y-4 rounded-lg border border-red-500/30 bg-red-500/5 p-4"
              onSubmit={async (event) => {
                event.preventDefault();
                setDeleteError('');
                setDeleteLoading(true);
                const result = await deleteTauIdAccount(deleteEmail, deletePassword);
                setDeleteLoading(false);
                if (!result.ok) {
                  setDeleteError(result.error || 'Could not delete account');
                  return;
                }
                logoutTauSession('/tauid/login');
              }}
            >
              <p className="text-sm text-red-200">
                This permanently deletes your Tau ID and cascades data across Tau Mail, Cloud, Talk, and connected apps.
              </p>
              {deleteError ? <p className="text-sm text-red-400">{deleteError}</p> : null}
              <div>
                <label className="text-xs font-semibold text-[#a1a1aa]">Confirm email</label>
                <input
                  type="email"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  required
                  className="mt-2 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-3 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#a1a1aa]">Password</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                  className="mt-2 w-full rounded-lg border border-[#222228] bg-[#0d0d0f] px-3 py-3 text-sm text-white outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {deleteLoading ? 'Deleting…' : 'Permanently delete my account'}
              </button>
            </form>
          ) : null}
        </section>
      </div>
    </TauIDAppShell>
  );
}
