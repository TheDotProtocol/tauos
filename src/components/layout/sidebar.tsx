'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home,
  FolderOpen,
  Star,
  GitBranch,
  Settings,
  Users,
  BarChart3,
  Terminal,
  Code,
  BookOpen,
  Package,
  Zap
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('dashboard');

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, href: '/' },
    { id: 'repositories', name: 'Repositories', icon: FolderOpen, href: '/repos', count: 12 },
    { id: 'stars', name: 'Stars', icon: Star, href: '/stars', count: 89 },
    { id: 'branches', name: 'Branches', icon: GitBranch, href: '/branches', count: 45 },
    { id: 'terminal', name: 'Terminal', icon: Terminal, href: '/terminal' },
    { id: 'packages', name: 'Packages', icon: Package, href: '/packages', count: 23 },
  ];

  const tools = [
    { id: 'code', name: 'Code Editor', icon: Code, href: '/editor' },
    { id: 'docs', name: 'Documentation', icon: BookOpen, href: '/docs' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, href: '/analytics' },
    { id: 'team', name: 'Team', icon: Users, href: '/team' },
  ];

  const settings = [
    { id: 'settings', name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-50 lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Developer Hub</h2>
                <p className="text-xs text-gray-400">TauOS Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Main
              </h3>
              {navigation.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveItem(item.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeItem === item.id
                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.count && (
                    <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">
                      {item.count}
                    </span>
                  )}
                </motion.a>
              ))}
            </div>

            <div className="space-y-1 mt-8">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Tools
              </h3>
              {tools.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </motion.a>
              ))}
            </div>

            <div className="space-y-1 mt-8">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Settings
              </h3>
              {settings.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </motion.a>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">saleena@tauos.org</p>
                <p className="text-xs text-gray-400 truncate">Developer</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}