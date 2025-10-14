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
  Zap,
  Code,
  Terminal,
  Play,
  Download
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
      features: ['End-to-end encryption', 'Private SMTP server', 'No data mining'],
      stats: { users: '10K+', uptime: '99.9%' }
    },
    {
      name: 'TauCloud',
      description: 'Secure cloud storage and file sharing',
      status: 'active',
      icon: Cloud,
      color: 'from-green-500 to-emerald-500',
      href: 'https://tauos.org/taucloud',
      features: ['Zero-knowledge encryption', 'File versioning', 'Secure sharing'],
      stats: { users: '25K+', uptime: '99.8%' }
    },
    {
      name: 'TauAI',
      description: 'AI assistant for productivity and creativity',
      status: 'active',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      href: 'https://tauos.org/tauai',
      features: ['Privacy-first AI', 'Local processing', 'No data collection'],
      stats: { users: '50K+', uptime: '99.7%' }
    },
    {
      name: 'TauID',
      description: 'Decentralized identity management',
      status: 'beta',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
      href: 'https://tauos.org/tauid',
      features: ['DID:WEB identities', 'Verifiable credentials', 'Self-sovereign identity'],
      stats: { users: '5K+', uptime: '99.5%' }
    },
    {
      name: 'TauStore',
      description: 'Privacy-first app marketplace',
      status: 'coming-soon',
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      href: 'https://tauos.org/taustore',
      features: ['Privacy scoring', 'Transparent audits', 'No tracking'],
      stats: { users: '0', uptime: 'N/A' }
    },
    {
      name: 'TauBrowser',
      description: 'Privacy-focused web browser',
      status: 'coming-soon',
      icon: Globe,
      color: 'from-indigo-500 to-purple-500',
      href: 'https://tauos.org/taubrowser',
      features: ['Built-in VPN', 'Ad blocking', 'Privacy protection'],
      stats: { users: '0', uptime: 'N/A' }
    }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Available';
      case 'beta': return 'Beta';
      case 'coming-soon': return 'Coming Soon';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'beta': return 'text-yellow-400 bg-yellow-400/20';
      case 'coming-soon': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 glass rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
                </div>
                <div>
                  <h1 className="display-huge mb-2" style={{ color: 'var(--text-primary)' }}>
                    TauCore™ <span style={{ color: 'var(--brand-primary)' }}>Ecosystem</span>
                  </h1>
                  <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
                    Access all TauCore™ applications from your developer hub
                  </p>
                </div>
              </div>
              
              <div className="glass p-6 rounded-xl">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5" style={{ color: 'var(--brand-primary)' }} />
                  <div>
                    <h3 className="heading-3 mb-2" style={{ color: 'var(--text-primary)' }}>
                      Unified Experience
                    </h3>
                    <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                      All applications open in new tabs with shared authentication. Your developer context is preserved across all apps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ecosystem Apps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ecosystemApps.map((app, index) => {
                const Icon = app.icon;
                return (
                  <div 
                    key={index}
                    className="glass p-6 rounded-xl dark-hover dark-transition cursor-pointer group"
                    onClick={() => window.open(app.href, '_blank')}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${app.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {getStatusText(app.status)}
                      </div>
                    </div>
                    
                    <h3 className="heading-3 mb-2" style={{ color: 'var(--text-primary)' }}>
                      {app.name}
                    </h3>
                    
                    <p className="body-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {app.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      {app.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="body-small" style={{ color: 'var(--text-muted)' }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-white">{app.stats.users}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Users</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-white">{app.stats.uptime}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Uptime</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-12 glass p-6 rounded-xl">
              <h2 className="heading-2 mb-6" style={{ color: 'var(--text-primary)' }}>Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => window.open('https://developerhub.tauos.org/ide', '_blank')}
                  className="flex items-center space-x-3 p-4 glass rounded-lg dark-hover dark-transition"
                >
                  <Code className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                  <div className="text-left">
                    <div className="font-medium text-white">Launch IDE</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>TauStudio development environment</div>
                  </div>
                </button>
                <button 
                  onClick={() => window.open('https://developerhub.tauos.org/terminal', '_blank')}
                  className="flex items-center space-x-3 p-4 glass rounded-lg dark-hover dark-transition"
                >
                  <Terminal className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                  <div className="text-left">
                    <div className="font-medium text-white">Open Terminal</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>TauScript REPL and command line</div>
                  </div>
                </button>
                <button 
                  onClick={() => window.open('https://docs.tauos.org', '_blank')}
                  className="flex items-center space-x-3 p-4 glass rounded-lg dark-hover dark-transition"
                >
                  <Globe className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                  <div className="text-left">
                    <div className="font-medium text-white">View Documentation</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Complete guides and tutorials</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}