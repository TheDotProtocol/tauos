'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import TauAiModelSelectionModal from '@/components/tau-ai-app/shared/TauAiModelSelectionModal';
import TauAiVoiceOverlay from '@/components/tau-ai-app/shared/TauAiVoiceOverlay';
import TauAiLogo from '@/components/tau-ai-app/shared/TauAiLogo';
import { TauAiEngineStatus } from '@/components/tau-ai-app/shared/TauAiTopBar';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';
import { tauAiNewChatCapabilities, tauAiNewChatSuggestions } from '@/lib/tau-ai-app/demo-data';
import { sendTauFoundationChat } from '@/lib/tau-ai-app/api-client';

const capabilityIcons: Record<string, string> = {
  globe2: tauAiAssets.icons.globe2,
  fileSearch: tauAiAssets.icons.fileSearch,
  terminalSquare: tauAiAssets.icons.terminalSquare,
  eye: tauAiAssets.icons.eye,
};

export default function TauAiNewChatPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [selectedSubstrate, setSelectedSubstrate] = useState('auto');

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    try {
      await sendTauFoundationChat({ messages: [{ role: 'user', content: trimmed }] });
      router.push('/tau-ai-app/chat');
    } catch {
      router.push('/tau-ai-app/chat');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void handleSend(input);
  };

  return (
    <TauAiAppShell active="chat" fullHeight>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-between px-[80px] pb-[32px] pt-[40px]">
        <div className="flex w-full items-center justify-between">
          <p className="text-[16px] font-semibold text-[#999]">New Chat</p>
          <TauAiEngineStatus />
        </div>

        <div className="flex w-full max-w-[720px] flex-col items-center gap-[36px]">
          <div className="flex flex-col items-center gap-[16px]">
            <div className="rounded-[100px] border border-[rgba(212,168,67,0.16)] p-[16px]">
              <TauAiLogo variant="emblem" width={80} height={80} />
            </div>
            <h1 className="text-[28px] font-bold text-white">How can I help you today?</h1>
          </div>

          <div className="grid w-full grid-cols-1 gap-[12px] sm:grid-cols-2">
            {tauAiNewChatSuggestions.map((s) => (
              <button
                key={s.title}
                type="button"
                onClick={() => void handleSend(s.description)}
                className="flex flex-col gap-[6px] rounded-[12px] border border-[#222] bg-[#111] p-[16px] text-left"
              >
                <div className="flex items-center gap-[8px]">
                  <TauAiIcon src={tauAiAssets.icons.code} size={14} />
                  <span className="text-[14px] font-semibold text-white">{s.title}</span>
                </div>
                <span className="text-[12px] leading-[16px] text-[#999]">{s.description}</span>
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex w-full flex-col gap-[8px]">
            <div className="flex w-full items-center gap-[12px] rounded-[30px] border border-[#222] bg-[#1a1a1a] py-[8px] pl-[16px] pr-[8px]">
              <div className="flex items-center gap-[8px]">
                <button type="button" aria-label="Attach">
                  <TauAiIcon src={tauAiAssets.icons.paperclip} size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setModelOpen(true)}
                  className="flex items-center gap-[6px] rounded-[16px] border border-[rgba(212,168,67,0.16)] bg-[#111] px-[12px] py-[6px] text-[12px] font-semibold text-[#d4a843]"
                  title="Model selected by Tau Foundation router — not a Tau-owned weight"
                >
                  Auto
                  <TauAiIcon src={tauAiAssets.icons.arrowDown} size={10} />
                </button>
              </div>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-[#666]"
              />
              <div className="flex items-center gap-[8px]">
                <button type="button" onClick={() => setVoiceOpen(true)} aria-label="Voice">
                  <TauAiIcon src={tauAiAssets.icons.mic} size={18} />
                </button>
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex size-[36px] items-center justify-center rounded-full bg-gradient-to-r from-[#f0d78c] via-[#d4a843] to-[#b8922e] disabled:opacity-50"
                >
                  <TauAiIcon src={tauAiAssets.icons.arrowUp} size={18} />
                </button>
              </div>
            </div>
            <p className="text-center text-[11px] text-[#666]">
              Tau AI can make mistakes. Verify important information.
            </p>
          </form>
        </div>

        <div className="flex flex-wrap justify-center gap-[12px]">
          {tauAiNewChatCapabilities.map((cap) => (
            <div
              key={cap.label}
              className="flex items-center gap-[8px] rounded-[20px] border border-[#222] bg-[#111] px-[16px] py-[8px]"
            >
              <TauAiIcon src={capabilityIcons[cap.icon]} size={14} />
              <span className="text-[13px] font-medium text-white">{cap.label}</span>
            </div>
          ))}
        </div>
      </div>

      <TauAiModelSelectionModal
        open={modelOpen}
        onClose={() => setModelOpen(false)}
        selectedId={selectedSubstrate}
        onSelect={setSelectedSubstrate}
      />
      <TauAiVoiceOverlay open={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </TauAiAppShell>
  );
}
