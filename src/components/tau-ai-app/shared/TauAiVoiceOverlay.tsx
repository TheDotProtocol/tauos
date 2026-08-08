'use client';

import Link from 'next/link';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';
import { useTauAiVoice } from '@/lib/tau-ai-app/useTauAiVoice';

type TauAiVoiceOverlayProps = {
  open: boolean;
  onClose: () => void;
  onComplete?: (transcription: string, response: string) => void;
};

function phaseLabel(phase: string): string {
  switch (phase) {
    case 'loading':
      return 'Loading voice…';
    case 'listening':
      return 'Listening…';
    case 'processing':
      return 'Processing via Tau Foundation…';
    case 'done':
      return 'Complete';
    case 'error':
      return 'Voice unavailable';
    default:
      return 'Tap to speak';
  }
}

export default function TauAiVoiceOverlay({ open, onClose, onComplete }: TauAiVoiceOverlayProps) {
  const {
    phase,
    status,
    transcription,
    response,
    error,
    verification,
    startListening,
    stopRecording,
    reset,
  } = useTauAiVoice();

  if (!open) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 px-[40px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-overlay-title"
    >
      <button
        type="button"
        onClick={handleClose}
        className="absolute right-[40px] top-[32px] text-[13px] font-medium text-[#999] hover:text-white"
      >
        Close
      </button>

      <div className="flex max-w-[480px] flex-col items-center gap-[24px]">
        <div className="relative flex size-[200px] items-center justify-center">
          <TauAiIcon src={tauAiAssets.icons.innerRing} size={200} className="absolute opacity-40" />
          <button
            type="button"
            onClick={() => {
              if (phase === 'listening') stopRecording();
              else if (phase === 'idle' || phase === 'done' || phase === 'error') void startListening();
            }}
            disabled={phase === 'loading' || phase === 'processing'}
            className="flex size-[120px] items-center justify-center rounded-full border border-[rgba(212,168,67,0.32)] bg-[rgba(212,168,67,0.08)] disabled:opacity-50"
          >
            <TauAiIcon src={phase === 'listening' ? tauAiAssets.icons.micOff : tauAiAssets.icons.mic} size={40} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-[8px] text-center">
          <h2 id="voice-overlay-title" className="text-[24px] font-bold text-white">
            {phaseLabel(phase)}
          </h2>
          {status ? (
            <p className="text-[12px] text-[#666]">
              {status.pipeline} · STT: {status.stt.substrate} · {verification}
            </p>
          ) : null}
          {error ? <p className="text-[13px] text-[#f87171]">{error}</p> : null}
          {transcription ? (
            <p className="text-[14px] text-[#999]">
              <span className="font-semibold text-[#d4a843]">You: </span>
              {transcription}
            </p>
          ) : null}
          {response ? (
            <p className="text-[14px] text-white">
              <span className="font-semibold text-[#d4a843]">Tau: </span>
              {response}
            </p>
          ) : null}
          {!error && phase === 'idle' ? (
            <p className="max-w-[400px] text-[14px] text-[#999]">
              Tap the microphone to speak. Audio flows through governed STT → Tau Foundation → client TTS.
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-[16px]">
          {phase === 'done' && transcription && response ? (
            <button
              type="button"
              onClick={() => {
                onComplete?.(transcription, response);
                handleClose();
              }}
              className="rounded-[20px] bg-gradient-to-r from-[#f0d78c] via-[#d4a843] to-[#b8922e] px-[20px] py-[10px] text-[13px] font-bold text-black"
            >
              Use in chat
            </button>
          ) : null}
          <Link
            href="/tau-ai-app/chat"
            onClick={handleClose}
            className="flex size-[56px] items-center justify-center rounded-full border border-[#222] bg-[#111]"
            title="Switch to keyboard"
          >
            <TauAiIcon src={tauAiAssets.icons.keyboard} size={22} />
          </Link>
        </div>
      </div>
    </div>
  );
}
