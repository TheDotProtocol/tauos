'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { geistMono, geistSans } from '@/lib/website/fonts';
import {
  archiveEmail,
  fetchTauMailEmails,
  fetchTauMailProfile,
  markEmailRead,
  moveEmailToTrash,
  summarizeTauMailEmail,
  toggleEmailStar,
  type TauMailProfile,
} from '@/lib/taumail/api-client';
import type { TauMailEmail, TauMailFolder } from '@/lib/taumail/types';
import TauMailAppShell from '@/components/taumail/shared/TauMailAppShell';
import EmailReaderPane, { type EmailReaderAction } from '@/components/taumail/shared/EmailReaderPane';
import TauMailUserAvatar from '@/components/taumail/shared/TauMailUserAvatar';
import { useTauMailSession } from '@/hooks/useTauMailSession';

import type { TauMailNavId } from '@/lib/taumail/assets';

const INBOX_POLL_MS = 60_000;

type MailFolderViewProps = {
  folder: TauMailFolder;
  title: string;
  activeNav: TauMailNavId;
  showTabs?: boolean;
};

export default function MailFolderView({ folder, title, activeNav, showTabs = false }: MailFolderViewProps) {
  const router = useRouter();
  const { ready, isLoggedIn, user, isDemo } = useTauMailSession();
  const [profile, setProfile] = useState<TauMailProfile | null>(null);
  const [emails, setEmails] = useState<TauMailEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'starred'>('all');
  const [busyAction, setBusyAction] = useState<EmailReaderAction | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const loadEmails = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const data = await fetchTauMailEmails(folder);
        setEmails(data);
        setSelectedId((current) => {
          if (current && data.some((e) => e.id === current)) return current;
          return data.length ? data[0].id : null;
        });
        setLastRefreshed(new Date());
      } catch (error) {
        console.error(error);
      } finally {
        if (!silent) setLoading(false);
        setRefreshing(false);
      }
    },
    [folder],
  );

  useEffect(() => {
    if (!ready || !isLoggedIn) return;
    loadEmails();
  }, [folder, ready, isLoggedIn, loadEmails]);

  useEffect(() => {
    if (!ready || !isLoggedIn || isDemo) return;
    fetchTauMailProfile()
      .then((p) => {
        if (p) setProfile(p);
      })
      .catch(() => undefined);
  }, [ready, isLoggedIn, isDemo]);

  const userAvatarUrl = profile?.avatarUrl ?? user?.avatarUrl ?? null;
  const userDisplayName = profile?.displayName || profile?.fullName || user?.fullName || user?.username || 'You';

  useEffect(() => {
    if (!ready || !isLoggedIn || folder !== 'inbox') return;
    const interval = window.setInterval(() => {
      loadEmails({ silent: true });
    }, INBOX_POLL_MS);
    return () => window.clearInterval(interval);
  }, [folder, ready, isLoggedIn, loadEmails]);

  const filtered = emails.filter((e) => {
    if (activeTab === 'unread') return e.unread;
    if (activeTab === 'starred') return e.starred;
    return true;
  });

  const selected = emails.find((e) => e.id === selectedId) ?? filtered[0];

  const handleSelect = async (email: TauMailEmail) => {
    setSelectedId(email.id);
    setAiSummary(null);
    setActionError('');
    if (email.unread && folder === 'inbox') {
      await markEmailRead(email.id);
      setEmails((prev) => prev.map((e) => (e.id === email.id ? { ...e, unread: false } : e)));
    }
  };

  const buildComposeUrl = (email: TauMailEmail, mode: 'reply' | 'forward') => {
    const params = new URLSearchParams();
    if (mode === 'reply') {
      params.set('to', email.senderEmail);
      params.set('subject', email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`);
      params.set(
        'body',
        `\n\n---\nOn ${email.time}, ${email.sender} wrote:\n${email.body}`,
      );
    } else {
      params.set('subject', email.subject.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`);
      params.set(
        'body',
        `\n\n--- Forwarded message ---\nFrom: ${email.sender} <${email.senderEmail}>\nSubject: ${email.subject}\nDate: ${email.time}\n\n${email.body}`,
      );
    }
    return `/taumail/compose?${params.toString()}`;
  };

  const handleEmailAction = async (action: EmailReaderAction) => {
    if (!selected) return;
    setActionError('');

    if (action === 'reply' || action === 'forward') {
      router.push(buildComposeUrl(selected, action));
      return;
    }

    setBusyAction(action);
    try {
      if (action === 'delete') {
        const result = await moveEmailToTrash(selected.id);
        if (!result.ok) {
          setActionError('Could not move message to trash');
          return;
        }
        setEmails((prev) => prev.filter((e) => e.id !== selected.id));
        setSelectedId(null);
        setAiSummary(null);
      } else if (action === 'archive') {
        const result = await archiveEmail(selected.id);
        if (!result.ok) {
          setActionError('Could not archive message');
          return;
        }
        setEmails((prev) => prev.filter((e) => e.id !== selected.id));
        setSelectedId(null);
        setAiSummary(null);
      } else if (action === 'star') {
        const result = await toggleEmailStar(selected.id, selected.starred);
        if (!result.ok) {
          setActionError('error' in result ? result.error : 'Could not update star');
          return;
        }
        setEmails((prev) =>
          prev.map((e) => (e.id === selected.id ? { ...e, starred: result.starred ?? !e.starred } : e)),
        );
      } else if (action === 'ai-summarize') {
        const result = await summarizeTauMailEmail({
          sender: selected.sender,
          subject: selected.subject,
          body: selected.body,
        });
        if (result.ok === false) {
          setActionError(result.error);
          return;
        }
        setAiSummary(result.summary);
      }
    } finally {
      setBusyAction(null);
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
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-white">{title}</h2>
              <button
                type="button"
                onClick={() => loadEmails({ silent: true })}
                disabled={refreshing || loading}
                title="Refresh mailbox"
                className="rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214] px-2.5 py-1 text-[11px] font-semibold text-[#a1a1aa] hover:text-white disabled:opacity-50"
              >
                {refreshing ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
            {lastRefreshed ? (
              <p className={`${geistMono.className} mt-1 text-[10px] text-[#71717a]`}>
                Updated {lastRefreshed.toLocaleTimeString()}
                {folder === 'inbox' ? ' · auto-refresh every 60s' : ''}
              </p>
            ) : null}
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
                const isSentByMe = folder === 'sent';
                const avatarName = isSentByMe ? userDisplayName : email.sender;
                const avatarEmail = isSentByMe ? profile?.email || user?.email : email.senderEmail;
                const avatarUrl = isSentByMe ? userAvatarUrl : undefined;
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
                    <TauMailUserAvatar
                      name={avatarName}
                      email={avatarEmail}
                      imageUrl={avatarUrl}
                      size={36}
                      rounded="full"
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
        {selected ? (
          <div className="relative flex min-w-0 flex-1">
            {actionError ? (
              <p className="absolute bottom-4 right-4 z-10 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {actionError}
              </p>
            ) : null}
            <EmailReaderPane
              email={selected}
              recipientLabel={folder === 'sent' ? `To: ${selected.senderEmail}` : undefined}
              avatarName={folder === 'sent' ? userDisplayName : selected.sender}
              avatarEmail={folder === 'sent' ? profile?.email || user?.email : selected.senderEmail}
              avatarUrl={folder === 'sent' ? userAvatarUrl : undefined}
              busyAction={busyAction}
              aiSummary={aiSummary}
              onAction={handleEmailAction}
            />
          </div>
        ) : null}
      </div>
    </TauMailAppShell>
  );
}
