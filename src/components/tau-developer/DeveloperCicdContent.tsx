'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { getActiveProjectId, loadProjects } from '@/lib/tau-ide/projects';
import { apiFetch } from '@/lib/tau-ide/sync-client';
import { tauAuthHeaders, tauFetchCredentials } from '@/lib/tau-auth-client';
import { tauDev } from '@/lib/tau-developer/theme';

type Pipeline = {
  id: string;
  name: string;
  config_yaml: string;
  last_run_status: string;
  last_run_at?: string;
};

type Job = { id: string; job_type: string; status: string; created_at: string };

export default function DeveloperCicdContent() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [runs, setRuns] = useState<Job[]>([]);
  const [secrets, setSecrets] = useState<{ key: string; masked: string }[]>([]);
  const [config, setConfig] = useState(`pipeline: prod-telemetry-sync\non: push [main]\njobs:\n  - compile:\n      platform: edge-node-lambda`);

  useEffect(() => {
    loadProjects().then(() => {
      const id = getActiveProjectId();
      fetch('/api/developers/pipelines', { credentials: tauFetchCredentials, headers: tauAuthHeaders() })
        .then((r) => (r.ok ? r.json() : { pipelines: [] }))
        .then((d) => {
          setPipelines(d.pipelines ?? []);
          if (d.pipelines?.[0]?.config_yaml) setConfig(d.pipelines[0].config_yaml);
        });
      if (!id || id === 'default' || id.startsWith('proj_')) return;
      apiFetch<{ secrets: { key: string }[] }>(`/api/tau-ide/projects/${id}/secrets`)
        .then((d) => {
          if (d.secrets?.length) {
            setSecrets(d.secrets.slice(0, 4).map((s) => ({ key: s.key, masked: `****${s.key.slice(-4)}` })));
          }
        })
        .catch(() => {});
    });
    apiFetch<{ jobs: Job[] }>('/api/tau-ide/jobs').then((d) => setRuns(d.jobs?.slice(0, 5) ?? [])).catch(() => {});
  }, []);

  const savePipeline = async () => {
    const id = getActiveProjectId();
    if (!id || id === 'default') return;
    await fetch('/api/developers/pipelines', {
      method: 'POST',
      credentials: tauFetchCredentials,
      headers: { 'Content-Type': 'application/json', ...tauAuthHeaders() },
      body: JSON.stringify({ projectId: id, name: 'core-pipeline-prod', configYaml: config }),
    });
    const d = await fetch('/api/developers/pipelines', { credentials: tauFetchCredentials, headers: tauAuthHeaders() }).then((r) => r.json());
    setPipelines(d.pipelines ?? []);
  };

  const displayPipelines = pipelines.length
    ? pipelines.map((p) => ({
        name: p.name,
        trigger: 'push:main',
        status: p.last_run_status === 'running' ? 'RUNNING' as const : 'COMPLETED' as const,
        steps: ['Lint', 'Build', 'Test', 'Deploy'],
        activeStep: 2,
      }))
    : [{ name: 'core-pipeline-prod', trigger: 'push:main', status: 'COMPLETED' as const, steps: ['Lint', 'Build'], activeStep: 1 }];

  return (
    <div className={`${geistSans.className} flex flex-col gap-6 p-8`}>
      <div className="grid gap-4 lg:grid-cols-3">
        {displayPipelines.map((p) => (
          <div key={p.name} className="rounded-xl border p-5" style={{ backgroundColor: tauDev.surface, borderColor: p.status === 'RUNNING' ? tauDev.gold : tauDev.border }}>
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[#fafafa]">{p.name}</p>
                <p className={`${geistMono.className} text-[11px] text-[#a1a1aa]`}>{p.trigger}</p>
              </div>
              <span className="rounded-md border px-2 py-0.5 text-[10px] font-semibold" style={{ color: p.status === 'RUNNING' ? tauDev.gold : tauDev.success, backgroundColor: p.status === 'RUNNING' ? tauDev.goldMuted : tauDev.successBg, borderColor: p.status === 'RUNNING' ? tauDev.gold : tauDev.success }}>{p.status}</span>
            </div>
            <div className="flex gap-1">
              {p.steps.map((s, i) => (
                <div key={s} className="h-1.5 flex-1 rounded" style={{ backgroundColor: i <= p.activeStep ? tauDev.gold : tauDev.surfaceElevated }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border p-5" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
          <p className="mb-3 text-sm font-semibold text-[#fafafa]">Recent Runs</p>
          {(runs.length ? runs : [{ id: '—', job_type: 'validate', status: 'idle', created_at: new Date().toISOString() }]).map((r) => (
            <div key={r.id} className="flex justify-between border-b py-2 text-xs last:border-0" style={{ borderColor: tauDev.border }}>
              <span className={`${geistMono.className} text-[#a1a1aa]`}>{r.job_type}</span>
              <span style={{ color: r.status === 'completed' ? tauDev.success : r.status === 'failed' ? '#ef4444' : tauDev.gold }}>{r.status}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border p-5" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
          <p className="mb-3 text-sm font-semibold text-[#fafafa]">Pipeline Secrets</p>
          {secrets.map((s) => (
            <p key={s.key} className={`${geistMono.className} text-xs text-[#f5a623]`}>{s.key}: {s.masked}</p>
          ))}
          {secrets.length === 0 && <p className="text-xs text-[#52525b]">No secrets — add in Settings → Security</p>}
        </div>
      </div>

      <div className="rounded-xl border p-5" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#fafafa]">Pipeline YAML</p>
          <button type="button" onClick={savePipeline} className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-[#060608]" style={{ backgroundColor: tauDev.gold }}>
            <Plus className="size-3" /> Save
          </button>
        </div>
        <textarea value={config} onChange={(e) => setConfig(e.target.value)} rows={8} className={`${geistMono.className} w-full rounded-md border bg-transparent p-3 text-xs text-[#a1a1aa]`} style={{ borderColor: tauDev.border, backgroundColor: tauDev.surfaceElevated }} />
      </div>
    </div>
  );
}
