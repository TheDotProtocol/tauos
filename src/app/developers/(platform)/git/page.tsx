'use client';

import { useState, useEffect } from 'react';
import PlatformShell from '@/components/tau-ide/PlatformShell';
import {
  GitBranch, GitCommit, Upload, Download, Plus, ExternalLink, RefreshCw,
  GitPullRequest, GitMerge, Copy, AlertTriangle, Check
} from 'lucide-react';
import { getActiveProjectId, loadProjects } from '@/lib/tau-ide/projects';
import { apiFetch } from '@/lib/tau-ide/sync-client';

type Tab = 'repos' | 'history' | 'branches' | 'pull-requests' | 'conflicts';

export default function GitPage() {
  const [tab, setTab] = useState<Tab>('repos');
  const [gitInfo, setGitInfo] = useState<{ remote: string | null; provider: string | null; branch: string } | null>(null);
  const [repos, setRepos] = useState<{ fullName?: string; name?: string; url: string }[]>([]);
  const [commits, setCommits] = useState<{ sha: string; message: string; author: string; date: string }[]>([]);
  const [branches, setBranches] = useState<{ name: string; sha: string }[]>([]);
  const [pullRequests, setPullRequests] = useState<{ number: number; title: string; author: string; state: string; head: string; base: string }[]>([]);
  const [conflicts, setConflicts] = useState<Array<{ path: string; diff: { additions: number; deletions: number; hunks: string[] } }>>([]);
  const [diff, setDiff] = useState<{ hunks: string[]; path: string } | null>(null);
  const [staged, setStaged] = useState<Set<string>>(new Set());
  const [commitMsg, setCommitMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    loadProjects().then(() => {
      const id = getActiveProjectId();
      setProjectId(id);
      if (id && !id.startsWith('proj_') && id !== 'default') {
        apiFetch<typeof gitInfo>(`/api/tau-ide/projects/${id}/git`).then(setGitInfo).catch(() => {});
      }
    });
  }, []);

  const loadRepos = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await apiFetch<{ repos: typeof repos }>(`/api/tau-ide/projects/${projectId}/git?action=repos`);
      setRepos(data.repos ?? []);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Configure GITHUB_TOKEN in Settings → Secrets');
    } finally {
      setLoading(false);
    }
  };

  const selectRepo = async (o: string, r: string) => {
    setOwner(o);
    setRepo(r);
    if (!projectId) return;
    const [commitsData, branchesData, prsData] = await Promise.all([
      apiFetch<{ commits: typeof commits }>(`/api/tau-ide/projects/${projectId}/git?action=commits&owner=${o}&repo=${r}`),
      apiFetch<{ branches: typeof branches }>(`/api/tau-ide/projects/${projectId}/git?action=branches&owner=${o}&repo=${r}`),
      apiFetch<{ pullRequests: typeof pullRequests }>(`/api/tau-ide/projects/${projectId}/git?action=pull_requests&owner=${o}&repo=${r}`),
    ]);
    setCommits(commitsData.commits ?? []);
    setBranches(branchesData.branches ?? []);
    setPullRequests(prsData.pullRequests ?? []);
  };

  const pushToGitHub = async () => {
    if (!projectId || !owner || !repo) return alert('Select a repository first');
    setLoading(true);
    try {
      const data = await apiFetch<{ pushed: number }>(`/api/tau-ide/projects/${projectId}/git`, {
        method: 'POST',
        body: JSON.stringify({ action: 'push', owner, repo, message: commitMsg || 'Update from Tau IDE' }),
      });
      alert(`Pushed ${data.pushed} files`);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Push failed');
    } finally {
      setLoading(false);
    }
  };

  const pullFromGitHub = async () => {
    if (!projectId || !owner || !repo) return;
    setLoading(true);
    try {
      const data = await apiFetch<{ files: number; conflicts: typeof conflicts; merged: boolean }>(`/api/tau-ide/projects/${projectId}/git`, {
        method: 'POST',
        body: JSON.stringify({ action: 'pull', owner, repo, apply: true }),
      });
      setConflicts(data.conflicts ?? []);
      alert(data.conflicts?.length ? `${data.conflicts.length} conflicts detected` : `Pulled ${data.files} files`);
      if (data.conflicts?.length) setTab('conflicts');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Pull failed');
    } finally {
      setLoading(false);
    }
  };

  const cloneRepo = async () => {
    const url = prompt('owner/repo to clone:');
    if (!url || !projectId) return;
    const [o, r] = url.split('/');
    setLoading(true);
    try {
      const data = await apiFetch<{ cloned: number }>(`/api/tau-ide/projects/${projectId}/git`, {
        method: 'POST',
        body: JSON.stringify({ action: 'clone', owner: o, repo: r, apply: true }),
      });
      alert(`Cloned ${data.cloned} files`);
      setOwner(o);
      setRepo(r);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Clone failed');
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
      const [o, r] = data.repo.full_name.split('/');
      selectRepo(o, r);
      loadRepos();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  const createPR = async () => {
    const title = prompt('PR title:');
    if (!title || !projectId || !owner || !repo) return;
    const head = prompt('Head branch:', 'feature');
    if (!head) return;
    try {
      await apiFetch(`/api/tau-ide/projects/${projectId}/git`, {
        method: 'POST',
        body: JSON.stringify({ action: 'create_pr', owner, repo, title, head, base: 'main', body: 'Created from Tau IDE' }),
      });
      selectRepo(owner, repo);
      setTab('pull-requests');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'PR creation failed');
    }
  };

  const mergePR = async (number: number) => {
    if (!projectId || !owner || !repo) return;
    await apiFetch(`/api/tau-ide/projects/${projectId}/git`, {
      method: 'POST',
      body: JSON.stringify({ action: 'merge_pr', owner, repo, number }),
    });
    selectRepo(owner, repo);
  };

  const showDiff = async (path: string) => {
    if (!projectId || !owner || !repo) return;
    const data = await apiFetch<{ diff: { hunks: string[] }; path: string }>(
      `/api/tau-ide/projects/${projectId}/git?action=diff&owner=${owner}&repo=${repo}&path=${encodeURIComponent(path)}`
    );
    setDiff({ hunks: data.diff.hunks, path: data.path });
  };

  const checkConflicts = async () => {
    if (!projectId || !owner || !repo) return;
    const data = await apiFetch<{ conflicts: typeof conflicts }>(
      `/api/tau-ide/projects/${projectId}/git?action=conflicts&owner=${owner}&repo=${repo}`
    );
    setConflicts(data.conflicts ?? []);
    setTab('conflicts');
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'repos', label: 'Repositories' },
    { id: 'history', label: 'History' },
    { id: 'branches', label: 'Branches' },
    { id: 'pull-requests', label: 'Pull Requests' },
    { id: 'conflicts', label: 'Conflicts' },
  ];

  return (
    <PlatformShell title="Git">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="glass-strong rounded-xl p-4 border border-cyan-500/20 text-sm flex flex-wrap items-center gap-3">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          GitHub · GitLab · Clone · Pull · Push · Merge · PRs
          {gitInfo?.remote && <span className="text-green-400">Connected: {gitInfo.remote}</span>}
          {owner && repo && <span className="text-gray-400">{owner}/{repo}</span>}
        </div>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-1.5 rounded-lg text-sm ${tab === t.id ? 'bg-cyan-500/20 text-cyan-400' : 'glass text-gray-400'}`}>
              {t.label}
              {t.id === 'conflicts' && conflicts.length > 0 && <span className="ml-1 text-yellow-400">({conflicts.length})</span>}
            </button>
          ))}
        </div>

        {tab === 'repos' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><ExternalLink className="w-4 h-4 text-cyan-400" /> Remote</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={loadRepos} disabled={loading} className="btn-secondary text-sm"><RefreshCw className="w-3.5 h-3.5" /> Load</button>
                <button onClick={createRepo} disabled={loading} className="btn-primary text-sm"><Plus className="w-3.5 h-3.5" /> Create</button>
                <button onClick={cloneRepo} disabled={loading} className="btn-secondary text-sm"><Copy className="w-3.5 h-3.5" /> Clone</button>
              </div>
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {repos.map((r) => (
                  <li key={r.fullName ?? r.name}>
                    <button onClick={() => { const [o, rn] = (r.fullName ?? r.name ?? '').split('/'); selectRepo(o, rn); setTab('history'); }} className="text-sm text-cyan-400 hover:underline">
                      {r.fullName ?? r.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><GitCommit className="w-4 h-4 text-cyan-400" /> Commit & Sync</h3>
              <input value={commitMsg} onChange={(e) => setCommitMsg(e.target.value)} placeholder="Commit message" className="w-full px-4 py-2 glass rounded-lg border border-white/10 text-white focus:border-cyan-500 focus:outline-none" />
              <div className="flex flex-wrap gap-2">
                <button onClick={pushToGitHub} disabled={loading || !owner} className="btn-primary text-sm"><Upload className="w-4 h-4" /> Push</button>
                <button onClick={pullFromGitHub} disabled={loading || !owner} className="btn-secondary text-sm"><Download className="w-4 h-4" /> Pull</button>
                <button onClick={checkConflicts} disabled={!owner} className="btn-secondary text-sm"><AlertTriangle className="w-4 h-4" /> Check Conflicts</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div className="card">
            <h3 className="font-semibold mb-4">Commit History</h3>
            <ul className="space-y-3">
              {commits.map((c) => (
                <li key={c.sha} className="flex items-start gap-3 text-sm border-b border-white/5 pb-3">
                  <code className="text-cyan-400 shrink-0">{c.sha}</code>
                  <div>
                    <p className="text-white">{c.message}</p>
                    <p className="text-gray-500 text-xs">{c.author} · {c.date}</p>
                  </div>
                </li>
              ))}
              {commits.length === 0 && <p className="text-gray-600 text-sm">Select a repository to view history</p>}
            </ul>
          </div>
        )}

        {tab === 'branches' && (
          <div className="card">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><GitBranch className="w-4 h-4" /> Branches</h3>
            <ul className="space-y-2">
              {branches.map((b) => (
                <li key={b.name} className="flex items-center gap-3 text-sm glass px-3 py-2 rounded-lg">
                  <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-white">{b.name}</span>
                  <code className="text-gray-500 text-xs">{b.sha}</code>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'pull-requests' && (
          <div className="card space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2"><GitPullRequest className="w-4 h-4 text-cyan-400" /> Pull Requests</h3>
              <button onClick={createPR} disabled={!owner} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Create PR</button>
            </div>
            <ul className="space-y-3">
              {pullRequests.map((pr) => (
                <li key={pr.number} className="glass px-4 py-3 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm">#{pr.number} {pr.title}</p>
                    <p className="text-xs text-gray-500">{pr.author} · {pr.head} → {pr.base}</p>
                  </div>
                  <button onClick={() => mergePR(pr.number)} className="btn-secondary text-xs flex items-center gap-1">
                    <GitMerge className="w-3 h-3" /> Merge
                  </button>
                </li>
              ))}
              {pullRequests.length === 0 && <p className="text-gray-600 text-sm">No open pull requests</p>}
            </ul>
          </div>
        )}

        {tab === 'conflicts' && (
          <div className="card space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400" /> Conflict Resolution</h3>
            {conflicts.length === 0 ? (
              <p className="text-green-400 text-sm flex items-center gap-2"><Check className="w-4 h-4" /> No conflicts detected</p>
            ) : (
              conflicts.map((c) => (
                <div key={c.path} className="glass rounded-lg p-4 border border-yellow-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <code className="text-cyan-400">{c.path}</code>
                    <button onClick={() => showDiff(c.path)} className="text-xs text-gray-400 hover:text-white">View Diff</button>
                  </div>
                  <p className="text-xs text-gray-500">+{c.diff.additions} / -{c.diff.deletions} lines</p>
                  <div className="mt-2 flex gap-2">
                    <button className="btn-secondary text-xs">Keep Local</button>
                    <button className="btn-secondary text-xs">Keep Remote</button>
                    <button className="btn-primary text-xs">Merge Manually</button>
                  </div>
                </div>
              ))
            )}
            {diff && (
              <div className="glass rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-400 mb-2">Diff: {diff.path}</p>
                <pre className="text-xs font-mono text-green-400 overflow-auto max-h-48">{diff.hunks.join('\n')}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </PlatformShell>
  );
}
