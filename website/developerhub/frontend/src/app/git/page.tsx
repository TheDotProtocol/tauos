'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  Plus, 
  Download, 
  Upload, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  MessageSquare,
  Eye,
  Code,
  History,
  Settings,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react';

interface Repository {
  id: string;
  name: string;
  description: string;
  url: string;
  isPrivate: boolean;
  lastCommit: {
    hash: string;
    message: string;
    author: string;
    date: string;
  };
  branches: string[];
  currentBranch: string;
  status: 'clean' | 'modified' | 'conflict';
  remote: {
    name: string;
    url: string;
  };
}

interface Commit {
  hash: string;
  message: string;
  author: string;
  date: string;
  files: string[];
  additions: number;
  deletions: number;
}

export default function GitPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('repositories');
  const [repositories, setRepositories] = useState<Repository[]>([
    {
      id: '1',
      name: 'tauos-core',
      description: 'TauCore™ operating system core',
      url: 'https://github.com/tauos/tauos-core',
      isPrivate: false,
      lastCommit: {
        hash: 'a1b2c3d',
        message: 'feat: implement universal driver support',
        author: 'Developer',
        date: '2025-01-15T10:30:00Z'
      },
      branches: ['main', 'develop', 'feature/kernel-integration'],
      currentBranch: 'main',
      status: 'clean',
      remote: {
        name: 'origin',
        url: 'https://github.com/tauos/tauos-core'
      }
    },
    {
      id: '2',
      name: 'tauscript',
      description: 'TauScript programming language',
      url: 'https://github.com/tauos/tauscript',
      isPrivate: false,
      lastCommit: {
        hash: 'e4f5g6h',
        message: 'feat: complete standard library implementation',
        author: 'Developer',
        date: '2025-01-15T09:15:00Z'
      },
      branches: ['main', 'develop', 'feature/ai-sdk'],
      currentBranch: 'develop',
      status: 'modified',
      remote: {
        name: 'origin',
        url: 'https://github.com/tauos/tauscript'
      }
    }
  ]);

  const [commits, setCommits] = useState<Commit[]>([
    {
      hash: 'a1b2c3d',
      message: 'feat: implement universal driver support',
      author: 'Developer',
      date: '2025-01-15T10:30:00Z',
      files: ['drivers/wifi.c', 'drivers/graphics.c', 'drivers/usb.c'],
      additions: 1250,
      deletions: 45
    },
    {
      hash: 'b2c3d4e',
      message: 'fix: resolve kernel compilation issues',
      author: 'Developer',
      date: '2025-01-15T09:45:00Z',
      files: ['kernel/main.c', 'kernel/memory.c'],
      additions: 89,
      deletions: 23
    },
    {
      hash: 'c3d4e5f',
      message: 'docs: update API documentation',
      author: 'Developer',
      date: '2025-01-15T08:20:00Z',
      files: ['docs/api.md', 'docs/examples.md'],
      additions: 456,
      deletions: 12
    }
  ]);

  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'text-green-600 bg-green-100';
      case 'modified': return 'text-yellow-600 bg-yellow-100';
      case 'conflict': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clean': return <CheckCircle className="h-4 w-4" />;
      case 'modified': return <Clock className="h-4 w-4" />;
      case 'conflict': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex">
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Git Integration
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage repositories, branches, commits, and pull requests
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'repositories', label: 'Repositories', icon: GitBranch },
                    { id: 'commits', label: 'Commits', icon: GitCommit },
                    { id: 'pull-requests', label: 'Pull Requests', icon: GitPullRequest },
                    { id: 'branches', label: 'Branches', icon: GitBranch }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-yellow-500 text-yellow-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Repositories Tab */}
            {activeTab === 'repositories' && (
              <div className="space-y-6">
                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Clone Repository</span>
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>New Repository</span>
                    </button>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700">
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>

                {/* Repository List */}
                <div className="grid gap-4">
                  {repositories.map((repo) => (
                    <div key={repo.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {repo.name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(repo.status)}`}>
                              {getStatusIcon(repo.status)}
                              <span className="ml-1 capitalize">{repo.status}</span>
                            </span>
                            {repo.isPrivate && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                Private
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{repo.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <GitBranch className="h-4 w-4" />
                              <span>{repo.currentBranch}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{repo.lastCommit.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(repo.lastCommit.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <GitCommit className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                                {repo.lastCommit.hash}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {repo.lastCommit.message}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button 
                            onClick={() => setSelectedRepo(repo)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Settings className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Commits Tab */}
            {activeTab === 'commits' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Recent Commits
                  </h2>
                  <div className="flex space-x-2">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {commits.map((commit) => (
                    <div key={commit.hash} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <GitCommit className="h-5 w-5 text-yellow-600" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                              {commit.hash}
                            </span>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Copy className="h-3 w-3 text-gray-400" />
                            </button>
                          </div>
                          
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {commit.message}
                          </h3>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{commit.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(commit.date).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1 text-green-600">
                              <span>+{commit.additions}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-red-600">
                              <span>-{commit.deletions}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-500">
                              <span>{commit.files.length} files</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            {commit.files.map((file, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                {file}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Code className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pull Requests Tab */}
            {activeTab === 'pull-requests' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Pull Requests
                  </h2>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>New Pull Request</span>
                  </button>
                </div>

                <div className="text-center py-12">
                  <GitPullRequest className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No pull requests yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Create your first pull request to start collaborating
                  </p>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg">
                    Create Pull Request
                  </button>
                </div>
              </div>
            )}

            {/* Branches Tab */}
            {activeTab === 'branches' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Branches
                  </h2>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>New Branch</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {repositories.map((repo) => (
                    <div key={repo.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">{repo.name}</h3>
                        <span className="text-sm text-gray-500">{repo.branches.length} branches</span>
                      </div>
                      
                      <div className="space-y-2">
                        {repo.branches.map((branch) => (
                          <div key={branch} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <div className="flex items-center space-x-2">
                              <GitBranch className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-gray-900 dark:text-white">{branch}</span>
                              {branch === repo.currentBranch && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <Settings className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
