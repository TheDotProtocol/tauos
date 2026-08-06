'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import TauTalkAvatar from '@/components/tautalk/TauTalkAvatar';
import {
  fetchContactLabel,
  removeContactLabel,
  saveContactLabel,
} from '@/lib/tautalk-web-api';

type Props = {
  token: string;
  open: boolean;
  contactUserId: string | null;
  realName: string;
  username: string | null;
  avatarUrl?: string | null;
  onClose: () => void;
  onUpdated: (contactUserId: string, label: string | null) => void;
};

export default function TauTalkContactModal({
  token,
  open,
  contactUserId,
  realName,
  username,
  avatarUrl,
  onClose,
  onUpdated,
}: Props) {
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !token || !contactUserId) return;
    setLoading(true);
    setError('');
    fetchContactLabel(token, contactUserId)
      .then((saved) => setLabel(saved ?? ''))
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load contact'))
      .finally(() => setLoading(false));
  }, [open, token, contactUserId]);

  const save = async () => {
    if (!contactUserId) return;
    setSaving(true);
    setError('');
    try {
      const trimmed = label.trim();
      if (!trimmed) {
        await removeContactLabel(token, contactUserId);
        onUpdated(contactUserId, null);
      } else {
        const saved = await saveContactLabel(token, contactUserId, trimmed);
        onUpdated(contactUserId, saved);
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const resetToRealName = async () => {
    if (!contactUserId) return;
    setSaving(true);
    setError('');
    try {
      await removeContactLabel(token, contactUserId);
      setLabel('');
      onUpdated(contactUserId, null);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reset name');
    } finally {
      setSaving(false);
    }
  };

  if (!open || !contactUserId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0c0c12] shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <h2 className="text-lg font-bold text-white">Contact name</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {loading ? (
            <p className="text-center text-gray-400 py-8">Loading…</p>
          ) : (
            <>
              <div className="flex flex-col items-center gap-2 text-center">
                <TauTalkAvatar name={realName} imageUrl={avatarUrl} size={72} />
                <p className="text-sm text-gray-400">{realName}</p>
                {username ? <p className="text-xs text-[#D4AF37]/80">@{username}</p> : null}
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">
                  Name shown in your chat list (only you see this)
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder={realName}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-white placeholder:text-gray-600 focus:border-[#D4AF37]/50 focus:outline-none"
                  disabled={saving}
                />
              </div>

              {error ? <p className="text-sm text-red-400">{error}</p> : null}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => void resetToRealName()}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl border border-white/[0.12] text-gray-300 hover:bg-white/[0.04] disabled:opacity-50"
                >
                  Use real name
                </button>
                <button
                  type="button"
                  onClick={() => void save()}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-[#D4AF37] text-[#0f0f0f] font-semibold hover:bg-[#c9a430] disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
