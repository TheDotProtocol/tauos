'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { geistMono, geistSans, outfit } from '@/lib/website/fonts';
import { tauMailAssets } from '@/lib/taumail/assets';
import TauMailAppShell from '@/components/taumail/shared/TauMailAppShell';
import { MailIcon } from '@/components/taumail/shared/MailIcon';
import { fetchTauMailCalendar, type TauMailCalendarData } from '@/lib/taumail/api-client';
import { useTauMailSession } from '@/hooks/useTauMailSession';

const hours = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'];

export default function TauMailCalendarPage() {
  const { ready, isLoggedIn } = useTauMailSession();
  const [data, setData] = useState<TauMailCalendarData | null>(null);

  useEffect(() => {
    if (!ready || !isLoggedIn) return;
    fetchTauMailCalendar().then(setData).catch(console.error);
  }, [ready, isLoggedIn]);

  if (!ready || !isLoggedIn) {
    return <div className={`${geistSans.className} flex min-h-screen items-center justify-center bg-[#070708] text-[#a1a1aa]`}>Loading...</div>;
  }

  const calendarWeekDays = data?.weekDays ?? [];
  const calendarEvents = data?.events ?? [];
  const calendarAgenda = data?.agenda ?? [];
  const calendarLegends = data?.legends ?? [];

  return (
    <TauMailAppShell active="calendar">
      <div className={`${geistSans.className} flex min-h-0 flex-1 flex-col`}>
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] px-8 py-4">
          <h1 className={`${outfit.className} text-[22px] font-bold text-white`}>{data?.monthLabel ?? 'Calendar'}</h1>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg bg-[#121214] p-1">
              {['Day', 'Week', 'Month'].map((v) => (
                <button
                  key={v}
                  type="button"
                  className={clsx(
                    'rounded-md px-3 py-1.5 text-xs font-medium',
                    v === 'Week' ? 'bg-[rgba(212,168,67,0.08)] text-[#d4a843]' : 'text-[#a1a1aa]',
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <button type="button" className="rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214] p-2">
              <MailIcon src={tauMailAssets.icons.chevronLeft} size={14} />
            </button>
            <button type="button" className="rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214] p-2">
              <MailIcon src={tauMailAssets.icons.chevronRight} size={14} />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <aside className="w-[220px] shrink-0 border-r border-[rgba(255,255,255,0.05)] p-5">
            <p className={`${geistMono.className} text-[11px] font-semibold uppercase text-[#71717a]`}>{data?.monthLabel ?? 'Calendar'}</p>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] text-[#71717a]">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                <span key={d}>{d}</span>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <span
                  key={day}
                  className={clsx(
                    'flex size-6 items-center justify-center rounded-full',
                    day === 28 ? 'bg-[#d4a843] font-semibold text-[#070708]' : 'text-[#a1a1aa]',
                  )}
                >
                  {day}
                </span>
              ))}
            </div>
            <p className="mt-6 text-xs font-semibold text-white">My Calendars</p>
            <div className="mt-3 space-y-2">
              {calendarLegends.map((item) => (
                <label key={item.label} className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                  <span className="size-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                  {item.label}
                </label>
              ))}
            </div>
          </aside>

          <div className="min-w-0 flex-1 overflow-auto p-4">
            <div className="grid grid-cols-7 border-b border-[rgba(255,255,255,0.05)] pb-2">
              {calendarWeekDays.map((day) => (
                <div key={day.label} className={clsx('text-center text-xs', day.active ? 'font-semibold text-[#d4a843]' : 'text-[#71717a]')}>
                  {day.label}
                </div>
              ))}
            </div>
            <div className="relative grid grid-cols-7">
              {hours.map((hour, row) => (
                <div key={hour} className="contents">
                  <div className={`${geistMono.className} col-span-7 border-b border-[rgba(255,255,255,0.03)] py-3 text-[10px] text-[#71717a]`}>{hour}</div>
                  {row === 1 ? (
                    <div className="pointer-events-none absolute left-0 right-0 top-[88px] z-10 flex items-center">
                      <span className="size-2 rounded-full bg-[#d4a843]" />
                      <div className="h-px flex-1 bg-[#d4a843]" />
                    </div>
                  ) : null}
                </div>
              ))}
              {calendarEvents.map((ev) => (
                <div
                  key={ev.id}
                  className={clsx(
                    'absolute rounded-lg border px-2 py-1.5 text-[11px] font-medium text-white',
                    ev.color === 'gold' && 'border-[rgba(212,168,67,0.3)] bg-[rgba(212,168,67,0.12)]',
                    ev.color === 'blue' && 'border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.12)]',
                    ev.color === 'purple' && 'border-[rgba(168,85,247,0.3)] bg-[rgba(168,85,247,0.12)]',
                  )}
                  style={{ left: `${(ev.day + 1) * (100 / 7)}%`, top: ev.top === '10:30 AM' ? 72 : ev.top === '02:00 PM' ? 200 : 120, width: '12%' }}
                >
                  {ev.title}
                  {ev.avatars ? (
                    <div className="mt-1 flex -space-x-1">
                      {[tauMailAssets.avatars.sender1, tauMailAssets.avatars.sender3].map((a) => (
                        <Image key={a} src={a} alt="" width={14} height={14} className="size-3.5 rounded-full border border-[#121214] object-cover" />
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <aside className="w-[280px] shrink-0 border-l border-[rgba(255,255,255,0.05)] p-5">
            <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#d4a843] py-3 text-sm font-semibold text-[#070708]">
              <MailIcon src={tauMailAssets.icons.plus} size={14} />
              Quick Add Event
            </button>
            <h2 className="mt-6 text-sm font-semibold text-white">Today&apos;s Agenda</h2>
            <div className="mt-3 space-y-4">
              {calendarAgenda.length === 0 ? (
                <p className="text-xs text-[#71717a]">No events today</p>
              ) : (
                calendarAgenda.map((item) => (
                  <div key={item.title}>
                    <p className={`${geistMono.className} text-[11px] font-semibold text-[#d4a843]`}>{item.time}</p>
                    <p className="text-[13px] font-medium text-white">{item.title}</p>
                    <p className="text-[11px] text-[#71717a]">{item.location}</p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 rounded-xl border border-[rgba(212,168,67,0.15)] bg-[rgba(212,168,67,0.08)] p-4">
              <div className="flex items-center gap-2">
                <MailIcon src={tauMailAssets.icons.sparkles} size={14} />
                <p className="text-[13px] font-semibold text-white">Optimal Slot Detected</p>
              </div>
              <p className="mt-2 text-xs text-[#a1a1aa]">Sariel Tau and Director Vance are both available for telemetry coordination tomorrow.</p>
              <p className={`${geistMono.className} mt-3 rounded-md bg-[#070708] px-2 py-1 text-[11px] text-[#a1a1aa]`}>Thursday, Oct 29 · 11:30 AM</p>
              <button type="button" className="mt-3 w-full rounded-lg border border-[rgba(212,168,67,0.15)] py-2 text-xs font-semibold text-[#d4a843]">
                Book This Meeting
              </button>
            </div>
          </aside>
        </div>
      </div>
    </TauMailAppShell>
  );
}
