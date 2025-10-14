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
  ExternalLink,
  Play,
  Database,
  Brain
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['projects']);

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
      id: 'ide',
      label: 'TauStudio IDE',
      icon: Code,
      href: '/ide'
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
      id: 'git',
      label: 'Git',
      icon: GitBranch,
      href: '/git'
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
      id: 'automation',
      label: 'CI/CD',
      icon: Zap,
      href: '/automation'
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 glass-strong transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 glass rounded-lg flex items-center justify-center">
                <img src="/taucore-logo.png" alt="TauCore" className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Developer Hub</h2>
                <p className="text-xs text-gray-400">TauCore™ Platform</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedItems.includes(item.id);
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div key={item.id}>
                  <a
                    href={item.href}
                    className={`
                      flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${item.active 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }
                    `}
                    onClick={hasChildren ? (e) => {
                      e.preventDefault();
                      toggleExpanded(item.id);
                    } : undefined}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {hasChildren && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </a>

                  {/* Children */}
                  {hasChildren && isExpanded && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          target={child.external ? '_blank' : undefined}
                          rel={child.external ? 'noopener noreferrer' : undefined}
                          className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                        >
                          <span>{child.label}</span>
                          {child.external && <ExternalLink className="w-3 h-3" />}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="glass p-3 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">TauScript</p>
                  <p className="text-xs text-gray-400">v1.0.0</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Privacy-first, AI-native programming language
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}