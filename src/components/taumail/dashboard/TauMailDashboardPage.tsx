'use client';

import Image from 'next/image';
import { geistMono, geistSans, outfit } from '@/lib/website/fonts';
import { tauMailAssets } from '@/lib/taumail/assets';
import TauMailAppShell from '@/components/taumail/shared/TauMailAppShell';
import { MailIcon } from '@/components/taumail/shared/MailIcon';

const quickActions = [
  { label: 'Compose', sub: 'New draft', icon: tauMailAssets.icons.edit, href: '/taumail/compose' },
  { label: 'Schedule', sub: 'Calendar', icon: tauMailAssets.icons.calendarPlus, href: '/taumail/calendar' },
  { label: 'Create Task', sub: 'To-do list', icon: tauMailAssets.icons.checkSquare, href: '/taumail/tasks' },
  { label: 'AI Summary', sub: 'All unreads', icon: tauMailAssets.icons.sparkles, href: '/taumail/ai' },
] as const;

const aiDrafts = [
  { title: 'Draft: Reply to Sariel Tau', preview: '"Acknowledge quantum protocol limits and schedule subsequent telemetry..."' },
  { title: 'Draft: Confirm Delivery Receipt', preview: '"Acknowledge secure terminal handshake with Epsilon Cargo dispatch squad..."' },
] as const;

const alignments = [
  { title: 'Quantum Computing Alignment', time: '10:30 AM · Tau Core' },
  { title: 'Product Analytics Sync', time: '02:00 PM · Marketing' },
] as const;

const attachments = ['tau_universe_protocol.pdf', 'financial_projection_q4.xlsx', 'interface_concept_v3.fig'] as const;

const notifications = [
  { title: 'Node security handshake successful', meta: '4m ago · Security Subsystem', tone: 'success' as const },
  { title: 'Springfield hub failsafe triggered', meta: '12m ago · Grid Maintenance', tone: 'danger' as const },
];

export default function TauMailDashboardPage() {
  return (
    <TauMailAppShell active="dashboard">
      <div className={`${geistSans.className} flex-1 overflow-y-auto p-8`}>
        <div>
          <h1 className={`${outfit.className} text-[28px] font-bold text-white`}>Welcome back, Cassiel V</h1>
          <p className="mt-1.5 text-sm text-[#a1a1aa]">
            All systems functional. You have <span className="font-semibold text-[#d4a843]">12 unread signals</span> from the inner core network.
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
                  12 <span className="text-sm font-normal text-[#71717a]">unreads</span>
                </p>
                <p className="text-xs text-[#a1a1aa]">1,452 total messages on file</p>
              </div>
              <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-5">
                <div className="flex items-center justify-between">
                  <span className={`${geistMono.className} text-[11px] font-semibold uppercase text-[#a1a1aa]`}>Calendar</span>
                  <MailIcon src={tauMailAssets.icons.clock} size={16} />
                </div>
                <p className={`${outfit.className} mt-4 text-[36px] font-bold text-white`}>
                  3 <span className="text-sm font-normal text-[#71717a]">today</span>
                </p>
                <p className="text-xs font-medium text-[#d4a843]">Next alignment in 42m</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MailIcon src={tauMailAssets.icons.wandSparkles} size={16} />
                  <h2 className="text-[15px] font-semibold text-white">AI Smart Drafts Pending</h2>
                </div>
                <span className={`${geistMono.className} rounded-md bg-[rgba(212,168,67,0.08)] px-2 py-0.5 text-[11px] font-semibold text-[#d4a843]`}>
                  5 SUGESTIONS
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {aiDrafts.map((draft) => (
                  <div key={draft.title} className="rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#070708] p-3">
                    <p className="text-[13px] font-semibold text-white">{draft.title}</p>
                    <p className="mt-1 truncate text-xs text-[#a1a1aa]">{draft.preview}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-6">
              <h2 className="text-[15px] font-semibold text-white">Productivity Analytics</h2>
              <div className="mt-4 grid grid-cols-3 gap-5">
                <div>
                  <p className={`${geistMono.className} text-2xl font-bold text-[#d4a843]`}>142</p>
                  <p className="text-xs text-[#71717a]">Emails Outbound</p>
                </div>
                <div>
                  <p className={`${geistMono.className} text-2xl font-bold text-white`}>4.2m</p>
                  <p className="text-xs text-[#71717a]">Mean Response Time</p>
                </div>
                <div>
                  <p className={`${geistMono.className} text-2xl font-bold text-white`}>18 / 20</p>
                  <p className="text-xs text-[#71717a]">Assigned Tasks Done</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[420px] shrink-0 space-y-5">
            <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#71717a]">Cloud Storage</span>
                <span className={`${geistMono.className} font-semibold text-white`}>142 GB / 250 GB</span>
              </div>
              <div className="mt-2 h-1.5 w-[200px] overflow-hidden rounded-full bg-[#1e1e24]">
                <div className="h-full w-[57%] rounded-full bg-gradient-to-r from-[#d4a843] to-[#e8c547]" />
              </div>
              <Image src={tauMailAssets.shared.dividerLine} alt="" width={360} height={1} className="my-5 h-px w-full opacity-60" />
              <h3 className="text-sm font-semibold text-white">Upcoming Alignments</h3>
              <div className="mt-3 space-y-3">
                {alignments.map((item) => (
                  <div key={item.title} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[13px] font-medium text-white">{item.title}</p>
                      <p className={`${geistMono.className} text-[11px] text-[#71717a]`}>{item.time}</p>
                    </div>
                    <MailIcon src={tauMailAssets.icons.toggle} size={34} className="h-5 w-[34px]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-6">
              <h3 className="text-sm font-semibold text-white">Recent Artifact Attachments</h3>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {attachments.map((file) => (
                  <div key={file} className="flex items-center gap-1.5 rounded-md border border-[rgba(255,255,255,0.05)] bg-[#070708] px-2 py-1.5">
                    <MailIcon src={tauMailAssets.icons.file} size={12} />
                    <span className={`${geistMono.className} max-w-[120px] truncate text-[11px] text-[#a1a1aa]`}>{file}</span>
                  </div>
                ))}
              </div>
              <Image src={tauMailAssets.shared.dividerLine} alt="" width={360} height={1} className="my-5 h-px w-full opacity-60" />
              <h3 className="text-sm font-semibold text-white">Subsystem Notifications</h3>
              <div className="mt-3 space-y-2.5">
                {notifications.map((note) => (
                  <div key={note.title} className="relative pl-3.5">
                    <MailIcon
                      src={note.tone === 'success' ? tauMailAssets.icons.statusSuccess : tauMailAssets.icons.statusDanger}
                      size={6}
                      className="absolute left-0 top-1.5"
                    />
                    <p className="text-xs font-medium text-white">{note.title}</p>
                    <p className="text-[10px] text-[#71717a]">{note.meta}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TauMailAppShell>
  );
}
