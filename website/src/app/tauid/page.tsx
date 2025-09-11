'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, User, Lock, Eye, CheckCircle, AlertCircle, BarChart3, 
  Activity, Settings, Search, Plus, Edit3, Download, Users, 
  UserCheck, Fingerprint, Smartphone, Monitor, Tablet
} from 'lucide-react';

export default function TauIDDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const identityMetrics = {
    totalUsers: 1247,
    activeUsers: 1189,
    verifiedUsers: 1156,
    privacyScore: 94,
    securityEvents: 3
  };

  const privacyBreakdown = [
    { category: 'Data Collection', score: 98, status: 'excellent' },
    { category: 'Data Sharing', score: 95, status: 'excellent' },
    { category: 'Data Retention', score: 92, status: 'good' },
    { category: 'Access Control', score: 96, status: 'excellent' },
    { category: 'Encryption', score: 100, status: 'excellent' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'excellent': return 'text-green-400 bg-green-400/10';
      case 'good': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src="/brand/tauos-logo.svg" alt="TauOS" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-white">TauID</h1>
                <p className="text-sm text-gray-400">Identity & Access Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{identityMetrics.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <UserCheck className="w-4 h-4 mr-1" />
              <span>{identityMetrics.activeUsers} active</span>
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
                <p className="text-sm text-gray-400">Privacy Score</p>
                <p className="text-2xl font-bold text-white">{identityMetrics.privacyScore}/100</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${identityMetrics.privacyScore}%` }}
                ></div>
              </div>
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
                <p className="text-sm text-gray-400">Verified Users</p>
                <p className="text-2xl font-bold text-white">{identityMetrics.verifiedUsers}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>92.7% verified</span>
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
                <p className="text-sm text-gray-400">Security Events</p>
                <p className="text-2xl font-bold text-white">{identityMetrics.securityEvents}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-yellow-400">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Last 24 hours</span>
            </div>
          </motion.div>
        </div>

        <div className="flex space-x-1 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'devices', label: 'Devices', icon: Smartphone },
            { id: 'permissions', label: 'Permissions', icon: Lock },
            { id: 'activity', label: 'Activity', icon: Activity }
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

        <div className="space-y-8">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-6">Privacy Score Breakdown</h3>
                  <div className="space-y-4">
                    {privacyBreakdown.map((item) => (
                      <div key={item.category} className="p-4 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{item.category}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.score}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              item.score >= 95 ? 'bg-green-500' : 
                              item.score >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-6">Recent Activities</h3>
                  <div className="space-y-4">
                    {[
                      { action: 'Login from new device', user: 'john.doe@company.com', time: '2 minutes ago' },
                      { action: 'Permission change', user: 'sarah.smith@company.com', time: '5 minutes ago' },
                      { action: 'User account created', user: 'admin@company.com', time: '10 minutes ago' },
                      { action: 'Failed login attempt', user: 'unknown@external.com', time: '15 minutes ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-green-400"></div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{activity.action}</p>
                          <p className="text-gray-400 text-xs">{activity.user}</p>
                          <p className="text-gray-500 text-xs">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'devices' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Connected Devices</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Plus className="w-4 h-4" />
                  <span>Add Device</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'MacBook Pro - John Doe', type: 'desktop', status: 'active', lastSeen: '2 minutes ago' },
                  { name: 'iPhone 15 - Sarah Smith', type: 'mobile', status: 'active', lastSeen: '5 minutes ago' },
                  { name: 'iPad Pro - Marketing Team', type: 'tablet', status: 'inactive', lastSeen: '2 hours ago' }
                ].map((device, index) => (
                  <div key={index} className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        {device.type === 'desktop' && <Monitor className="w-5 h-5 text-white" />}
                        {device.type === 'mobile' && <Smartphone className="w-5 h-5 text-white" />}
                        {device.type === 'tablet' && <Tablet className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{device.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                          {device.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Last seen: {device.lastSeen}</p>
                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 transition-colors">
                        View Details
                      </button>
                      <button className="flex-1 bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 transition-colors">
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'permissions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Permission Management</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Plus className="w-4 h-4" />
                  <span>Create Policy</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'TauMail', users: 1247, permissions: ['Read', 'Write', 'Delete'] },
                  { name: 'TauCloud', users: 1189, permissions: ['Read', 'Write', 'Share'] },
                  { name: 'TauStore', users: 892, permissions: ['Browse', 'Install', 'Update'] },
                  { name: 'TauID', users: 1247, permissions: ['View', 'Edit', 'Manage'] },
                  { name: 'Enterprise Tools', users: 156, permissions: ['Admin', 'Monitor', 'Configure'] },
                  { name: 'API Access', users: 45, permissions: ['Read', 'Write', 'Execute'] }
                ].map((service, index) => (
                  <div key={index} className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{service.users} users</p>
                    <div className="space-y-2 mb-4">
                      {service.permissions.map((permission, pIndex) => (
                        <div key={pIndex} className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">{permission}</span>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 transition-colors">
                        Edit
                      </button>
                      <button className="flex-1 bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 transition-colors">
                        View Users
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Activity Log</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Download className="w-4 h-4" />
                  <span>Export Log</span>
                </button>
              </div>

              <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Action</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Resource</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Timestamp</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {[
                        { user: 'john.doe@company.com', action: 'Login from new device', resource: 'MacBook Pro', timestamp: '2 minutes ago', status: 'success' },
                        { user: 'sarah.smith@company.com', action: 'Permission change', resource: 'TauCloud', timestamp: '5 minutes ago', status: 'success' },
                        { user: 'admin@company.com', action: 'User account created', resource: 'New employee', timestamp: '10 minutes ago', status: 'success' },
                        { user: 'unknown@external.com', action: 'Failed login attempt', resource: 'Unknown location', timestamp: '15 minutes ago', status: 'failed' }
                      ].map((activity, index) => (
                        <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-white">{activity.user}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-white">{activity.action}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">{activity.resource}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{activity.timestamp}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
