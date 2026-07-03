'use client';

import React from 'react';
import Link from 'next/link';
import MarketingPageShell from '@/components/marketing/MarketingPageShell';
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
    <MarketingPageShell
      title="Documentation"
      subtitle="Guides for Tau OS and the TAU CORE ecosystem from Tau Core Inc."
    >
      <div className="container mx-auto px-6 py-12">
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/download" className="bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors">
              <h3 className="font-semibold text-white">Installation</h3>
              <p className="text-sm text-muted-foreground">Get Tau OS running on your device</p>
            </Link>
            <Link href="/beta" className="bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors">
              <h3 className="font-semibold text-white">Beta Program</h3>
              <p className="text-sm text-muted-foreground">Join the Tau OS beta</p>
            </Link>
            <Link href="/help" className="bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors">
              <h3 className="font-semibold text-white">Help Center</h3>
              <p className="text-sm text-muted-foreground">Common questions answered</p>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {documentationSections.map((section, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${section.color} mr-4`}>
                  <section.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    className="block p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                  >
                    <h3 className="font-medium text-white">{link.name}</h3>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">
            Download Tau OS and experience privacy-first computing from Tau Core Inc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/download" className="bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-primary/90">
              Download Tau OS
            </Link>
            <Link href="/contact" className="border border-primary text-primary px-6 py-3 font-semibold hover:bg-primary/10">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
