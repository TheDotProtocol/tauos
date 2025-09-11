'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Star, Download, Shield, Search, Filter, 
  Grid, List, Heart, Eye, CheckCircle, AlertCircle, 
  BarChart3, Settings, Plus, Edit3, Trash2, Users, 
  Smartphone, Monitor, Tablet, Zap, Key, Database
} from 'lucide-react';

export default function TauStoreDashboard() {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchTerm, setSearchTerm] = useState('');

  const storeMetrics = {
    totalApps: 1247,
    verifiedApps: 1189,
    privacyScore: 96,
    downloads: 45678,
    lastUpdate: '2 minutes ago'
  };

  const featuredApps = [
    {
      id: '1',
      name: 'TauMail',
      category: 'Productivity',
      rating: 4.9,
      downloads: 1247,
      privacyScore: 100,
      verified: true,
      description: 'Secure email client with end-to-end encryption',
      icon: '📧'
    },
    {
      id: '2',
      name: 'TauCloud',
      category: 'Storage',
      rating: 4.8,
      downloads: 1189,
      privacyScore: 98,
      verified: true,
      description: 'Private cloud storage with zero-knowledge encryption',
      icon: '☁️'
    },
    {
      id: '3',
      name: 'TauBrowser',
      category: 'Internet',
      rating: 4.7,
      downloads: 892,
      privacyScore: 95,
      verified: true,
      description: 'Privacy-focused web browser with built-in protection',
      icon: '🌐'
    },
    {
      id: '4',
      name: 'TauCalendar',
      category: 'Productivity',
      rating: 4.6,
      downloads: 756,
      privacyScore: 92,
      verified: true,
      description: 'Secure calendar with local encryption',
      icon: '📅'
    }
  ];

  const categories = [
    { name: 'Productivity', count: 234, icon: '💼' },
    { name: 'Security', count: 156, icon: '🔒' },
    { name: 'Communication', count: 189, icon: '💬' },
    { name: 'Entertainment', count: 345, icon: '🎮' },
    { name: 'Utilities', count: 278, icon: '🛠️' },
    { name: 'Education', count: 145, icon: '📚' }
  ];

  const getPrivacyScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-400 bg-green-400/10';
    if (score >= 85) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-red-400 bg-red-400/10';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src="/brand/tauos-logo.svg" alt="TauOS" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-white">TauStore</h1>
                <p className="text-sm text-gray-400">Privacy-First App Marketplace</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-black" />
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
                <p className="text-sm text-gray-400">Total Apps</p>
                <p className="text-2xl font-bold text-white">{storeMetrics.totalApps}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>{storeMetrics.verifiedApps} verified</span>
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
                <p className="text-2xl font-bold text-white">{storeMetrics.privacyScore}/100</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${storeMetrics.privacyScore}%` }}
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
                <p className="text-sm text-gray-400">Downloads</p>
                <p className="text-2xl font-bold text-white">{storeMetrics.downloads.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-400">
              <Download className="w-4 h-4 mr-1" />
              <span>This month</span>
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
                <p className="text-sm text-gray-400">Last Update</p>
                <p className="text-2xl font-bold text-white">2m ago</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-yellow-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>All systems online</span>
            </div>
          </motion.div>
        </div>

        <div className="flex space-x-1 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-1 mb-8">
          {[
            { id: 'discover', label: 'Discover', icon: Grid },
            { id: 'categories', label: 'Categories', icon: List },
            { id: 'installed', label: 'Installed', icon: Download },
            { id: 'updates', label: 'Updates', icon: Zap }
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
          {activeTab === 'discover' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Featured Apps</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search apps..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
                    />
                  </div>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredApps.map((app) => (
                  <div key={app.id} className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
                        {app.icon}
                      </div>
                      {app.verified && (
                        <span className="text-green-400 text-xs">✓ Verified</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{app.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{app.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm">{app.rating}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrivacyScoreColor(app.privacyScore)}`}>
                        {app.privacyScore}/100
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{app.category}</span>
                      <span>{app.downloads.toLocaleString()} downloads</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                        Install
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">App Categories</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                  <div key={index} className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{category.name}</h3>
                        <p className="text-gray-400 text-sm">{category.count} apps</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 transition-colors">
                        Browse Apps
                      </button>
                      <button className="flex-1 bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 transition-colors">
                        View Stats
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'installed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Installed Apps</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Download className="w-4 h-4" />
                  <span>Check for Updates</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredApps.slice(0, 3).map((app) => (
                  <div key={app.id} className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl">
                        {app.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{app.name}</h3>
                        <p className="text-gray-400 text-sm">v2.1.0</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-green-400 text-sm">✓ Installed</span>
                      <span className="text-gray-400 text-sm">2.1.0</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 transition-colors">
                        Open
                      </button>
                      <button className="flex-1 bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 transition-colors">
                        Uninstall
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'updates' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Available Updates</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Download className="w-4 h-4" />
                  <span>Update All</span>
                </button>
              </div>

              <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">App</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Current Version</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">New Version</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Size</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {[
                        { name: 'TauMail', current: '2.1.0', new: '2.1.1', size: '15.2 MB' },
                        { name: 'TauCloud', current: '1.8.2', new: '1.8.3', size: '8.7 MB' },
                        { name: 'TauBrowser', current: '3.0.1', new: '3.0.2', size: '22.1 MB' }
                      ].map((update, index) => (
                        <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                📧
                              </div>
                              <span className="font-medium text-white">{update.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">{update.current}</td>
                          <td className="px-6 py-4 text-sm text-green-400">{update.new}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{update.size}</td>
                          <td className="px-6 py-4">
                            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                              Update
                            </button>
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
