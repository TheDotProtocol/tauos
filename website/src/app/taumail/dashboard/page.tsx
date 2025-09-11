'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Shield, Lock, Eye, CheckCircle, AlertCircle, BarChart3, 
  Activity, Settings, Search, Plus, Edit3, Download, Users, 
  Inbox, Send, Star, Archive, Trash2, MoreHorizontal, RefreshCw,
  Filter, Calendar, Clock, Bell, User, ChevronRight, Zap
} from 'lucide-react';

export default function TauMailDashboard() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');

  const mailMetrics = {
    totalEmails: 1247,
    unreadEmails: 23,
    sentEmails: 456,
    privacyScore: 98,
    lastSync: '2 minutes ago'
  };

  const emailFolders = [
    { name: 'Inbox', count: 23, icon: Inbox, color: 'from-blue-500 to-cyan-500' },
    { name: 'Sent', count: 456, icon: Send, color: 'from-green-500 to-emerald-500' },
    { name: 'Drafts', count: 5, icon: Edit3, color: 'from-yellow-500 to-orange-500' },
    { name: 'Archive', count: 234, icon: Archive, color: 'from-purple-500 to-pink-500' },
    { name: 'Trash', count: 12, icon: Trash2, color: 'from-red-500 to-pink-500' }
  ];

  const recentEmails = [
    {
      id: '1',
      from: 'john.doe@company.com',
      subject: 'Q4 Security Review Meeting',
      preview: 'Hi team, I wanted to schedule our quarterly security review meeting...',
      timestamp: '2 minutes ago',
      unread: true,
      starred: false,
      category: 'work'
    },
    {
      id: '2',
      from: 'sarah.smith@company.com',
      subject: 'New Privacy Policy Updates',
      preview: 'We have updated our privacy policy to comply with the latest regulations...',
      timestamp: '15 minutes ago',
      unread: true,
      starred: true,
      category: 'important'
    },
    {
      id: '3',
      from: 'admin@tauos.com',
      subject: 'System Maintenance Notice',
      preview: 'Scheduled maintenance will occur this weekend from 2-4 AM...',
      timestamp: '1 hour ago',
      unread: false,
      starred: false,
      category: 'system'
    },
    {
      id: '4',
      from: 'marketing@company.com',
      subject: 'Monthly Newsletter - January 2025',
      preview: 'Check out our latest updates and upcoming features...',
      timestamp: '2 hours ago',
      unread: false,
      starred: false,
      category: 'newsletter'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'text-blue-400 bg-blue-400/10';
      case 'important': return 'text-red-400 bg-red-400/10';
      case 'system': return 'text-yellow-400 bg-yellow-400/10';
      case 'newsletter': return 'text-purple-400 bg-purple-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TauMail</h1>
                <p className="text-sm text-gray-400">Secure Email Management</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Emails</p>
                <p className="text-2xl font-bold text-white">{mailMetrics.totalEmails}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-400">
              <Inbox className="w-4 h-4 mr-1" />
              <span>{mailMetrics.unreadEmails} unread</span>
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
                <p className="text-2xl font-bold text-white">{mailMetrics.privacyScore}/100</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${mailMetrics.privacyScore}%` }}
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
                <p className="text-sm text-gray-400">Sent Emails</p>
                <p className="text-2xl font-bold text-white">{mailMetrics.sentEmails}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-400">
              <Send className="w-4 h-4 mr-1" />
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
                <p className="text-sm text-gray-400">Last Sync</p>
                <p className="text-2xl font-bold text-white">2m ago</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-yellow-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>All systems online</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Folders</h3>
                <button className="p-1 text-gray-400 hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {emailFolders.map((folder) => (
                  <button
                    key={folder.name}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      activeTab === folder.name.toLowerCase()
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                        : 'text-gray-300 hover:bg-gray-800/50'
                    }`}
                    onClick={() => setActiveTab(folder.name.toLowerCase())}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${folder.color} rounded-lg flex items-center justify-center`}>
                        <folder.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{folder.name}</span>
                    </div>
                    <span className="text-sm">{folder.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white capitalize">{activeTab}</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search emails..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
                    />
                  </div>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                    <Plus className="w-4 h-4" />
                    <span>Compose</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {recentEmails.map((email) => (
                  <div key={email.id} className={`p-4 rounded-lg transition-all duration-200 ${
                    email.unread ? 'bg-gray-800/50 border-l-4 border-blue-500' : 'bg-gray-800/30 hover:bg-gray-800/50'
                  }`}>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <p className={`font-medium ${email.unread ? 'text-white' : 'text-gray-300'}`}>
                              {email.from}
                            </p>
                            {email.starred && (
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(email.category)}`}>
                              {email.category}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">{email.timestamp}</span>
                            <button className="p-1 text-gray-400 hover:text-white transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className={`text-sm mt-1 ${email.unread ? 'text-white font-medium' : 'text-gray-300'}`}>
                          {email.subject}
                        </p>
                        <p className="text-sm text-gray-400 mt-1 truncate">
                          {email.preview}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
