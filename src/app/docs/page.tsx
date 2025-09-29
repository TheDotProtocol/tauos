import React from 'react';
import Link from 'next/link';
import { 
  BookOpenIcon, 
  DocumentTextIcon, 
  CodeBracketIcon, 
  ShieldCheckIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  CogIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const documentationSections = [
  {
    title: 'Getting Started',
    description: 'Quick start guides and installation instructions',
    icon: RocketLaunchIcon,
    color: 'bg-blue-500',
    links: [
      { name: 'Installation Guide', href: '/docs/installation', description: 'Desktop, mobile, and cloud installation' },
      { name: 'Quick Start', href: '/docs/quick-start', description: 'Get up and running in 5 minutes' },
      { name: 'System Requirements', href: '/docs/requirements', description: 'Hardware and software requirements' }
    ]
  },
  {
    title: 'User Guides',
    description: 'Complete user documentation and tutorials',
    icon: BookOpenIcon,
    color: 'bg-green-500',
    links: [
      { name: 'Desktop OS Guide', href: '/docs/desktop', description: 'Complete desktop operating system guide' },
      { name: 'Mobile OS Guide', href: '/docs/mobile', description: 'Mobile operating system features' },
      { name: 'TauMail Guide', href: '/docs/taumail', description: 'Privacy-first email system' },
      { name: 'TauCloud Guide', href: '/docs/taucloud', description: 'Secure cloud storage' },
      { name: 'TauID Guide', href: '/docs/tauid', description: 'Identity management system' }
    ]
  },
  {
    title: 'Developer Resources',
    description: 'API documentation and development tools',
    icon: CodeBracketIcon,
    color: 'bg-purple-500',
    links: [
      { name: 'API Documentation', href: '/docs/api', description: 'Complete API reference' },
      { name: 'TauScript Guide', href: '/docs/tauscript', description: 'TauScript programming language' },
      { name: 'SDK & Libraries', href: '/docs/sdk', description: 'Software development kits' },
      { name: 'Development Tools', href: '/docs/dev-tools', description: 'TauStudio IDE and tools' }
    ]
  },
  {
    title: 'Security & Privacy',
    description: 'Security features and privacy documentation',
    icon: ShieldCheckIcon,
    color: 'bg-red-500',
    links: [
      { name: 'Privacy Policy', href: '/docs/privacy', description: 'How we protect your data' },
      { name: 'Security Features', href: '/docs/security', description: 'Built-in security measures' },
      { name: 'Compliance', href: '/docs/compliance', description: 'GDPR, SOC2, ISO 27001 compliance' },
      { name: 'Data Protection', href: '/docs/data-protection', description: 'Your data, your control' }
    ]
  },
  {
    title: 'Enterprise',
    description: 'Enterprise features and deployment guides',
    icon: UserGroupIcon,
    color: 'bg-indigo-500',
    links: [
      { name: 'Enterprise Features', href: '/docs/enterprise', description: 'Advanced enterprise capabilities' },
      { name: 'Deployment Guide', href: '/docs/deployment', description: 'Enterprise deployment' },
      { name: 'MDM Integration', href: '/docs/mdm', description: 'Mobile device management' },
      { name: 'OTA Updates', href: '/docs/ota', description: 'Over-the-air update system' }
    ]
  },
  {
    title: 'Support & Help',
    description: 'Support resources and troubleshooting',
    icon: QuestionMarkCircleIcon,
    color: 'bg-yellow-500',
    links: [
      { name: 'FAQ', href: '/docs/faq', description: 'Frequently asked questions' },
      { name: 'Troubleshooting', href: '/docs/troubleshooting', description: 'Common issues and solutions' },
      { name: 'Contact Support', href: '/docs/support', description: 'Get help from our team' },
      { name: 'Community', href: '/docs/community', description: 'User community and forums' }
    ]
  },
  {
    title: 'Business & Legal',
    description: 'Business information and legal documents',
    icon: DocumentTextIcon,
    color: 'bg-gray-500',
    links: [
      { name: 'Terms of Service', href: '/docs/terms', description: 'Terms and conditions' },
      { name: 'Acceptable Use', href: '/docs/acceptable-use', description: 'Acceptable use policy' },
      { name: 'Data Processing Agreement', href: '/docs/dpa', description: 'Data processing agreement' },
      { name: 'Cookie Policy', href: '/docs/cookies', description: 'Cookie usage policy' }
    ]
  },
  {
    title: 'Investor Relations',
    description: 'Business information for investors',
    icon: ChartBarIcon,
    color: 'bg-emerald-500',
    links: [
      { name: 'Pitch Deck', href: '/docs/pitch-deck', description: 'Investment presentation' },
      { name: 'Financial Model', href: '/docs/financials', description: 'Financial projections' },
      { name: 'Go-to-Market', href: '/docs/gtm', description: 'Market strategy' },
      { name: 'Release Notes', href: '/docs/release-notes', description: 'Product updates and changes' }
    ]
  },
  {
    title: 'Technical Specifications',
    description: 'Technical documentation and specifications',
    icon: CogIcon,
    color: 'bg-orange-500',
    links: [
      { name: 'Technical Whitepaper', href: '/docs/whitepaper', description: 'Technical architecture' },
      { name: 'Hardware Requirements', href: '/docs/hardware', description: 'Supported hardware' },
      { name: 'Performance Metrics', href: '/docs/performance', description: 'Performance benchmarks' },
      { name: 'Monitoring', href: '/docs/monitoring', description: 'System monitoring and alerts' }
    ]
  },
  {
    title: 'Global Resources',
    description: 'International and localization resources',
    icon: GlobeAltIcon,
    color: 'bg-cyan-500',
    links: [
      { name: 'Internationalization', href: '/docs/i18n', description: 'Multi-language support' },
      { name: 'Localization', href: '/docs/localization', description: 'Regional customization' },
      { name: 'Global Deployment', href: '/docs/global', description: 'Worldwide deployment guide' },
      { name: 'Regional Compliance', href: '/docs/regional', description: 'Regional compliance requirements' }
    ]
  }
];

export default function DocumentationHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              TauOS Documentation Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete documentation for TauOS - the world's first privacy-first, AI-native operating system. 
              Find everything you need to get started, develop, and deploy TauOS solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/docs/installation" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900">Installation</h3>
              <p className="text-sm text-gray-600">Get TauOS running on your device</p>
            </Link>
            <Link href="/docs/quick-start" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900">Quick Start</h3>
              <p className="text-sm text-gray-600">5-minute setup guide</p>
            </Link>
            <Link href="/docs/faq" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900">FAQ</h3>
              <p className="text-sm text-gray-600">Common questions answered</p>
            </Link>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {documentationSections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${section.color} mr-4`}>
                  <section.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{link.name}</h3>
                        <p className="text-sm text-gray-600">{link.description}</p>
                      </div>
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-sm text-gray-600">Step-by-step video guides</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-sm text-gray-600">Join our user community</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CodeBracketIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">GitHub</h3>
              <p className="text-sm text-gray-600">Open source repositories</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <QuestionMarkCircleIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-sm text-gray-600">Get help when you need it</p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6 opacity-90">
            Download TauOS today and experience the future of privacy-first computing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/download" 
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Download TauOS
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
