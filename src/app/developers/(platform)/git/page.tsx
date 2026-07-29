'use client';

import { useState, useEffect } from 'react';
import PlatformShell from '@/components/tau-ide/PlatformShell';
import { GitBranch, GitCommit, Upload, Download, Plus, ExternalLink, RefreshCw } from 'lucide-react';
import { getActiveProject, getActiveProjectId } from '@/lib/tau-ide/projects';
import { apiFetch } from '@/lib/tau-ide/sync-client';

export default function GitPage() {
  const [gitInfo, setGitInfo] = useState<{ remote: string | null; provider: string | null; branch: string } | null>(null);
  const [repos, setRepos] = useState<{ fullName?: string; name?: string; url: string }[]>([]);
  const [commits, setCommits] = useState<{ sha: string; message: string; author: string; date: string }[]>([]);
  const [localCommits, setLocalCommits] = useState<{ hash: string; message: string; author: string; date: string }[]>([]);
  const [commitMsg, setCommitMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const projectId = typeof window !== 'undefined' ? getActiveProjectId() : '';

  useEffect(() => {
    if (!projectId || projectId.startsWith('proj_') || projectId === 'default') return;
    apiFetch<typeof gitInfo>(`/api/tau-ide/projects/${projectId}/git`)
      .then(setGitInfo)
      .catch(() => {});
  }, [projectId]);

  const loadRepos = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await apiFetch<{ repos: typeof repos }>(`/api/tau-ide/projects/${projectId}/git?action=repos`);
      setRepos(data.repos ?? []);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Configure GITHUB_TOKEN in project secrets');
    } finally {
      setLoading(false);
    }
  };

  const loadCommits = async (o: string, r: string) => {
    if (!projectId) return;
    const data = await apiFetch<{ commits: typeof commits }>(`/api/tau-ide/projects/${projectId}/git?action=commits&owner=${o}&repo=${r}`);
    setCommits(data.commits ?? []);
    setOwner(o);
    setRepo(r);
  };

  const pushToGitHub = async () => {
    if (!projectId || !owner || !repo) return alert('Select a repository first');
    setLoading(true);
    try {
      const data = await apiFetch<{ pushed: number }>(`/api/tau-ide/projects/${projectId}/git`, {
        method: 'POST',
        body: JSON.stringify({ action: 'push', owner, repo, message: commitMsg || 'Update from Tau IDE' }),
      });
      alert(`Pushed ${data.pushed} files to GitHub`);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Push failed');
    } finally {
      setLoading(false);
    }
  };

  const createRepo = async () => {
    const name = prompt('Repository name:');
    if (!name || !projectId) return;
    setLoading(true);
    try {
      const data = await apiFetch<{ repo: { html_url: string; full_name: string } }>(`/api/tau-ide/projects/${projectId}/git`, {
        method: 'POST',
        body: JSON.stringify({ action: 'create_repo', name, private: false }),
      });
      alert(`Created: ${data.repo.html_url}`);
      const [o, r] = data.repo.full_name.split('/');
      setOwner(o);
      setRepo(r);
      loadRepos();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Create failed — add GITHUB_TOKEN in Settings → Secrets');
    } finally {
      setLoading(false);
    }
  };

  const localCommit = () => {
    if (!commitMsg.trim()) return;
    setLocalCommits([
      { hash: Math.random().toString(16).slice(2, 9), message: commitMsg, author: 'You', date: new Date().toISOString().slice(0, 10) },
      ...localCommits,
    ]);
    setCommitMsg('');
  };

  return (
    <PlatformShell title="Git">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="glass-strong rounded-xl p-4 border border-cyan-500/20 text-sm">
          <GitBranch className="w-4 h-4 inline mr-2 text-cyan-400" />
          Remote Git: GitHub · GitLab · Self-hosted. Add <code className="text-cyan-400">GITHUB_TOKEN</code> in Settings → Secrets.
          {gitInfo?.remote && <span className="ml-2 text-green-400">Connected: {gitInfo.remote}</span>}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><ExternalLink className="w-4 h-4 text-cyan-400" /> Remote Repositories</h3>
            <div className="flex gap-2">
              <button onClick={loadRepos} disabled={loading} className="btn-secondary text-sm"><RefreshCw className="w-3.5 h-3.5" /> Load</button>
              <button onClick={createRepo} disabled={loading} className="btn-primary text-sm"><Plus className="w-3.5 h-3.5" /> Create Repo</button>
            </div>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {repos.map((r) => (
                <li key={r.fullName ?? r.name}>
                  <button onClick={() => { const [o, rn] = (r.fullName ?? r.name ?? '').split('/'); loadCommits(o, rn); }} className="text-sm text-cyan-400 hover:underline">
                    {r.fullName ?? r.name}
                  </button>
                </li>
              ))}
            </ul>
            {owner && repo && (
              <button onClick={pushToGitHub} disabled={loading} className="btn-primary text-sm w-full">
                <Upload className="w-4 h-4" /> Push to {owner}/{repo}
              </button>
            )}
          </div>

          <div className="card space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><GitCommit className="w-4 h-4 text-cyan-400" /> Commit</h3>
            <input value={commitMsg} onChange={(e) => setCommitMsg(e.target.value)} placeholder="Commit message" className="w-full px-4 py-2 glass rounded-lg border border-white/10 text-white focus:border-cyan-500 focus:outline-none" />
            <button onClick={localCommit} className="btn-secondary text-sm">Local Commit</button>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">History {owner && repo ? `(${owner}/${repo})` : '(local + remote)'}</h3>
          <ul className="space-y-3">
            {[...commits.map((c) => ({ ...c, hash: c.sha, remote: true })), ...localCommits.map((c) => ({ ...c, remote: false }))].map((c, i) => (
              <li key={i} className="flex items-start gap-3 text-sm border-b border-white/5 pb-3">
                <code className="text-cyan-400 shrink-0">{c.hash}</code>
                <div>
                  <p className="text-white">{c.message}</p>
                  <p className="text-gray-500 text-xs">{c.author} · {c.date} {'remote' in c && c.remote ? '· GitHub' : '· local'}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-gray-600">Pull Requests architecture ready — Version 4.</p>
      </div>
    </PlatformShell>
  );
}
