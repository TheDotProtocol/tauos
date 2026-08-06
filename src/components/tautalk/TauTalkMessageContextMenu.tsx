'use client';

import { Reply } from 'lucide-react';

export type MessageContextMenuState = {
  x: number;
  y: number;
  messageId: string;
};

type Props = {
  menu: MessageContextMenuState | null;
  onReply: () => void;
  onClose: () => void;
};

export default function TauTalkMessageContextMenu({ menu, onReply, onClose }: Props) {
  if (!menu) return null;

  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} aria-hidden />
      <div
        className="fixed z-[91] min-w-[140px] rounded-xl border border-[rgba(212,175,55,0.25)] bg-[#0c0c12] shadow-2xl py-1 overflow-hidden"
        style={{ left: menu.x, top: menu.y }}
        role="menu"
      >
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            onReply();
            onClose();
          }}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#f5f5f7] hover:bg-[rgba(212,175,55,0.12)] transition-colors text-left"
        >
          <Reply className="w-4 h-4 text-[#D4AF37]" />
          Reply
        </button>
      </div>
    </>
  );
}

export type ReplyQuote = {
  id: string;
  senderUsername: string;
  preview: string;
};

type ReplyBarProps = {
  quote: ReplyQuote;
  onClear: () => void;
};

export function TauTalkReplyBar({ quote, onClear }: ReplyBarProps) {
  return (
    <div className="flex items-stretch gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-[rgba(212,175,55,0.2)]">
      <div className="w-1 rounded-full bg-[#D4AF37] shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-[#D4AF37] truncate">{quote.senderUsername}</p>
        <p className="text-xs text-[#9ca3af] truncate">{quote.preview}</p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="text-[#9ca3af] hover:text-white px-2 text-lg leading-none"
        aria-label="Cancel reply"
      >
        ×
      </button>
    </div>
  );
}
