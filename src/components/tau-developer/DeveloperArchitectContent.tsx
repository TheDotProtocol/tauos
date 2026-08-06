'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Loader2, ChevronDown } from 'lucide-react';
import type { ArchitectPhaseId } from '@/lib/tau-ide/architect/phases';
import { ARCHITECT_PHASES } from '@/lib/tau-ide/architect/phases';
import {
  loadMemory, saveMemory, updateMemoryFromResponse, createEmptyMemory, type ProjectMemory,
} from '@/lib/tau-ide/architect/memory';
import { extractMermaidDiagrams, parseProjectBlock } from '@/lib/tau-ide/architect/project-generator';
import { upsertProject, getActiveProject, getActiveProjectId, loadProjects } from '@/lib/tau-ide/projects';
import { authHeaders } from '@/lib/tau-ide/sync-client';
import { getStoredToken } from '@/lib/tau-ide/auth-client';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { tauDev } from '@/lib/tau-developer/theme';

type Message = { role: 'user' | 'assistant'; content: string; phase?: ArchitectPhaseId };

const TECH_TAGS = ['TauServer', 'API Gateway', 'Cluster Redis', 'RabbitMQ', 'IsolatedMemoryPool'];

export default function DeveloperArchitectContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Welcome to Tau Architect. Tell me what you want to build and I will guide you through discovery, architecture, and implementation.',
      phase: 'discovery',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<ArchitectPhaseId>('discovery');
  const [mode] = useState<'beginner' | 'professional'>('professional');
  const [memory, setMemory] = useState<ProjectMemory>(() => createEmptyMemory(getActiveProjectId()));
  const [projectId, setProjectId] = useState(getActiveProjectId());
  const [streamingText, setStreamingText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProjects().then(() => {
      const id = getActiveProjectId();
      setProjectId(id);
      loadMemory(id).then((m) => {
        setMemory(m);
        setPhase(m.currentPhase);
      });
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    const next = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(next);
    setLoading(true);
    setStreamingText('');

    try {
      if (!getStoredToken()) throw new Error('Sign in required to use Tau Architect.');
      const res = await fetch('/api/tau-ide/architect', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
          phase,
          mode,
          memory: { ...memory, projectId },
          projectId,
          stream: true,
        }),
      });

      if (res.headers.get('content-type')?.includes('text/event-stream')) {
        const reader = res.body?.getReader();
        if (!reader) throw new Error('No stream');
        const decoder = new TextDecoder();
        let full = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          for (const line of decoder.decode(value).split('\n')) {
            if (!line.startsWith('data: ')) continue;
            const payload = line.slice(6).trim();
            if (payload === '[DONE]') break;
            try {
              const chunk = JSON.parse(payload);
              if (chunk.delta) {
                full += chunk.delta;
                setStreamingText(full);
              }
            } catch {
              /* skip */
            }
          }
        }
        setMessages((prev) => [...prev, { role: 'assistant', content: full, phase }]);
        setStreamingText('');
        processResponse(full);
      } else {
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message, phase }]);
        processResponse(data.message);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${e instanceof Error ? e.message : 'Request failed'}.`,
          phase,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const processResponse = useCallback(
    (content: string) => {
      const updated = updateMemoryFromResponse(memory, phase, content);
      updated.projectId = projectId;
      setMemory(updated);
      saveMemory(updated);
      extractMermaidDiagrams(content);
    },
    [memory, phase, projectId]
  );

  const generateBoilerplate = () => {
    const last = [...messages].reverse().find((m) => m.role === 'assistant');
    if (!last) return alert('No project to import yet.');
    const project = parseProjectBlock(last.content);
    if (!project) return alert('Ask Tau Architect to generate a project first.');
    const existing = getActiveProject();
    upsertProject({
      ...existing,
      name: project.projectName,
      description: project.description || existing.description,
      files: project.files.map((f) => ({
        path: f.path.startsWith('/') ? f.path : `/${f.path}`,
        name: f.path.split('/').pop() || f.path,
        content: f.content,
      })),
    }).then(() => alert(`"${project.projectName}" imported with ${project.files.length} files.`));
  };

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');

  return (
    <div className={`${geistSans.className} flex h-[calc(100vh-4rem)] gap-5 p-8`}>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div
          className="flex min-h-0 flex-1 flex-col rounded-xl border"
          style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
        >
          <div className="flex items-center justify-between border-b p-5" style={{ borderColor: tauDev.border }}>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[#f5a623]" />
              <p className="text-sm font-semibold text-[#fafafa]">Architect AI Session</p>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5"
              style={{ backgroundColor: tauDev.surfaceElevated, borderColor: tauDev.border }}
            >
              <span className={`${geistMono.className} text-[11px] text-[#f5a623]`}>Model: Tau AI v3</span>
              <ChevronDown className="size-2.5 text-[#52525b]" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {lastUser && (
              <div className="mb-4">
                <p className="mb-1.5 text-[11px] font-semibold text-[#a1a1aa]">You</p>
                <div className="rounded-lg p-3" style={{ backgroundColor: tauDev.surfaceElevated }}>
                  <p className="text-[13px] text-[#fafafa]">{lastUser.content}</p>
                </div>
              </div>
            )}

            {(lastAssistant || streamingText) && (
              <div>
                <p className="mb-1.5 text-[11px] font-semibold text-[#f5a623]">Tau Architect AI</p>
                <div
                  className="rounded-lg border p-3.5"
                  style={{ backgroundColor: tauDev.bg, borderColor: tauDev.border }}
                >
                  <p className="whitespace-pre-wrap text-[13px] leading-5 text-[#a1a1aa]">
                    {streamingText || lastAssistant?.content}
                    {streamingText && <span className="animate-pulse">▊</span>}
                  </p>
                  {!streamingText && (
                    <>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {TECH_TAGS.map((tag) => (
                          <span
                            key={tag}
                            className={`${geistMono.className} rounded border px-2 py-0.5 text-[10px] text-[#f5a623]`}
                            style={{ backgroundColor: tauDev.goldMuted, borderColor: tauDev.goldBorder }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#52525b]">
                          Estimated Latency Matrix
                        </p>
                        <div className="mt-1 flex justify-between text-xs">
                          <span className="text-[#a1a1aa]">Gateway Parse & Filter</span>
                          <span className={`${geistMono.className} font-semibold text-[#10b981]`}>12μs</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {loading && !streamingText && (
              <div className="mt-4 flex items-center gap-2 text-xs text-[#52525b]">
                <Loader2 className="size-3.5 animate-spin" />
                Tau Architect is working…
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t p-4" style={{ borderColor: tauDev.border }}>
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={`Continue ${ARCHITECT_PHASES.find((p) => p.id === phase)?.label ?? 'session'}…`}
                rows={2}
                className="flex-1 resize-none rounded-lg border bg-transparent px-3 py-2 text-sm text-[#fafafa] placeholder-[#52525b] focus:outline-none"
                style={{ borderColor: tauDev.border, backgroundColor: tauDev.surfaceElevated }}
              />
              <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                className="self-end rounded-lg px-3 py-2 text-[#060608] disabled:opacity-50"
                style={{ backgroundColor: tauDev.gold }}
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between rounded-xl border p-4"
          style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
        >
          <p className="text-[13px] text-[#a1a1aa]">Ready to deploy the template structure?</p>
          <button
            type="button"
            onClick={generateBoilerplate}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[#060608]"
            style={{ backgroundColor: tauDev.gold }}
          >
            <Sparkles className="size-3.5" />
            Generate Boilerplate
          </button>
        </div>
      </div>

      <aside
        className="hidden w-[400px] shrink-0 flex-col rounded-xl border p-5 lg:flex"
        style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
      >
        <p className="mb-5 text-sm font-semibold text-[#fafafa]">Architecture Overview</p>
        <div
          className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border p-4"
          style={{ backgroundColor: tauDev.surfaceElevated, borderColor: tauDev.border }}
        >
          <Node label="Client Frontend" />
          <Connector />
          <Node label="Tau API Gateway" highlight />
          <Connector />
          <div className="flex gap-4">
            <Node label="Compute Node" small />
            <Node label="Isolated Memory" small />
          </div>
        </div>
      </aside>
    </div>
  );
}

function Node({ label, highlight, small }: { label: string; highlight?: boolean; small?: boolean }) {
  return (
    <div
      className={`rounded-md border px-3 py-2 text-center ${small ? 'w-[120px] text-[11px]' : 'w-[200px] text-[13px]'}`}
      style={{
        backgroundColor: tauDev.surface,
        borderColor: highlight ? tauDev.goldBorder : tauDev.border,
        color: highlight ? tauDev.gold : small ? tauDev.textMuted : tauDev.text,
      }}
    >
      {label}
    </div>
  );
}

function Connector() {
  return <div className="h-4 w-px" style={{ backgroundColor: tauDev.gold }} />;
}
