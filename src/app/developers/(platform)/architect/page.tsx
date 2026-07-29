'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import PlatformShell from '@/components/tau-ide/PlatformShell';
import PhaseNav from '@/components/tau-ide/architect/PhaseNav';
import AgentStatus from '@/components/tau-ide/architect/AgentStatus';
import ProgressTracker from '@/components/tau-ide/architect/ProgressTracker';
import ArchitectureDiagram from '@/components/tau-ide/architect/ArchitectureDiagram';
import {
  Send, Sparkles, Loader2, Download, ChevronRight, PanelRightOpen, PanelRightClose,
  Play, CheckCircle, Settings2
} from 'lucide-react';
import type { ArchitectPhaseId } from '@/lib/tau-ide/architect/phases';
import { ARCHITECT_PHASES } from '@/lib/tau-ide/architect/phases';
import {
  loadMemory, saveMemory, updateMemoryFromResponse, createEmptyMemory, type ProjectMemory
} from '@/lib/tau-ide/architect/memory';
import { extractMermaidDiagrams, parseProjectBlock } from '@/lib/tau-ide/architect/project-generator';
import { upsertProject, getActiveProject, getActiveProjectId, loadProjects } from '@/lib/tau-ide/projects';
import { authHeaders } from '@/lib/tau-ide/sync-client';
import { getStoredToken } from '@/lib/tau-ide/auth-client';
import Link from 'next/link';

type Message = { role: 'user' | 'assistant'; content: string; phase?: ArchitectPhaseId };

export default function ArchitectPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Welcome to **Tau Architect** — your complete AI software engineering team.

I'm not a chatbot. I function as your **Product Manager, Software Architect, and Development Team** — all in one.

Tell me what you want to build. I'll guide you through:

1. **Discovery** — understanding your vision
2. **Product Definition** — PRD and user stories
3. **Architecture** — system design with diagrams
4. **Project Generation** — complete codebase
5. **Review** — approve before building
6. **Implementation** — incremental code generation
7. **Validation** — lint, test, security review
8. **Deployment** — guided launch

