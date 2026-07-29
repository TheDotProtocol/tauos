'use client';

import { useEffect, useRef, useState } from 'react';
import { FileUp, Image as ImageIcon, MapPin, Mic, Phone, Video, X } from 'lucide-react';

type Props = {
  open: boolean;
  recording: boolean;
  onClose: () => void;
  onPhoto: () => void;
  onFile: () => void;
  onLocation: () => void;
  onStartVoice: () => void;
  onStopVoice: () => void;
  onVoiceCall: () => void;
  onVideoCall: () => void;
};

export default function TauTalkAttachSheet({
  open,
  recording,
  onClose,
  onPhoto,
  onFile,
  onLocation,
  onStartVoice,
  onStopVoice,
  onVoiceCall,
  onVideoCall,
}: Props) {
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!recording) {
      setSeconds(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recording]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl p-5 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">Share</h3>
            <p className="text-xs text-gray-500">Encrypted attachments & calls</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={onPhoto}
            className="flex flex-col items-start text-left p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07]"
          >
            <ImageIcon className="w-6 h-6 text-green-400 mb-2" />
            <span className="font-medium">Photo</span>
            <span className="text-xs text-gray-500">Gallery or camera</span>
          </button>
          <button
            type="button"
            onClick={onFile}
            className="flex flex-col items-start text-left p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07]"
          >
            <FileUp className="w-6 h-6 text-green-400 mb-2" />
            <span className="font-medium">File</span>
            <span className="text-xs text-gray-500">Documents & more</span>
          </button>
          <button
            type="button"
            onClick={recording ? onStopVoice : onStartVoice}
            className={`flex flex-col items-start text-left p-3.5 rounded-xl border hover:bg-white/[0.07] ${
              recording
                ? 'bg-red-950/30 border-red-500 ring-2 ring-red-500'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <Mic
              className={`w-6 h-6 mb-2 ${recording ? 'text-red-400 animate-pulse' : 'text-green-400'}`}
            />
            <span className="font-medium">{recording ? `Recording ${seconds}s` : 'Voice note'}</span>
            <span className="text-xs text-gray-500">{recording ? 'Tap to send' : 'Tap to record'}</span>
          </button>
          <button
            type="button"
            onClick={onLocation}
            className="flex flex-col items-start text-left p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07]"
          >
            <MapPin className="w-6 h-6 text-green-400 mb-2" />
            <span className="font-medium">Location</span>
            <span className="text-xs text-gray-500">Share where you are</span>
          </button>
        </div>

        <div className="flex gap-3 pt-2 border-t border-gray-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              onVoiceCall();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/15 text-green-400 font-medium"
          >
            <Phone className="w-5 h-5" /> Voice call
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onVideoCall();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/15 text-green-400 font-medium"
          >
            <Video className="w-5 h-5" /> Video call
          </button>
        </div>
      </div>
    </div>
  );
}
