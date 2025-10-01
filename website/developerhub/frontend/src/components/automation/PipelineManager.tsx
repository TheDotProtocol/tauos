'use client';

import { useState, useEffect } from 'react';
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

interface PipelineRun {
  id: string;
  pipelineId: string;
  status: 'running' | 'success' | 'failed' | 'cancelled';
  startTime: string;
  endTime?: string;
  duration: number;
  steps: PipelineStep[];
  logs: string[];
  environment: string;
  variables: Record<string, string>;
}

export default function PipelineManager() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPipelines();
    fetchRuns();
  }, []);

  const fetchPipelines = async () => {
    try {
      const response = await fetch('/api/automation/pipelines');
      const data = await response.json();
      if (data.success) {
        setPipelines(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch pipelines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRuns = async () => {
    try {
      const response = await fetch('/api/automation/run');
      const data = await response.json();
      if (data.success) {
        setRuns(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch runs:', error);
    }
  };

  const runPipeline = async (pipelineId: string) => {
    try {
      const response = await fetch('/api/automation/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pipelineId,
          trigger: 'manual',
          environment: 'staging',
          variables: {}
        }),
      });

      const data = await response.json();
      if (data.success) {
        setRuns(prev => [data.data, ...prev]);
        // Refresh runs after a delay to get updated status
        setTimeout(fetchRuns, 2000);
      }
    } catch (error) {
      console.error('Failed to run pipeline:', error);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-yellow-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading pipelines...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                  onClick={() => runPipeline(pipeline.id)}
                  disabled={pipeline.status === 'running'}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="h-4 w-4" />
                </button>
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

      {/* Recent Runs */}
      {runs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Pipeline Runs
          </h3>
          <div className="space-y-3">
            {runs.slice(0, 5).map((run) => (
              <div key={run.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(run.status)}`}>
                      {getStatusIcon(run.status)}
                      <span className="ml-1 capitalize">{run.status}</span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Run #{run.id}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{formatDuration(run.duration)}</span>
                    <span>{new Date(run.startTime).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Environment: {run.environment}
                </div>
                
                {run.logs.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm font-mono text-gray-700 dark:text-gray-300 max-h-32 overflow-y-auto">
                    {run.logs.slice(-5).map((log, index) => (
                      <div key={index}>{log}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Pipelines State */}
      {pipelines.length === 0 && (
        <div className="text-center py-12">
          <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No pipelines configured
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first CI/CD pipeline to automate your development workflow
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto">
            <Plus className="h-4 w-4" />
            <span>Create Pipeline</span>
          </button>
        </div>
      )}
    </div>
  );
}
