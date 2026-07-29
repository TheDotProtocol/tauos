'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import Link from 'next/link';
import { FolderGit2, Code, Brain, Rocket, GitBranch, Terminal, ArrowRight, Search, Bell, Activity, Users, Clock } from 'lucide-react';
import { loadProjects, getActiveProject, getActiveProjectId } from '@/lib/tau-ide/projects';
import { apiFetch } from '@/lib/tau-ide/sync-client';
import { useEffect, useState } from 'react';

type DashboardData = {
  health: { score: number; files: number; tasks: { total: number; completed: number }; versions: number; contributors: number };
  git: { remote: string | null; provider: string | null; branch: string };
  ai: { phase: string; goals: number; hasMemory: boolean };
  deployment: { status: string };
  lastActivity: string;
};

export default function DashboardPage() {
  const [projectCount, setProjectCount] = useState(0);
  const [activeName, setActiveName] = useState('');
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [notifications, setNotifications] = useState<{ unread: number }>({ unread: 0 });

  useEffect(() => {
    loadProjects().then((p) => {
      setProjectCount(p.length);
      const active = getActiveProject();
      setActiveName(active?.name ?? '');
      const id = getActiveProjectId();
      if (id && !id.startsWith('proj_') && id !== 'default') {
        apiFetch<DashboardData>(`/api/tau-ide/projects/${id}/dashboard`).then(setDashboard).catch(() => {});
      }
    });
    apiFetch<{ notifications: { read: boolean }[] }>('/api/tau-ide/notifications')
      .then((d) => setNotifications({ unread: d.notifications.filter((n) => !n.read).length }))
      .catch(() => {});
  }, []);

  const quickActions = [
    { href: '/developers/workspace', icon: Code, label: 'Open Tau IDE', desc: 'Monaco editor & terminal' },
    { href: '/developers/architect', icon: Brain, label: 'Tau Architect', desc: 'Build with AI conversation' },
    { href: '/developers/projects', icon: FolderGit2, label: 'Projects', desc: `${projectCount} project(s)` },
    { href: '/developers/search', icon: Search, label: 'Search', desc: 'Files, tasks, AI memory' },
    { href: '/developers/git', icon: GitBranch, label: 'Git', desc: 'Remote GitHub/GitLab' },
    { href: '/developers/automation', icon: Rocket, label: 'Deployment', desc: 'Deploy your app' },
  ];

  return (
    <PlatformShell title="Dashboard">
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <div className="glass-strong rounded-2xl p-8 border border-cyan-500/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Engineering Control Center</h2>
              <p className="text-gray-400 max-w-2xl">
                {activeName ? `Active project: ${activeName}` : 'Your unified developer platform with persistent storage, AI memory, and Git integration.'}
              </p>
            </div>
            {notifications.unread > 0 && (
              <Link href="/developers/settings" className="flex items-center gap-1.5 text-xs text-cyan-400 glass px-3 py-1.5 rounded-lg">
                <Bell className="w-3.5 h-3.5" /> {notifications.unread} new
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/developers/workspace" className="btn-primary">Open Workspace <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/developers/architect" className="btn-secondary"><Brain className="w-4 h-4" /> Tau Architect</Link>
          </div>
        </div>

        {dashboard && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card">
              <Activity className="w-5 h-5 text-cyan-400 mb-2" />
              <p className="text-2xl font-bold text-white">{dashboard.health.score}%</p>
              <p className="text-xs text-gray-500">Project Health</p>
            </div>
            <div className="card">
              <Brain className="w-5 h-5 text-cyan-400 mb-2" />
              <p className="text-2xl font-bold text-white capitalize">{dashboard.ai.phase}</p>
              <p className="text-xs text-gray-500">AI Phase · {dashboard.ai.goals} goals</p>
            </div>
            <div className="card">
              <GitBranch className="w-5 h-5 text-cyan-400 mb-2" />
              <p className="text-lg font-bold text-white truncate">{dashboard.git.provider ?? 'Local'}</p>
              <p className="text-xs text-gray-500">{dashboard.git.remote ? 'Connected' : 'Not connected'}</p>
            </div>
            <div className="card">
              <Users className="w-5 h-5 text-cyan-400 mb-2" />
              <p className="text-2xl font-bold text-white">{dashboard.health.contributors}</p>
              <p className="text-xs text-gray-500">Contributors</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Quick Actions</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map(({ href, icon: Icon, label, desc }) => (
              <Link key={href} href={href} className="card group hover:border-cyan-500/30">
                <Icon className="w-6 h-6 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white">{label}</h4>
                <p className="text-sm text-gray-500 mt-1">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Projects', value: String(projectCount) },
            { label: 'Runtime', value: 'TauScript v1.0' },
            { label: 'Persistence', value: dashboard ? 'PostgreSQL' : 'Syncing…' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-cyan-400">{stat.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </PlatformShell>
  );
}
