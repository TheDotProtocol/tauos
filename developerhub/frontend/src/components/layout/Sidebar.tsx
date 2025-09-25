'use client';

import { useState } from 'react';
import { 
  Home, 
  Code, 
  GitBranch, 
  Settings, 
  Users, 
  BarChart3, 
  Package, 
  Terminal,
  FileText,
  Shield,
  Zap,
  ChevronDown,
  X,
  Globe,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['repositories']);

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      href: '/',
      active: true
    },
    {
      id: 'control-center',
      label: 'Control Center',
      icon: Settings,
      href: '/control-center',
      children: [
        { label: 'Overview', href: '/control-center' },
        { label: 'Personal Projects', href: '/projects' },
        { label: 'Ecosystem Apps', href: '/ecosystem' },
        { label: 'Quick Actions', href: '/quick-actions' }
      ]
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: Code,
      href: '/projects',
      children: [
        { label: 'All Projects', href: '/projects' },
        { label: 'My Projects', href: '/projects/mine' },
        { label: 'Favorites', href: '/projects/favorites' },
        { label: 'Templates', href: '/projects/templates' }
      ]
    },
    {
      id: 'git',
      label: 'Git',
      icon: GitBranch,
      href: '/git'
    },
    {
      id: 'code-reviews',
      label: 'Code Reviews',
      icon: GitBranch,
      href: '/code-reviews'
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: FileText,
      href: '/tasks'
    },
    {
      id: 'packages',
      label: 'Packages',
      icon: Package,
      href: '/packages'
    },
    {
      id: 'ecosystem',
      label: 'Ecosystem',
      icon: Globe,
      href: '/ecosystem',
      children: [
        { label: 'All Apps', href: '/ecosystem' },
        { label: 'TauMail', href: 'https://tauos.org/taumail', external: true },
        { label: 'TauCloud', href: 'https://tauos.org/taucloud', external: true },
        { label: 'TauAI', href: 'https://tauos.org/tauai', external: true },
        { label: 'TauID', href: 'https://tauos.org/tauid', external: true },
        { label: 'TauStore', href: 'https://tauos.org/taustore', external: true },
        { label: 'TauBrowser', href: 'https://tauos.org/taubrowser', external: true }
      ]
    },
    {
      id: 'terminal',
      label: 'Terminal',
      icon: Terminal,
      href: '/terminal',
      children: [
        { label: 'Local Terminal', href: '/terminal' },
        { label: 'TauScript REPL', href: '/terminal/tauscript' },
        { label: 'Remote Servers', href: '/terminal/remote' },
        { label: 'Docker Containers', href: '/terminal/docker' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      href: '/analytics'
    },
    {
      id: 'team',
      label: 'Team',
      icon: Users,
      href: '/team'
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      href: '/security'
    },
  {
    id: 'automation',
    label: 'CI/CD',
    icon: Zap,
    href: '/automation'
  },
  {
    id: 'privacy',
    label: 'Privacy & Safety',
    icon: Shield,
    href: '/privacy'
  },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/settings'
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TC</span>
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  TauCore™
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Dev Hub
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.id}>
                <a
                  href={item.href}
                  className={`
                    flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${item.active 
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </div>
                  {item.children && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleExpanded(item.id);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform ${
                          expandedItems.includes(item.id) ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                  )}
                </a>
                
                {/* Submenu */}
                {item.children && expandedItems.includes(item.id) && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        target={child.external ? '_blank' : undefined}
                        rel={child.external ? 'noopener noreferrer' : undefined}
                        className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <span>{child.label}</span>
                        {child.external && (
                          <ExternalLink className="h-3 w-3" />
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">D</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Developer
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  developer@tauos.org
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
