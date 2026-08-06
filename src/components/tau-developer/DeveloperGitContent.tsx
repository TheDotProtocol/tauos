'use client';

import { useEffect, useState } from 'react';
import { Copy, Folder, GitBranch, Plus, Sparkles } from 'lucide-react';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { getActiveProjectId, loadProjects } from '@/lib/tau-ide/projects';
import { apiFetch } from '@/lib/tau-ide/sync-client';
import { tauDev } from '@/lib/tau-developer/theme';

const REPOS = [
  { name: 'tau-core-api', visibility: 'Public', activity: 'Merge pull request #145 from system-bot', lang: 'TypeScript', color: '#f5a623', ago: '2m ago' },
  { name: 'portal-v2', visibility: 'Private', activity: 'Committed d41a6b0 to core-api', lang: 'TypeScript', color: '#f5a623', ago: '12m ago' },
  { name: 'edge-worker', visibility: 'Private', activity: 'Deployed main branch of portal-v2', lang: 'Go', color: '#3178c6', ago: '1h ago' },
  { name: 'telemetry-broker', visibility: 'Public', activity: 'Merged PR #124 from system-bot', lang: 'Rust', color: '#10b981', ago: '3h ago' },
];

const COMMITS = [
  { sha: 'b42e12a', msg: 'Committed d41a6b0 to core-api', author: 'operator_z', add: 148, del: 22, ago: '2m ago' },
  { sha: 'a98d31f', msg: 'Successfully deployed main branch of portal-v2', author: 'system-bot', add: 42, del: 8, ago: '12m ago' },
  { sha: 'c01824d', msg: 'High latency spike detected on web-sockets', author: 'tau_dev_1', add: 18, del: 4, ago: '1h ago' },
];

const PROTECTION = [
  { title: 'Require pull request approvals', desc: 'Minimum 1 review from owners.' },
  { title: 'Restrict push to main/canary', desc: 'Requires automated checks to pass.' },
  { title: 'Signed commits enforced', desc: 'Unsigned pushes will reject natively.' },
];

export default function DeveloperGitContent() {
  const [repo, setRepo] = useState('tau-core-api');
  const [remote, setRemote] = useState('https://git.tau.dev/prod/tau-core-api.git');
  const [commits, setCommits] = useState(COMMITS);
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    loadProjects().then(() => {
      const id = getActiveProjectId();
      setProjectId(id);
      if (id && !id.startsWith('proj_') && id !== 'default') {
        apiFetch<{ remote: string | null; branch: string }>(`/api/tau-ide/projects/${id}/git`)
          .then((info) => {
            if (info.remote) setRemote(info.remote);
          })
          .catch(() => {});
      }
    });
  }, []);

  const loadCommits = async () => {
    if (!projectId) return;
    try {
      const data = await apiFetch<{ commits: { sha: string; message: string; author: string; date: string }[] }>(
        `/api/tau-ide/projects/${projectId}/git?action=commits&owner=tau&repo=${repo}`
      );
      if (data.commits?.length) {
        setCommits(
          data.commits.slice(0, 5).map((c) => ({
            sha: c.sha.slice(0, 7),
            msg: c.message,
            author: c.author,
            add: 42,
            del: 8,
            ago: new Date(c.date).toLocaleTimeString(),
          }))
        );
      }
    } catch {
      /* use defaults */
    }
  };

  useEffect(() => {
    if (projectId) loadCommits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, repo]);

  return (
    <div className={`${geistSans.className} flex flex-col gap-6 p-8`}>
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
          style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
        >
          <GitBranch className="size-4 text-[#f5a623]" />
          <span className="text-[#fafafa]">repository: {repo}</span>
        </div>
        <div
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border px-4 py-2"
          style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
        >
          <span className={`${geistMono.className} truncate text-xs text-[#a1a1aa]`}>{remote}</span>
          <button type="button" className="shrink-0 text-[#a1a1aa] hover:text-[#fafafa]" aria-label="Copy URL">
            <Copy className="size-3.5" />
          </button>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-semibold text-[#060608]"
          style={{ backgroundColor: tauDev.gold }}
        >
          <Plus className="size-3.5" />
          New Repository
        </button>
      </div>

      <div className="flex flex-col gap-5 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div
            className="rounded-xl border"
            style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
          >
            <p className="border-b p-4 text-sm font-semibold text-[#fafafa]" style={{ borderColor: tauDev.border }}>
              Connected Workspace Repositories
            </p>
            <div className="divide-y" style={{ borderColor: tauDev.border }}>
              {REPOS.map((r) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => setRepo(r.name)}
                  className="flex w-full flex-wrap items-center gap-3 p-4 text-left hover:bg-[#0f0f12] sm:flex-nowrap"
                >
                  <Folder className="size-4 shrink-0 text-[#f5a623]" />
                  <span className="w-[140px] shrink-0 text-[13px] font-semibold text-[#fafafa]">{r.name}</span>
                  <span
                    className="rounded-md border px-2 py-0.5 text-[10px] text-[#a1a1aa]"
                    style={{ borderColor: tauDev.border }}
                  >
                    {r.visibility}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs text-[#a1a1aa]">{r.activity}</span>
                  <span className="flex items-center gap-1.5 text-xs text-[#a1a1aa]">
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: r.color }} />
                    {r.lang}
                  </span>
                  <span className={`${geistMono.className} text-[11px] text-[#52525b]`}>{r.ago}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl border"
            style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
          >
            <p className="border-b p-4 text-sm font-semibold text-[#fafafa]" style={{ borderColor: tauDev.border }}>
              Commit History: main
            </p>
            <div className="divide-y" style={{ borderColor: tauDev.border }}>
              {commits.map((c) => (
                <div key={c.sha} className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap">
                  <span className={`${geistMono.className} w-[72px] shrink-0 text-xs text-[#f5a623]`}>{c.sha}</span>
                  <span className="min-w-0 flex-1 truncate text-[13px] text-[#fafafa]">{c.msg}</span>
                  <span className="text-xs text-[#a1a1aa]">{c.author}</span>
                  <span className={`${geistMono.className} text-[11px] text-[#10b981]`}>+{c.add}</span>
                  <span className={`${geistMono.className} text-[11px] text-[#ef4444]`}>-{c.del}</span>
                  <span className={`${geistMono.className} text-[11px] text-[#52525b]`}>{c.ago}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="w-full shrink-0 rounded-xl border p-5 xl:w-[320px]"
          style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
        >
          <p className="text-sm font-semibold text-[#fafafa]">Branch Protection</p>
          <p className="mt-1 text-xs text-[#a1a1aa]">Rules applied strictly to production targets.</p>
          <div className="mt-4 flex flex-col gap-3">
            {PROTECTION.map((rule) => (
              <div
                key={rule.title}
                className="flex items-start justify-between gap-3 rounded-lg border p-3"
                style={{ backgroundColor: tauDev.surfaceElevated, borderColor: tauDev.border }}
              >
                <div>
                  <p className="text-[13px] font-semibold text-[#fafafa]">{rule.title}</p>
                  <p className="text-xs text-[#a1a1aa]">{rule.desc}</p>
                </div>
                <span className="mt-1 size-2 shrink-0 rounded-full bg-[#10b981]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
