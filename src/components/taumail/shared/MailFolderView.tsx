'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { fetchTauMailEmails, markEmailRead } from '@/lib/taumail/api-client';
import type { TauMailEmail, TauMailFolder } from '@/lib/taumail/types';
import { tauMailAssets } from '@/lib/taumail/assets';
import TauMailAppShell from '@/components/taumail/shared/TauMailAppShell';
import EmailReaderPane from '@/components/taumail/shared/EmailReaderPane';
import { MailIcon } from '@/components/taumail/shared/MailIcon';
import { useTauMailSession } from '@/hooks/useTauMailSession';

import type { TauMailNavId } from '@/lib/taumail/assets';

type MailFolderViewProps = {
  folder: TauMailFolder;
  title: string;
  activeNav: TauMailNavId;
  showTabs?: boolean;
};

export default function MailFolderView({ folder, title, activeNav, showTabs = false }: MailFolderViewProps) {
  const { ready, isLoggedIn } = useTauMailSession();
  const [emails, setEmails] = useState<TauMailEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'starred'>('all');

  useEffect(() => {
    if (!ready || !isLoggedIn) return;
    setLoading(true);
    fetchTauMailEmails(folder)
      .then((data) => {
        setEmails(data);
        if (data.length) setSelectedId(data[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [folder, ready, isLoggedIn]);

  const filtered = emails.filter((e) => {
    if (activeTab === 'unread') return e.unread;
    if (activeTab === 'starred') return e.starred;
    return true;
  });

  const selected = emails.find((e) => e.id === selectedId) ?? filtered[0];

  const handleSelect = async (email: TauMailEmail) => {
    setSelectedId(email.id);
    if (email.unread && folder === 'inbox') {
      await markEmailRead(email.id);
      setEmails((prev) => prev.map((e) => (e.id === email.id ? { ...e, unread: false } : e)));
    }
  };

  if (!ready || !isLoggedIn) {
    return <div className={`${geistSans.className} flex min-h-screen items-center justify-center bg-[#070708] text-[#a1a1aa]`}>Loading...</div>;
  }

  return (
    <TauMailAppShell active={activeNav}>
      <div className={`${geistSans.className} flex min-h-0 flex-1`}>
        <div className="flex w-[400px] shrink-0 flex-col border-r border-[rgba(255,255,255,0.05)]">
          <div className="border-b border-[rgba(255,255,255,0.05)] p-4">
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            {showTabs ? (
              <div className="mt-3 flex gap-1 rounded-lg bg-[#121214] p-1">
                {(['all', 'unread', 'starred'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      'flex-1 rounded-md px-3 py-1.5 text-xs capitalize',
                      activeTab === tab ? 'bg-[rgba(212,168,67,0.08)] font-semibold text-[#d4a843]' : 'text-[#a1a1aa]',
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-sm text-[#71717a]">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="p-4 text-sm text-[#71717a]">No messages</p>
            ) : (
              filtered.map((email) => {
                const isSelected = email.id === selectedId;
                return (
                  <button
                    key={String(email.id)}
                    type="button"
                    onClick={() => handleSelect(email)}
                    className={clsx(
                      'relative flex w-full gap-3 border-b border-[rgba(255,255,255,0.05)] p-4 text-left',
                      isSelected ? 'bg-[rgba(212,168,67,0.08)]' : 'hover:bg-[rgba(255,255,255,0.02)]',
                    )}
                  >
                    {email.unread ? <span className="absolute bottom-0 left-0 top-0 w-1 bg-[#d4a843]" /> : null}
                    <Image
                      src={email.avatar || tauMailAssets.avatars.sender1}
                      alt=""
                      width={36}
                      height={36}
                      className="size-9 shrink-0 rounded-[18px] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={clsx('truncate text-[13px]', email.unread ? 'font-bold text-white' : 'font-medium text-white')}>{email.sender}</p>
                        <span className={`${geistMono.className} shrink-0 text-[11px] text-[#71717a]`}>{email.time}</span>
                      </div>
                      <p className="truncate text-xs text-[#a1a1aa]">{email.subject}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-[#71717a]">{email.preview}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
        {selected ? <EmailReaderPane email={selected} recipientLabel={folder === 'sent' ? `To: ${selected.senderEmail}` : undefined} /> : null}
      </div>
    </TauMailAppShell>
  );
}
