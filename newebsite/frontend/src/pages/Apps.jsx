import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Mail, Cloud, Shield, Store, Brain, Globe, Terminal, Palette, Users } from 'lucide-react';

const apps = [
  {
    icon: Mail,
    name: 'TauMail',
    description: 'Privacy-first email with end-to-end encryption. Zero tracking, complete sovereignty over your communications.',
    link: 'https://www.tauos.org/apps/taumail',
    status: 'Available',
    color: 'var(--brand-primary)'
  },
  {
    icon: Cloud,
    name: 'TauCloud',
    description: 'Sovereign cloud storage with military-grade encryption. Your files, your control, always.',
    link: 'https://www.tauos.org/apps/taucloud',
    status: 'Available',
    color: 'var(--brand-primary)'
  },
  {
    icon: Shield,
    name: 'TauID',
    description: 'Universal identity management across the TauOS ecosystem. One identity, infinite possibilities.',
    link: 'https://www.tauos.org/apps/tauid',
    status: 'Available',
    color: 'var(--brand-primary)'
  },
  {
    icon: Store,
    name: 'TauStore',
    description: 'Curated app marketplace for privacy-respecting applications. Discover, install, and manage apps securely.',
    link: 'https://www.tauos.org/apps/taustore',
    status: 'Available',
    color: 'var(--brand-primary)'
  },
  {
    icon: Brain,
    name: 'TauAI',
    description: 'Privacy-first AI assistant that runs locally on your device. No cloud, no tracking, complete privacy.',
    link: 'https://www.tauos.org/apps/tauai',
    status: 'Available',
    color: 'var(--brand-primary)'
  },
  {
    icon: Globe,
    name: 'TauBrowser',
    description: 'Privacy-focused web browser with built-in ad blocking and tracker protection.',
    link: 'https://www.tauos.org/apps/taubrowser',
    status: 'Available',
    color: 'var(--brand-primary)'
  },
  {
    icon: Terminal,
    name: 'TauScript',
    description: 'Powerful scripting language for automation and customization. Script, customize, and extend everything.',
    link: 'https://www.tauos.org/apps/tauscript',
    status: 'Available',
    color: 'var(--brand-primary)'
  },
  {
    icon: Palette,
    name: 'TauStudio',
    description: 'Professional IDE for developers. Build, test, and deploy applications with privacy-first tools.',
    link: 'https://www.tauos.org/apps/taustudio',
    status: 'Coming Soon',
    color: '#888'
  },
  {
    icon: Users,
    name: 'TauMeet',
    description: 'End-to-end encrypted video conferencing. Secure meetings without surveillance.',
    link: 'https://www.tauos.org/apps/taumeet',
    status: 'Coming Soon',
    color: '#888'
  }
];

export const Apps = () => {
  return (
    <div className="App">
      <Header />
      <main style={{ background: 'var(--bg-primary)' }}>
        {/* Hero Section */}
        <section className="py-32" style={{ paddingTop: '120px' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full mb-8">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-primary)' }}></div>
                <span className="body-small">Complete Ecosystem</span>
              </div>
              
              <h1 className="display-huge mb-6">
                The <span style={{ color: 'var(--brand-primary)' }}>TauOS</span> Ecosystem
              </h1>
              
              <p className="body-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                A complete suite of privacy-first applications designed to work seamlessly together. From secure email to AI assistance, every app is built on the foundation of digital sovereignty.
              </p>
            </div>
          </div>
        </section>

        {/* Apps Grid */}
        <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {apps.map((app, index) => {
                const Icon = app.icon;
                return (
                  <div 
                    key={index}
                    onClick={() => window.location.href = app.link}
                    className="glass-strong p-8 dark-hover dark-transition group cursor-pointer"
                    style={{ borderRadius: '0px' }}
                  >
                    <div className="space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="w-16 h-16 glass flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-8 h-8" style={{ color: app.color }} />
                        </div>
                        <div className="inline-flex items-center px-3 py-1 glass rounded-full">
                          <span className="body-small" style={{ color: app.color }}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="heading-2 mb-3">{app.name}</h3>
                        <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                          {app.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300" style={{ color: app.color }}>
                        <span>Learn more</span>
                        <div className="w-4 h-[1px]" style={{ background: app.color }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h2 className="display-medium mb-6">
              Ready to Experience <span style={{ color: 'var(--brand-primary)' }}>Digital Sovereignty</span>?
            </h2>
            <p className="body-large mb-8" style={{ color: 'var(--text-secondary)' }}>
              Download TauOS today and get access to the entire ecosystem of privacy-first applications.
            </p>
            <button 
              onClick={() => window.location.href = 'https://www.tauos.org/download'}
              className="btn-primary dark-button-animate text-lg px-8"
            >
              Download TauOS
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
