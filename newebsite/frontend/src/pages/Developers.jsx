import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Code, Github, Terminal, BookOpen, Download, ExternalLink, GitBranch, Zap, Database, Shield, Play } from 'lucide-react';

export const Developers = () => {
  return (
    <div className="App">
      <Header />
      <main style={{ background: 'var(--bg-primary)' }}>
        {/* Hero Section */}
        <section className="py-32" style={{ paddingTop: '120px' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full mb-8">
              <Code className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
              <span className="body-small">Developer Portal</span>
            </div>
            
            <h1 className="display-huge mb-6">
              Build with <span style={{ color: 'var(--brand-primary)' }}>TauCore™</span>
            </h1>
            
            <p className="body-large max-w-2xl mx-auto mb-12" style={{ color: 'var(--text-secondary)' }}>
              Everything you need to develop privacy-first applications on the TauCore™ platform.
            </p>
          </div>
        </section>

        {/* Developer Hub - GitHub Clone */}
        <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="display-medium mb-6">TauCore™ Developer Hub</h2>
              <p className="body-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                A GitHub-like platform, but better. Built for privacy-first development with integrated tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Github,
                  title: 'Repository Management',
                  description: 'Full Git integration with clone, push, pull, commit, and merge operations',
                  features: ['Git Operations API', 'Branch Management', 'Commit History', 'Pull Requests']
                },
                {
                  icon: Zap,
                  title: 'CI/CD Automation',
                  description: 'Complete pipeline management with deployment tracking',
                  features: ['Pipeline Management', 'Environment Management', 'Build Logs', 'Deployment Tracking']
                },
                {
                  icon: Terminal,
                  title: 'Integrated Terminal',
                  description: 'Real command execution with TauScript REPL and security controls',
                  features: ['Hybrid Execution', 'TauScript REPL', 'Command History', 'Security Controls']
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="glass p-8" style={{ borderRadius: '0px' }}>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 glass flex items-center justify-center">
                        <Icon className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
                      </div>
                      <h3 className="heading-3">{feature.title}</h3>
                    </div>
                    <p className="body-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--brand-primary)' }}></div>
                          <span className="body-small" style={{ color: 'var(--text-muted)' }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <button 
                onClick={() => window.open('https://developerhub.tauos.org', '_blank')}
                className="btn-primary dark-button-animate"
              >
                <Github className="w-5 h-5" />
                Access Developer Hub
              </button>
            </div>
          </div>
        </section>

        {/* TauStudio IDE */}
        <section className="py-32" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="display-medium mb-6">TauStudio IDE</h2>
              <p className="body-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                The ultimate development environment for TauScript with built-in privacy features.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="heading-2 mb-6">IDE Features</h3>
                <div className="space-y-4">
                  {[
                    'Syntax highlighting and auto-completion',
                    'Built-in debugger and performance profiler',
                    'Integrated terminal with TauScript REPL',
                    'Git integration and version control',
                    'Privacy-first development environment',
                    'Cross-platform support (Windows, macOS, Linux)',
                    'Multi-tab support with undo/redo',
                    'Real-time error checking and linting'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-primary)' }}></div>
                      <span className="body-medium" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <button 
                    onClick={() => window.open('https://developerhub.tauos.org/ide', '_blank')}
                    className="btn-primary dark-button-animate mr-4"
                  >
                    <Terminal className="w-5 h-5" />
                    Launch TauStudio
                  </button>
                  <button 
                    onClick={() => window.open('https://docs.tauos.org/tauscript', '_blank')}
                    className="btn-secondary dark-button-animate"
                  >
                    <BookOpen className="w-5 h-5" />
                    Learn TauScript
                  </button>
                </div>
              </div>
              
              <div className="glass p-8" style={{ borderRadius: '0px' }}>
                <div className="bg-black rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-green-400 font-mono text-sm">
                    <div>// TauScript IDE Example</div>
                    <div>import std.io;</div>
                    <div>import std.net;</div>
                    <div></div>
                    <div>fn main() {'{'}</div>
                    <div>    io.println("Hello, TauCore™!");</div>
                    <div>    let server = net.Server.new("localhost:8080");</div>
                    <div>    server.start();</div>
                    <div>{'}'}</div>
                  </div>
                </div>
                <p className="body-small text-center" style={{ color: 'var(--text-muted)' }}>
                  TauStudio IDE - Privacy-First Development Environment
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TauScript Language */}
        <section className="py-32" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="display-medium mb-6">TauScript Language</h2>
              <p className="body-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                A privacy-first, AI-native programming language designed for the TauCore™ ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Shield,
                  title: 'Privacy First',
                  description: 'No data collection, local execution by default'
                },
                {
                  icon: Zap,
                  title: 'AI Native',
                  description: 'Built-in AI capabilities and machine learning support'
                },
                {
                  icon: Database,
                  title: 'Cross Platform',
                  description: 'Runs on desktop, mobile, and web'
                },
                {
                  icon: Code,
                  title: 'Type Safe',
                  description: 'Static typing with inference and memory safety'
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 glass mx-auto mb-6 flex items-center justify-center">
                      <Icon className="w-8 h-8" style={{ color: 'var(--brand-primary)' }} />
                    </div>
                    <h3 className="heading-3 mb-3">{feature.title}</h3>
                    <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <button 
                onClick={() => window.open('https://docs.tauos.org/tauscript', '_blank')}
                className="btn-primary dark-button-animate mr-4"
              >
                <BookOpen className="w-5 h-5" />
                TauScript Documentation
              </button>
              <button 
                onClick={() => window.open('https://developerhub.tauos.org/terminal', '_blank')}
                className="btn-secondary dark-button-animate"
              >
                <Terminal className="w-5 h-5" />
                Try TauScript REPL
              </button>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-32" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h2 className="display-medium mb-8">Start Building Today</h2>
            <p className="body-large mb-12" style={{ color: 'var(--text-secondary)' }}>
              Clone our repository, explore the docs, and join thousands of developers building privacy-first applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open('https://github.com/TheDotProtocol/tauos', '_blank')}
                className="btn-primary dark-button-animate"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </button>
              <button 
                onClick={() => window.open('https://developerhub.tauos.org', '_blank')}
                className="btn-secondary dark-button-animate"
              >
                <Play className="w-5 h-5" />
                Get Started
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};