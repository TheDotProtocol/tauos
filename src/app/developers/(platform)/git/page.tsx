'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import { GitBranch, GitCommit, GitPullRequest, Clock, Plus } from 'lucide-react';
import { useState } from 'react';

type Commit = { hash: string; message: string; author: string; date: string };
type Branch = { name: string; current: boolean };

const DEMO_COMMITS: Commit[] = [
  { hash: 'a1b2c3d', message: 'Initial TauScript project', author: 'You', date: '2026-06-15' },
  { hash: 'e4f5g6h', message: 'Add greet function', author: 'You', date: '2026-06-14' },
];

export default function GitPage() {
  const [commits, setCommits] = useState<Commit[]>(DEMO_COMMITS);
  const [branches] = useState<Branch[]>([
    { name: 'main', current: true },
    { name: 'develop', current: false },
  ]);
  const [commitMsg, setCommitMsg] = useState('');
  const [staged] = useState(['main.tau', 'README.md']);

  const commit = () => {
    if (!commitMsg.trim()) return;
    setCommits([
      { hash: Math.random().toString(16).slice(2, 9), message: commitMsg, author: 'You', date: new Date().toISOString().slice(0, 10) },
      ...commits,
    ]);
    setCommitMsg('');
  };

  return (
    <PlatformShell title="Git">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="glass-strong rounded-xl p-4 border border-cyan-500/20 text-sm text-gray-400">
          <GitBranch className="w-4 h-4 inline mr-2 text-cyan-400" />
          Git v1 — local repository management. Remote hosting (GitHub-style) is <span className="text-purple-300">Version 2</span>.
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="card lg:col-span-1">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan-400" /> Branches
            </h3>
            <ul className="space-y-2">
              {branches.map((b) => (
                <li key={b.name} className={`px-3 py-2 rounded-lg text-sm ${b.current ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400'}`}>
                  {b.name} {b.current && '(current)'}
                </li>
              ))}
            </ul>
            <button disabled className="mt-4 w-full py-2 text-xs text-gray-600 glass rounded-lg cursor-not-allowed">
              <Plus className="w-3 h-3 inline mr-1" /> New branch (v2)
            </button>
          </div>

          <div className="card lg:col-span-2 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-cyan-400" /> Commit
            </h3>
            <div className="text-sm text-gray-500">Staged: {staged.join(', ')}</div>
            <input
              value={commitMsg}
              onChange={(e) => setCommitMsg(e.target.value)}
              placeholder="Commit message"
              className="w-full px-4 py-2 glass rounded-lg border border-white/10 text-white focus:border-cyan-500 focus:outline-none"
            />
            <button onClick={commit} className="btn-primary text-sm">Commit</button>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" /> History
          </h3>
          <ul className="space-y-3">
            {commits.map((c) => (
              <li key={c.hash} className="flex items-start gap-3 text-sm border-b border-white/5 pb-3">
                <code className="text-cyan-400 shrink-0">{c.hash}</code>
                <div>
                  <p className="text-white">{c.message}</p>
                  <p className="text-gray-500 text-xs">{c.author} · {c.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PlatformShell>
  );
}
