'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import StatsCard from '@/components/dashboard/StatsCard';
import RepositoryCard from '@/components/dashboard/RepositoryCard';
import { 
  Code, 
  GitBranch, 
  Users, 
  Activity, 
  Star,
  GitFork,
  Eye,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Terminal,
  Play,
  Zap
} from 'lucide-react';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Projects',
      value: '24',
      change: '+3 this month',
      changeType: 'positive' as const,
      icon: Code,
      description: 'Active projects'
    },
    {
      title: 'Code Reviews',
      value: '12',
      change: '+5 this week',
      changeType: 'positive' as const,
      icon: GitBranch,
      description: 'Open reviews'
    },
    {
      title: 'Team Members',
      value: '8',
      change: '+1 this month',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Active developers'
    },
    {
      title: 'Activity Score',
      value: '94%',
      change: '+2% this week',
      changeType: 'positive' as const,
      icon: Activity,
      description: 'Overall activity'
    }
  ];

  const repositories = [
    {
      name: 'tauos-core',
      description: 'The core operating system built with Rust, featuring privacy-first architecture and zero telemetry.',
      language: 'Rust',
      stars: 1247,
      forks: 89,
      watchers: 156,
      lastUpdated: '2025-01-10T18:30:00Z',
      isPrivate: false,
      topics: ['operating-system', 'privacy', 'security', 'rust'],
      owner: 'tauos'
    },
    {
      name: 'tauscript-compiler',
      description: 'The TauScript programming language compiler and runtime. A privacy-first, AI-native language.',
      language: 'Rust',
      stars: 567,
      forks: 19,
      watchers: 73,
      lastUpdated: '2025-01-10T16:45:00Z',
      isPrivate: false,
      topics: ['programming-language', 'compiler', 'rust', 'ai'],
      owner: 'tauos'
    },
    {
      name: 'taucloud-backend',
      description: 'Backend services for TauCloud - secure cloud storage with zero-knowledge encryption.',
      language: 'TypeScript',
      stars: 234,
      forks: 12,
      watchers: 45,
      lastUpdated: '2025-01-10T14:20:00Z',
      isPrivate: false,
      topics: ['cloud-storage', 'encryption', 'privacy'],
      owner: 'tauos'
    },
    {
      name: 'taumail-server',
      description: 'Private email server with end-to-end encryption and zero data collection.',
      language: 'Go',
      stars: 189,
      forks: 8,
      watchers: 32,
      lastUpdated: '2025-01-10T12:15:00Z',
      isPrivate: false,
      topics: ['email', 'privacy', 'encryption', 'smtp'],
      owner: 'tauos'
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="display-huge mb-2" style={{ color: 'var(--text-primary)' }}>
                    Developer <span style={{ color: 'var(--brand-primary)' }}>Dashboard</span>
                  </h1>
                  <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
                    Welcome to the TauCore™ Developer Hub. Manage your repositories, track progress, and collaborate with your team.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="btn-primary">
                    <Plus className="w-5 h-5" />
                    New Project
                  </button>
                  <button className="btn-secondary">
                    <Terminal className="w-5 h-5" />
                    Open Terminal
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="glass p-6 rounded-xl dark-hover dark-transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 glass rounded-lg flex items-center justify-center">
                      <stat.icon className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.title}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.description}</span>
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="glass p-6 rounded-xl mb-8">
              <h2 className="heading-2 mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center space-x-3 p-4 glass rounded-lg dark-hover dark-transition">
                  <Terminal className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                  <div className="text-left">
                    <div className="font-medium text-white">Open Terminal</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Start coding with TauScript</div>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 glass rounded-lg dark-hover dark-transition">
                  <Code className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                  <div className="text-left">
                    <div className="font-medium text-white">Launch IDE</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>TauStudio development environment</div>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 glass rounded-lg dark-hover dark-transition">
                  <Zap className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                  <div className="text-left">
                    <div className="font-medium text-white">CI/CD Pipeline</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Automate your deployments</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Projects Section */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-2" style={{ color: 'var(--text-primary)' }}>Recent Projects</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {repositories.map((repo, index) => (
                  <RepositoryCard key={index} repository={repo} viewMode={viewMode} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}