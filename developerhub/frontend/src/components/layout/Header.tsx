'use client';

import { useState } from 'react';
import { Search, Bell, Settings, User, Menu, X, Code, Terminal, Globe } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="glass-strong border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 glass rounded-lg flex items-center justify-center">
                <img src="/taucore-logo.png" alt="TauCore" className="w-8 h-8" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-white">
                  TauCore™
                </h1>
                <p className="text-xs text-gray-400">
                  Developer Hub
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <Code className="w-4 h-4" />
              <span>Dashboard</span>
            </a>
            <a href="/terminal" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <Terminal className="w-4 h-4" />
              <span>Terminal</span>
            </a>
            <a href="/ide" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <Code className="w-4 h-4" />
              <span>IDE</span>
            </a>
            <a href="/ecosystem" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
              <span>Ecosystem</span>
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:block flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects, code, documentation..."
                className="block w-full pl-10 pr-3 py-2 glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-primary)' }}
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-white relative transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Settings className="h-6 w-6" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 glass rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-300">
                Developer
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="block w-full pl-10 pr-3 py-2 glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-primary)' }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}