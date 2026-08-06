'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Code2, Package, Plus } from 'lucide-react';
import { geistMono, geistSans } from '@/lib/website/fonts';
import {
  loadProjects,
  createProject,
  deleteProject,
  setActiveProjectId,
  type TauProject,
} from '@/lib/tau-ide/projects';
import { tauDev } from '@/lib/tau-developer/theme';

type Filter = 'All' | 'Active' | 'Archived' | 'Starred';

/** Figma reference cards shown when the account has few real projects */
const FIGMA_DEMO_CARDS = [
  { name: 'tau-auth-server', branch: 'main', deployed: 'Deployed 2m ago', status: 'ok' as const, icon: 'package' as const },
  { name: 'tau-documentation', branch: 'release-v2', deployed: 'Deployed 12m ago', status: 'ok' as const, icon: 'code' as const },
  { name: 'lambda-edge-gateway', branch: 'canary', deployed: 'Deployed 1h ago', status: 'warn' as const, icon: 'code' as const },
  { name: 'telemetry-aggregator', branch: 'dev', deployed: 'Deployed 1d ago', status: 'ok' as const, icon: 'code' as const },
  { name: 'web-sockets-broker', branch: 'main', deployed: 'Deployed 3d ago', status: 'err' as const, icon: 'package' as const },
];

