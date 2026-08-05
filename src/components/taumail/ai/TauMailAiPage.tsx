'use client';

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { geistSans, outfit } from '@/lib/website/fonts';
import { tauMailAssets } from '@/lib/taumail/assets';
import TauMailAppShell from '@/components/taumail/shared/TauMailAppShell';
import { MailIcon } from '@/components/taumail/shared/MailIcon';
import { fetchTauMailAi, sendTauMailAiMessage, type TauMailAiMessage } from '@/lib/taumail/api-client';
import { useTauMailSession } from '@/hooks/useTauMailSession';

export default function TauMailAiPage() {
  const { ready, isLoggedIn } = useTauMailSession();
  const [messages, setMessages] = useState<TauMailAiMessage[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!ready || !isLoggedIn) return;
    fetchTauMailAi()
      .then(({ messages: m, prompts: p }) => {
        setMessages(m);
        setPrompts(p);
      })
      .catch(console.error);
  }, [ready, isLoggedIn]);

  const handleSend = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || sending) return;
    setSending(true);
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: message }]);
    try {
      const reply = await sendTauMailAiMessage(message);
      if (reply) setMessages((prev) => [...prev, reply]);
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  if (!ready || !isLoggedIn) {
    return <div className={`${geistSans.className} flex min-h-screen items-center justify-center bg-[#070708] text-[#a1a1aa]`}>Loading...</div>;
  }

  return (
    <TauMailAppShell active="ai">
      <div className={`${geistSans.className} flex min-h-0 flex-1`}>
        <aside className="w-[280px] shrink-0 border-r border-[rgba(255,255,255,0.05)] p-5">
          <h2 className="text-sm font-semibold text-white">AI Intelligence Menu</h2>
          <div className="mt-4 space-y-2">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="w-full rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214] p-3 text-left text-xs text-[#a1a1aa] hover:text-white"
              >
                {prompt}
              </button>
            ))}
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-[rgba(255,255,255,0.05)] px-8 py-4">
            <h1 className={`${outfit.className} text-[22px] font-bold text-white`}>AI Assistant</h1>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-8">
            {messages.map((msg, i) => (
              <div
                key={msg.id ?? i}
                className={clsx(
                  'max-w-[80%] rounded-xl p-4 text-sm',
                  msg.role === 'assistant' ? 'bg-[#121214] text-[#a1a1aa]' : 'ml-auto bg-[rgba(212,168,67,0.08)] text-white',
                )}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="border-t border-[rgba(255,255,255,0.05)] p-4">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Tau AI anything about your mail..."
                className="flex-1 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214] px-4 py-3 text-sm text-white outline-none"
              />
              <button type="button" onClick={() => handleSend()} disabled={sending} className="rounded-lg bg-[#d4a843] px-4 py-3 disabled:opacity-60">
                <MailIcon src={tauMailAssets.icons.send} size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </TauMailAppShell>
  );
}
