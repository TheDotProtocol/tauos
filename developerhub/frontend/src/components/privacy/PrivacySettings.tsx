'use client';

import { useState } from 'react';
import { 
  Shield, 
  Settings, 
  Save, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
  Cpu,
  HardDrive,
  Wifi,
  Shield as SecurityIcon,
  BarChart3,
  Clock,
  Database,
  Download,
  Trash2
} from 'lucide-react';

interface PrivacySettings {
  privacyLevel: 'maximum' | 'balanced' | 'enhanced';
  systemMonitoring: boolean;
  securityMonitoring: boolean;
  performanceMonitoring: boolean;
  networkMonitoring: boolean;
  dataRetention: number;
  dataExport: boolean;
  dataDeletion: boolean;
  auditLogging: boolean;
  threatDetection: boolean;
  anomalyDetection: boolean;
  realTimeAlerts: boolean;
}

export default function PrivacySettings() {
  const [settings, setSettings] = useState<PrivacySettings>({
    privacyLevel: 'balanced',
    systemMonitoring: true,
    securityMonitoring: true,
    performanceMonitoring: true,
    networkMonitoring: false,
    dataRetention: 30,
    dataExport: true,
    dataDeletion: true,
    auditLogging: true,
    threatDetection: true,
    anomalyDetection: false,
    realTimeAlerts: true
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateSetting = (key: keyof PrivacySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // Simulate saving settings
    console.log('Saving privacy settings:', settings);
    setHasChanges(false);
    // Show success message
    alert('Privacy settings saved successfully!');
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all privacy settings to default?')) {
      setSettings({
        privacyLevel: 'balanced',
        systemMonitoring: true,
        securityMonitoring: true,
        performanceMonitoring: true,
        networkMonitoring: false,
        dataRetention: 30,
        dataExport: true,
        dataDeletion: true,
        auditLogging: true,
        threatDetection: true,
        anomalyDetection: false,
        realTimeAlerts: true
      });
      setHasChanges(true);
    }
  };

  const getPrivacyLevelInfo = (level: string) => {
    switch (level) {
      case 'maximum':
        return {
          name: 'Maximum Privacy',
          description: 'No monitoring, complete privacy protection',
          icon: Lock,
          color: 'text-green-600 bg-green-100',
          features: ['No system monitoring', 'Complete privacy', 'No data collection', 'Zero telemetry']
        };
      case 'balanced':
        return {
          name: 'Balanced Privacy',
          description: 'Basic security monitoring without personal data access',
          icon: Shield,
          color: 'text-blue-600 bg-blue-100',
          features: ['Basic security monitoring', 'System protection', 'No personal data access', 'Threat detection']
        };
      case 'enhanced':
        return {
          name: 'Enhanced Safety',
          description: 'Comprehensive security monitoring for maximum protection',
          icon: Unlock,
          color: 'text-orange-600 bg-orange-100',
          features: ['Comprehensive monitoring', 'Advanced threat protection', 'System health monitoring', 'Enterprise security']
        };
      default:
        return {
          name: 'Unknown',
          description: 'Unknown privacy level',
          icon: Shield,
          color: 'text-gray-600 bg-gray-100',
          features: []
        };
    }
  };

  const privacyLevelInfo = getPrivacyLevelInfo(settings.privacyLevel);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Privacy Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Control your privacy level and monitoring preferences
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <span className="text-sm text-orange-600 dark:text-orange-400 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Unsaved changes
            </span>
          )}
          <button
            onClick={resetSettings}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={saveSettings}
            disabled={!hasChanges}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Privacy Level Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Privacy Level
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { id: 'maximum', name: 'Maximum Privacy', icon: Lock, color: 'text-green-600 bg-green-100' },
            { id: 'balanced', name: 'Balanced Privacy', icon: Shield, color: 'text-blue-600 bg-blue-100' },
            { id: 'enhanced', name: 'Enhanced Safety', icon: Unlock, color: 'text-orange-600 bg-orange-100' }
          ].map((level) => (
            <div
              key={level.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                settings.privacyLevel === level.id
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => updateSetting('privacyLevel', level.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${level.color}`}>
                  <level.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {level.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {level.id === 'maximum' && 'No monitoring, complete privacy'}
                    {level.id === 'balanced' && 'Basic security monitoring'}
                    {level.id === 'enhanced' && 'Comprehensive monitoring'}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <input
                    type="radio"
                    name="privacyLevel"
                    value={level.id}
                    checked={settings.privacyLevel === level.id}
                    onChange={() => updateSetting('privacyLevel', level.id)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Privacy Level Info */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${privacyLevelInfo.color}`}>
              <privacyLevelInfo.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {privacyLevelInfo.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {privacyLevelInfo.description}
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            {privacyLevelInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monitoring Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monitoring Settings
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">System Monitoring</h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Cpu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">System Performance</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Monitor CPU, memory, disk usage</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.systemMonitoring}
                  onChange={(e) => updateSetting('systemMonitoring', e.target.checked)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SecurityIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Security Events</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Monitor failed logins, threats</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.securityMonitoring}
                  onChange={(e) => updateSetting('securityMonitoring', e.target.checked)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Performance Metrics</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Monitor system performance</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.performanceMonitoring}
                  onChange={(e) => updateSetting('performanceMonitoring', e.target.checked)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wifi className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Network Activity</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Monitor network connections</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.networkMonitoring}
                  onChange={(e) => updateSetting('networkMonitoring', e.target.checked)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Advanced Settings</h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Audit Logging</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Log system events</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.auditLogging}
                  onChange={(e) => updateSetting('auditLogging', e.target.checked)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Threat Detection</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Detect security threats</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.threatDetection}
                  onChange={(e) => updateSetting('threatDetection', e.target.checked)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Anomaly Detection</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Detect unusual patterns</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.anomalyDetection}
                  onChange={(e) => updateSetting('anomalyDetection', e.target.checked)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Real-time Alerts</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Get immediate notifications</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.realTimeAlerts}
                  onChange={(e) => updateSetting('realTimeAlerts', e.target.checked)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Management
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Retention Period
              </label>
              <select
                value={settings.dataRetention}
                onChange={(e) => updateSetting('dataRetention', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={365}>1 year</option>
                <option value={0}>Never delete</option>
              </select>
            </div>

            <div>
              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Data Export</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Allow exporting monitoring data</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dataExport}
                  onChange={(e) => updateSetting('dataExport', e.target.checked)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                />
              </label>
            </div>

            <div>
              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Data Deletion</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Allow deleting monitoring data</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dataDeletion}
                  onChange={(e) => updateSetting('dataDeletion', e.target.checked)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-800 dark:text-blue-200">Privacy Protection</h3>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                All monitoring data is encrypted and stored securely. We never access your personal files, 
                messages, or browsing history. Only system-level events are monitored.
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-800 dark:text-green-200">Your Rights</h3>
              </div>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• View what we monitor</li>
                <li>• Export your data</li>
                <li>• Delete your data</li>
                <li>• Change settings anytime</li>
                <li>• Complete transparency</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* What We Never Monitor */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-6">
        <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center">
          <XCircle className="h-5 w-5 mr-2" />
          What We Never Monitor
        </h2>
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
    </div>
  );
}
