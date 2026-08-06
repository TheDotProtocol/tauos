'use client';

import { useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff } from 'lucide-react';
import type { WebCallMediaState } from '@/lib/tautalk-web-call';
import { TAUTALK_UNAVAILABLE_MESSAGE } from '@/lib/tautalk-call-constants';

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

function statusLabel(media: WebCallMediaState, error?: string) {
  if (error) return error;
  if (media.connectionState === 'connected') return 'Connected';
  if (media.connectionState === 'unavailable') return TAUTALK_UNAVAILABLE_MESSAGE;
  if (media.connectionState === 'connecting') return 'Connecting…';
  if (media.connectionState === 'ringing') return 'Ringing…';
  return 'Calling…';
}

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

  const label = statusLabel(media, error);
  const ringing =
    media.connectionState === 'ringing' ||
    (media.connectionState === 'connecting' && !media.remoteStream);
  const unavailable =
    media.connectionState === 'unavailable' || label === TAUTALK_UNAVAILABLE_MESSAGE;

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
            <div
              className={`mx-auto mb-5 w-24 h-24 rounded-full flex items-center justify-center ${
                ringing ? 'bg-[rgba(212,175,55,0.2)] animate-pulse' : unavailable ? 'bg-red-500/15' : 'bg-white/[0.06]'
              }`}
            >
              {mode === 'video' ? (
                <Video className="w-10 h-10 text-[#D4AF37]" />
              ) : (
                <Phone className="w-10 h-10 text-[#D4AF37]" />
              )}
            </div>
            <p className="text-2xl font-bold text-white mb-2">{peerName || 'Contact'}</p>
            <p className={`${unavailable || error ? 'text-red-400' : 'text-gray-400'}`}>{label}</p>
          </div>
        )}
        {mode === 'video' && media.localStream ? (
          <video
            ref={localRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-24 right-4 w-32 h-44 object-cover rounded-xl border-2 border-[#D4AF37]/40 bg-[#0c0c12]"
          />
        ) : null}
      </div>

      <div className="flex items-center justify-center gap-4 pb-10 px-4">
        {!unavailable ? (
          <>
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
          </>
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
