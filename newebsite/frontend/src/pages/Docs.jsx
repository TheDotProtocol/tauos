import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Book, Download, Terminal, Shield, Cloud, Mail, Users, Code, ExternalLink, Play, Github, FileText, Settings, Globe, Zap, Database, Brain, ChevronDown, ChevronRight } from 'lucide-react';

export const Docs = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState(['quick-start', 'getting-started']);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const docsSections = [
    {
      id: 'quick-start',
      title: 'Quick Start',
      icon: Play,
      description: 'Get up and running with TauOS in minutes',
      items: [
        { 
          name: 'Installation Guide', 
          description: 'Complete installation instructions for all platforms',
          link: '/docs/installation',
          file: 'COMPLETE_SETUP_GUIDE.md',
          type: 'guide'
        },
        { 
          name: '5-Minute Setup', 
          description: 'Quick start guide to get TauOS running',
          link: '/docs/quick-start',
          file: 'setup.md',
          type: 'tutorial'
        },
        { 
          name: 'System Requirements', 
          description: 'Hardware and software requirements',
          link: '/docs/requirements',
          file: 'building.md',
          type: 'reference'
        },
        { 
          name: 'FAQ', 
          description: 'Frequently asked questions and answers',
          link: '/docs/faq',
          file: 'answers.md',
          type: 'faq'
        }
      ]
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Download,
      description: 'Complete guides for new users',
      items: [
        { 
          name: 'Desktop OS Guide', 
          description: 'Complete desktop operating system guide',
          link: '/docs/desktop',
          file: 'desktop.md',
          type: 'guide'
        },
        { 
          name: 'Mobile OS Features', 
          description: 'Mobile operating system features and capabilities',
          link: '/docs/mobile',
          file: 'mobileosfeatures.md',
          type: 'guide'
        },
        { 
          name: 'Project Overview', 
          description: 'Understanding the TauOS project structure',
          link: '/docs/overview',
          file: 'project-overview.md',
          type: 'overview'
        }
      ]
    },
    {
      id: 'applications',
      title: 'TauOS Applications',
      icon: Cloud,
      description: 'Complete guides for all TauOS applications',
      items: [
        { 
          name: 'TauMail Guide', 
          description: 'Privacy-first email system setup and usage',
          link: '/docs/taumail',
          file: 'taumail.md',
          type: 'guide'
        },
        { 
          name: 'TauCloud Guide', 
          description: 'Secure cloud storage and file sharing',
          link: '/docs/taucloud',
          file: 'taucloud.md',
          type: 'guide'
        },
        { 
          name: 'TauStore Guide', 
          description: 'Privacy-first app marketplace',
          link: '/docs/taustore',
          file: 'tau-store.md',
          type: 'guide'
        }
      ]
    },
    {
      id: 'developer-resources',
      title: 'Developer Resources',
      icon: Code,
      description: 'API documentation and development tools',
      items: [
        { 
          name: 'API Documentation', 
          description: 'Complete API reference and guides',
          link: '/docs/api',
          file: 'API.md',
          type: 'reference'
        },
        { 
          name: 'TauScript Guide', 
          description: 'TauScript programming language documentation',
          link: '/docs/tauscript',
          file: 'developer/tauscript-complete.md',
          type: 'guide'
        },
        { 
          name: 'Developer Hub', 
          description: 'TauStudio IDE and development environment',
          link: 'https://developerhub.tauos.org',
          file: 'developer/taudeveloper.md',
          type: 'tool',
          external: true
        },
        { 
          name: 'Architecture Guide', 
          description: 'TauOS system architecture and design',
          link: '/docs/architecture',
          file: 'architecture/',
          type: 'reference'
        }
      ]
    },
    {
      id: 'security-privacy',
      title: 'Security & Privacy',
      icon: Shield,
      description: 'Security features and privacy documentation',
      items: [
        { 
          name: 'Security Features', 
          description: 'Built-in security measures and protocols',
          link: '/docs/security',
          file: 'SECURITY.md',
          type: 'guide'
        },
        { 
          name: 'Privacy Policy', 
          description: 'How we protect your data and privacy',
          link: '/privacy',
          file: 'privacy-policy.md',
          type: 'policy'
        },
        { 
          name: 'Compliance', 
          description: 'GDPR, SOC2, ISO 27001 compliance',
          link: '/docs/compliance',
          file: 'compliance/',
          type: 'compliance'
        },
        { 
          name: 'Data Protection', 
          description: 'Your data, your control - privacy guarantees',
          link: '/docs/data-protection',
          file: 'data.md',
          type: 'guide'
        }
      ]
    },
    {
      id: 'enterprise',
      title: 'Enterprise',
      icon: Users,
      description: 'Enterprise features and deployment guides',
      items: [
        { 
          name: 'Enterprise Features', 
          description: 'Advanced enterprise capabilities',
          link: '/docs/enterprise',
          file: 'PRODUCTION_ENTERPRISE_SUMMARY.md',
          type: 'guide'
        },
        { 
          name: 'Deployment Guide', 
          description: 'Enterprise deployment and setup',
          link: '/docs/deployment',
          file: 'DEPLOYMENT.md',
          type: 'guide'
        },
        { 
          name: 'Production Setup', 
          description: 'Production environment configuration',
          link: '/docs/production',
          file: 'PRODUCTION_SETUP.md',
          type: 'guide'
        },
        { 
          name: 'Monitoring', 
          description: 'System monitoring and alerts',
          link: '/docs/monitoring',
          file: 'monitoring.md',
          type: 'guide'
        }
      ]
    },
    {
      id: 'support-help',
      title: 'Support & Help',
      icon: Settings,
      description: 'Support resources and troubleshooting',
      items: [
        { 
          name: 'Troubleshooting', 
          description: 'Common issues and solutions',
          link: '/docs/troubleshooting',
          file: 'troubleshooting.md',
          type: 'guide'
        },
        { 
          name: 'Testing Guide', 
          description: 'Testing and quality assurance',
          link: '/docs/testing',
          file: 'TESTING.md',
          type: 'guide'
        },
        { 
          name: 'Contributing', 
          description: 'How to contribute to TauOS',
          link: '/docs/contributing',
          file: 'CONTRIBUTING.md',
          type: 'guide'
        },
        { 
          name: 'Community', 
          description: 'User community and forums',
          link: '/community',
          file: 'help-center.md',
          type: 'community'
        }
      ]
    },
    {
      id: 'business-legal',
      title: 'Business & Legal',
      icon: FileText,
      description: 'Business information and legal documents',
      items: [
        { 
          name: 'Terms of Service', 
          description: 'Terms and conditions for using TauOS',
          link: '/terms',
          file: 'terms-of-service.md',
          type: 'legal'
        },
        { 
          name: 'Licensing', 
          description: 'Open source licensing and usage',
          link: '/docs/licensing',
          file: 'license.md',
          type: 'legal'
        },
        { 
          name: 'Governance', 
          description: 'Project governance and decision making',
          link: '/docs/governance',
          file: 'GOVERNANCE.md',
          type: 'governance'
        },
        { 
          name: 'Code of Conduct', 
          description: 'Community guidelines and standards',
          link: '/docs/code-of-conduct',
          file: 'CODE_OF_CONDUCT.md',
          type: 'policy'
        }
      ]
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'guide': return 'text-blue-400 bg-blue-400/20';
      case 'tutorial': return 'text-green-400 bg-green-400/20';
      case 'reference': return 'text-purple-400 bg-purple-400/20';
      case 'faq': return 'text-yellow-400 bg-yellow-400/20';
      case 'tool': return 'text-cyan-400 bg-cyan-400/20';
      case 'overview': return 'text-orange-400 bg-orange-400/20';
      case 'policy': return 'text-red-400 bg-red-400/20';
      case 'compliance': return 'text-indigo-400 bg-indigo-400/20';
      case 'legal': return 'text-gray-400 bg-gray-400/20';
      case 'governance': return 'text-pink-400 bg-pink-400/20';
      case 'community': return 'text-emerald-400 bg-emerald-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="App">
      <Header />
      <main style={{ background: 'var(--bg-primary)' }}>
        {/* Hero Section */}
        <section className="py-32" style={{ paddingTop: '120px' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full mb-8">
              <Book className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
              <span className="body-small">Documentation Hub</span>
            </div>
            
            <h1 className="display-huge mb-6">
              TauOS <span style={{ color: 'var(--brand-primary)' }}>Documentation</span>
            </h1>
            
            <p className="body-large max-w-2xl mx-auto mb-12" style={{ color: 'var(--text-secondary)' }}>
              Complete documentation for TauOS - the world's first privacy-first, AI-native operating system. Find everything you need to get started, develop, and deploy TauOS solutions.
            </p>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="display-medium mb-6">Documentation Sections</h2>
              <p className="body-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Everything you need to get started, build applications, and deploy privacy-first solutions.
              </p>
            </div>

            <div className="space-y-6">
              {docsSections.map((section, index) => {
                const Icon = section.icon;
                const isExpanded = expandedSections.includes(section.id);
                
                return (
                  <div key={index} className="glass p-6 rounded-xl">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 glass rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
                        </div>
                        <div>
                          <h3 className="heading-3 mb-1">{section.title}</h3>
                          <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                            {section.description}
                          </p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.items.map((item, idx) => (
                          <div 
                            key={idx}
                            className="glass p-4 rounded-lg dark-hover dark-transition cursor-pointer"
                            onClick={() => {
                              if (item.external) {
                                window.open(item.link, '_blank');
                              } else {
                                // Navigate to the doc viewer route
                                navigate(item.link);
                              }
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="heading-4 text-white">{item.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                                {item.type}
                              </span>
                            </div>
                            <p className="body-small mb-3" style={{ color: 'var(--text-secondary)' }}>
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {item.file}
                              </span>
                              {item.external ? (
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Access */}
        <section className="py-32" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="display-medium mb-6">Quick Access</h2>
              <p className="body-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Jump into development with our most popular resources.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Play,
                  title: 'Quick Start',
                  description: 'Get up and running in 5 minutes',
                  link: '/docs/quickstart',
                  color: 'bg-green-500'
                },
                {
                  icon: Code,
                  title: 'TauScript',
                  description: 'Learn our programming language',
                  link: '/docs/tauscript',
                  color: 'bg-blue-500'
                },
                {
                  icon: Terminal,
                  title: 'TauStudio IDE',
                  description: 'Start coding with our IDE',
                  link: 'https://developerhub.tauos.org/ide',
                  color: 'bg-purple-500'
                },
                {
                  icon: Github,
                  title: 'GitHub',
                  description: 'View source code and contribute',
                  link: 'https://github.com/TheDotProtocol/tauos',
                  color: 'bg-gray-500'
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index}
                    onClick={() => window.open(item.link, item.link.startsWith('http') ? '_blank' : '_self')}
                    className="glass p-8 dark-hover dark-transition cursor-pointer group"
                    style={{ borderRadius: '0px' }}
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="heading-3">{item.title}</h3>
                    </div>
                    <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-32" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h2 className="display-medium mb-8">Ready to Get Started?</h2>
            <p className="body-large mb-12" style={{ color: 'var(--text-secondary)' }}>
              Download TauOS today and experience the future of privacy-first computing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/download'}
                className="btn-primary dark-button-animate"
              >
                <Download className="w-5 h-5" />
                Download TauOS
              </button>
              <button 
                onClick={() => window.location.href = '/contact'}
                className="btn-secondary dark-button-animate"
              >
                <Users className="w-5 h-5" />
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};