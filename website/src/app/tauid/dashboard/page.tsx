'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, User, Lock, Eye, CheckCircle, AlertCircle, BarChart3, 
  Activity, Settings, Search, Plus, Edit3, Download, Users, 
  UserCheck, Fingerprint, Smartphone, Monitor, Tablet, LogOut, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function TauIDDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('tauos_user');
    const storedToken = localStorage.getItem('tauos_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    } else {
      // Redirect to landing page if not logged in
      window.location.href = '/tauid';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tauos_user');
    localStorage.removeItem('tauos_token');
    window.location.href = '/tauid';
  };

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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">TauID</h1>
                  <p className="text-sm text-gray-400">Identity & Access Management</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900/30 p-1 rounded-xl">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'identity', label: 'Identity', icon: User },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'devices', label: 'Devices', icon: Smartphone },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-green-400">{identityMetrics.totalUsers}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Total Users</h3>
                <p className="text-gray-400 text-sm">Registered identities</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-blue-400">{identityMetrics.activeUsers}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Active Users</h3>
                <p className="text-gray-400 text-sm">Currently online</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-yellow-400">{identityMetrics.verifiedUsers}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Verified Users</h3>
                <p className="text-gray-400 text-sm">Identity verified</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-purple-400">{identityMetrics.privacyScore}%</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Privacy Score</h3>
                <p className="text-gray-400 text-sm">Overall security</p>
              </motion.div>
            </div>

            {/* Privacy Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Privacy Breakdown</h3>
              <div className="space-y-4">
                {privacyBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status).split(' ')[0]}`}></div>
                      <span className="text-gray-300">{item.category}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-semibold w-12 text-right">{item.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Identity Tab */}
        {activeTab === 'identity' && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Your Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={user?.fullName || ''}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={user?.username || ''}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Security Settings</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Fingerprint className="w-6 h-6 text-green-400" />
                    <div>
                      <h4 className="text-white font-semibold">Biometric Authentication</h4>
                      <p className="text-gray-400 text-sm">Use fingerprint or face recognition</p>
                    </div>
                  </div>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    Enabled
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-6 h-6 text-blue-400" />
                    <div>
                      <h4 className="text-white font-semibold">Two-Factor Authentication</h4>
                      <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-500">
                    Enable
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-6 h-6 text-purple-400" />
                    <div>
                      <h4 className="text-white font-semibold">Privacy Mode</h4>
                      <p className="text-gray-400 text-sm">Hide your online status</p>
                    </div>
                  </div>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    Active
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Connected Devices</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-6 h-6 text-blue-400" />
                    <div>
                      <h4 className="text-white font-semibold">MacBook Pro</h4>
                      <p className="text-gray-400 text-sm">Current device • Last active: Now</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm">Active</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-6 h-6 text-green-400" />
                    <div>
                      <h4 className="text-white font-semibold">iPhone 15 Pro</h4>
                      <p className="text-gray-400 text-sm">Last active: 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-400 text-sm">Offline</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Change Password</label>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-500">
                    Update Password
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Export Data</label>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600">
                    Download Data
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Delete Account</label>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600">
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
