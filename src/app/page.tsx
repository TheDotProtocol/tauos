'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import StatsCard from '@/components/dashboard/StatsCard';
import RepositoryCard from '@/components/dashboard/RepositoryCard';
import { 
  FolderOpen, 
  Star, 
  GitFork, 
  Users, 
  Code,
  Terminal,
  BookOpen,
  Package,
  Plus,
  Search,
  Filter
} from 'lucide-react';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Repositories',
      value: '1,247',
      change: '+12% from last month',
      changeType: 'positive' as const,
      icon: FolderOpen,
      color: 'purple' as const,
    },
    {
      title: 'Active Developers',
      value: '89',
      change: '+5 new this week',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue' as const,
    },
    {
      title: 'Lines of Code',
      value: '2.3M',
      change: '+156K this month',
      changeType: 'positive' as const,
      icon: Code,
      color: 'green' as const,
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: 'Last 30 days',
      changeType: 'positive' as const,
      icon: Terminal,
      color: 'orange' as const,
    },
  ];

  const repositories = [
    {
      name: 'TauMail',
      description: 'Privacy-first email client with end-to-end encryption and zero tracking. Built for the modern privacy-conscious user.',
      language: 'TypeScript',
      stars: 1247,
      forks: 89,
      watchers: 234,
      lastUpdated: new Date('2024-09-20'),
      isPrivate: false,
      color: 'purple',
    },
    {
      name: 'TauCloud',
      description: 'Encrypted cloud storage with zero-knowledge architecture. Your files, your keys, your privacy.',
      language: 'Rust',
      stars: 1189,
      forks: 67,
      watchers: 198,
      lastUpdated: new Date('2024-09-19'),
      isPrivate: false,
      color: 'blue',
    },
    {
      name: 'TauID',
      description: 'Decentralized identity management with verifiable credentials and privacy-first authentication.',
      language: 'Go',
      stars: 1089,
      forks: 45,
      watchers: 156,
      lastUpdated: new Date('2024-09-18'),
      isPrivate: false,
      color: 'green',
    },
    {
      name: 'TauStore',
      description: 'Privacy-scored app marketplace with transparent security audits and community-driven curation.',
      language: 'JavaScript',
      stars: 956,
      forks: 34,
      watchers: 123,
      lastUpdated: new Date('2024-09-17'),
      isPrivate: false,
      color: 'orange',
    },
    {
      name: 'TauBrowser',
      description: 'Privacy-first web browser with built-in ad blocking, tracking protection, and secure browsing.',
      language: 'C++',
      stars: 1345,
      forks: 78,
      watchers: 267,
      lastUpdated: new Date('2024-09-16'),
      isPrivate: false,
      color: 'red',
    },
    {
      name: 'TauAI',
      description: 'On-device AI assistant with privacy protection and local processing capabilities.',
      language: 'Python',
      stars: 1876,
      forks: 123,
      watchers: 345,
      lastUpdated: new Date('2024-09-15'),
      isPrivate: false,
      color: 'purple',
    },
  ];

  const tools = [
    { name: 'Terminal', icon: Terminal, description: 'Integrated terminal with TauScript support' },
    { name: 'Documentation', icon: BookOpen, description: 'Comprehensive API docs and guides' },
    { name: 'Package Manager', icon: Package, description: 'TauScript package management' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome to <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">TauOS Developer Hub</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
                Build, deploy, and scale with privacy-first developer tools and infrastructure. 
                Join the future of secure software development.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Repository</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>View Documentation</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {stats.map((stat, index) => (
                <StatsCard
                  key={stat.title}
                  {...stat}
                  delay={index * 0.1}
                />
              ))}
            </motion.div>

            {/* Trending Repositories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">🔥 Trending Repositories</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search repositories..."
                      className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repositories.map((repo, index) => (
                  <RepositoryCard
                    key={repo.name}
                    {...repo}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </motion.div>

            {/* Developer Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6">🛠️ Developer Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tools.map((tool, index) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors duration-200">
                        {tool.name}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {tool.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}