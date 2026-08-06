'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Play, Folder, File, X, Terminal as TerminalIcon, Save, Cloud, GitBranch, Sparkles,
} from 'lucide-react';
import CodeEditor from '@/components/tau-ide/CodeEditor';
import {
  getActiveProject, upsertProjectLocal, loadProjects, type ProjectFile, type TauProject,
} from '@/lib/tau-ide/projects';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { tauDev } from '@/lib/tau-developer/theme';

type OpenTab = ProjectFile & { modified?: boolean };

export default function DeveloperIdeContent() {
  const [project, setProject] = useState<TauProject | null>(null);
  const [tabs, setTabs] = useState<OpenTab[]>([]);
  const [activePath, setActivePath] = useState<string>('/main.tau');
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'modified'>('saved');

  useEffect(() => {
    loadProjects().then(() => {
      const p = getActiveProject();
      setProject(p);
      const main = p.files.find((f) => f.path === '/main.tau') ?? p.files[0];
      if (main) {
        setTabs([{ ...main, modified: false }]);
        setActivePath(main.path);
      }
    });
  }, []);

  useEffect(() => {
    const hasModified = tabs.some((t) => t.modified);
    if (!hasModified || !project) return;
    setSaveStatus('modified');
    const timer = setTimeout(() => saveAll(), 30000);
    return () => clearTimeout(timer);
  }, [tabs, project]);

  const saveAll = () => {
    if (!project) return;
    setSaveStatus('saving');
    const files = project.files.map((f) => {
      const tab = tabs.find((t) => t.path === f.path);
      return tab ? { ...f, content: tab.content } : f;
    });
    const updated = upsertProjectLocal({ ...project, files });
    setProject(updated);
    setTabs((prev) => prev.map((t) => ({ ...t, modified: false })));
    setSaveStatus('saved');
  };

  const activeTab = tabs.find((t) => t.path === activePath);

  const updateContent = useCallback((content: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.path === activePath ? { ...t, content, modified: true } : t))
    );
    setProject((p) =>
      p
        ? {
            ...p,
            files: p.files.map((f) => (f.path === activePath ? { ...f, content } : f)),
          }
        : p
    );
    setSaveStatus('modified');
  }, [activePath]);

  const openFile = (file: ProjectFile) => {
    if (!tabs.find((t) => t.path === file.path)) {
      setTabs((prev) => [...prev, { ...file, modified: false }]);
    }
    setActivePath(file.path);
  };

  const closeTab = (path: string) => {
    const remaining = tabs.filter((t) => t.path !== path);
    setTabs(remaining);
    if (activePath === path && remaining.length) setActivePath(remaining[remaining.length - 1].path);
  };

  const runTauScript = async () => {
    if (!activeTab) return;
    setRunning(true);
    setOutput([]);
    try {
      const res = await fetch('/api/developers/tauscript/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: activeTab.content }),
      });
      const data = await res.json();
      if (data.output?.length) setOutput(data.output);
      else if (data.value !== undefined) setOutput([String(data.value)]);
      if (data.error) setOutput((prev) => [...prev, `Error: ${data.error}`]);
    } catch (e) {
      setOutput([e instanceof Error ? e.message : 'Run failed']);
    } finally {
      setRunning(false);
    }
  };

  const langForFile = (name: string) => {
    if (name.endsWith('.tau')) return 'tauscript';
    if (name.endsWith('.ts') || name.endsWith('.tsx')) return 'typescript';
    if (name.endsWith('.js')) return 'javascript';
    if (name.endsWith('.md')) return 'markdown';
    return 'plaintext';
  };

  const tree = project?.files ?? [];

  return (
    <div className={`${geistSans.className} flex h-[calc(100vh-4rem)] flex-col`}>
      <div
        className="flex h-12 shrink-0 items-center justify-between border-b px-5"
        style={{ backgroundColor: tauDev.sidebar, borderColor: tauDev.border }}
      >
        <div className="flex items-center gap-3">
          <TerminalIcon className="size-3.5 text-[#f5a623]" />
          <p className="text-xs font-semibold text-[#fafafa]">
            TAU_IDE: root@{project?.name ?? 'production-worker'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runTauScript}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold text-[#060608] disabled:opacity-50"
            style={{ backgroundColor: tauDev.gold }}
          >
            <Play className="size-3" /> {running ? 'Running…' : 'Run'}
          </button>
          <button
            onClick={saveAll}
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs text-[#a1a1aa] hover:text-[#fafafa]"
            style={{ borderColor: tauDev.border }}
          >
            <Save className="size-3" />
            {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'modified' ? 'Save *' : 'Saved'}
          </button>
          <span className={`${geistMono.className} hidden items-center gap-1 text-[10px] text-[#52525b] sm:inline-flex`}>
            <Cloud className="size-3" /> Auto-save
          </span>
          <span
            className={`${geistMono.className} rounded border px-2 py-0.5 text-[10px] text-[#f5a623]`}
            style={{ backgroundColor: tauDev.goldMuted, borderColor: tauDev.gold }}
          >
            sandbox-v3
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside
          className="hidden w-[220px] shrink-0 flex-col border-r p-4 sm:flex"
          style={{ backgroundColor: tauDev.sidebar, borderColor: tauDev.border }}
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[1px] text-[#52525b]">project-tree</p>
          <div className="flex flex-col gap-2 overflow-y-auto">
            {tree.map((file) => (
              <button
                key={file.path}
                onClick={() => openFile(file)}
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs ${
                  activePath === file.path ? 'text-[#fafafa]' : 'text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
              >
                <File className="size-3.5 shrink-0 text-[#f5a623]" />
                <span className="truncate">{file.name}</span>
              </button>
            ))}
            {tree.length === 0 && (
              <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                <Folder className="size-3.5" /> src
              </div>
            )}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 overflow-x-auto border-b" style={{ backgroundColor: tauDev.sidebar, borderColor: tauDev.border }}>
            {tabs.map((tab) => (
              <div
                key={tab.path}
                className="flex shrink-0 cursor-pointer items-center gap-2 border-r px-4 py-2 text-[11px]"
                style={{
                  backgroundColor: activePath === tab.path ? tauDev.bg : 'transparent',
                  borderColor: tauDev.border,
                  color: activePath === tab.path ? tauDev.gold : tauDev.textMuted,
                }}
                onClick={() => setActivePath(tab.path)}
              >
                {tab.name}{tab.modified ? ' •' : ''}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.path); }}
                  className="hover:text-[#fafafa]"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex min-h-0 flex-1">
            <div className="min-w-0 flex-1">
              {activeTab && (
                <CodeEditor
                  value={activeTab.content}
                  onChange={updateContent}
                  language={langForFile(activeTab.name)}
                />
              )}
            </div>
            <div
              className="hidden w-16 shrink-0 flex-col gap-1 border-l p-2 lg:flex"
              style={{ backgroundColor: tauDev.sidebar, borderColor: tauDev.border }}
            >
              {[30, 20, 20, 30, 15].map((op, i) => (
                <div key={i} className="h-1 rounded" style={{ backgroundColor: tauDev.gold, opacity: op / 100 }} />
              ))}
            </div>
          </div>

          {terminalOpen && (
            <div
              className="flex h-40 shrink-0 flex-col border-t"
              style={{ backgroundColor: tauDev.sidebar, borderColor: tauDev.border }}
            >
              <div className="flex items-center justify-between border-b px-4 py-2" style={{ borderColor: tauDev.border }}>
                <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#52525b]">Terminal output</p>
                <p className={`${geistMono.className} text-[10px] text-[#10b981]`}>
                  {output.length ? 'SUCCESS (0s)' : 'IDLE'}
                </p>
              </div>
              <pre className={`${geistMono.className} flex-1 overflow-auto p-4 text-[11px] text-[#a1a1aa]`}>
                {output.length
                  ? output.join('\n')
                  : 'tau_dev@terminal:~$ tau build --platform=lambda\n[13:37:10] Compiling main.ts into executable binary...\n[13:37:11] Executable payload generated successfully (14.2MB).'}
              </pre>
            </div>
          )}
        </div>

        <aside
          className="hidden w-[280px] shrink-0 flex-col gap-4 border-l p-4 xl:flex"
          style={{ backgroundColor: tauDev.sidebar, borderColor: tauDev.border }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 text-[#f5a623]" />
            <p className="text-xs font-semibold text-[#fafafa]">Tau Assistant AI</p>
          </div>
          <div
            className="rounded-lg border p-3 text-xs leading-relaxed text-[#a1a1aa]"
            style={{ backgroundColor: tauDev.surfaceElevated, borderColor: tauDev.border }}
          >
            I&apos;ve analyzed your cluster config. Would you like me to optimize your telemetry broker routing policy?
          </div>
          <div
            className="rounded-lg border p-3"
            style={{ backgroundColor: tauDev.goldMuted, borderColor: tauDev.goldBorder }}
          >
            <p className={`${geistMono.className} text-[10px] text-[#f5a623]`}>SUGGESTED IMPLEMENTATION</p>
            <p className={`${geistMono.className} mt-1.5 text-[11px] text-[#fafafa]`}>
              setRoutingPolicy(&apos;latency&apos;)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTerminalOpen(!terminalOpen)}
            className="mt-auto inline-flex items-center gap-2 text-xs text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <TerminalIcon className="size-3.5" /> Toggle terminal
          </button>
        </aside>
      </div>

      <div
        className="flex h-7 shrink-0 items-center justify-between border-t px-4 text-[11px]"
        style={{ backgroundColor: tauDev.sidebar, borderColor: tauDev.border }}
      >
        <div className="flex items-center gap-1 text-[#a1a1aa]">
          <GitBranch className="size-3" />
          <span className={geistMono.className}>main</span>
        </div>
        <div className={`${geistMono.className} flex gap-4`}>
          <span className="text-[#52525b]">Line 5, Col 12</span>
          <span className="text-[#f5a623]">{activeTab ? langForFile(activeTab.name) : 'TypeScript'}</span>
        </div>
      </div>
    </div>
  );
}
