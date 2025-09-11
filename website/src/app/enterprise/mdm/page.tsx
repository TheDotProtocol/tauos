'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield,
  Smartphone,
  Monitor,
  Tablet,
  Settings,
  Users,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  BarChart3,
  Activity,
  Network,
  HardDrive,
  Cpu,
  Battery,
  Wifi,
  Signal,
  MapPin,
  Calendar,
  Bell,
  User,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  X,
  Check,
  XCircle,
  Info,
  Warning,
  Zap,
  Key,
  Database,
  Server,
  Globe,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  Clock as ClockIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Plus as PlusIcon,
  Edit3 as Edit3Icon,
  Trash2 as Trash2Icon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  RefreshCw as RefreshCwIcon,
  BarChart3 as BarChart3Icon,
  Activity as ActivityIcon,
  Network as NetworkIcon,
  HardDrive as HardDriveIcon,
  Cpu as CpuIcon,
  Battery as BatteryIcon,
  Wifi as WifiIcon,
  Signal as SignalIcon,
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  Bell as BellIcon,
  User as UserIcon,
  ChevronRight as ChevronRightIcon,
  ChevronDown as ChevronDownIcon,
  MoreHorizontal as MoreHorizontalIcon,
  X as XIcon,
  Check as CheckIcon,
  XCircle as XCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Zap as ZapIcon,
  Key as KeyIcon,
  Database as DatabaseIcon,
  Server as ServerIcon,
  Globe as GlobeIcon
} from 'lucide-react';

export default function MDMDashboard() {
  const [activeTab, setActiveTab] = useState('devices');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  // Mock data for devices
  const devices = [
    {
      id: '1',
      name: 'MacBook Pro - John Doe',
      type: 'desktop',
      status: 'online',
      lastSeen: '2 minutes ago',
      os: 'TauOS Desktop 2.1.0',
      location: 'New York, NY',
      compliance: 'compliant',
      policies: 12,
      storage: '512GB',
      memory: '16GB',
      battery: 85
    },
    {
      id: '2',
      name: 'iPhone 15 - Sarah Smith',
      type: 'mobile',
      status: 'online',
      lastSeen: '5 minutes ago',
      os: 'TauOS Mobile 1.8.2',
      location: 'San Francisco, CA',
      compliance: 'compliant',
      policies: 8,
      storage: '256GB',
      memory: '8GB',
      battery: 92
    },
    {
      id: '3',
      name: 'iPad Pro - Marketing Team',
      type: 'tablet',
      status: 'offline',
      lastSeen: '2 hours ago',
      os: 'TauOS Mobile 1.8.1',
      location: 'Chicago, IL',
      compliance: 'non-compliant',
      policies: 6,
      storage: '1TB',
      memory: '16GB',
      battery: 0
    }
  ];

  const policies = [
    {
      id: '1',
      name: 'Privacy-Max Policy',
      description: 'Maximum privacy settings with strict data controls',
      devices: 45,
      status: 'active',
      lastUpdated: '2 days ago'
    },
    {
      id: '2',
      name: 'Balanced Security',
      description: 'Balanced approach between usability and security',
      devices: 23,
      status: 'active',
      lastUpdated: '1 week ago'
    },
    {
      id: '3',
      name: 'Custom Enterprise',
      description: 'Custom policy for enterprise requirements',
      devices: 12,
      status: 'draft',
      lastUpdated: '3 days ago'
    }
  ];

  const securityEvents = [
    {
      id: '1',
      type: 'policy_violation',
      device: 'MacBook Pro - John Doe',
      severity: 'medium',
      description: 'Unauthorized app installation detected',
      timestamp: '10 minutes ago',
      status: 'investigating'
    },
    {
      id: '2',
      type: 'security_scan',
      device: 'iPhone 15 - Sarah Smith',
      severity: 'low',
      description: 'Routine security scan completed',
      timestamp: '1 hour ago',
      status: 'resolved'
    },
    {
      id: '3',
      type: 'compliance_check',
      device: 'iPad Pro - Marketing Team',
      severity: 'high',
      description: 'Device out of compliance - missing updates',
      timestamp: '3 hours ago',
      status: 'pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      case 'compliant': return 'text-green-400';
      case 'non-compliant': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src="/brand/tauos-logo.svg" alt="TauOS" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-white">TauOS MDM</h1>
                <p className="text-sm text-gray-400">Device Management & Security</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Devices</p>
                <p className="text-2xl font-bold text-white">1,247</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>98% Online</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Policies</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>All Enforced</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Security Score</p>
                <p className="text-2xl font-bold text-white">94/100</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-yellow-400">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>3 Issues</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Compliance</p>
                <p className="text-2xl font-bold text-white">96%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>GDPR Ready</span>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-1 mb-8">
          {[
            { id: 'devices', label: 'Devices', icon: Smartphone },
            { id: 'policies', label: 'Policies', icon: Shield },
            { id: 'security', label: 'Security', icon: Lock },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {activeTab === 'devices' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Device Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search devices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
                    />
                  </div>
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                    <Plus className="w-4 h-4" />
                    <span>Add Device</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Device</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">OS Version</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Compliance</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Last Seen</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {devices.map((device) => (
                        <tr key={device.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                {device.type === 'desktop' && <Monitor className="w-5 h-5 text-white" />}
                                {device.type === 'mobile' && <Smartphone className="w-5 h-5 text-white" />}
                                {device.type === 'tablet' && <Tablet className="w-5 h-5 text-white" />}
                              </div>
                              <div>
                                <p className="font-medium text-white">{device.name}</p>
                                <p className="text-sm text-gray-400">{device.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${device.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                              {device.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">{device.os}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.compliance)}`}>
                              {device.compliance}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">{device.lastSeen}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'policies' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Policy Management</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Plus className="w-4 h-4" />
                  <span>Create Policy</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies.map((policy) => (
                  <div key={policy.id} className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        policy.status === 'active' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'
                      }`}>
                        {policy.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{policy.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{policy.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{policy.devices} devices</span>
                      <span className="text-gray-400">Updated {policy.lastUpdated}</span>
                    </div>
                    <div className="mt-4 flex items-center space-x-2">
                      <button className="flex-1 bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 transition-colors">
                        Edit
                      </button>
                      <button className="flex-1 bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 transition-colors">
                        Deploy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Security Monitoring</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="space-y-6">
                {securityEvents.map((event) => (
                  <div key={event.id} className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-white">{event.description}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                              {event.severity}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">Device: {event.device}</p>
                          <p className="text-gray-500 text-sm">{event.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'resolved' ? 'text-green-400 bg-green-400/10' : 
                          event.status === 'investigating' ? 'text-yellow-400 bg-yellow-400/10' : 
                          'text-red-400 bg-red-400/10'
                        }`}>
                          {event.status}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Analytics & Reports</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">Device Distribution</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-gray-300">Desktop</span>
                      </div>
                      <span className="text-white font-semibold">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-gray-300">Mobile</span>
                      </div>
                      <span className="text-white font-semibold">35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                        <span className="text-gray-300">Tablet</span>
                      </div>
                      <span className="text-white font-semibold">20%</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">Security Trends</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Policy Violations</span>
                      <span className="text-red-400 font-semibold">-12%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Security Incidents</span>
                      <span className="text-green-400 font-semibold">-8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Compliance Rate</span>
                      <span className="text-green-400 font-semibold">+4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
