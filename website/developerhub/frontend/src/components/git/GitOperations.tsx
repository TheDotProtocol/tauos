'use client';

import { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  Download, 
  Upload, 
  RefreshCw, 
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Copy,
  Terminal
} from 'lucide-react';

interface GitOperation {
  id: string;
  command: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  output: string;
  duration: number;
  timestamp: string;
}

interface GitOperationsProps {
  repository?: string;
  onCommandExecute?: (command: string) => void;
}

export default function GitOperations({ repository, onCommandExecute }: GitOperationsProps) {
  const [operations, setOperations] = useState<GitOperation[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const executeGitCommand = async (command: string) => {
    const operationId = Date.now().toString();
    const startTime = new Date().toISOString();

    const newOperation: GitOperation = {
      id: operationId,
      command,
      status: 'running',
      output: '',
      duration: 0,
      timestamp: startTime
    };

    setOperations(prev => [newOperation, ...prev]);
    setIsRunning(true);

    try {
      const response = await fetch('/api/git/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: command.split(' ')[0],
          repository: repository || 'tauos/tauos-core',
          branch: command.includes('checkout') ? command.split(' ')[2] : undefined,
          message: command.includes('commit') ? command.split('-m')[1]?.trim()?.replace(/['"]/g, '') : undefined
        }),
      });

      const result = await response.json();
      const endTime = new Date().toISOString();
      const duration = Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000);

      setOperations(prev => prev.map(op => 
        op.id === operationId 
          ? {
              ...op,
              status: result.success ? 'success' : 'failed',
              output: result.data.output || result.error || 'Command completed',
              duration
            }
          : op
      ));

      if (onCommandExecute) {
        onCommandExecute(command);
      }
    } catch (error) {
      setOperations(prev => prev.map(op => 
        op.id === operationId 
          ? {
              ...op,
              status: 'failed',
              output: `Error: ${error}`,
              duration: Math.floor((new Date().getTime() - new Date(startTime).getTime()) / 1000)
            }
          : op
      ));
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const quickCommands = [
    { command: 'git status', label: 'Status', icon: Eye },
    { command: 'git pull', label: 'Pull', icon: Download },
    { command: 'git push', label: 'Push', icon: Upload },
    { command: 'git log --oneline', label: 'Log', icon: GitCommit },
    { command: 'git branch', label: 'Branches', icon: GitBranch }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Commands */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Git Commands
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {quickCommands.map((cmd, index) => (
            <button
              key={index}
              onClick={() => executeGitCommand(cmd.command)}
              disabled={isRunning}
              className="flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <cmd.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {cmd.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Command Input */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Custom Git Command
        </h3>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter git command (e.g., git commit -m 'message')"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const command = e.currentTarget.value;
                if (command.trim()) {
                  executeGitCommand(command.trim());
                  e.currentTarget.value = '';
                }
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (input?.value.trim()) {
                executeGitCommand(input.value.trim());
                input.value = '';
              }
            }}
            disabled={isRunning}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Terminal className="h-4 w-4" />
            <span>Execute</span>
          </button>
        </div>
      </div>

      {/* Operations History */}
      {operations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Operations
            </h3>
            <button
              onClick={() => setOperations([])}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear History
            </button>
          </div>
          
          <div className="space-y-3">
            {operations.slice(0, 10).map((operation) => (
              <div key={operation.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(operation.status)}
                    <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                      {operation.command}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(operation.status)}`}>
                      {operation.status}
                    </span>
                    {operation.duration > 0 && (
                      <span className="text-xs text-gray-500">
                        {operation.duration}s
                      </span>
                    )}
                  </div>
                </div>
                
                {operation.output && (
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {operation.output}
                  </div>
                )}
                
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(operation.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Repository Info */}
      {repository && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <GitBranch className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Current Repository
            </span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {repository}
          </p>
        </div>
      )}
    </div>
  );
}
