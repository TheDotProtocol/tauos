'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { 
  Zap, 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Settings,
  Plus,
  Eye,
  Download,
  Trash2,
  GitBranch,
  Code,
  Package,
  Server,
  Database,
  Globe,
  Shield,
  Activity,
  BarChart3,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react';

interface Pipeline {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'success' | 'failed' | 'pending' | 'cancelled';
  trigger: 'push' | 'pull_request' | 'schedule' | 'manual';
  repository: string;
  branch: string;
  lastRun: string;
  duration: number;
  steps: PipelineStep[];
  environment: string;
  deployment?: {
    status: 'pending' | 'deploying' | 'success' | 'failed';
    url?: string;
    environment: string;
  };
}

interface PipelineStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  duration: number;
  logs?: string[];
}

interface Deployment {
  id: string;
  pipelineId: string;
  environment: string;
  status: 'pending' | 'deploying' | 'success' | 'failed';
  url?: string;
  timestamp: string;
  duration: number;
  logs: string[];
}

export default function AutomationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pipelines');
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);

  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: '1',
      name: 'TauCore Build & Test',
      description: 'Build and test TauCore™ operating system',
      status: 'success',
      trigger: 'push',
      repository: 'tauos/tauos-core',
      branch: 'main',
      lastRun: '2025-01-15T10:30:00Z',
      duration: 1200,
      environment: 'production',
      steps: [
        { id: '1', name: 'Checkout Code', status: 'success', duration: 15 },
        { id: '2', name: 'Install Dependencies', status: 'success', duration: 45 },
        { id: '3', name: 'Build Kernel', status: 'success', duration: 300 },
        { id: '4', name: 'Run Tests', status: 'success', duration: 180 },
        { id: '5', name: 'Build ISO', status: 'success', duration: 240 },
        { id: '6', name: 'Deploy', status: 'success', duration: 420 }
      ],
      deployment: {
        status: 'success',
        url: 'https://tauos.org/downloads',
        environment: 'production'
      }
    },
    {
      id: '2',
      name: 'TauScript CI',
      description: 'Build and test TauScript language',
      status: 'running',
      trigger: 'pull_request',
      repository: 'tauos/tauscript',
      branch: 'feature/ai-sdk',
      lastRun: '2025-01-15T11:15:00Z',
      duration: 0,
      environment: 'staging',
      steps: [
        { id: '1', name: 'Checkout Code', status: 'success', duration: 12 },
        { id: '2', name: 'Install Dependencies', status: 'success', duration: 30 },
        { id: '3', name: 'Compile TauScript', status: 'running', duration: 0 },
        { id: '4', name: 'Run Tests', status: 'pending', duration: 0 },
        { id: '5', name: 'Build Packages', status: 'pending', duration: 0 },
        { id: '6', name: 'Deploy to Staging', status: 'pending', duration: 0 }
      ]
    },
    {
      id: '3',
      name: 'Documentation Build',
      description: 'Build and deploy documentation',
      status: 'failed',
      trigger: 'push',
      repository: 'tauos/docs',
      branch: 'main',
      lastRun: '2025-01-15T09:45:00Z',
      duration: 180,
      environment: 'production',
      steps: [
        { id: '1', name: 'Checkout Code', status: 'success', duration: 8 },
        { id: '2', name: 'Install Dependencies', status: 'success', duration: 25 },
        { id: '3', name: 'Build Docs', status: 'failed', duration: 0 },
        { id: '4', name: 'Deploy', status: 'skipped', duration: 0 }
      ]
    }
  ]);

  const [deployments, setDeployments] = useState<Deployment[]>([
    {
      id: '1',
      pipelineId: '1',
      environment: 'production',
      status: 'success',
      url: 'https://tauos.org/downloads',
      timestamp: '2025-01-15T10:30:00Z',
      duration: 420,
      logs: ['Deploying to production...', 'Health check passed', 'Deployment successful']
    },
    {
      id: '2',
      pipelineId: '2',
      environment: 'staging',
      status: 'deploying',
      timestamp: '2025-01-15T11:15:00Z',
      duration: 0,
      logs: ['Deploying to staging...', 'Building containers...']
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'running': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <Square className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'skipped': return <Square className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '0s';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
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
                CI/CD Automation
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage pipelines, deployments, and automation workflows
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'pipelines', label: 'Pipelines', icon: Zap },
                    { id: 'deployments', label: 'Deployments', icon: Server },
                    { id: 'environments', label: 'Environments', icon: Globe },
                    { id: 'logs', label: 'Logs', icon: Activity }
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

            {/* Pipelines Tab */}
            {activeTab === 'pipelines' && (
              <div className="space-y-6">
                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>New Pipeline</span>
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                      <Play className="h-4 w-4" />
                      <span>Run All</span>
                    </button>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700">
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>

                {/* Pipeline List */}
                <div className="grid gap-4">
                  {pipelines.map((pipeline) => (
                    <div key={pipeline.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {pipeline.name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pipeline.status)}`}>
                              {getStatusIcon(pipeline.status)}
                              <span className="ml-1 capitalize">{pipeline.status}</span>
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              {pipeline.trigger}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{pipeline.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-1">
                              <GitBranch className="h-4 w-4" />
                              <span>{pipeline.repository}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Code className="h-4 w-4" />
                              <span>{pipeline.branch}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Globe className="h-4 w-4" />
                              <span>{pipeline.environment}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatDuration(pipeline.duration)}</span>
                            </div>
                          </div>

                          {/* Pipeline Steps */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Steps:</h4>
                            <div className="space-y-1">
                              {pipeline.steps.map((step) => (
                                <div key={step.id} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                  {getStepStatusIcon(step.status)}
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{step.name}</span>
                                  {step.duration > 0 && (
                                    <span className="text-xs text-gray-500 ml-auto">
                                      {formatDuration(step.duration)}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button 
                            onClick={() => setSelectedPipeline(pipeline)}
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

            {/* Deployments Tab */}
            {activeTab === 'deployments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Recent Deployments
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
                  {deployments.map((deployment) => (
                    <div key={deployment.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Server className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                              {getStatusIcon(deployment.status)}
                              <span className="ml-1 capitalize">{deployment.status}</span>
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              {deployment.environment}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Deployment #{deployment.id}
                          </h3>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(deployment.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatDuration(deployment.duration)}</span>
                            </div>
                            {deployment.url && (
                              <div className="flex items-center space-x-1">
                                <Globe className="h-4 w-4" />
                                <a href={deployment.url} className="text-blue-600 hover:underline">
                                  View Site
                                </a>
                              </div>
                            )}
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Deployment Logs:</h4>
                            <div className="space-y-1">
                              {deployment.logs.map((log, index) => (
                                <div key={index} className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                  {log}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Environments Tab */}
            {activeTab === 'environments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Environments
                  </h2>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>New Environment</span>
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: 'Production', status: 'active', url: 'https://tauos.org', deployments: 12 },
                    { name: 'Staging', status: 'active', url: 'https://staging.tauos.org', deployments: 8 },
                    { name: 'Development', status: 'active', url: 'https://dev.tauos.org', deployments: 25 }
                  ].map((env) => (
                    <div key={env.name} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{env.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(env.status)}`}>
                          {getStatusIcon(env.status)}
                          <span className="ml-1 capitalize">{env.status}</span>
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <a href={env.url} className="text-blue-600 hover:underline">{env.url}</a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4" />
                          <span>{env.deployments} deployments</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm">
                          View
                        </button>
                        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm">
                          Settings
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logs Tab */}
            {activeTab === 'logs' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    System Logs
                  </h2>
                  <div className="flex space-x-2">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <div>[2025-01-15 11:15:30] INFO: Pipeline started for tauos/tauscript</div>
                    <div>[2025-01-15 11:15:31] INFO: Checking out code from feature/ai-sdk</div>
                    <div>[2025-01-15 11:15:32] INFO: Installing dependencies...</div>
                    <div>[2025-01-15 11:15:45] INFO: Dependencies installed successfully</div>
                    <div>[2025-01-15 11:15:46] INFO: Compiling TauScript...</div>
                    <div className="text-yellow-400">[2025-01-15 11:16:12] WARN: Warning: unused variable 'temp' in ai-sdk.tau:45</div>
                    <div>[2025-01-15 11:16:15] INFO: Compilation completed successfully</div>
                    <div className="text-blue-400">[2025-01-15 11:16:16] INFO: Running tests...</div>
                    <div className="animate-pulse">[2025-01-15 11:16:17] INFO: Test suite running...</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
