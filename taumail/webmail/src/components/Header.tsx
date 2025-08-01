'use client';

import React from 'react';
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { AccessibilityModeSelector } from './AccessibilityModes';
import { MultilingualSupport } from './MultilingualSupport';
import { SecurityTrustSeal } from './SecurityTrustSeal';

interface HeaderProps {
  mode: 'standard' | 'parental' | 'senior';
  onModeChange: (mode: 'standard' | 'parental' | 'senior') => void;
  onLanguageChange: (language: string) => void;
  onAccessibilityChange: (settings: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  onLanguageChange,
  onAccessibilityChange
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">TauMail</h1>
          </div>
          
          {/* Security Badge */}
          <div className="flex items-center space-x-1 text-green-600">
            <LockClosedIcon className="h-4 w-4" />
            <span className="text-xs font-medium">Secure</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          {/* Accessibility Mode */}
          <AccessibilityModeSelector 
            mode={mode} 
            onModeChange={onModeChange} 
          />

          {/* Language & Accessibility */}
          <MultilingualSupport 
            onLanguageChange={onLanguageChange}
            onAccessibilityChange={onAccessibilityChange}
          />

          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-gray-800 relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Security Status */}
          <div className="flex items-center space-x-2 text-green-600">
            <ShieldCheckIcon className="h-5 w-5" />
            <span className="text-sm font-medium">A+</span>
          </div>
        </div>
      </div>

      {/* Security Status Bar */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <SecurityTrustSeal mode="dashboard" />
      </div>
    </header>
  );
}; 