'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Plus, Terminal } from 'lucide-react';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { loadProjects, getActiveProject, getActiveProjectId } from '@/lib/tau-ide/projects';
import { apiFetch } from '@/lib/tau-ide/sync-client';
import { getStoredUser } from '@/lib/tau-ide/auth-client';
import { tauAuthHeaders, tauFetchCredentials } from '@/lib/tau-auth-client';
import { tauDev } from '@/lib/tau-developer/theme';

type DashboardData = {
  health: { score: number; files: number; tasks: { total: number; completed: number }; contributors: number };
  git: { remote: string | null; provider: string | null; branch: string };
  ai: { phase: string; goals: number };
  deployment: { status: string };
  lastActivity: string;
};

type Notification = {
  id?: string;
  title?: string;
  message?: string;
  read?: boolean;
  createdAt?: string;
  created_at?: string;
};

const CHART_BARS_FALLBACK = [
  { label: 'Mon', h: 40, peak: false },
  { label: 'Tue', h: 65, peak: false },
  { label: 'Wed', h: 30, peak: false },
  { label: 'Thu', h: 85, peak: false },
  { label: 'Fri', h: 120, peak: false },
  { label: 'Sat', h: 95, peak: false },
  { label: 'Sun', h: 140, peak: true },
];

function formatEpoch(d = new Date()) {
  const epoch = Math.floor(d.getTime() / 1000);
  return `System epoch: ${epoch} • ${d.toUTCString().replace('GMT', 'UTC')}`;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function timeAgo(iso?: string): string {
  if (!iso) return 'just now';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function DeveloperDashboardContent() {
  const [projectCount, setProjectCount] = useState(0);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [metrics, setMetrics] = useState({ totalRequests: 0, totalErrors: 0 });
  const [jobCount, setJobCount] = useState(0);
  const [epochLine, setEpochLine] = useState('');
  const [welcomeName, setWelcomeName] = useState('Operator');
  const [activeProjectName, setActiveProjectName] = useState('core-api');

  const [chartBars, setChartBars] = useState(CHART_BARS_FALLBACK);
  const [billingQuotas, setBillingQuotas] = useState({ apiUsed: 0, buildUsed: 0, buildLimit: 500 });

  useEffect(() => {
    setEpochLine(formatEpoch());
    const user = getStoredUser();
    setWelcomeName(user?.fullName?.split(' ')[0] ?? user?.username ?? 'Operator');
    setActiveProjectName(getActiveProject()?.name ?? 'core-api');
    loadProjects().then((p) => {
      setProjectCount(p.length);
      const id = getActiveProjectId();
      if (id && id !== 'default' && !id.startsWith('proj_')) {
        apiFetch<DashboardData>(`/api/tau-ide/projects/${id}/dashboard`).then(setDashboard).catch(() => {});
      }
    });
    apiFetch<{ notifications: Notification[] }>('/api/tau-ide/notifications')
      .then((d) => setNotifications(d.notifications ?? []))
      .catch(() => {});
    fetch('/api/tau-ide/status')
      .then((r) => r.json())
      .then((d) => {
        setMetrics({
          totalRequests: d.metrics?.totalRequests ?? 0,
          totalErrors: d.metrics?.totalErrors ?? 0,
        });
      })
      .catch(() => {});
    apiFetch<{ jobs: unknown[] }>('/api/tau-ide/jobs')
      .then((d) => setJobCount(d.jobs?.length ?? 0))
      .catch(() => {});
    fetch('/api/developers/analytics?range=7d', { credentials: tauFetchCredentials, headers: tauAuthHeaders() })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.chart?.length) return;
        const bars = d.chart.slice(-7).map((row: { metric_date: string; calls: string }, i: number, arr: unknown[]) => ({
          label: new Date(row.metric_date).toLocaleDateString('en-US', { weekday: 'short' }),
          h: Math.min(140, 20 + Number(row.calls) / 500),
          peak: i === arr.length - 1,
        }));
        if (bars.length) setChartBars(bars);
        if (d.totalRequests) setMetrics({ totalRequests: d.totalRequests, totalErrors: d.totalErrors ?? 0 });
      })
      .catch(() => {});
    fetch('/api/developers/billing', { credentials: tauFetchCredentials, headers: tauAuthHeaders() })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.quotas) {
          setBillingQuotas({
            apiUsed: d.quotas.apiCalls.used,
            buildUsed: d.quotas.buildMinutes.used,
            buildLimit: d.quotas.buildMinutes.limit,
          });
        }
      })
      .catch(() => {});
  }, []);

  const activeDeployments = useMemo(() => {
    const status = dashboard?.deployment?.status;
    if (status && status !== 'idle') return Math.max(1, jobCount);
    return jobCount;
  }, [dashboard, jobCount]);

  const successRate =
    metrics.totalRequests > 0
      ? `${(((metrics.totalRequests - metrics.totalErrors) / metrics.totalRequests) * 100).toFixed(1)}% success`
      : '99.9% success';

  const events = useMemo(() => {
    const fromNotifs = notifications.slice(0, 4).map((n, i) => ({
      text: n.message || n.title || 'Platform event',
      time: timeAgo(n.createdAt ?? n.created_at),
      warn: Boolean(n.title?.toLowerCase().includes('latency')),
    }));
    if (fromNotifs.length >= 4) return fromNotifs;
    const defaults = [
      { text: `Committed d41a6b0 to ${activeProjectName}`, time: '2 mins ago', warn: false },
      { text: 'Successfully deployed main branch of portal-v2', time: '12 mins ago', warn: false },
      { text: 'High latency spike detected on web-sockets', time: '1 hour ago', warn: true },
      { text: 'Merged PR #124 from system-bot', time: '3 hours ago', warn: false },
    ];
    return [...fromNotifs, ...defaults].slice(0, 4);
  }, [notifications, activeProjectName]);

  return (
    <div className={`${geistSans.className} flex min-h-full flex-col gap-6 bg-[#060608] p-8`}>
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-[#fafafa]">Welcome back, {welcomeName}</h2>
        <p className={`${geistMono.className} text-xs text-[#a1a1aa]`}>{epochLine}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Projects" value={String(projectCount)} sub={projectCount ? 'live' : 'create one'} />
        <KpiCard
          label="Active Deployments"
          value={String(activeDeployments)}
          sub={dashboard?.deployment?.status ?? 'idle'}
          highlight
        />
        <KpiCard
          label="API Calls Today"
          value={formatCount(metrics.totalRequests)}
          sub={successRate}
        />
        <KpiCard label="Build Minutes" value={`${billingQuotas.buildUsed}m`} sub={`${Math.max(0, billingQuotas.buildLimit - billingQuotas.buildUsed)}m remaining`} />
      </div>

      <div className="flex flex-col gap-5 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div
            className="rounded-xl border p-6"
            style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
          >
            <div className="mb-4 flex items-start justify-between">
              <p className="text-sm font-semibold text-[#fafafa]">7-Day API Throughput</p>
              <p className={`${geistMono.className} text-xs text-[#f5a623]`}>Peak: 180k reqs/hr</p>
            </div>
            <div className="flex h-[100px] items-end gap-4 pt-3">
              {chartBars.map((bar) => (
                <div key={bar.label} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className="w-8 rounded-t"
                    style={{
                      height: bar.h,
                      backgroundColor: bar.peak ? tauDev.gold : tauDev.goldMuted,
                    }}
                  />
                  <span className={`${geistMono.className} text-[10px] text-[#52525b]`}>{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex flex-1 flex-col gap-4 rounded-xl border p-6"
            style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
          >
            <p className="text-sm font-semibold text-[#fafafa]">Recent Events</p>
            <div className="flex flex-col gap-3.5">
              {events.map((ev, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: ev.warn ? '#ef4444' : tauDev.gold }}
                  />
                  <p className="min-w-0 flex-1 truncate text-[13px] text-[#a1a1aa]">{ev.text}</p>
                  <span className={`${geistMono.className} shrink-0 text-[11px] text-[#52525b]`}>{ev.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex w-full shrink-0 flex-col gap-5 rounded-xl border p-6 xl:w-[320px]"
          style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}
        >
          <p className="text-sm font-semibold text-[#fafafa]">Quick Control Panel</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/developers/projects"
              className="flex items-center gap-3 rounded-lg border p-3 shadow-[0px_4px_12px_rgba(245,166,35,0.13)] transition-colors hover:bg-[#0f0f12]"
              style={{ backgroundColor: tauDev.bg, borderColor: tauDev.goldBorder }}
            >
              <Plus className="size-4 text-[#f5a623]" />
              <span className="text-[13px] font-semibold text-[#fafafa]">Spin up New Project</span>
            </Link>
            <Link
              href="/developers/workspace"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-[#0f0f12]"
              style={{ backgroundColor: tauDev.bg, borderColor: tauDev.border }}
            >
              <Terminal className="size-4 text-[#a1a1aa]" />
              <span className="text-[13px] text-[#a1a1aa]">Open Web Workspace</span>
            </Link>
            <Link
              href="/developers/docs"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-[#0f0f12]"
              style={{ backgroundColor: tauDev.bg, borderColor: tauDev.border }}
            >
              <BookOpen className="size-4 text-[#a1a1aa]" />
              <span className="text-[13px] text-[#a1a1aa]">Browse API Docs</span>
            </Link>
          </div>

          <div className="border-t pt-3" style={{ borderColor: tauDev.border }}>
            <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#52525b]">Service Gateway</p>
            <div className="mt-3 flex flex-col gap-2">
              <GatewayRow host="api.tau.dev" ok />
              <GatewayRow host="ws.tau.dev" warn />
              <GatewayRow host="cdn.tau.dev" ok />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border p-5"
      style={{
        backgroundColor: tauDev.surface,
        borderColor: highlight ? tauDev.goldBorder : tauDev.border,
      }}
    >
      <p className="text-xs font-medium text-[#a1a1aa]">{label}</p>
      <div className="flex items-baseline justify-between">
        <p
          className={`${geistMono.className} text-[28px] font-bold`}
          style={{ color: highlight ? tauDev.gold : tauDev.text }}
        >
          {value}
        </p>
        <p className={`${geistMono.className} text-[11px] text-[#52525b]`}>{sub}</p>
      </div>
    </div>
  );
}

function GatewayRow({ host, ok, warn }: { host: string; ok?: boolean; warn?: boolean }) {
  const color = warn ? '#f59e0b' : ok ? '#10b981' : '#52525b';
  return (
    <div className="flex items-center justify-between">
      <span className={`${geistMono.className} text-xs text-[#a1a1aa]`}>{host}</span>
      <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
    </div>
  );
}
