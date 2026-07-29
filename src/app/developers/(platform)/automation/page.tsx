'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import { Rocket, Box, Cloud, Server, CheckCircle } from 'lucide-react';

const targets = [
  {
    id: 'vercel',
    icon: Rocket,
    name: 'Vercel',
    status: 'ready' as const,
    desc: 'Deploy Next.js and static frontends with one click.',
    steps: ['Connect Git repository', 'Configure build command', 'Deploy preview & production'],
  },
  {
    id: 'docker',
    icon: Box,
    name: 'Docker',
    status: 'ready' as const,
    desc: 'Containerize your application for any environment.',
    steps: ['Generate Dockerfile', 'Build image', 'Run container locally or in cloud'],
  },
  {
    id: 'taucloud',
    icon: Cloud,
    name: 'Tau Cloud',
    status: 'v2' as const,
    desc: 'Native deployment to Tau Cloud infrastructure.',
    steps: ['Coming in Version 2'],
  },
  {
    id: 'self',
    icon: Server,
    name: 'Self-Hosted',
    status: 'ready' as const,
    desc: 'Export project and deploy on your own servers.',
    steps: ['Download project bundle', 'Configure environment', 'Run with Docker or Node'],
  },
];

export default function AutomationPage() {
  return (
    <PlatformShell title="Deployment">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Deployment</h2>
          <p className="text-gray-400 text-sm mt-1">Deploy your Tau IDE projects to production environments.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {targets.map(({ id, icon: Icon, name, status, desc, steps }) => (
            <div key={id} className="card">
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8 text-cyan-400" />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  status === 'v2' ? 'bg-purple-500/20 text-purple-300' : 'bg-green-500/20 text-green-400'
                }`}>
                  {status === 'v2' ? 'Version 2' : 'Architecture Ready'}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{name}</h3>
              <p className="text-sm text-gray-400 mb-4">{desc}</p>
              <ul className="space-y-2">
                {steps.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
              {status !== 'v2' && (
                <button className="mt-4 btn-secondary text-sm w-full opacity-60 cursor-not-allowed" disabled>
                  Configure (connect project first)
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </PlatformShell>
  );
}
