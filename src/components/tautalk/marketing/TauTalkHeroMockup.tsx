'use client';

import { Phone, Video } from 'lucide-react';

/** Figma 31:2083 — marketing preview only (not live chat data). */
export default function TauTalkHeroMockup() {
  return (
    <div className="mt-16 w-full max-w-[1000px] overflow-hidden rounded-xl border border-[#262626] bg-[#171717] shadow-[0_20px_40px_rgba(0,0,0,0.7)] min-h-[440px] flex">
      <aside className="hidden w-[280px] shrink-0 flex-col gap-5 border-r border-[#262626] p-5 sm:flex">
        <p className="text-sm font-bold text-white">Chats</p>
        {[
          { initials: 'JD', name: 'John Doe', preview: 'Decrypt keys completed.', time: '10:24 AM', online: true },
          { initials: 'AS', name: 'Alice Smith', preview: 'Can we discuss self-hosting tomorrow?', time: 'Yesterday', online: true },
          { initials: 'OP', name: 'Ops Room', preview: 'Service monitoring stable.', time: 'Monday', online: false },
        ].map((c) => (
          <div key={c.name} className="flex gap-3 text-left">
            <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#48484a] text-sm font-semibold text-white">
              {c.initials}
              {c.online ? (
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#171717] bg-[#28c840]" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2 text-sm">
                <span className="truncate font-semibold text-white">{c.name}</span>
                <span className="shrink-0 text-[11px] text-[#8e8e93]">{c.time}</span>
              </div>
              <p className="truncate text-xs text-[#8e8e93]">{c.preview}</p>
            </div>
          </div>
        ))}
      </aside>

      <div className="flex min-h-[440px] flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#262626] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#48484a] text-sm font-semibold text-white">
              JD
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">John Doe</p>
              <p className="text-[11px] text-[#d4af37]">E2EE Secured Session</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Phone className="size-[18px] text-[#d4af37]" aria-hidden />
            <Video className="size-[18px] text-[#d4af37]" aria-hidden />
          </div>
        </header>

        <div className="flex flex-1 flex-col justify-end gap-4 p-5">
          <div className="flex items-end gap-2">
            <div className="max-w-[340px] rounded-bl rounded-br-xl rounded-tl-xl rounded-tr-xl bg-[#222] p-3 text-left text-[13px] leading-relaxed text-[#f5f5f7]">
              Are the database changes committed to our primary cluster yet?
            </div>
            <span className="text-[10px] text-[#8e8e93]">10:22 AM</span>
          </div>
          <div className="flex items-end justify-end gap-2">
            <span className="text-[10px] text-[#8e8e93]">10:24 AM</span>
            <div className="max-w-[340px] rounded-bl-xl rounded-br rounded-tl-xl rounded-tr-xl border border-[#d4af37] bg-[rgba(212,175,55,0.08)] p-3 text-left text-[13px] leading-relaxed text-[#f5f5f7]">
              Yes, synced across all nodes. Everything is fully decentralized and running fine.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
