import React, { useState } from 'react';
import { Button } from '../tau-components/Button';
import { Terminal } from '../tau-components/Terminal';

const Dashboard: React.FC = () => {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState('');

  const apps = [
    { id: 'file-manager', name: 'File Manager', icon: '📁', color: 'bg-blue-500' },
    { id: 'taustore', name: 'TauStore', icon: '🛒', color: 'bg-green-500' },
    { id: 'taubrowser', name: 'TauBrowser', icon: '🌐', color: 'bg-purple-500' },
    { id: 'terminal', name: 'Terminal', icon: '💻', color: 'bg-gray-500' },
    { id: 'settings', name: 'Settings', icon: '⚙️', color: 'bg-yellow-500' },
    { id: 'taumail', name: 'TauMail', icon: '📧', color: 'bg-red-500' },
  ];

  const handleAppClick = (appId: string) => {
    setActiveApp(appId);
  };

  const handleTerminalCommand = (command: string) => {
    setTerminalOutput(prev => [...prev, command]);
    
    // Simulate command execution
    setTimeout(() => {
      let output = '';
      switch (command.toLowerCase()) {
        case 'help':
          output = 'Available commands: ls, pwd, whoami, date, clear';
          break;
        case 'ls':
          output = 'Desktop  Documents  Downloads  Pictures  Videos  tauos';
          break;
        case 'pwd':
          output = '/home/tauuser';
          break;
        case 'whoami':
          output = 'tauuser';
          break;
        case 'date':
          output = new Date().toString();
          break;
        case 'clear':
          setTerminalOutput([]);
          return;
        default:
          output = `Command not found: ${command}`;
      }
      setTerminalOutput(prev => [...prev, output]);
    }, 500);
  };

  const renderAppContent = () => {
    switch (activeApp) {
      case 'file-manager':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-heading font-bold text-tau-white-primary mb-4">
              File Manager
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {['Desktop', 'Documents', 'Downloads', 'Pictures', 'Videos', 'tauos'].map((folder) => (
                <div key={folder} className="bg-tau-bg-surface rounded-lg p-4 border border-tau-gray-600 hover:border-tau-gold-500 transition-colors cursor-pointer">
                  <div className="text-4xl mb-2">📁</div>
                  <div className="text-tau-white-primary font-medium">{folder}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'taustore':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-heading font-bold text-tau-white-primary mb-4">
              TauStore
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {['TauMail', 'TauCloud', 'TauBrowser', 'TauAI', 'TauCalendar', 'TauVoice'].map((app) => (
                <div key={app} className="bg-tau-bg-surface rounded-lg p-4 border border-tau-gray-600 hover:border-tau-gold-500 transition-colors cursor-pointer">
                  <div className="text-4xl mb-2">📱</div>
                  <div className="text-tau-white-primary font-medium mb-1">{app}</div>
                  <div className="text-tau-gray-400 text-sm">Free</div>
                  <Button size="sm" className="w-full mt-2">Install</Button>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'terminal':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-heading font-bold text-tau-white-primary mb-4">
              Terminal
            </h2>
            <Terminal
              output={terminalOutput}
              onCommand={handleTerminalCommand}
              className="h-96"
            />
          </div>
        );
      
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-heading font-bold text-tau-white-primary mb-4">
              Settings
            </h2>
            <div className="space-y-4">
              {['Display', 'Sound', 'Network', 'Privacy', 'Security', 'Updates'].map((setting) => (
                <div key={setting} className="bg-tau-bg-surface rounded-lg p-4 border border-tau-gray-600 hover:border-tau-gold-500 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="text-tau-white-primary font-medium">{setting}</span>
                    <svg className="w-5 h-5 text-tau-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-heading font-bold text-tau-white-primary mb-2">
              Welcome to TauCore™
            </h2>
            <p className="text-tau-gray-400">
              Click on an app in the dock to get started
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-tau-bg-primary">
      {/* Top Panel */}
      <div className="bg-tau-bg-surface border-b border-tau-gray-600 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-tau-gold-500 rounded-full flex items-center justify-center">
              <span className="text-tau-black-900 text-lg font-bold">τ</span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search apps, files, and settings..."
                className="w-96 px-4 py-2 bg-tau-gray-800 border border-tau-gray-600 rounded-lg text-tau-white-primary placeholder-tau-gray-500 focus:outline-none focus:border-tau-gold-500 focus:ring-1 focus:ring-tau-gold-500"
              />
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-tau-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-tau-gray-400 text-sm">TauID</span>
            </div>
            <div className="w-8 h-8 bg-tau-gray-700 rounded-full flex items-center justify-center">
              <span className="text-tau-white-primary text-sm">👤</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-tau-bg-surface border-r border-tau-gray-600 p-4">
          <h3 className="text-tau-white-primary font-semibold mb-4">Quick Access</h3>
          <div className="space-y-2">
            {['Recent Files', 'Downloads', 'Documents', 'Pictures', 'Videos'].map((item) => (
              <div key={item} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-tau-gray-800 cursor-pointer">
                <span className="text-tau-gray-400">📁</span>
                <span className="text-tau-white-primary text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 flex flex-col">
          {/* App Content */}
          <div className="flex-1 overflow-y-auto">
            {renderAppContent()}
          </div>

          {/* Dock */}
          <div className="bg-tau-bg-surface border-t border-tau-gray-600 p-4">
            <div className="flex items-center justify-center space-x-4">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app.id)}
                  className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                    activeApp === app.id
                      ? 'bg-tau-gold-500 text-tau-black-900'
                      : 'bg-tau-gray-800 text-tau-white-primary hover:bg-tau-gray-700'
                  }`}
                >
                  <span className="text-2xl">{app.icon}</span>
                  <span className="text-xs font-medium">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
