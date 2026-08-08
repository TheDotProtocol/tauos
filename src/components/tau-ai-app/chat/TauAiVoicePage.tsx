'use client';

import Link from 'next/link';
import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';
import { useTauAiVoice } from '@/lib/tau-ai-app/useTauAiVoice';

export default function TauAiVoicePage() {
  const {
    phase,
    status,
    transcription,
    response,
    error,
    verification,
    startListening,
    stopRecording,
  } = useTauAiVoice();

  return (
    <TauAiAppShell active="chat" fullHeight>
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-[32px] px-[40px]">
        <Link href="/tau-ai-app/chat" className="absolute right-[40px] top-[32px] text-[13px] text-[#999] hover:text-white">
          Close
        </Link>

        <div className="relative flex size-[240px] items-center justify-center">
          <TauAiIcon src={tauAiAssets.icons.innerRing} size={240} className="absolute opacity-30" />
          <button
            type="button"
            onClick={() => {
              if (phase === 'listening') stopRecording();
              else if (phase !== 'loading' && phase !== 'processing') void startListening();
            }}
            disabled={phase === 'loading' || phase === 'processing'}
            className="flex size-[140px] items-center justify-center rounded-full border border-[rgba(212,168,67,0.32)] bg-[rgba(212,168,67,0.08)] disabled:opacity-50"
          >
            <TauAiIcon src={phase === 'listening' ? tauAiAssets.icons.micOff : tauAiAssets.icons.mic} size={48} />
          </button>
        </div>

        <div className="flex max-w-[520px] flex-col items-center gap-[8px] text-center">
          <h1 className="text-[28px] font-bold text-white">Voice Mode</h1>
          {status ? (
            <p className="text-[12px] text-[#666]">
              {status.pipeline} · verification: {verification}
            </p>
          ) : null}
          {error ? <p className="text-[14px] text-[#f87171]">{error}</p> : null}
          {transcription ? (
            <p className="text-[14px] text-[#999]">
              <span className="text-[#d4a843]">You: </span>
              {transcription}
            </p>
          ) : null}
          {response ? (
            <p className="text-[14px] text-white">
              <span className="text-[#d4a843]">Tau: </span>
              {response}
            </p>
          ) : null}
          <p className="text-[14px] leading-[22px] text-[#999]">
            Governed voice path: STT substrate → Tau Foundation → client speech synthesis.
          </p>
        </div>

        <div className="flex items-center gap-[20px]">
          <Link
            href="/tau-ai-app/chat"
            className="flex size-[64px] items-center justify-center rounded-full border border-[#991b1b] bg-[rgba(153,27,27,0.2)]"
            title="Cancel"
          >
            <span className="text-[24px] text-[#f87171]">×</span>
          </Link>
          <Link
            href="/tau-ai-app/chat"
            className="flex size-[64px] items-center justify-center rounded-full border border-[#222] bg-[#111]"
            title="Switch to keyboard"
          >
            <TauAiIcon src={tauAiAssets.icons.keyboard} size={24} />
          </Link>
        </div>
      </div>
    </TauAiAppShell>
  );
}
