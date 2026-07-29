'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import Link from 'next/link';
import { FolderGit2, Code, Brain, Rocket, GitBranch, Terminal, ArrowRight } from 'lucide-react';
import { loadProjects } from '@/lib/tau-ide/projects';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    setProjectCount(loadProjects().length);
  }, []);

  const quickActions = [
    { href: '/developers/workspace', icon: Code, label: 'Open Tau IDE', desc: 'Monaco editor & terminal' },
    { href: '/developers/architect', icon: Brain, label: 'Tau Architect', desc: 'Build with AI conversation' },
    { href: '/developers/projects', icon: FolderGit2, label: 'Projects', desc: `${projectCount} project(s)` },
    { href: '/developers/terminal', icon: Terminal, label: 'Terminal', desc: 'TauScript REPL' },
    { href: '/developers/git', icon: GitBranch, label: 'Git', desc: 'Version control' },
    { href: '/developers/automation', icon: Rocket, label: 'Deployment', desc: 'Deploy your app' },
  ];

  return (
    <PlatformShell title="Dashboard">
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <div className="glass-strong rounded-2xl p-8 border border-cyan-500/20">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Tau IDE</h2>
          <p className="text-gray-400 max-w-2xl">
            Your unified developer platform. Create projects, write TauScript, collaborate with Tau Architect,
            and prepare for deployment — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/developers/workspace" className="btn-primary">
              Open Workspace <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/developers/architect" className="btn-secondary">
              <Brain className="w-4 h-4" /> Tau Architect
            </Link>
          </div>
        </div>

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
            { label: 'Mode', value: 'Professional + Architect' },
            { label: 'Runtime', value: 'TauScript v1.0' },
            { label: 'Projects', value: String(projectCount) },
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
