'use client';

import { useEffect, useState } from 'react';
import { Rocket } from 'lucide-react';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { getActiveProjectId, loadProjects } from '@/lib/tau-ide/projects';
import { apiFetch } from '@/lib/tau-ide/sync-client';
import { tauDev } from '@/lib/tau-developer/theme';

const STEPS = ['Source Build', 'Unit Testing', 'Staging Sandbox', 'Global Deploy'];

type Job = {
  id: string;
  job_type: string;
  status: string;
  input?: { environment?: string; branch?: string };
  created_at: string;
};

export default function DeveloperDeploymentsContent() {
  const [logs, setLogs] = useState<string[]>([]);
  const [history, setHistory] = useState<{ env: string; branch: string; status: string; time: string }[]>([]);
  const [projectId, setProjectId] = useState('');
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    loadProjects().then(() => setProjectId(getActiveProjectId()));
    apiFetch<{ jobs: Job[] }>('/api/tau-ide/jobs')
      .then((d) => {
        const jobs = d.jobs ?? [];
        const deployJobs = jobs.filter((j) => j.job_type === 'deploy' || j.job_type === 'validate');
        if (deployJobs.length) {
          setLogs(deployJobs.slice(0, 5).map((j) => `[${j.job_type}] ${j.status}`));
          setHistory(
            deployJobs.slice(0, 5).map((j) => ({
              env: j.input?.environment ?? 'Production',
              branch: j.input?.branch ?? 'main',
              status: j.status === 'completed' ? 'Success' : j.status === 'failed' ? 'Failed' : 'Building',
              time: new Date(j.created_at).toLocaleTimeString(),
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  const deploy = async () => {
    if (!projectId || projectId === 'default') return;
    setDeploying(true);
    try {
      await apiFetch('/api/tau-ide/jobs', {
        method: 'POST',
        body: JSON.stringify({ jobType: 'deploy', projectId, input: { environment: 'production', branch: 'main' } }),
      });
      setLogs((l) => [`[deploy] queued`, ...l]);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className={`${geistSans.className} flex flex-col gap-6 p-8`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#10b981]">Pipeline Status: Active</p>
          <p className={`${geistMono.className} text-xs text-[#a1a1aa]`}>Project • Production</p>
        </div>
        <button type="button" disabled={deploying} onClick={deploy} className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-[#060608] disabled:opacity-50" style={{ backgroundColor: tauDev.gold }}>
          <Rocket className="size-4" /> {deploying ? 'Deploying…' : 'Deploy Now'}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((step, i) => (
          <div key={step} className="rounded-xl border p-4" style={{ backgroundColor: tauDev.surface, borderColor: i === 3 ? tauDev.goldBorder : tauDev.border }}>
            <p className="text-xs text-[#52525b]">Step {i + 1}</p>
            <p className="mt-1 text-sm font-semibold text-[#fafafa]">{step}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
        <div className="flex border-b p-4 text-xs font-semibold uppercase text-[#52525b]" style={{ backgroundColor: tauDev.sidebar, borderColor: tauDev.border }}>
          <span className="w-32">Environment</span>
          <span className="w-32">Branch</span>
          <span className="w-28">Status</span>
          <span className="flex-1 text-right">Time</span>
        </div>
        {(history.length ? history : [{ env: 'Production', branch: 'main', status: 'Idle', time: '—' }]).map((row, i) => (
          <div key={i} className="flex border-b p-4 text-sm last:border-0" style={{ borderColor: tauDev.border }}>
            <span className="w-32 text-[#fafafa]">{row.env}</span>
            <span className={`${geistMono.className} w-32 text-[#a1a1aa]`}>{row.branch}</span>
            <span className="w-28 text-xs font-semibold" style={{ color: row.status === 'Success' ? tauDev.success : row.status === 'Failed' ? '#ef4444' : tauDev.gold }}>{row.status}</span>
            <span className={`${geistMono.className} flex-1 text-right text-xs text-[#52525b]`}>{row.time}</span>
          </div>
        ))}
      </div>

      <pre className={`${geistMono.className} rounded-xl border p-4 text-xs text-[#a1a1aa]`} style={{ backgroundColor: tauDev.surfaceElevated, borderColor: tauDev.border }}>
        {logs.join('\n') || '[build] Waiting for deployment jobs…'}
      </pre>
    </div>
  );
}
