'use client';

import { useState } from 'react';
import { 
  User, 
  Shield, 
  Terminal, 
  Code, 
  Bell, 
  Palette, 
  Database, 
  Key, 
  Globe, 
  Save,
  RotateCcw,
  Check
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: 'Developer',
      email: 'developer@tauos.org',
      avatar: '',
      bio: 'TauCore™ Developer',
      location: 'San Francisco, CA',
      website: 'https://tauos.org'
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginNotifications: true,
      suspiciousActivity: true
    },
    terminal: {
      theme: 'dark',
      fontSize: 14,
      fontFamily: 'JetBrains Mono',
      cursor: 'block',
      shell: 'bash',
      autoComplete: true
    },
    development: {
      defaultLanguage: 'typescript',
      codeStyle: 'prettier',
      autoSave: true,
      formatOnSave: true,
      lintOnSave: true,
      tabSize: 2,
      insertSpaces: true
    },
    notifications: {
      email: true,
      push: true,
      codeReviews: true,
      pullRequests: true,
      issues: true,
      security: true,
      weekly: true
    },
    appearance: {
      theme: 'system',
      accentColor: 'yellow',
      sidebar: 'expanded',
      density: 'comfortable'
    },
    integrations: {
      git: {
        username: 'developer',
        email: 'developer@tauos.org',
        defaultBranch: 'main',
        autoStash: true
      },
      docker: {
        enabled: true,
        registry: 'docker.io',
        autoCleanup: true
      },
      ci: {
        enabled: true,
        provider: 'github-actions',
        autoDeploy: false
      }
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // Simulate saving
    setTimeout(() => {
      setHasChanges(false);
      // Show success message
    }, 1000);
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default values
      setHasChanges(true);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'terminal', label: 'Terminal', icon: Terminal },
    { id: 'development', label: 'Development', icon: Code },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your TauCore™ Developer Hub preferences and configuration.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              {/* Content Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                  <div className="flex items-center space-x-2">
                    {hasChanges && (
                      <span className="text-sm text-yellow-600 dark:text-yellow-400">
                        Unsaved changes
                      </span>
                    )}
                    <button
                      onClick={resetSettings}
                      className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <RotateCcw className="h-4 w-4 mr-1 inline" />
                      Reset
                    </button>
                    <button
                      onClick={saveSettings}
                      disabled={!hasChanges}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="h-4 w-4 mr-1 inline" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Profile Picture
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload a new avatar
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={settings.profile.name}
                          onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={settings.profile.location}
                          onChange={(e) => updateSetting('profile', 'location', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={settings.profile.website}
                          onChange={(e) => updateSetting('profile', 'website', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={settings.profile.bio}
                        onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'terminal' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Theme
                        </label>
                        <select
                          value={settings.terminal.theme}
                          onChange={(e) => updateSetting('terminal', 'theme', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="dark">Dark</option>
                          <option value="light">Light</option>
                          <option value="high-contrast">High Contrast</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Font Size
                        </label>
                        <input
                          type="number"
                          value={settings.terminal.fontSize}
                          onChange={(e) => updateSetting('terminal', 'fontSize', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Font Family
                        </label>
                        <select
                          value={settings.terminal.fontFamily}
                          onChange={(e) => updateSetting('terminal', 'fontFamily', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="JetBrains Mono">JetBrains Mono</option>
                          <option value="Fira Code">Fira Code</option>
                          <option value="Source Code Pro">Source Code Pro</option>
                          <option value="Monaco">Monaco</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Shell
                        </label>
                        <select
                          value={settings.terminal.shell}
                          onChange={(e) => updateSetting('terminal', 'shell', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="bash">Bash</option>
                          <option value="zsh">Zsh</option>
                          <option value="fish">Fish</option>
                          <option value="powershell">PowerShell</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Auto Complete
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Enable command auto-completion
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.terminal.autoComplete}
                            onChange={(e) => updateSetting('terminal', 'autoComplete', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'development' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Default Language
                        </label>
                        <select
                          value={settings.development.defaultLanguage}
                          onChange={(e) => updateSetting('development', 'defaultLanguage', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="typescript">TypeScript</option>
                          <option value="javascript">JavaScript</option>
                          <option value="rust">Rust</option>
                          <option value="go">Go</option>
                          <option value="python">Python</option>
                          <option value="tauscript">TauScript</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Code Style
                        </label>
                        <select
                          value={settings.development.codeStyle}
                          onChange={(e) => updateSetting('development', 'codeStyle', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="prettier">Prettier</option>
                          <option value="eslint">ESLint</option>
                          <option value="biome">Biome</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tab Size
                        </label>
                        <input
                          type="number"
                          value={settings.development.tabSize}
                          onChange={(e) => updateSetting('development', 'tabSize', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'autoSave', label: 'Auto Save', description: 'Automatically save files' },
                        { key: 'formatOnSave', label: 'Format on Save', description: 'Format code when saving' },
                        { key: 'lintOnSave', label: 'Lint on Save', description: 'Run linter when saving' },
                        { key: 'insertSpaces', label: 'Insert Spaces', description: 'Use spaces instead of tabs' }
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.label}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.development[item.key as keyof typeof settings.development] as boolean}
                              onChange={(e) => updateSetting('development', item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add other tabs content here */}
                {activeTab === 'security' && (
                  <div className="text-center py-12">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Security Settings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Security configuration options will be available here.
                    </p>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Notification Settings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Notification preferences will be available here.
                    </p>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="text-center py-12">
                    <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Appearance Settings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Theme and appearance options will be available here.
                    </p>
                  </div>
                )}

                {activeTab === 'integrations' && (
                  <div className="text-center py-12">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Integration Settings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Third-party integrations will be available here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
