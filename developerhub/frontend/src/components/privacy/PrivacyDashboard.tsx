'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Settings, 
  Download, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Activity,
  BarChart3,
  Clock,
  Database,
  Globe,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Thermometer,
  Zap
} from 'lucide-react';

interface MonitoringData {
  systemPerformance: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  securityEvents: {
    failedLogins: number;
    malwareDetected: number;
    suspiciousActivity: number;
    blockedThreats: number;
  };
  systemHealth: {
    temperature: number;
    battery: number;
    uptime: string;
    errors: number;
  };
  networkActivity: {
    connections: number;
    dataTransferred: number;
    anomalies: number;
    blockedConnections: number;
  };
}

interface PrivacySettings {
  privacyLevel: 'maximum' | 'balanced' | 'enhanced';
  systemMonitoring: boolean;
  securityMonitoring: boolean;
  performanceMonitoring: boolean;
  networkMonitoring: boolean;
  dataRetention: number; // days
  dataExport: boolean;
  dataDeletion: boolean;
}

export default function PrivacyDashboard() {
  const [monitoringData, setMonitoringData] = useState<MonitoringData>({
    systemPerformance: {
      cpu: 45,
      memory: 67,
      disk: 23,
      network: 12
    },
    securityEvents: {
      failedLogins: 2,
      malwareDetected: 0,
      suspiciousActivity: 1,
      blockedThreats: 3
    },
    systemHealth: {
      temperature: 42,
      battery: 85,
      uptime: '2d 14h 32m',
      errors: 0
    },
    networkActivity: {
      connections: 15,
      dataTransferred: 1024,
      anomalies: 0,
      blockedConnections: 2
    }
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    privacyLevel: 'balanced',
    systemMonitoring: true,
    securityMonitoring: true,
    performanceMonitoring: true,
    networkMonitoring: false,
    dataRetention: 30,
    dataExport: true,
    dataDeletion: true
  });

  const [isRealTime, setIsRealTime] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setMonitoringData(prev => ({
        systemPerformance: {
          cpu: Math.max(0, Math.min(100, prev.systemPerformance.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(0, Math.min(100, prev.systemPerformance.memory + (Math.random() - 0.5) * 5)),
          disk: Math.max(0, Math.min(100, prev.systemPerformance.disk + (Math.random() - 0.5) * 2)),
          network: Math.max(0, Math.min(100, prev.systemPerformance.network + (Math.random() - 0.5) * 15))
        },
        securityEvents: {
          ...prev.securityEvents,
          failedLogins: prev.securityEvents.failedLogins + (Math.random() < 0.1 ? 1 : 0),
          suspiciousActivity: prev.securityEvents.suspiciousActivity + (Math.random() < 0.05 ? 1 : 0)
        },
        systemHealth: {
          ...prev.systemHealth,
          temperature: Math.max(30, Math.min(80, prev.systemHealth.temperature + (Math.random() - 0.5) * 2)),
          battery: Math.max(0, Math.min(100, prev.systemHealth.battery - (Math.random() * 0.1)))
        },
        networkActivity: {
          ...prev.networkActivity,
          connections: Math.max(0, prev.networkActivity.connections + (Math.random() < 0.3 ? (Math.random() < 0.5 ? 1 : -1) : 0)),
          dataTransferred: prev.networkActivity.dataTransferred + Math.random() * 10
        }
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  const getPrivacyLevelInfo = (level: string) => {
    switch (level) {
      case 'maximum':
        return {
          name: 'Maximum Privacy',
          description: 'No monitoring, complete privacy',
          icon: Lock,
          color: 'text-green-600 bg-green-100',
          monitoring: false
        };
      case 'balanced':
        return {
          name: 'Balanced Privacy',
          description: 'Basic security monitoring',
          icon: Shield,
          color: 'text-blue-600 bg-blue-100',
          monitoring: true
        };
      case 'enhanced':
        return {
          name: 'Enhanced Safety',
          description: 'Comprehensive monitoring',
          icon: Unlock,
          color: 'text-orange-600 bg-orange-100',
          monitoring: true
        };
      default:
        return {
          name: 'Unknown',
          description: 'Unknown privacy level',
          icon: Shield,
          color: 'text-gray-600 bg-gray-100',
          monitoring: false
        };
    }
  };

  const privacyLevelInfo = getPrivacyLevelInfo(privacySettings.privacyLevel);

  const updatePrivacySetting = (key: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      privacySettings,
      monitoringData,
      exportReason: 'User requested data export'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tauos-privacy-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteData = () => {
    if (confirm('Are you sure you want to delete all monitoring data? This action cannot be undone.')) {
      setMonitoringData({
        systemPerformance: { cpu: 0, memory: 0, disk: 0, network: 0 },
        securityEvents: { failedLogins: 0, malwareDetected: 0, suspiciousActivity: 0, blockedThreats: 0 },
        systemHealth: { temperature: 0, battery: 0, uptime: '0d 0h 0m', errors: 0 },
        networkActivity: { connections: 0, dataTransferred: 0, anomalies: 0, blockedConnections: 0 }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Privacy Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor what we monitor, control your privacy
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsRealTime(!isRealTime)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isRealTime
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {isRealTime ? (
              <>
                <Activity className="h-4 w-4 mr-2 inline" />
                Live
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-2 inline" />
                Paused
              </>
            )}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Privacy Level Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${privacyLevelInfo.color}`}>
              <privacyLevelInfo.icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {privacyLevelInfo.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {privacyLevelInfo.description}
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
            <Settings className="h-4 w-4 mr-2 inline" />
            Change Settings
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded ${privacySettings.systemMonitoring ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              {privacySettings.systemMonitoring ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">System Monitoring</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded ${privacySettings.securityMonitoring ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              {privacySettings.securityMonitoring ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Security Monitoring</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded ${privacySettings.performanceMonitoring ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              {privacySettings.performanceMonitoring ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Performance Monitoring</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded ${privacySettings.networkMonitoring ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              {privacySettings.networkMonitoring ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Network Monitoring</span>
          </div>
        </div>
      </div>

      {/* What We Monitor */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* System Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Cpu className="h-5 w-5 mr-2" />
            System Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.round(monitoringData.systemPerformance.cpu)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${monitoringData.systemPerformance.cpu}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.round(monitoringData.systemPerformance.memory)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${monitoringData.systemPerformance.memory}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Disk Usage</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.round(monitoringData.systemPerformance.disk)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${monitoringData.systemPerformance.disk}%` }}
              />
            </div>
          </div>
        </div>

        {/* Security Events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Events
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {monitoringData.securityEvents.failedLogins}
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">Failed Logins</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {monitoringData.securityEvents.suspiciousActivity}
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">Suspicious Activity</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {monitoringData.securityEvents.blockedThreats}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">Blocked Threats</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {monitoringData.securityEvents.malwareDetected}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Malware Detected</div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Thermometer className="h-5 w-5 mr-2" />
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Temperature</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.round(monitoringData.systemHealth.temperature)}°C
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Battery</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.round(monitoringData.systemHealth.battery)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {monitoringData.systemHealth.uptime}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Errors</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {monitoringData.systemHealth.errors}
              </span>
            </div>
          </div>
        </div>

        {/* Network Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Wifi className="h-5 w-5 mr-2" />
            Network Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Connections</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {monitoringData.networkActivity.connections}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Data Transferred</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.round(monitoringData.networkActivity.dataTransferred)} MB
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Anomalies</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {monitoringData.networkActivity.anomalies}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Blocked Connections</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {monitoringData.networkActivity.blockedConnections}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* What We Never Monitor */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-6">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center">
          <XCircle className="h-5 w-5 mr-2" />
          What We Never Monitor
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300">File Contents</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300">Messages & Emails</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300">Browsing History</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300">Personal Documents</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300">Application Usage</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300">Personal Activities</span>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Management
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Database className="h-8 w-8 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Data Retention</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {privacySettings.dataRetention} days
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Download className="h-8 w-8 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Data Export</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {privacySettings.dataExport ? 'Enabled' : 'Disabled'}
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Trash2 className="h-8 w-8 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Data Deletion</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {privacySettings.dataDeletion ? 'Available' : 'Disabled'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-4 mt-6">
          <button
            onClick={exportData}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
          <button
            onClick={deleteData}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
