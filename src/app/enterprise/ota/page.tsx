'use client';

import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  BarChart3,
  Calendar,
  Users,
  Smartphone,
  Monitor,
  Tablet,
  Server,
  Database,
  Settings,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  X,
  Check,
  Info,
  AlertTriangle,
  Zap,
  Key,
  Shield,
  Lock,
  Activity,
  Network,
  HardDrive,
  Cpu,
  Battery,
  Wifi,
  Signal,
  MapPin,
  Bell,
  User
} from 'lucide-react';

export default function OTADashboard() {
  const [activeTab, setActiveTab] = useState('deployments');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for OTA updates
  const deployments = [
    {
      id: '1',
      name: 'TauOS Desktop 2.1.1',
      version: '2.1.1',
      type: 'security',
      status: 'in_progress',
      progress: 65,
      devices: 1247,
      completed: 810,
      failed: 12,
      scheduled: '2025-01-15 14:00 UTC',
      estimated: '2 hours remaining'
    },
    {
      id: '2',
      name: 'TauOS Mobile 1.8.3',
      version: '1.8.3',
      type: 'feature',
      status: 'scheduled',
      progress: 0,
      devices: 892,
      completed: 0,
      failed: 0,
      scheduled: '2025-01-16 10:00 UTC',
      estimated: '1 hour estimated'
    },
    {
      id: '3',
      name: 'Security Patch 2025.01',
      version: '2.1.0-patch1',
      type: 'critical',
      status: 'completed',
      progress: 100,
      devices: 1247,
      completed: 1247,
      failed: 0,
      scheduled: '2025-01-10 16:00 UTC',
      estimated: 'Completed'
    }
  ];

  const updateHistory = [
    {
      id: '1',
      name: 'TauOS Desktop 2.1.0',
      version: '2.1.0',
      type: 'major',
      status: 'success',
      devices: 1247,
      completed: 1247,
      failed: 0,
      deployed: '2025-01-05 10:00 UTC',
      duration: '45 minutes'
    },
    {
      id: '2',
      name: 'TauOS Mobile 1.8.2',
      version: '1.8.2',
      type: 'minor',
      status: 'success',
      devices: 892,
      completed: 890,
      failed: 2,
      deployed: '2024-12-28 14:00 UTC',
      duration: '30 minutes'
    },
    {
      id: '3',
      name: 'Security Hotfix',
      version: '2.0.9-hotfix1',
      type: 'critical',
      status: 'partial',
      devices: 1247,
      completed: 1200,
      failed: 47,
      deployed: '2024-12-20 18:00 UTC',
      duration: '1 hour'
    }
  ];

  const deviceGroups = [
    {
      id: '1',
      name: 'Executive Devices',
      devices: 45,
      status: 'ready',
      lastUpdate: '2025-01-10 16:00 UTC'
    },
    {
      id: '2',
      name: 'Engineering Team',
      devices: 156,
      status: 'ready',
      lastUpdate: '2025-01-10 16:00 UTC'
    },
    {
      id: '3',
      name: 'Marketing Team',
      devices: 89,
      status: 'updating',
      lastUpdate: '2025-01-15 14:00 UTC'
    },
    {
      id: '4',
      name: 'Sales Team',
      devices: 234,
      status: 'pending',
      lastUpdate: '2025-01-16 10:00 UTC'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'text-blue-400 bg-blue-400/10';
      case 'scheduled': return 'text-yellow-400 bg-yellow-400/10';
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      case 'success': return 'text-green-400 bg-green-400/10';
      case 'partial': return 'text-orange-400 bg-orange-400/10';
      case 'ready': return 'text-green-400 bg-green-400/10';
      case 'updating': return 'text-blue-400 bg-blue-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security': return 'text-red-400 bg-red-400/10';
      case 'critical': return 'text-red-400 bg-red-400/10';
      case 'feature': return 'text-blue-400 bg-blue-400/10';
      case 'major': return 'text-purple-400 bg-purple-400/10';
      case 'minor': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <MarketingPageShell
      title="OTA Updates"
      subtitle="Schedule and track over-the-air updates for TAU CORE™ desktop and mobile fleets."
      hero={false}
    >
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
                <p className="text-sm text-gray-400">Active Deployments</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-400">
              <Activity className="w-4 h-4 mr-1" />
              <span>1 in progress</span>
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
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-white">99.2%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>Last 30 days</span>
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
                <p className="text-sm text-gray-400">Avg. Deployment Time</p>
                <p className="text-2xl font-bold text-white">42m</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-yellow-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>Across all devices</span>
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
                <p className="text-sm text-gray-400">Pending Updates</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-400">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Ready to deploy</span>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-1 mb-8">
          {[
            { id: 'deployments', label: 'Deployments', icon: Download },
            { id: 'history', label: 'History', icon: Clock },
            { id: 'groups', label: 'Device Groups', icon: Users },
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
          {activeTab === 'deployments' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Active Deployments</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Plus className="w-4 h-4" />
                  <span>New Deployment</span>
                </button>
              </div>

              <div className="space-y-6">
                {deployments.map((deployment) => (
                  <div key={deployment.id} className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                          <Download className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-bold text-white">{deployment.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(deployment.type)}`}>
                              {deployment.type}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                              {deployment.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">Version {deployment.version} • {deployment.devices} devices</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {deployment.status === 'in_progress' && (
                          <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <Pause className="w-4 h-4" />
                          </button>
                        )}
                        {deployment.status === 'scheduled' && (
                          <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {deployment.status === 'in_progress' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{deployment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${deployment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Completed</p>
                        <p className="text-white font-semibold">{deployment.completed}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Failed</p>
                        <p className="text-red-400 font-semibold">{deployment.failed}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Scheduled</p>
                        <p className="text-white font-semibold">{deployment.scheduled}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Estimated</p>
                        <p className="text-white font-semibold">{deployment.estimated}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Update History</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search updates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
                    />
                  </div>
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Update</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Devices</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Deployed</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Duration</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {updateHistory.map((update) => (
                        <tr key={update.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-white">{update.name}</p>
                              <p className="text-sm text-gray-400">v{update.version}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(update.type)}`}>
                              {update.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(update.status)}`}>
                              {update.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <p className="text-white">{update.completed}/{update.devices}</p>
                              <p className="text-gray-400">{update.failed} failed</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">{update.deployed}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{update.duration}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                                <RotateCcw className="w-4 h-4" />
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

          {activeTab === 'groups' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Device Groups</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Plus className="w-4 h-4" />
                  <span>Create Group</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deviceGroups.map((group) => (
                  <div key={group.id} className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(group.status)}`}>
                        {group.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{group.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{group.devices} devices</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Last update</span>
                      <span className="text-gray-300">{group.lastUpdate}</span>
                    </div>
                    <div className="mt-4 flex items-center space-x-2">
                      <button className="flex-1 bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 transition-colors">
                        Manage
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

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Deployment Analytics</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">Deployment Success Rate</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-gray-300">Successful</span>
                      </div>
                      <span className="text-white font-semibold">99.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-gray-300">Failed</span>
                      </div>
                      <span className="text-white font-semibold">0.8%</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">Update Types Distribution</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-gray-300">Security</span>
                      </div>
                      <span className="text-white font-semibold">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-gray-300">Feature</span>
                      </div>
                      <span className="text-white font-semibold">35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                        <span className="text-gray-300">Bug Fix</span>
                      </div>
                      <span className="text-white font-semibold">20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </MarketingPageShell>
  );
}
