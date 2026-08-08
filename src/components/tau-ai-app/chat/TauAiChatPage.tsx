'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useRef, useState } from 'react';
import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import TauAiLogo from '@/components/tau-ai-app/shared/TauAiLogo';
import TauAiModelSelectionModal from '@/components/tau-ai-app/shared/TauAiModelSelectionModal';
import TauAiVoiceOverlay from '@/components/tau-ai-app/shared/TauAiVoiceOverlay';
import { sendTauFoundationChat, type TauFoundationChatMessage } from '@/lib/tau-ai-app/api-client';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';
import { tauAiChatFollowUps } from '@/lib/tau-ai-app/demo-data';

type ChatMessage = TauFoundationChatMessage & { id: string; isDemo?: boolean };

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: 'demo-user',
    role: 'user',
    content:
      'Tau, compare our Q3 performance indicators against competitors A and B. Highlight any outstanding anomalies and summarize in a structured table.',
    isDemo: true,
  },
  {
    id: 'demo-assistant',
    role: 'assistant',
    content: 'DEMO_Q3_RESPONSE',
    isDemo: true,
  },
];

function DemoAssistantBubble() {
  return (
    <div className="flex w-full gap-[16px]">
      <TauAiLogo variant="emblem" width={36} height={36} className="shrink-0 rounded-[18px]" />
      <div className="flex min-w-0 flex-1 max-w-[760px] flex-col gap-[20px]">
        <div className="flex flex-col gap-[12px]">
          <p className="text-[18px] font-bold text-[#d4a843]">Q3 Competitor Performance Delta</p>
          <p className="text-[14px] leading-[22px] text-[#999]">
            Based on local market intelligence updates synced at 18:00 UTC, your growth vectors remained
            highly stable despite increased customer acquisition compression.
          </p>
          <div className="flex flex-col gap-[6px] text-[14px] text-white">
            <p>
              <span className="leading-[20px]">• </span>
              <span className="font-semibold leading-[20px] text-[#f0d78c]">Anomalous Spikes:</span>
              <span className="leading-[20px]">
                {' '}
                Region A witnessed a 14.8% growth delta, mainly attributed to systemic Enterprise node
                expansions.
              </span>
            </p>
            <p>
              <span className="leading-[20px]">• </span>
              <span className="font-semibold leading-[20px] text-[#f0d78c]">Efficiency Delta:</span>
              <span className="leading-[20px]">
                {' '}
                CAC Efficiency improved to 1.8x, strongly outpacing both key targets.
              </span>
            </p>
          </div>
        </div>

        <div className="w-full max-w-[760px] overflow-hidden rounded-[8px] border border-[#222] bg-[#111] text-[13px]">
          <div className="flex gap-[24px] border-b border-[rgba(212,168,67,0.16)] bg-[rgba(212,168,67,0.08)] p-[12px] font-bold text-[#d4a843]">
            <p className="min-w-0 flex-1">Performance Metric</p>
            <p className="w-[120px] shrink-0 text-right">Region A</p>
            <p className="w-[120px] shrink-0 text-right">Region B</p>
          </div>
          {[
            ['Aggregate Q3 Rev', '$42.4M', '$39.1M'],
            ['Growth Delta (%)', '+14.8%', '+11.2%'],
            ['CAC Efficiency', '1.8x', '1.4x'],
            ['Churn Rate (Q3)', '1.1%', '1.4%'],
          ].map(([metric, a, b], i, arr) => (
            <div
              key={metric}
              className={`flex gap-[24px] p-[12px] ${i < arr.length - 1 ? 'border-b border-[#222]' : ''}`}
            >
              <p className="min-w-0 flex-1 font-medium text-white">{metric}</p>
              <p className="w-[120px] shrink-0 text-right text-[#f0d78c]">{a}</p>
              <p className="w-[120px] shrink-0 text-right text-[#999]">{b}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-[6px]">
          <TauAiIcon src={tauAiAssets.icons.link} size={12} />
          <p className="text-[12px] font-semibold text-[#d4a843]">Source: Internal Q3 Financial Stream</p>
        </div>

        <div className="flex gap-[12px]">
          {['Copy', 'Share', 'Export'].map((label) => (
            <button
              key={label}
              type="button"
              className="rounded-[6px] border border-[#222] bg-[#111] px-[12px] py-[6px] text-[12px] font-medium text-[#999]"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TauAiChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveMode, setLiveMode] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [selectedSubstrate, setSelectedSubstrate] = useState('auto');
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  }, []);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    setLiveMode(true);
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: trimmed };
    const nextMessages = liveMode ? [...messages, userMsg] : [userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    scrollToBottom();

    try {
      const apiMessages = nextMessages
        .filter((m) => !m.isDemo)
        .map(({ role, content }) => ({ role, content }));

      const result = await sendTauFoundationChat({ messages: apiMessages });
      setMessages((prev) => [
        ...prev.filter((m) => !m.isDemo),
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: result.message ?? '',
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reach Tau Foundation');
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void handleSend(input);
  };

  return (
    <TauAiAppShell active="chat" fullHeight>
      <div className="flex min-h-0 flex-1 flex-col justify-between px-[40px] py-[32px]">
        <div className="flex w-full shrink-0 items-center justify-between border-b border-[#222] pb-[16px]">
          <div className="flex flex-col gap-[4px]">
            <p className="text-[18px] font-bold text-white">Q3 Market Analysis</p>
            <p className="text-[12px] text-[#999]">Last updated 2 hours ago • Local AI Engine</p>
          </div>
          <div className="flex items-center gap-[12px]">
            <Link
              href="/tau-ai-app/chat/history"
              className="text-[13px] font-medium text-[#999] hover:text-[#d4a843]"
            >
              History
            </Link>
            <Link
              href="/tau-ai-app/search"
              className="text-[13px] font-medium text-[#999] hover:text-[#d4a843]"
            >
              Search
            </Link>
            {[
              { label: 'Share', icon: tauAiAssets.icons.share },
              { label: 'Export PDF', icon: tauAiAssets.icons.download },
            ].map(({ label, icon }) => (
              <button
                key={label}
                type="button"
                className="flex items-center gap-[8px] rounded-[6px] border border-[#222] bg-[#111] px-[16px] py-[8px] text-[13px] font-medium text-[#999]"
                title="UI only — integration pending"
              >
                <TauAiIcon src={icon} size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-[24px] overflow-y-auto py-[24px]">
          {messages.map((msg) =>
            msg.role === 'user' ? (
              <div key={msg.id} className="flex w-full justify-end">
                <div className="w-full max-w-[640px] rounded-bl-[12px] rounded-br-[2px] rounded-tl-[12px] rounded-tr-[12px] border border-[#222] bg-[#111] p-[16px]">
                  <p className="text-[14px] leading-[22px] text-white">{msg.content}</p>
                </div>
              </div>
            ) : msg.isDemo && msg.content === 'DEMO_Q3_RESPONSE' ? (
              <DemoAssistantBubble key={msg.id} />
            ) : (
              <div key={msg.id} className="flex w-full gap-[16px]">
                <TauAiLogo variant="emblem" width={36} height={36} className="shrink-0 rounded-[18px]" />
                <div className="min-w-0 flex-1 max-w-[760px]">
                  <p className="whitespace-pre-wrap text-[14px] leading-[22px] text-white">{msg.content}</p>
                </div>
              </div>
            ),
          )}

          {loading ? (
            <div className="flex gap-[16px]">
              <TauAiLogo variant="emblem" width={36} height={36} className="shrink-0 rounded-[18px]" />
              <p className="text-[14px] text-[#999]">Tau is thinking…</p>
            </div>
          ) : null}

          {!liveMode ? (
            <div className="flex w-full max-w-[760px] items-center gap-[12px] rounded-[8px] border border-[rgba(212,168,67,0.16)] bg-[#1a1a1a] px-[16px] py-[12px]">
              <TauAiIcon src={tauAiAssets.icons.cpuReasoning} size={16} />
              <p className="min-w-0 flex-1 text-[13px] font-medium text-[#d4a843]">
                Reasoning: Analysed 3 sources • Cross-referenced market data • Generated insights
              </p>
              <TauAiIcon src={tauAiAssets.icons.chevronDown} size={14} />
            </div>
          ) : null}

          {error ? <p className="text-[13px] text-red-400">{error}</p> : null}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-[16px] pt-[16px]">
          <div className="flex flex-wrap gap-[8px]">
            {tauAiChatFollowUps.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => void handleSend(pill)}
                className="rounded-[20px] border border-[rgba(212,168,67,0.16)] bg-[#111] px-[16px] py-[8px] text-[13px] font-medium text-[#d4a843]"
              >
                {pill}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              onClick={() => setModelOpen(true)}
              className="rounded-[20px] border border-[rgba(212,168,67,0.16)] bg-[#111] px-[12px] py-[6px] text-[12px] font-semibold text-[#d4a843]"
            >
              Auto Router
            </button>
            <Link
              href="/tau-ai-app/chat/models"
              className="text-[12px] text-[#666] hover:text-[#999]"
            >
              Change
            </Link>
          </div>

          <form
            onSubmit={onSubmit}
            className="flex w-full items-center gap-[12px] rounded-[30px] border border-[#222] bg-[#111] px-[12px] py-[8px]"
          >
            <div className="flex shrink-0 gap-[8px]">
              <button type="button" className="flex size-[36px] items-center justify-center rounded-[18px]" aria-label="Attach">
                <TauAiIcon src={tauAiAssets.icons.paperclip} size={18} />
              </button>
              <button
                type="button"
                onClick={() => setVoiceOpen(true)}
                className="flex size-[36px] items-center justify-center rounded-[18px]"
                aria-label="Voice"
              >
                <TauAiIcon src={tauAiAssets.icons.mic} size={18} />
              </button>
            </div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Tau AI..."
              className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-[#999]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex size-[40px] shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-r from-[#f0d78c] via-[#d4a843] to-[#b8922e] disabled:opacity-50"
              aria-label="Send"
            >
              <TauAiIcon src={tauAiAssets.icons.arrowUp} size={18} />
            </button>
          </form>
        </div>
      </div>

      <TauAiModelSelectionModal
        open={modelOpen}
        onClose={() => setModelOpen(false)}
        selectedId={selectedSubstrate}
        onSelect={setSelectedSubstrate}
      />
      <TauAiVoiceOverlay
        open={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onComplete={(text) => {
          setVoiceOpen(false);
          void handleSend(text);
        }}
      />
    </TauAiAppShell>
  );
}
