'use client';

import { useState, useEffect, useCallback } from 'react';
import PlatformShell from '@/components/tau-ide/PlatformShell';
import CodeEditor from '@/components/tau-ide/CodeEditor';
import {
  Play, Folder, File, ChevronRight, ChevronDown, X, Plus, Terminal as TerminalIcon, Save
} from 'lucide-react';
import {
  getActiveProject, upsertProject, type ProjectFile, type TauProject
} from '@/lib/tau-ide/projects';

type OpenTab = ProjectFile & { modified?: boolean };

export default function WorkspacePage() {
  const [project, setProject] = useState<TauProject | null>(null);
  const [tabs, setTabs] = useState<OpenTab[]>([]);
  const [activePath, setActivePath] = useState<string>('/main.tau');
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));

  useEffect(() => {
    const p = getActiveProject();
    setProject(p);
    const main = p.files.find((f) => f.path === '/main.tau') ?? p.files[0];
    if (main) {
      setTabs([{ ...main, modified: false }]);
      setActivePath(main.path);
    }
  }, []);

  const activeTab = tabs.find((t) => t.path === activePath);

  const updateContent = useCallback((content: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.path === activePath ? { ...t, content, modified: true } : t))
    );
  }, [activePath]);

  const saveFile = () => {
    if (!project || !activeTab) return;
    const files = project.files.map((f) =>
      f.path === activeTab.path ? { ...f, content: activeTab.content } : f
    );
    const updated = upsertProject({ ...project, files });
    setProject(updated);
    setTabs((prev) => prev.map((t) => (t.path === activePath ? { ...t, modified: false } : t)));
  };

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
    <PlatformShell title="Tau IDE Workspace" mode="professional">
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-[#111]">
          <button onClick={runTauScript} disabled={running} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 disabled:opacity-50">
            <Play className="w-4 h-4" /> {running ? 'Running…' : 'Run TauScript'}
          </button>
          <button onClick={saveFile} className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg text-sm text-gray-300 hover:text-white">
            <Save className="w-4 h-4" /> Save
          </button>
          <button onClick={() => setTerminalOpen(!terminalOpen)} className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg text-sm text-gray-300 hover:text-white ml-auto">
            <TerminalIcon className="w-4 h-4" /> Terminal
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Explorer */}
          {explorerOpen && (
            <div className="w-56 border-r border-white/10 bg-[#0d0d0d] flex flex-col">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <Folder className="w-3.5 h-3.5" /> {project?.name ?? 'Project'}
              </div>
              <div className="flex-1 overflow-y-auto px-2 pb-4">
                {tree.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => openFile(file)}
                    className={`flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-lg text-left ${
                      activePath === file.path ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <File className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Editor area */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex items-center gap-0 border-b border-white/10 bg-[#111] overflow-x-auto">
              {tabs.map((tab) => (
                <div
                  key={tab.path}
                  className={`flex items-center gap-2 px-3 py-2 text-sm border-r border-white/5 cursor-pointer shrink-0 ${
                    activePath === tab.path ? 'bg-[#0a0a0a] text-cyan-400' : 'text-gray-500 hover:text-gray-300'
                  }`}
                  onClick={() => setActivePath(tab.path)}
                >
                  <File className="w-3.5 h-3.5" />
                  {tab.name}{tab.modified ? ' •' : ''}
                  <button onClick={(e) => { e.stopPropagation(); closeTab(tab.path); }} className="hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Monaco */}
            <div className="flex-1 min-h-0">
              {activeTab && (
                <CodeEditor
                  value={activeTab.content}
                  onChange={updateContent}
                  language={langForFile(activeTab.name)}
                />
              )}
            </div>

            {/* Terminal output */}
            {terminalOpen && (
              <div className="h-48 border-t border-white/10 bg-black flex flex-col">
                <div className="px-3 py-1.5 text-xs text-gray-500 border-b border-white/5 flex items-center gap-2">
                  <TerminalIcon className="w-3.5 h-3.5" /> Output
                </div>
                <pre className="flex-1 p-3 text-sm font-mono text-green-400 overflow-auto">
                  {output.length ? output.join('\n') : '// Run TauScript to see output'}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </PlatformShell>
  );
}
