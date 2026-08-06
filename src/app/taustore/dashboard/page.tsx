'use client';

import DashboardShell from '@/components/apps/DashboardShell';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Star, Download, Shield, Search, Filter, 
  Grid, List, Heart, Eye, CheckCircle, AlertCircle, 
  BarChart3, Settings, Plus, Edit3, Trash2, Users, 
  Smartphone, Monitor, Tablet, Zap, Key, Database, LogOut, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { hydrateTauSession, logoutTauSession } from '@/lib/tau-auth-client';

export default function TauStoreDashboard() {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = await hydrateTauSession();
      if (cancelled) return;
      if (session.user) {
        setUser(session.user);
        setIsLoggedIn(true);
      } else {
        window.location.href = '/taustore';
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    logoutTauSession('/taustore');
  };

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
      icon: '📧',
      price: 'Free'
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
      icon: '☁️',
      price: 'Free'
    },
    {
      id: '3',
      name: 'TauBrowser',
      category: 'Internet',
      rating: 4.7,
      downloads: 1156,
      privacyScore: 95,
      verified: true,
      description: 'Privacy-first web browser with built-in ad blocking',
      icon: '🌐',
      price: 'Free'
    },
    {
      id: '4',
      name: 'TauID',
      category: 'Security',
      rating: 4.9,
      downloads: 1089,
      privacyScore: 100,
      verified: true,
      description: 'Secure identity management with biometric authentication',
      icon: '🛡️',
      price: 'Free'
    }
  ];

  const categories = [
    { name: 'All', count: 1247 },
    { name: 'Productivity', count: 234 },
    { name: 'Security', count: 189 },
    { name: 'Storage', count: 156 },
    { name: 'Internet', count: 123 },
    { name: 'Entertainment', count: 98 },
    { name: 'Utilities', count: 87 }
  ];

  

  return (
    <DashboardShell
      title="Tau Store"
      subtitle="Privacy-scored apps for Tau OS."
      userLabel={user?.email}
      onLogout={handleLogout}
      loading={!isLoggedIn}
      
    >
{/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900/30 p-1 rounded-xl">
          {[
            { id: 'discover', label: 'Discover', icon: Search },
            { id: 'installed', label: 'Installed', icon: Download },
            { id: 'favorites', label: 'Favorites', icon: Heart },
            { id: 'updates', label: 'Updates', icon: Zap },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div className="space-y-8">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search apps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/30 border border-gray-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-3 bg-gray-900/30 border border-gray-800 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="px-4 py-2 bg-gray-900/30 border border-gray-800 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* Featured Apps */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Featured Apps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredApps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-purple-400/30 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="text-4xl">{app.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{app.name}</h3>
                        <p className="text-gray-400 text-sm">{app.category}</p>
                      </div>
                      {app.verified && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4">{app.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold">{app.rating}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">{app.privacyScore}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-purple-400 font-semibold">{app.price}</span>
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200">
                        Install
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Installed Tab */}
        {activeTab === 'installed' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white mb-6">Installed Apps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredApps.slice(0, 3).map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-4xl">{app.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{app.name}</h3>
                      <p className="text-gray-400 text-sm">Version 1.0.0</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-500">
                      Open
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600">
                      Uninstall
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white mb-6">Favorite Apps</h2>
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No favorite apps yet</p>
              <p className="text-gray-500 text-sm">Start exploring and add apps to your favorites</p>
            </div>
          </div>
        )}

        {/* Updates Tab */}
        {activeTab === 'updates' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white mb-6">Available Updates</h2>
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-gray-400">All apps are up to date</p>
              <p className="text-gray-500 text-sm">Your apps are running the latest versions</p>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white mb-6">Store Settings</h2>
            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Auto-update apps</h3>
                    <p className="text-gray-400 text-sm">Automatically update apps when new versions are available</p>
                  </div>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    Enabled
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Privacy notifications</h3>
                    <p className="text-gray-400 text-sm">Get notified about privacy policy changes</p>
                  </div>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-500">
                    Enable
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Clear cache</h3>
                    <p className="text-gray-400 text-sm">Clear downloaded app cache to free up space</p>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600">
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </DashboardShell>
  );
}
