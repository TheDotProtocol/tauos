'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, Server, AlertTriangle, CheckCircle, Clock, Cpu, HardDrive, Globe } from 'lucide-react';

interface AppMetrics {
  status: string;
  lastCheck: number;
  endpoints: string[];
  requests: number;
  errors: number;
  avgResponseTime: number;
}

interface SystemHealth {
  status: string;
  database: {
    status: string;
    responseTime: number;
  };
  apps: Record<string, AppMetrics>;
  system: {
    uptime: number;
    memory: any;
    cpu: any;
    platform: string;
    nodeVersion: string;
    pid: number;
  };
  environment: {
    NODE_ENV: string;
    DATABASE_URL: boolean;
    JWT_SECRET: boolean;
    SENDGRID_API_KEY: boolean;
  };
}

export default function MonitoringPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/monitoring/metrics');
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const data = await response.json();
        setHealth(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'unhealthy': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'unhealthy': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-300">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-300">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!health) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-2xl font-bold">TauCore™ System Monitoring</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${getStatusColor(health.status)}`}>
                {getStatusIcon(health.status)}
                <span className="ml-2 font-medium capitalize">{health.status}</span>
              </div>
              <div className="text-sm text-gray-400">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Database</p>
                <div className="flex items-center">
                  {getStatusIcon(health.database.status)}
                  <span className="ml-2 font-medium">{health.database.responseTime}ms</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Uptime</p>
                <p className="text-lg font-medium">{formatUptime(health.system.uptime)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <HardDrive className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Memory</p>
                <p className="text-lg font-medium">{formatBytes(health.system.memory.heapUsed)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Server className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Platform</p>
                <p className="text-lg font-medium">{health.system.platform}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Applications Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-6">Applications Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(health.apps).map(([appName, appData]) => (
              <div key={appName} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium capitalize">{appName}</h3>
                  {getStatusIcon(appData.status)}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Requests</span>
                    <span className="font-medium">{appData.requests}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Errors</span>
                    <span className={`font-medium ${appData.errors > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {appData.errors}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Avg Response</span>
                    <span className="font-medium">{Math.round(appData.avgResponseTime)}ms</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Endpoints</span>
                    <span className="font-medium">{appData.endpoints.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Environment Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-6">Environment Status</h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-400">Environment:</span>
                <span className="ml-2 font-medium">{health.environment.NODE_ENV}</span>
              </div>
              
              <div className="flex items-center">
                <Database className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-400">Database URL:</span>
                <span className="ml-2 font-medium">{health.environment.DATABASE_URL ? '✓' : '✗'}</span>
              </div>
              
              <div className="flex items-center">
                <Server className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-400">JWT Secret:</span>
                <span className="ml-2 font-medium">{health.environment.JWT_SECRET ? '✓' : '✗'}</span>
              </div>
              
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-400">SendGrid API:</span>
                <span className="ml-2 font-medium">{health.environment.SENDGRID_API_KEY ? '✓' : '✗'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-6">System Information</h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Memory Usage</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">RSS:</span>
                    <span className="font-medium">{formatBytes(health.system.memory.rss)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Heap Total:</span>
                    <span className="font-medium">{formatBytes(health.system.memory.heapTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Heap Used:</span>
                    <span className="font-medium">{formatBytes(health.system.memory.heapUsed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">External:</span>
                    <span className="font-medium">{formatBytes(health.system.memory.external)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">System Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Node Version:</span>
                    <span className="font-medium">{health.system.nodeVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Platform:</span>
                    <span className="font-medium">{health.system.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Process ID:</span>
                    <span className="font-medium">{health.system.pid}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
