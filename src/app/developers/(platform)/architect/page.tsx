'use client';

import { useState, useRef, useEffect } from 'react';
import PlatformShell from '@/components/tau-ide/PlatformShell';
import { Send, Sparkles, FileText, Loader2, Download } from 'lucide-react';
import type { ArchitectMessage } from '@/lib/tau-ide/architect-prompt';
import { getActiveProject, upsertProject } from '@/lib/tau-ide/projects';
import Link from 'next/link';

export default function ArchitectPage() {
  const [messages, setMessages] = useState<ArchitectMessage[]>([
    {
      role: 'assistant',
      content: `Welcome to **Tau Architect** — your AI software architect inside Tau IDE.

Tell me what you want to build in plain English. I'll ask follow-up questions, then produce:
- Product Requirements Document
- System architecture
- Database & API design
- Implementation plan
- TauScript code for your project

What would you like to create?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<'gather' | 'design' | 'implement'>('gather');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    const next = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch('/api/tau-ide/architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, phase }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      if (data.phase) setPhase(data.phase);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${e instanceof Error ? e.message : 'Request failed'}. You can continue the conversation.` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const importProject = () => {
    const last = [...messages].reverse().find((m) => m.role === 'assistant');
    if (!last) return;
    const match = last.content.match(/```tauscript-project\n([\s\S]*?)```/);
    if (!match) return alert('No project block found. Ask Tau Architect to generate implementation.');
    try {
      const parsed = JSON.parse(match[1]) as { projectName: string; files: { path: string; content: string }[] };
      const project = getActiveProject();
      upsertProject({
        ...project,
        name: parsed.projectName || project.name,
        files: parsed.files.map((f) => ({ path: f.path, name: f.path.split('/').pop() || f.path, content: f.content })),
      });
      alert('Project imported! Open Tau IDE workspace to review.');
    } catch {
      alert('Could not parse project JSON.');
    }
  };

  return (
    <PlatformShell title="Tau Architect" mode="architect">
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="px-4 py-3 border-b border-white/10 glass flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-400">Phase:</span>
            {(['gather', 'design', 'implement'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPhase(p)}
                className={`px-2 py-1 rounded text-xs capitalize ${
                  phase === p ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={importProject} className="btn-secondary text-xs py-1.5 px-3">
              <Download className="w-3.5 h-3.5" /> Import to IDE
            </button>
            <Link href="/developers/workspace" className="btn-primary text-xs py-1.5 px-3">
              Open IDE
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-cyan-500/20 text-white border border-cyan-500/30'
                    : 'glass text-gray-200'
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Tau Architect is thinking…
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-white/10 glass-strong">
          <div className="max-w-4xl mx-auto flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Describe your software idea…"
              rows={2}
              className="flex-1 px-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none resize-none"
            />
            <button onClick={send} disabled={loading || !input.trim()} className="btn-primary px-4 self-end disabled:opacity-50">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </PlatformShell>
  );
}
