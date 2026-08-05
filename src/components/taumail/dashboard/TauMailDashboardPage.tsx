'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { geistMono, geistSans, outfit } from '@/lib/website/fonts';
import { tauMailAssets } from '@/lib/taumail/assets';
import TauMailAppShell from '@/components/taumail/shared/TauMailAppShell';
import { MailIcon } from '@/components/taumail/shared/MailIcon';
import { useTauMailSession } from '@/hooks/useTauMailSession';
import {
  fetchTauMailCalendar,
  fetchTauMailEmails,
  fetchTauMailNotifications,
  fetchTauMailProfile,
  fetchTauMailStorage,
  fetchTauMailTasks,
} from '@/lib/taumail/api-client';

const quickActions = [
  { label: 'Compose', sub: 'New draft', icon: tauMailAssets.icons.edit, href: '/taumail/compose' },
  { label: 'Schedule', sub: 'Calendar', icon: tauMailAssets.icons.calendarPlus, href: '/taumail/calendar' },
  { label: 'Create Task', sub: 'To-do list', icon: tauMailAssets.icons.checkSquare, href: '/taumail/tasks' },
  { label: 'AI Summary', sub: 'All unreads', icon: tauMailAssets.icons.sparkles, href: '/taumail/ai' },
] as const;

export default function TauMailDashboardPage() {
  const { ready, isLoggedIn, user, isDemo } = useTauMailSession();
  const [displayName, setDisplayName] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [todayEvents, setTodayEvents] = useState(0);
  const [nextEventLabel, setNextEventLabel] = useState('No events today');
  const [draftCount, setDraftCount] = useState(0);
  const [tasksDone, setTasksDone] = useState(0);
  const [tasksTotal, setTasksTotal] = useState(0);
  const [usedGb, setUsedGb] = useState(0);
  const [totalGb, setTotalGb] = useState(250);
  const [agenda, setAgenda] = useState<{ title: string; time: string }[]>([]);
  const [notifications, setNotifications] = useState<{ title: string; meta: string; tone: 'success' | 'danger' | 'info' | 'warning' }[]>([]);

  useEffect(() => {
    if (!ready || !isLoggedIn) return;

    const name = user?.fullName || user?.username || 'there';
    setDisplayName(name);

    if (isDemo) return;

    fetchTauMailProfile()
      .then((profile) => {
        if (profile?.displayName || profile?.fullName) {
          setDisplayName(profile.displayName || profile.fullName);
        }
      })
      .catch(() => undefined);

    Promise.all([
      fetchTauMailEmails('inbox'),
      fetchTauMailEmails('drafts'),
      fetchTauMailTasks(),
      fetchTauMailStorage(),
      fetchTauMailCalendar(),
      fetchTauMailNotifications(),
    ])
      .then(([inbox, drafts, tasks, storage, calendar, notes]) => {
        setUnreadCount(inbox.filter((e) => e.unread).length);
        setTotalMessages(inbox.length);
        setDraftCount(drafts.length);
        setTasksTotal(tasks.length);
        setTasksDone(tasks.filter((t) => t.done).length);
        setUsedGb(storage.usedGb);
        setTotalGb(storage.totalGb);
        setTodayEvents(calendar.agenda.length);
        setAgenda(calendar.agenda.slice(0, 2).map((item) => ({ title: item.title, time: item.time })));
        setNextEventLabel(calendar.agenda[0] ? `Next: ${calendar.agenda[0].time}` : 'No events today');
        setNotifications(notes.slice(0, 3));
      })
      .catch(console.error);
  }, [ready, isLoggedIn, user, isDemo]);

  const storagePct = useMemo(() => (totalGb ? Math.min(100, (usedGb / totalGb) * 100) : 0), [usedGb, totalGb]);

  if (!ready || !isLoggedIn) {
    return <div className={`${geistSans.className} flex min-h-screen items-center justify-center bg-[#070708] text-[#a1a1aa]`}>Loading...</div>;
  }

  return (
    <TauMailAppShell active="dashboard">
      <div className={`${geistSans.className} flex-1 overflow-y-auto p-8`}>
        <div>
          <h1 className={`${outfit.className} text-[28px] font-bold text-white`}>Welcome back, {displayName}</h1>
          <p className="mt-1.5 text-sm text-[#a1a1aa]">
            {unreadCount > 0 ? (
              <>
                You have <span className="font-semibold text-[#d4a843]">{unreadCount} unread</span> message{unreadCount === 1 ? '' : 's'} in your inbox.
              </>
            ) : (
              'Your inbox is clear. Compose a new message anytime.'
            )}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-4 transition hover:border-[rgba(255,255,255,0.1)]"
            >
              <div className="flex size-9 items-center justify-center rounded-lg border border-[rgba(212,168,67,0.15)] bg-[rgba(212,168,67,0.08)]">
                <MailIcon src={action.icon} size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{action.label}</p>
                <p className="text-[11px] text-[#71717a]">{action.sub}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-5 flex gap-5">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[rgba(212,168,67,0.15)] bg-[#121214] p-5">
                <div className="flex items-center justify-between">
                  <span className={`${geistMono.className} text-[11px] font-semibold uppercase text-[#d4a843]`}>Inbox Overview</span>
                  <MailIcon src={tauMailAssets.icons.mail} size={16} />
                </div>
                <p className={`${outfit.className} mt-4 text-[36px] font-bold text-white`}>
                  {unreadCount} <span className="text-sm font-normal text-[#71717a]">unreads</span>
                </p>
                <p className="text-xs text-[#a1a1aa]">{totalMessages} messages loaded</p>
              </div>
              <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-5">
                <div className="flex items-center justify-between">
                  <span className={`${geistMono.className} text-[11px] font-semibold uppercase text-[#a1a1aa]`}>Calendar</span>
                  <MailIcon src={tauMailAssets.icons.clock} size={16} />
                </div>
                <p className={`${outfit.className} mt-4 text-[36px] font-bold text-white`}>
                  {todayEvents} <span className="text-sm font-normal text-[#71717a]">today</span>
                </p>
                <p className="text-xs font-medium text-[#d4a843]">{nextEventLabel}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MailIcon src={tauMailAssets.icons.wandSparkles} size={16} />
                  <h2 className="text-[15px] font-semibold text-white">Saved Drafts</h2>
                </div>
                <span className={`${geistMono.className} rounded-md bg-[rgba(212,168,67,0.08)] px-2 py-0.5 text-[11px] font-semibold text-[#d4a843]`}>
                  {draftCount} DRAFT{draftCount === 1 ? '' : 'S'}
                </span>
              </div>
              <div className="mt-4">
                {draftCount === 0 ? (
                  <p className="text-xs text-[#71717a]">No drafts yet. Start composing to save one.</p>
                ) : (
                  <a href="/taumail/drafts" className="text-sm font-medium text-[#d4a843] hover:underline">
                    View {draftCount} draft{draftCount === 1 ? '' : 's'}
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-6">
              <h2 className="text-[15px] font-semibold text-white">Productivity</h2>
              <div className="mt-4 grid grid-cols-3 gap-5">
                <div>
                  <p className={`${geistMono.className} text-2xl font-bold text-[#d4a843]`}>{totalMessages}</p>
                  <p className="text-xs text-[#71717a]">Inbox Messages</p>
                </div>
                <div>
                  <p className={`${geistMono.className} text-2xl font-bold text-white`}>{draftCount}</p>
                  <p className="text-xs text-[#71717a]">Open Drafts</p>
                </div>
                <div>
                  <p className={`${geistMono.className} text-2xl font-bold text-white`}>
                    {tasksDone} / {tasksTotal}
                  </p>
                  <p className="text-xs text-[#71717a]">Tasks Complete</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[420px] shrink-0 space-y-5">
            <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#71717a]">Cloud Storage</span>
                <span className={`${geistMono.className} font-semibold text-white`}>
                  {usedGb} GB / {totalGb} GB
                </span>
              </div>
              <div className="mt-2 h-1.5 w-[200px] overflow-hidden rounded-full bg-[#1e1e24]">
                <div className="h-full rounded-full bg-gradient-to-r from-[#d4a843] to-[#e8c547]" style={{ width: `${storagePct}%` }} />
              </div>
              <Image src={tauMailAssets.shared.dividerLine} alt="" width={360} height={1} className="my-5 h-px w-full opacity-60" />
              <h3 className="text-sm font-semibold text-white">Today&apos;s Agenda</h3>
              <div className="mt-3 space-y-3">
                {agenda.length === 0 ? (
                  <p className="text-xs text-[#71717a]">No events scheduled today</p>
                ) : (
                  agenda.map((item) => (
                    <div key={item.title} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[13px] font-medium text-white">{item.title}</p>
                        <p className={`${geistMono.className} text-[11px] text-[#71717a]`}>{item.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-6">
              <h3 className="text-sm font-semibold text-white">Recent Notifications</h3>
              <div className="mt-3 space-y-2.5">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#71717a]">No notifications yet</p>
                ) : (
                  notifications.map((note) => (
                    <div key={note.title} className="relative pl-3.5">
                      <MailIcon
                        src={note.tone === 'success' ? tauMailAssets.icons.statusSuccess : tauMailAssets.icons.statusDanger}
                        size={6}
                        className="absolute left-0 top-1.5"
                      />
                      <p className="text-xs font-medium text-white">{note.title}</p>
                      <p className="text-[10px] text-[#71717a]">{note.meta}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TauMailAppShell>
  );
}
