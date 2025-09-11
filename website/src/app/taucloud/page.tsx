'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, Shield, Lock, Eye, CheckCircle, AlertCircle, BarChart3, 
  Activity, Settings, Search, Plus, Edit3, Download, Users, 
  Folder, File, Upload, Share2, Trash2, MoreHorizontal, RefreshCw,
  Filter, Calendar, Clock, Bell, User, ChevronRight, Zap,
  HardDrive, Database, Server, FileText, FileImage, FileVideo,
  FileAudio, FolderOpen, Copy, EyeOff, Unlock, Key, Fingerprint
} from 'lucide-react';

export default function TauCloudDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const cloudMetrics = {
    totalFiles: 2847,
    storageUsed: '892GB',
    storageTotal: '1.2TB',
    privacyScore: 97,
    securityEvents: 2
  };

  const privacyBreakdown = [
    { category: 'Client-Side Encryption', score: 100, status: 'excellent' },
    { category: 'Zero-Knowledge Storage', score: 98, status: 'excellent' },
    { category: 'Access Control', score: 95, status: 'excellent' },
    { category: 'Data Retention', score: 94, status: 'excellent' },
    { category: 'Backup Security', score: 96, status: 'excellent' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'excellent': return 'text-green-400 bg-green-400/10';
      case 'good': return 'text-yellow-400 bg-yellow-400/10';
      case 'success': return 'text-green-400 bg-green-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
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
                <h1 className="text-xl font-bold text-white">TauCloud</h1>
                <p className="text-sm text-gray-400">Encrypted Cloud Storage</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Cloud className="w-4 h-4 text-black" />
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
                <p className="text-sm text-gray-400">Total Files</p>
                <p className="text-2xl font-bold text-white">{cloudMetrics.totalFiles}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <File className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-400">
              <Folder className="w-4 h-4 mr-1" />
              <span>156 folders</span>
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
                <p className="text-sm text-gray-400">Storage Used</p>
                <p className="text-2xl font-bold text-white">{cloudMetrics.storageUsed}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: '75%' }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">{cloudMetrics.storageTotal} total</p>
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
                <p className="text-sm text-gray-400">Privacy Score</p>
                <p className="text-2xl font-bold text-white">{cloudMetrics.privacyScore}/100</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>Zero-knowledge</span>
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
                <p className="text-2xl font-bold text-white">{cloudMetrics.securityEvents}</p>
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
            { id: 'files', label: 'Files', icon: File },
            { id: 'sharing', label: 'Sharing', icon: Share2 },
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
                  <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { action: 'File uploaded', file: 'Project_Report.pdf', user: 'john.doe@company.com', time: '2 minutes ago' },
                      { action: 'Folder shared', file: 'Team Documents', user: 'sarah.smith@company.com', time: '5 minutes ago' },
                      { action: 'File downloaded', file: 'Presentation_Slides.png', user: 'admin@company.com', time: '10 minutes ago' },
                      { action: 'Backup completed', file: 'System backup', user: 'system@tauos.org', time: '15 minutes ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-green-400"></div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{activity.action}</p>
                          <p className="text-gray-400 text-xs">{activity.file}</p>
                          <p className="text-gray-500 text-xs">{activity.user} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'files' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Files & Folders</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Plus className="w-4 h-4" />
                  <span>Upload Files</span>
                </button>
              </div>

              <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Size</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Modified</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {[
                        { name: 'Project_Report.pdf', size: '2.3 MB', modified: '2 hours ago', status: 'encrypted' },
                        { name: 'Presentation_Slides.png', size: '15.7 MB', modified: '1 day ago', status: 'encrypted' },
                        { name: 'Work Projects', size: '12 items', modified: '3 days ago', status: 'folder' },
                        { name: 'Team_Meeting.mp4', size: '245.8 MB', modified: '1 week ago', status: 'encrypted' }
                      ].map((file, index) => (
                        <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <FileText className="w-4 h-4 text-white" />
                              </div>
                              <p className="font-medium text-white">{file.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">{file.size}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{file.modified}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                              {file.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                                <Share2 className="w-4 h-4" />
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

          {activeTab === 'sharing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center py-12">
                <Share2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Shared Files</h3>
                <p className="text-gray-400 mb-6">You haven't shared any files yet</p>
                <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  Share Files
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Activity Log</h3>
                <p className="text-gray-400">Detailed activity tracking coming soon</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 