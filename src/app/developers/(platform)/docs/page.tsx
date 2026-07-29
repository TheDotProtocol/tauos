'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import Link from 'next/link';
import { BookOpen, Code, Brain, Rocket, Shield } from 'lucide-react';

const sections = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    links: [
      { href: '/developers', label: 'Tau IDE Landing', desc: 'Platform overview' },
      { href: '/developers/dashboard', label: 'Dashboard', desc: 'Engineering control center' },
      { href: '/developers/projects', label: 'Projects', desc: 'Server-synced projects with auto-save' },
      { href: '/developers/search', label: 'Global Search', desc: 'Files, tasks, memory, architecture' },
    ],
  },
  {
    title: 'Development',
    icon: Code,
    links: [
      { href: '/developers/workspace', label: 'Tau IDE Workspace', desc: 'Monaco editor, files, tabs' },
      { href: '/developers/tauscript', label: 'TauScript Language', desc: 'v1 syntax and REPL' },
      { href: '/developers/terminal', label: 'Terminal', desc: 'Interactive TauScript REPL' },
    ],
  },
  {
    title: 'AI & Architecture',
    icon: Brain,
    links: [
      { href: '/developers/architect', label: 'Tau Architect', desc: 'Persistent AI memory across sessions' },
    ],
  },
  {
    title: 'DevOps',
    icon: Rocket,
    links: [
      { href: '/developers/git', label: 'Git', desc: 'GitHub/GitLab remote push, branches, history' },
      { href: '/developers/settings', label: 'Secrets & Versions', desc: 'Encrypted secrets and version restore' },
      { href: '/developers/automation', label: 'Deployment', desc: 'Vercel, Docker, self-hosted' },
    ],
  },
];

export default function DocsPage() {
  return (
    <PlatformShell title="Documentation">
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Tau IDE Documentation</h2>
          <p className="text-gray-400 mt-2">
            One documentation experience for the Tau IDE Developer Platform. No duplicates — everything reflects actual implementation.
          </p>
        </div>

        {sections.map(({ title, icon: Icon, links }) => (
          <section key={title}>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-cyan-400">
              <Icon className="w-5 h-5" /> {title}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="card block hover:border-cyan-500/30">
                  <h4 className="font-medium text-white">{link.label}</h4>
                  <p className="text-sm text-gray-500 mt-1">{link.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="glass-strong rounded-xl p-6 border border-white/10">
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-cyan-400" /> Ecosystem docs
          </h3>
          <p className="text-sm text-gray-400 mt-4">
            <strong className="text-gray-300">Infrastructure (Sprint 3):</strong> Run{' '}
            <code className="text-cyan-400">npm run tau-ide:setup</code> with{' '}
            <code className="text-cyan-400">DATABASE_URL</code> set. Projects persist in PostgreSQL with file fallback at{' '}
            <code className="text-cyan-400">.data/tau-ide/</code> when offline.
          </p>
        </section>
      </div>
    </PlatformShell>
  );
}