const STATUS_COLORS = {
  ok: '#10b981',
  warn: '#f59e0b',
  err: '#ef4444',
} as const;

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function relativeDeploy(updatedAt?: string) {
  if (!updatedAt) return 'Deployed recently';
  const diff = Date.now() - new Date(updatedAt).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Deployed ${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Deployed ${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `Deployed ${days}d ago`;
}

export default function DeveloperProjectsContent() {
  const [projects, setProjects] = useState<TauProject[]>([]);
  const [filter, setFilter] = useState<Filter>('All');
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    const p = await loadProjects();
    setProjects(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    if (filter === 'All') return projects;
    if (filter === 'Active') return projects.filter((p) => p.id !== 'default');
    if (filter === 'Archived') return [];
    return projects;
  }, [projects, filter]);

  const featured = filtered[0];
  const grid = filtered.slice(1);
  const showDemoGrid = false;

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createProject(name.trim(), desc.trim());
    setName('');
    setDesc('');
    setShowNew(false);
    refresh();
  };

  const statusFor = (i: number) => {
    if (i % 5 === 4) return STATUS_COLORS.err;
    if (i % 3 === 2) return STATUS_COLORS.warn;
    return STATUS_COLORS.ok;
  };

  return (
    <div className={`${geistSans.className} flex min-h-full flex-col gap-6 bg-[#060608] p-8`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          className="inline-flex rounded-lg border p-1"
          style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
        >
          {(['All', 'Active', 'Archived', 'Starred'] as Filter[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-md px-4 py-1.5 text-xs transition-colors ${
                filter === tab
                  ? 'border font-semibold text-[#f5a623]'
                  : 'font-medium text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
              style={
                filter === tab
                  ? { backgroundColor: tauDev.bg, borderColor: tauDev.border }
                  : { border: '1px solid transparent' }
              }
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-semibold text-[#060608] shadow-[0px_4px_12px_rgba(245,166,35,0.13)]"
          style={{ backgroundColor: tauDev.gold }}
        >
          <Plus className="size-3.5" strokeWidth={2.5} />
          New Project
        </button>
      </div>

      {showNew && (
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: tauDev.surface, borderColor: tauDev.goldBorder }}
        >
          <h3 className="mb-4 font-semibold text-[#fafafa]">Create Project</h3>
          <div className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="w-full rounded-lg border bg-[#060608] px-4 py-2 text-sm text-white outline-none focus:border-[#f5a623]"
              style={{ borderColor: tauDev.border }}
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description"
              rows={2}
              className="w-full resize-none rounded-lg border bg-[#060608] px-4 py-2 text-sm text-white outline-none focus:border-[#f5a623]"
              style={{ borderColor: tauDev.border }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCreate}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-[#060608]"
                style={{ backgroundColor: tauDev.gold }}
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowNew(false)}
                className="rounded-lg border px-4 py-2 text-sm text-[#a1a1aa]"
                style={{ borderColor: tauDev.border }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className={`${geistMono.className} text-sm text-[#52525b]`}>Loading projects…</p>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
        >
          <p className="text-[#a1a1aa]">No projects yet.</p>
          <button
            type="button"
            onClick={() => setShowNew(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-[#060608]"
            style={{ backgroundColor: tauDev.gold }}
          >
            <Plus className="size-4" /> Create your first project
          </button>
        </div>
      ) : (
        <>
          {featured && <FeaturedCard project={featured} />}
          <div className="flex flex-wrap gap-4">
            {grid.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                statusColor={statusFor(i)}
                onDelete={p.id !== 'default' ? () => deleteProject(p.id).then(refresh) : undefined}
              />
            ))}
            {showDemoGrid &&
              FIGMA_DEMO_CARDS.map((demo) => (
                <DemoProjectCard key={demo.name} demo={demo} />
              ))}
          </div>
        </>
      )}
    </div>
  );
}

function FeaturedCard({ project }: { project: TauProject }) {
  const slug = slugify(project.name);
  return (
    <div
      className="flex flex-col gap-4 rounded-xl border p-6"
      style={{ backgroundColor: tauDev.surface, borderColor: tauDev.goldBorder }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Code2 className="size-6 text-[#f5a623]" />
          <div>
            <Link
              href="/developers/workspace"
              onClick={() => setActiveProjectId(project.id)}
              className="text-lg font-semibold text-[#fafafa] hover:text-[#f5a623]"
            >
              {slug || project.name}
            </Link>
            <p className={`${geistMono.className} text-[11px] text-[#a1a1aa]`}>
              Active Deployment: main • {project.id.slice(0, 7)}
            </p>
          </div>
        </div>
        <span
          className="rounded-md border px-2 py-1 text-[11px] font-semibold"
          style={{ color: tauDev.success, borderColor: tauDev.success, backgroundColor: tauDev.successBg }}
        >
          Production Operational
        </span>
      </div>
      <p className="text-[13px] text-[#a1a1aa]">
        {project.description ||
          'Next-generation rendering pipeline for decentralized cloud telemetry streams. Integrated with real-time analytics brokers.'}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3" style={{ borderColor: tauDev.border }}>
        <p className={`${geistMono.className} text-[11px] text-[#52525b]`}>
          Deploys triggered automatically from Git webhook pushes
        </p>
        <div className="flex items-center gap-1">
          <span className={`${geistMono.className} text-[11px] text-[#f5a623]`}>14.2k reqs/s</span>
          <svg width="40" height="8" viewBox="0 0 40 8" aria-hidden>
            <polyline
              fill="none"
              stroke="#f5a623"
              strokeWidth="1.5"
              points="0,6 8,4 16,5 24,2 32,3 40,1"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function DemoProjectCard({
  demo,
}: {
  demo: (typeof FIGMA_DEMO_CARDS)[number];
}) {
  const Icon = demo.icon === 'package' ? Package : Code2;
  const statusColor = STATUS_COLORS[demo.status];

  return (
    <div
      className="flex w-full flex-col gap-3 rounded-xl border p-5 sm:w-[360px]"
      style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon className="size-4 text-[#a1a1aa]" />
          <span className="text-sm font-semibold text-[#fafafa]">{demo.name}</span>
        </div>
        <span className="size-2 rounded-full" style={{ backgroundColor: statusColor }} />
      </div>
      <p className={`${geistMono.className} text-[11px] text-[#a1a1aa]`}>branch: {demo.branch}</p>
      <div
        className={`${geistMono.className} flex items-center justify-between border-t pt-2 text-[11px]`}
        style={{ borderColor: tauDev.border }}
      >
        <span className="text-[#52525b]">{demo.deployed}</span>
        <span className="text-[#a1a1aa]">99.98% SLA</span>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  statusColor,
  onDelete,
}: {
  project: TauProject;
  statusColor: string;
  onDelete?: () => void;
}) {
  const slug = slugify(project.name);
  const branch = 'main';
  const Icon = project.files.length % 2 === 0 ? Package : Code2;

  return (
    <div
      className="flex w-full flex-col gap-3 rounded-xl border p-5 sm:w-[360px]"
      style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon className="size-4 text-[#a1a1aa]" />
          <Link
            href="/developers/workspace"
            onClick={() => setActiveProjectId(project.id)}
            className="text-sm font-semibold text-[#fafafa] hover:text-[#f5a623]"
          >
            {slug || project.name}
          </Link>
        </div>
        <span className="size-2 rounded-full" style={{ backgroundColor: statusColor }} />
      </div>
      <p className={`${geistMono.className} text-[11px] text-[#a1a1aa]`}>branch: {branch}</p>
      <div
        className={`${geistMono.className} flex items-center justify-between border-t pt-2 text-[11px]`}
        style={{ borderColor: tauDev.border }}
      >
        <span className="text-[#52525b]">{relativeDeploy(project.updatedAt)}</span>
        <span className="text-[#a1a1aa]">99.98% SLA</span>
      </div>
      {onDelete && (
        <button type="button" onClick={onDelete} className="text-left text-[11px] text-[#52525b] hover:text-red-400">
          Delete project
        </button>
      )}
    </div>
  );
}
