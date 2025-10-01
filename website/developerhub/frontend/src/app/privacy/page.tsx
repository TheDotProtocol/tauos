'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import PrivacyDashboard from '@/components/privacy/PrivacyDashboard';
import PrivacySettings from '@/components/privacy/PrivacySettings';
import { 
  Shield, 
  Settings, 
  Eye, 
  BarChart3,
  Lock,
  Unlock,
  Activity,
  Database,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

export default function PrivacyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    {
      id: 'dashboard',
      label: 'Privacy Dashboard',
      icon: Eye,
      description: 'View what we monitor in real-time'
    },
    {
      id: 'settings',
      label: 'Privacy Settings',
      icon: Settings,
      description: 'Control your privacy level and monitoring'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex">
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Privacy & Safety
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Transparent privacy protection with user-controlled safety monitoring
              </p>
            </div>

            {/* Privacy Notice */}
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                    Transparent Privacy Protection
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    TauCore™ is privacy-first by design. We never monitor your personal files, messages, 
                    or browsing history. Optional safety monitoring protects your system without compromising your privacy.
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-yellow-500 text-yellow-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'dashboard' && <PrivacyDashboard />}
            {activeTab === 'settings' && <PrivacySettings />}

            {/* Privacy Principles */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {/* What We Protect */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-6">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  What We Protect
                </h3>
                <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Your files and documents</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Your messages and communications</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Your browsing history</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Your personal data</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Your application usage</span>
                  </li>
                </ul>
              </div>

              {/* What We Never Do */}
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-6">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  What We Never Do
                </h3>
                <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                  <li className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4" />
                    <span>Collect personal information</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4" />
                    <span>Track your activities</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4" />
                    <span>Monitor your communications</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4" />
                    <span>Share data with third parties</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4" />
                    <span>Participate in surveillance</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Optional Safety Monitoring */}
            <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 p-6">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Optional Safety Monitoring
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                To protect your system from threats, you may choose to enable optional security monitoring. 
                This monitoring is limited to system-level events and does not access personal data.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">We Monitor:</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• System performance (CPU, memory, disk)</li>
                    <li>• Security events (failed logins, threats)</li>
                    <li>• Network anomalies (unusual traffic)</li>
                    <li>• System stability (crashes, errors)</li>
                    <li>• Hardware health (temperature, battery)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">We Never Monitor:</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• File contents or personal documents</li>
                    <li>• Messages, emails, or communications</li>
                    <li>• Browsing history or web activity</li>
                    <li>• Application usage patterns</li>
                    <li>• Personal behavior or activities</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Your Privacy Rights
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Control your privacy level</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">View what we monitor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Export your data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Delete your data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Opt out completely</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Complete transparency</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Questions About Privacy?
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Privacy Team</div>
                  <div className="text-gray-600 dark:text-gray-400">privacy@tauos.org</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Security Team</div>
                  <div className="text-gray-600 dark:text-gray-400">security@tauos.org</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Legal Team</div>
                  <div className="text-gray-600 dark:text-gray-400">legal@tauos.org</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Support</div>
                  <div className="text-gray-600 dark:text-gray-400">support@tauos.org</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
