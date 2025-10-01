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
  List
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
      description: 'The core operating system kernel and system services for TauCore™. Built with Rust for maximum performance and security.',
      language: 'Rust',
      stars: 1247,
      forks: 89,
      watchers: 156,
      lastUpdated: '2025-01-15T10:30:00Z',
      isPrivate: false,
      topics: ['operating-system', 'rust', 'kernel', 'security'],
      owner: 'tauos'
    },
    {
      name: 'tauos-desktop',
      description: 'Modern desktop environment built with GTK4 and TypeScript. Features a beautiful, privacy-first user interface.',
      language: 'TypeScript',
      stars: 892,
      forks: 45,
      watchers: 98,
      lastUpdated: '2025-01-14T15:45:00Z',
      isPrivate: false,
      topics: ['desktop', 'gtk4', 'typescript', 'ui'],
      owner: 'tauos'
    },
    {
      name: 'tauos-mobile',
      description: 'Mobile operating system for smartphones and tablets. Built with Flutter and optimized for privacy.',
      language: 'Dart',
      stars: 634,
      forks: 23,
      watchers: 67,
      lastUpdated: '2025-01-13T09:20:00Z',
      isPrivate: false,
      topics: ['mobile', 'flutter', 'dart', 'privacy'],
      owner: 'tauos'
    },
    {
      name: 'taumail-client',
      description: 'Privacy-first email client with end-to-end encryption. Built with React and Electron.',
      language: 'TypeScript',
      stars: 445,
      forks: 34,
      watchers: 52,
      lastUpdated: '2025-01-12T14:15:00Z',
      isPrivate: false,
      topics: ['email', 'encryption', 'react', 'electron'],
      owner: 'tauos'
    },
    {
      name: 'taucloud-storage',
      description: 'Decentralized cloud storage solution with zero-knowledge encryption. Built with Go and IPFS.',
      language: 'Go',
      stars: 378,
      forks: 28,
      watchers: 41,
      lastUpdated: '2025-01-11T11:30:00Z',
      isPrivate: false,
      topics: ['storage', 'encryption', 'go', 'ipfs'],
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
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Developer Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome to the TauCore™ Developer Hub. Manage your repositories, track progress, and collaborate with your team.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Projects Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Recent Projects
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Your latest projects and contributions
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Filter */}
                    <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </button>
                    
                    {/* View Mode */}
                    <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-yellow-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-yellow-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* New Project */}
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                      <Plus className="h-4 w-4" />
                      <span>New Project</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Projects Grid/List */}
              <div className={`p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}`}>
                {repositories.map((repo, index) => (
                  <RepositoryCard key={index} {...repo} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}