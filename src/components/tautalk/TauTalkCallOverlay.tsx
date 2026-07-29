'use client';

import { useEffect, useRef } from 'react';
import { Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react';
import type { WebCallMediaState } from '@/lib/tautalk-web-call';

type Props = {
  open: boolean;
  mode: 'voice' | 'video';
  peerName: string;
  media: WebCallMediaState;
  error?: string;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onHangup: () => void;
};

export default function TauTalkCallOverlay({
  open,
  mode,
  peerName,
  media,
  error,
  onToggleMute,
  onToggleCamera,
  onHangup,
}: Props) {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (localRef.current) {
      localRef.current.srcObject = media.localStream;
    }
  }, [media.localStream]);

  useEffect(() => {
    if (remoteRef.current) {
      remoteRef.current.srcObject = media.remoteStream;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = media.remoteStream;
      if (media.remoteStream) {
        remoteAudioRef.current.play().catch(() => {});
      }
    }
  }, [media.remoteStream]);

  if (!open) return null;

  const statusLabel =
    error ||
    (media.connectionState === 'connected'
      ? 'Connected'
      : media.connectionState === 'connecting'
        ? 'Connecting…'
        : 'Ringing…');

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col">
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      <div className="flex-1 relative flex items-center justify-center p-4">
        {mode === 'video' && media.remoteStream ? (
          <video
            ref={remoteRef}
            autoPlay
            playsInline
            className="max-h-full max-w-full rounded-2xl bg-gray-900"
          />
        ) : (
          <div className="text-center">
            <p className="text-2xl font-bold text-white mb-2">{peerName || 'Contact'}</p>
            <p className={`capitalize ${error ? 'text-red-400' : 'text-gray-400'}`}>{statusLabel}</p>
          </div>
        )}
        {mode === 'video' && media.localStream ? (
          <video
            ref={localRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-24 right-4 w-32 h-44 object-cover rounded-xl border-2 border-green-500/40 bg-gray-900"
          />
        ) : null}
      </div>

      <div className="flex items-center justify-center gap-4 pb-10 px-4">
        <button
          type="button"
          onClick={onToggleMute}
          className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700"
          aria-label={media.muted ? 'Unmute' : 'Mute'}
        >
          {media.muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        {mode === 'video' ? (
          <button
            type="button"
            onClick={onToggleCamera}
            className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700"
            aria-label={media.cameraOff ? 'Camera on' : 'Camera off'}
          >
            {media.cameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onHangup}
          className="p-4 rounded-full bg-red-600 text-white hover:bg-red-500"
          aria-label="End call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
