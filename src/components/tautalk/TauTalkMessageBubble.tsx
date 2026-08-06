'use client';

import { memo, useEffect, useState } from 'react';
import { FileText, MapPin, Mic } from 'lucide-react';
import type { MessagePayload } from '@/lib/tautalk-message-payload';
import { openStreetMapUrl } from '@/lib/tautalk-message-payload';
import { signedAttachmentUrl } from '@/lib/tautalk-web-api';
import type { ReplyQuote } from '@/components/tautalk/TauTalkMessageContextMenu';

type Props = {
  payload: MessagePayload;
  isMe: boolean;
  token: string;
  time: string;
  replyQuote?: ReplyQuote | null;
  onContextMenu?: (e: React.MouseEvent) => void;
};

function ReplySnippet({ quote, isMe }: { quote: ReplyQuote; isMe: boolean }) {
  return (
    <div
      className={`mb-2 rounded-lg px-2.5 py-1.5 border-l-2 ${
        isMe
          ? 'border-[#D4AF37]/70 bg-black/20'
          : 'border-[#D4AF37]/50 bg-white/[0.04]'
      }`}
    >
      <p className="text-[11px] font-semibold text-[#D4AF37] truncate">{quote.senderUsername}</p>
      <p className="text-[11px] text-[#9ca3af] truncate">{quote.preview}</p>
    </div>
  );
}

function TauTalkMessageBubble({ payload, isMe, token, time, replyQuote, onContextMenu }: Props) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(
    payload.kind === 'image' || payload.kind === 'file' ? payload.url ?? null : null
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (payload.kind !== 'image' && payload.kind !== 'file') return;
      if (payload.url) {
        setMediaUrl(payload.url);
        return;
      }
      if (!payload.path) return;
      try {
        const url = await signedAttachmentUrl(token, payload.path);
        if (!cancelled) setMediaUrl(url);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [payload, token]);

  const bubbleClass = isMe
    ? 'max-w-[85%] sm:max-w-[75%] px-4 py-2 rounded-2xl rounded-br-sm text-sm border border-[rgba(212,175,55,0.45)] bg-[rgba(212,175,55,0.08)] text-[#f5f5f7]'
    : 'max-w-[85%] sm:max-w-[75%] px-4 py-2 rounded-2xl rounded-bl-sm text-sm bg-white/[0.08] border border-white/[0.12] text-[#f5f5f7]';

  if (payload.kind === 'text') {
    return (
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div className={bubbleClass} onContextMenu={onContextMenu}>
          {replyQuote ? <ReplySnippet quote={replyQuote} isMe={isMe} /> : null}
          <p className="whitespace-pre-wrap break-words">{payload.text}</p>
          <p className="text-[10px] opacity-60 mt-1">{time}</p>
        </div>
      </div>
    );
  }

  if (payload.kind === 'image') {
    return (
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div className={`${bubbleClass} p-2`} onContextMenu={onContextMenu}>
          {replyQuote ? <ReplySnippet quote={replyQuote} isMe={isMe} /> : null}
          {mediaUrl ? (
            <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaUrl} alt={payload.name || 'Photo'} className="rounded-xl max-h-64 w-full object-cover" />
            </a>
          ) : (
            <p className="text-sm opacity-70 py-4">Loading photo…</p>
          )}
          {payload.caption ? <p className="mt-2 whitespace-pre-wrap break-words">{payload.caption}</p> : null}
          <p className="text-[10px] opacity-60 mt-1">{time}</p>
        </div>
      </div>
    );
  }

  if (payload.kind === 'file') {
    const isAudio = payload.mime.startsWith('audio/');
    return (
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div className={bubbleClass} onContextMenu={onContextMenu}>
          {replyQuote ? <ReplySnippet quote={replyQuote} isMe={isMe} /> : null}
          {isAudio && mediaUrl ? (
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-4 h-4 shrink-0 opacity-80" />
              <audio controls src={mediaUrl} className="max-w-full h-8" preload="metadata" />
            </div>
          ) : (
            <a
              href={mediaUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 ${mediaUrl ? 'hover:underline' : 'pointer-events-none opacity-70'}`}
            >
              <FileText className="w-5 h-5 shrink-0" />
              <span className="break-all">{payload.name}</span>
            </a>
          )}
          {!isAudio ? <p className="text-[10px] opacity-60 mt-1">{payload.mime}</p> : null}
          <p className="text-[10px] opacity-60 mt-1">{time}</p>
        </div>
      </div>
    );
  }

  if (payload.kind === 'location') {
    const mapsUrl = openStreetMapUrl(payload.lat, payload.lng);
    return (
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={bubbleClass}
          onContextMenu={onContextMenu}
        >
          {replyQuote ? <ReplySnippet quote={replyQuote} isMe={isMe} /> : null}
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 shrink-0 text-[#D4AF37]" />
            <div>
              <p>{payload.label || 'Shared location'}</p>
              <p className="text-xs opacity-70 mt-1">
                {payload.lat.toFixed(5)}, {payload.lng.toFixed(5)}
              </p>
              <p className="text-xs text-[#D4AF37]/80 mt-1">Open in OpenStreetMap</p>
            </div>
          </div>
          <p className="text-[10px] opacity-60 mt-2">{time}</p>
        </a>
      </div>
    );
  }

  return null;
}

export default memo(TauTalkMessageBubble);
