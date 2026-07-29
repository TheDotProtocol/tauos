'use client';

import { useEffect, useState } from 'react';
import { FileText, MapPin, Mic } from 'lucide-react';
import type { MessagePayload } from '@/lib/tautalk-message-payload';
import { openStreetMapUrl } from '@/lib/tautalk-message-payload';
import { signedAttachmentUrl } from '@/lib/tautalk-web-api';

type Props = {
  payload: MessagePayload;
  isMe: boolean;
  token: string;
  time: string;
};

export default function TauTalkMessageBubble({ payload, isMe, token, time }: Props) {
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

  const bubbleClass = `max-w-[85%] sm:max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
    isMe ? 'bg-green-600 text-white rounded-br-sm' : 'bg-gray-800 text-gray-100 rounded-bl-sm'
  }`;

  if (payload.kind === 'text') {
    return (
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div className={bubbleClass}>
          <p className="whitespace-pre-wrap break-words">{payload.text}</p>
          <p className="text-[10px] opacity-60 mt-1">{time}</p>
        </div>
      </div>
    );
  }

  if (payload.kind === 'image') {
    return (
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div className={`${bubbleClass} p-2`}>
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
        <div className={bubbleClass}>
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
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={bubbleClass}>
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 shrink-0 text-green-400" />
            <div>
              <p>{payload.label || 'Shared location'}</p>
              <p className="text-xs opacity-70 mt-1">
                {payload.lat.toFixed(5)}, {payload.lng.toFixed(5)}
              </p>
              <p className="text-xs text-green-400/80 mt-1">Open in OpenStreetMap</p>
            </div>
          </div>
          <p className="text-[10px] opacity-60 mt-2">{time}</p>
        </a>
      </div>
    );
  }

  return null;
}