What would you like to create?`,
      phase: 'discovery',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<ArchitectPhaseId>('discovery');
  const [mode, setMode] = useState<'beginner' | 'professional'>('beginner');
  const [memory, setMemory] = useState<ProjectMemory>(() => createEmptyMemory(getActiveProjectId()));
  const [projectId, setProjectId] = useState(getActiveProjectId());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedPhases, setCompletedPhases] = useState<ArchitectPhaseId[]>([]);
  const [diagrams, setDiagrams] = useState<string[]>([]);
  const [streamingText, setStreamingText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMode = localStorage.getItem('tau-ide-mode');
    if (savedMode === 'professional' || savedMode === 'beginner') setMode(savedMode);
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

  const advancePhase = useCallback(() => {
    const current = ARCHITECT_PHASES.find((p) => p.id === phase);
    if (!current) return;
    if (!completedPhases.includes(phase)) {
      setCompletedPhases((prev) => [...prev, phase]);
    }
    const next = ARCHITECT_PHASES.find((p) => p.order === current.order + 1);
    if (next) setPhase(next.id);
  }, [phase, completedPhases]);

  const send = async (useStream = false) => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    const userMessage: Message = { role: 'user', content: userMsg };
    const next = [...messages, userMessage];
    setMessages(next);
    setLoading(true);
    setStreamingText('');

    try {
      if (!getStoredToken()) {
        throw new Error('Sign in required to use Tau Architect. Go to Settings or Login.');
      }
      const res = await fetch('/api/tau-ide/architect', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
          phase,
          mode,
          memory: { ...memory, projectId },
          projectId,
          stream: useStream,
        }),
      });

      if (useStream && res.headers.get('content-type')?.includes('text/event-stream')) {
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
              if (chunk.delta) { full += chunk.delta; setStreamingText(full); }
            } catch { /* skip */ }
          }
        }
        const assistantMsg: Message = { role: 'assistant', content: full, phase };
        setMessages((prev) => [...prev, assistantMsg]);
        setStreamingText('');
        processResponse(full);
      } else {
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        const assistantMsg: Message = { role: 'assistant', content: data.message, phase };
        setMessages((prev) => [...prev, assistantMsg]);
        processResponse(data.message);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${e instanceof Error ? e.message : 'Request failed'}. Continue the conversation or try again.`, phase },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const processResponse = (content: string) => {
    const updated = updateMemoryFromResponse(memory, phase, content);
    updated.projectId = projectId;
    setMemory(updated);
    saveMemory(updated);

    const newDiagrams = extractMermaidDiagrams(content);
    if (newDiagrams.length) setDiagrams((prev) => Array.from(new Set([...prev, ...newDiagrams])));
  };

  const importProject = () => {
    const last = [...messages].reverse().find((m) => m.role === 'assistant');
    if (!last) return alert('No project to import yet.');
    const project = parseProjectBlock(last.content);
    if (!project) return alert('No tau-project block found. Ask Tau Architect to generate the project in Phase 4 (Project Generation).');
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
    }).then(() => {
      alert(`"${project.projectName}" imported with ${project.files.length} files. Open Tau IDE workspace to review.`);
    });
  };

  const validateProject = async () => {
    const last = [...messages].reverse().find((m) => m.role === 'assistant');
    if (!last) return;
    const res = await fetch('/api/tau-ide/architect/validate', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ content: last.content }),
    });
    const data = await res.json();
    if (data.validation) {
      const v = data.validation;
      setMessages((prev) => [...prev, {
        role: 'assistant',
        phase: 'validation',
        content: `## Validation Report\n\n✅ Passed: ${v.passed}\n❌ Failed: ${v.failed}\n⚠️ Warnings: ${v.warnings}\n\n${v.items.map((i: { status: string; name: string; message: string }) => `${i.status === 'pass' ? '✅' : i.status === 'fail' ? '❌' : '⚠️'} **${i.name}**: ${i.message}`).join('\n')}`,
      }]);
    }
  };

  const currentPhaseInfo = ARCHITECT_PHASES.find((p) => p.id === phase);

  return (
    <PlatformShell title="Tau Architect" mode="architect">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main chat */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-white/10 glass space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-white">{currentPhaseInfo?.label}</span>
                <span className="text-xs text-gray-500 hidden sm:inline">— {currentPhaseInfo?.description}</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={mode}
                  onChange={(e) => { setMode(e.target.value as 'beginner' | 'professional'); localStorage.setItem('tau-ide-mode', e.target.value); }}
                  className="text-xs glass rounded-lg px-2 py-1 border border-white/10 text-gray-300 bg-transparent"
                >
                  <option value="beginner">Beginner Mode</option>
                  <option value="professional">Professional Mode</option>
                </select>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-gray-400 hover:text-white glass rounded-lg">
                  {sidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <PhaseNav currentPhase={phase} onPhaseChange={setPhase} completedPhases={completedPhases} />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-cyan-500/20 text-white border border-cyan-500/30'
                    : 'glass text-gray-200'
                }`}>
                  {m.phase && m.role === 'assistant' && (
                    <span className="text-[10px] text-cyan-400/60 uppercase tracking-wide block mb-1">{m.phase}</span>
                  )}
                  <div className="whitespace-pre-wrap font-sans prose prose-invert prose-sm max-w-none">{m.content}</div>
                </div>
              </div>
            ))}
            {streamingText && (
              <div className="flex justify-start">
                <div className="max-w-[85%] glass rounded-2xl px-4 py-3 text-sm text-gray-200">
                  <div className="whitespace-pre-wrap">{streamingText}<span className="animate-pulse">▊</span></div>
                </div>
              </div>
            )}
            {loading && !streamingText && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Tau Architect team is working…
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 glass-strong">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(true); } }}
                placeholder={phase === 'discovery' ? 'Describe your software idea…' : `Continue ${currentPhaseInfo?.label}…`}
                rows={2}
                className="flex-1 px-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none resize-none text-sm"
              />
              <div className="flex flex-col gap-1.5 self-end">
                <button onClick={() => send(true)} disabled={loading || !input.trim()} className="btn-primary px-3 py-2 disabled:opacity-50">
                  <Send className="w-4 h-4" />
                </button>
                <button onClick={advancePhase} disabled={loading} className="btn-secondary px-3 py-2 text-xs" title="Advance to next phase">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <button onClick={importProject} className="text-xs text-gray-400 hover:text-cyan-400 flex items-center gap-1">
                <Download className="w-3 h-3" /> Import Project
              </button>
              <button onClick={validateProject} className="text-xs text-gray-400 hover:text-cyan-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Validate
              </button>
              <Link href="/developers/workspace" className="text-xs text-gray-400 hover:text-cyan-400 flex items-center gap-1">
                <Play className="w-3 h-3" /> Open IDE
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar panel */}
        {sidebarOpen && (
          <div className="w-72 border-l border-white/10 bg-[#0d0d0d] overflow-y-auto p-4 space-y-4 shrink-0 hidden lg:block">
            <AgentStatus phase={phase} />
            <ProgressTracker tasks={memory.tasks} />

            {diagrams.length > 0 && (
              <ArchitectureDiagram diagram={diagrams[diagrams.length - 1]} />
            )}

            <div className="glass rounded-lg p-3 border border-white/5">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Deliverables</p>
              <ul className="space-y-1">
                {(currentPhaseInfo?.deliverables ?? []).map((d) => (
                  <li key={d} className="text-xs text-gray-400 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-cyan-400" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {memory.goals.length > 0 && (
              <div className="glass rounded-lg p-3 border border-white/5">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Project Goals</p>
                <ul className="space-y-1">
                  {memory.goals.slice(0, 5).map((g, i) => (
                    <li key={i} className="text-xs text-gray-400">{g}</li>
                  ))}
                </ul>
              </div>
            )}

            {memory.architectureDecisions.length > 0 && (
              <div className="glass rounded-lg p-3 border border-white/5">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Decisions</p>
                <ul className="space-y-1">
                  {memory.architectureDecisions.slice(-3).map((d, i) => (
                    <li key={i} className="text-xs text-gray-400">{d.decision}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </PlatformShell>
  );
}
