'use client';

import { Phone, PhoneOff, Video } from 'lucide-react';
import TauTalkAvatar from '@/components/tautalk/TauTalkAvatar';
import type { IncomingCall } from '@/lib/tautalk-web-api';

type Props = {
  call: IncomingCall;
  onAccept: () => void;
  onDecline: () => void;
};

export default function TauTalkIncomingCall({ call, onAccept, onDecline }: Props) {
  const callerName = call.caller?.full_name || call.caller?.username || 'Someone';
  const isVideo = call.mode === 'video';

  return (
    <div className="fixed inset-0 z-[70] bg-gradient-to-b from-gray-950 via-black to-gray-950 flex flex-col items-center justify-between py-12 px-6">
      <div className="text-center pt-8">
        <p className="text-green-400 text-sm font-semibold uppercase tracking-wider mb-2">
          TauTalk · encrypted
        </p>
        <p className="text-gray-400 text-lg">
          Incoming {isVideo ? 'video' : 'voice'} call
        </p>
      </div>

      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping scale-110" />
          <div className="relative ring-4 ring-green-500/40 rounded-full">
            <TauTalkAvatar
              name={callerName}
              imageUrl={call.caller?.avatar_url ?? null}
              size={120}
            />
          </div>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-white">{callerName}</p>
          <p className="text-gray-400 mt-2 flex items-center justify-center gap-2">
            {isVideo ? <Video className="w-5 h-5 text-green-400" /> : <Phone className="w-5 h-5 text-green-400" />}
            {isVideo ? 'Video call' : 'Voice call'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-10 pb-8">
        <button
          type="button"
          onClick={onDecline}
          className="flex flex-col items-center gap-2 group"
          aria-label="Decline call"
        >
          <span className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-500 transition-colors">
            <PhoneOff className="w-7 h-7 text-white" />
          </span>
          <span className="text-sm text-gray-400">Decline</span>
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="flex flex-col items-center gap-2 group"
          aria-label="Accept call"
        >
          <span className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center group-hover:bg-green-400 transition-colors">
            {isVideo ? (
              <Video className="w-7 h-7 text-black" />
            ) : (
              <Phone className="w-7 h-7 text-black" />
            )}
          </span>
          <span className="text-sm text-green-400 font-medium">Accept</span>
        </button>
      </div>
    </div>
  );
}
