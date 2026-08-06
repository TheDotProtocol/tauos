'use client';

import { useEffect, useRef, useState } from 'react';
import { Smile } from 'lucide-react';
import { TAUTALK_EMOJI_CATEGORIES, TAUTALK_QUICK_EMOJIS } from '@/lib/tautalk-emojis';

type Props = {
  open: boolean;
  onToggle: () => void;
  onPick: (emoji: string) => void;
  disabled?: boolean;
};

export default function TauTalkEmojiPicker({ open, onToggle, onPick, disabled }: Props) {
  const [categoryId, setCategoryId] = useState(TAUTALK_EMOJI_CATEGORIES[0].id);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onToggle();
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onToggle]);

  const category =
    TAUTALK_EMOJI_CATEGORIES.find((c) => c.id === categoryId) ?? TAUTALK_EMOJI_CATEGORIES[0];

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="px-3 py-3 rounded-xl bg-white/[0.06] text-[#D4AF37] disabled:opacity-40 hover:bg-white/[0.08] transition-colors"
        title="Emoji"
        aria-expanded={open}
        aria-label="Open emoji picker"
      >
        <Smile className="w-5 h-5" />
      </button>

      {open ? (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-[min(100vw-2rem,320px)] rounded-2xl border border-[rgba(212,175,55,0.25)] bg-[#0c0c12] shadow-2xl overflow-hidden">
          <div className="flex items-center gap-1 px-2 py-2 border-b border-white/[0.08] overflow-x-auto">
            {TAUTALK_QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onPick(emoji)}
                className="text-xl p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors shrink-0"
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="flex gap-0.5 px-2 py-1.5 border-b border-white/[0.08] overflow-x-auto">
            {TAUTALK_EMOJI_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`text-lg p-1.5 rounded-lg shrink-0 transition-colors ${
                  categoryId === cat.id
                    ? 'bg-[rgba(212,175,55,0.2)] ring-1 ring-[rgba(212,175,55,0.35)]'
                    : 'hover:bg-white/[0.06]'
                }`}
                title={cat.label}
              >
                {cat.icon}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-8 gap-0.5 p-2 max-h-[220px] overflow-y-auto">
            {category.emojis.map((emoji) => (
              <button
                key={`${category.id}-${emoji}`}
                type="button"
                onClick={() => onPick(emoji)}
                className="text-xl p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
