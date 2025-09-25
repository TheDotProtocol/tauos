'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { 
  Mail, 
  Cloud, 
  Brain, 
  Shield, 
  Star, 
  Globe,
  ExternalLink,
  ArrowRight,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

export default function EcosystemPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const ecosystemApps = [
    {
      name: 'TauMail',
      description: 'Private email with end-to-end encryption',
      status: 'active',
      icon: Mail,
      color: 'from-blue-500 to-cyan-500',
      href: 'https://tauos.org/taumail',
      features: ['End-to-end encryption', 'Private SMTP server', 'No data mining']
    },
    {
      name: 'TauCloud',
      description: 'Secure cloud storage and file sharing',
      status: 'active',
      icon: Cloud,
      color: 'from-green-500 to-emerald-500',
      href: 'https://tauos.org/taucloud',
      features: ['Zero-knowledge encryption', 'File versioning', 'Secure sharing']
    },
    {
      name: 'TauAI',
      description: 'AI assistant for productivity and creativity',
      status: 'active',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      href: 'https://tauos.org/tauai',
      features: ['Privacy-first AI', 'Local processing', 'No data collection']
    },
    {
      name: 'TauID',
      description: 'Decentralized identity management',
      status: 'beta',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
      href: 'https://tauos.org/tauid',
      features: ['DID:WEB identities', 'Verifiable credentials', 'Self-sovereign identity']
    },
    {
      name: 'TauStore',
      description: 'Privacy-first app marketplace',
      status: 'coming-soon',
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      href: 'https://tauos.org/taustore',
      features: ['Privacy scoring', 'Transparent audits', 'No tracking']
    },
    {
      name: 'TauBrowser',
      description: 'Privacy-focused web browser',
      status: 'coming-soon',
      icon: Globe,
      color: 'from-indigo-500 to-blue-500',
      href: 'https://tauos.org/taubrowser',
      features: ['Built-in VPN', 'Ad blocking', 'Tracker protection']
    }
  ];

  const openEcosystemApp = (href: string, appName: string) => {
    // Open in new tab with context
    const context = 'developer-hub';
    const url = `${href}?context=${context}&source=developer-hub`;
    window.open(url, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'beta': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'coming-soon': return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Live';
      case 'beta': return 'Beta';
      case 'coming-soon': return 'Coming Soon';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    TauCore™ Ecosystem
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Access all TauCore™ applications from your developer hub
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800 p-4">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Unified Experience
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      All applications open in new tabs with shared authentication. Your developer context is preserved across all apps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ecosystem Apps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ecosystemApps.map((app, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:border-yellow-400/50 cursor-pointer"
                  onClick={() => openEcosystemApp(app.href, app.name)}
                >
                  <div className="p-6">
                    {/* App Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${app.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <app.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                            {app.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                              {getStatusText(app.status)}
                            </span>
                            {app.status === 'active' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* App Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {app.description}
                    </p>

                    {/* App Features */}
                    <div className="space-y-2 mb-4">
                      {app.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {app.status === 'active' ? 'Click to open' : 
                         app.status === 'beta' ? 'Beta access' : 'Coming soon'}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Integration Benefits */}
            <div className="mt-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Why Unified Ecosystem?
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Single Sign-On
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      One login works across all TauCore™ applications. No need to remember multiple passwords.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Seamless Integration
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      All apps work together seamlessly. Share files, send emails, and collaborate without friction.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Consistent Experience
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Same design language and user experience across all applications. Learn once, use everywhere.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
