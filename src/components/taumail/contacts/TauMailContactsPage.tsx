'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { geistMono, geistSans, outfit } from '@/lib/website/fonts';
import { tauMailAssets } from '@/lib/taumail/assets';
import TauMailAppShell from '@/components/taumail/shared/TauMailAppShell';
import { MailIcon } from '@/components/taumail/shared/MailIcon';
import { fetchTauMailContacts, type TauMailContact } from '@/lib/taumail/api-client';
import { useTauMailSession } from '@/hooks/useTauMailSession';

export default function TauMailContactsPage() {
  const { ready, isLoggedIn } = useTauMailSession();
  const [contacts, setContacts] = useState<TauMailContact[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!ready || !isLoggedIn) return;
    fetchTauMailContacts().then(setContacts).catch(console.error);
  }, [ready, isLoggedIn]);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()),
  );

  if (!ready || !isLoggedIn) {
    return <div className={`${geistSans.className} flex min-h-screen items-center justify-center bg-[#070708] text-[#a1a1aa]`}>Loading...</div>;
  }

  return (
    <TauMailAppShell active="contacts">
      <div className={`${geistSans.className} flex min-h-0 flex-1 flex-col p-8`}>
        <div className="flex items-center justify-between">
          <h1 className={`${outfit.className} text-[28px] font-bold text-white`}>Contacts</h1>
          <button type="button" className="rounded-lg bg-[#d4a843] px-4 py-2 text-sm font-semibold text-[#070708]">
            Add Contact
          </button>
        </div>
        <div className="mt-4 flex w-full max-w-md items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214] px-4 py-2">
          <MailIcon src={tauMailAssets.icons.search} size={14} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#71717a]"
          />
        </div>
        <div className="mt-6 grid gap-3">
          {filtered.length === 0 ? (
            <p className="text-sm text-[#71717a]">No contacts found</p>
          ) : (
            filtered.map((c) => (
              <div key={c.id} className="flex items-center gap-4 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-4">
                <Image src={c.avatar || tauMailAssets.avatars.sender1} alt="" width={44} height={44} className="size-11 rounded-[22px] object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[15px] font-semibold text-white">{c.name}</p>
                    {c.verified ? <MailIcon src={tauMailAssets.icons.badgeCheck} size={12} /> : null}
                  </div>
                  <p className={`${geistMono.className} text-xs text-[#71717a]`}>{c.email}</p>
                  <p className="text-xs text-[#a1a1aa]">{c.role}</p>
                </div>
                <button type="button" className="rounded-lg border border-[rgba(255,255,255,0.05)] px-3 py-1.5 text-xs text-[#a1a1aa]">
                  Message
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </TauMailAppShell>
  );
}
