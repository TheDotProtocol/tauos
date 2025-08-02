'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  SpeakerWaveIcon,
  EyeIcon,
  CogIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  EnvelopeIcon,
  CalendarIcon,
  FolderIcon
} from '@heroicons/react/24/outline';

interface AccessibilityModeProps {
  mode: 'parental' | 'senior' | 'standard';
  onModeChange: (mode: 'parental' | 'senior' | 'standard') => void;
}

export const AccessibilityModeSelector: React.FC<AccessibilityModeProps> = ({ 
  mode, 
  onModeChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const modes = [
    {
      id: 'standard',
      name: 'Standard Mode',
      description: 'Full features for experienced users',
      icon: UserIcon,
      color: 'bg-blue-500'
    },
    {
      id: 'parental',
      name: 'Parental Mode',
      description: 'Simple interface for children and families',
      icon: UserGroupIcon,
      color: 'bg-green-500'
    },
    {
      id: 'senior',
      name: 'Senior Assist Mode',
      description: 'Large text and voice assistance',
      icon: UserIcon,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        <CogIcon className="h-5 w-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {modes.find(m => m.id === mode)?.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Choose Interface Mode
            </h3>
            <div className="space-y-2">
              {modes.map((modeOption) => {
                const Icon = modeOption.icon;
                return (
                  <button
                    key={modeOption.id}
                    onClick={() => {
                      onModeChange(modeOption.id as 'parental' | 'senior' | 'standard');
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                      mode === modeOption.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${modeOption.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">
                        {modeOption.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {modeOption.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ParentalMode: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="parental-mode">
      <style jsx>{`
        .parental-mode {
          --primary-color: #10b981;
          --secondary-color: #fbbf24;
          --accent-color: #f87171;
          --background-color: #f0fdf4;
          --text-color: #065f46;
        }
        
        .parental-mode * {
          font-family: 'Comic Sans MS', cursive, sans-serif;
        }
        
        .parental-mode button {
          border-radius: 20px;
          font-weight: bold;
          text-transform: uppercase;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .parental-mode .email-item {
          border-radius: 15px;
          margin: 10px 0;
          padding: 15px;
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        }
      `}</style>
      {children}
    </div>
  );
};

export const SeniorAssistMode: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [fontSize, setFontSize] = useState(18);

  useEffect(() => {
    if (speechEnabled) {
      // Initialize speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Welcome to TauOS Senior Assist Mode');
        speechSynthesis.speak(utterance);
      }
    }
  }, [speechEnabled]);

  const speak = (text: string) => {
    if (speechEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="senior-assist-mode" style={{ fontSize: `${fontSize}px` }}>
      <style jsx>{`
        .senior-assist-mode {
          --primary-color: #8b5cf6;
          --secondary-color: #a78bfa;
          --background-color: #faf5ff;
          --text-color: #581c87;
          --high-contrast: #000000;
        }
        
        .senior-assist-mode * {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
        }
        
        .senior-assist-mode button {
          min-height: 60px;
          min-width: 120px;
          font-size: 1.2em;
          border-radius: 10px;
          border: 3px solid;
        }
        
        .senior-assist-mode .email-item {
          border: 3px solid #8b5cf6;
          border-radius: 10px;
          margin: 15px 0;
          padding: 20px;
          background: #faf5ff;
        }
        
        .senior-assist-mode .navigation {
          background: #8b5cf6;
          color: white;
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 20px;
        }
        
        .senior-assist-mode .high-contrast {
          background: #000000 !important;
          color: #ffffff !important;
        }
      `}</style>
      
      {/* Senior Assist Controls */}
      <div className="senior-controls bg-purple-100 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                speechEnabled ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <SpeakerWaveIcon className="h-6 w-6" />
              <span>Voice {speechEnabled ? 'ON' : 'OFF'}</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Text Size:</span>
              <button
                onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                A-
              </button>
              <span className="text-sm">{fontSize}px</span>
              <button
                onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                A+
              </button>
            </div>
          </div>
          
          <button
            onClick={() => {
              const body = document.body;
              body.classList.toggle('high-contrast');
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg"
          >
            <EyeIcon className="h-6 w-6" />
            <span>High Contrast</span>
          </button>
        </div>
      </div>
      
      {children}
    </div>
  );
};

export const UniversalNavigation: React.FC<{ mode: string }> = ({ mode }) => {
  const navigationItems = [
    { name: 'Home', icon: HomeIcon, href: '/' },
    { name: 'Email', icon: EnvelopeIcon, href: '/mail' },
    { name: 'Calendar', icon: CalendarIcon, href: '/calendar' },
    { name: 'Files', icon: FolderIcon, href: '/files' },
  ];

  const isSeniorMode = mode === 'senior';
  const isParentalMode = mode === 'parental';

  return (
    <nav className={`universal-navigation ${
      isSeniorMode ? 'senior-nav' : isParentalMode ? 'parental-nav' : 'standard-nav'
    }`}>
      <style jsx>{`
        .universal-navigation {
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 15px;
        }
        
        .senior-nav {
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          color: white;
          font-size: 1.3em;
        }
        
        .parental-nav {
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          color: white;
          border-radius: 25px;
        }
        
        .standard-nav {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }
      `}</style>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  isSeniorMode 
                    ? 'hover:bg-purple-700 text-white' 
                    : isParentalMode 
                    ? 'hover:bg-green-600 text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon className={`${isSeniorMode ? 'h-8 w-8' : 'h-6 w-6'}`} />
                <span className="font-medium">{item.name}</span>
              </a>
            );
          })}
        </div>
        
        <AccessibilityModeSelector 
          mode={mode as 'parental' | 'senior' | 'standard'} 
          onModeChange={() => {}} 
        />
      </div>
    </nav>
  );
}; 