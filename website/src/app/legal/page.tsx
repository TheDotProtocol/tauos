'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  Globe, 
  Lock, 
  Users, 
  Mail, 
  Building,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  ExternalLink,
  Heart,
  Code,
  GitBranch
} from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <a href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">τ</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  TauOS
                </span>
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:flex items-center space-x-8"
            >
              {[
                { href: '/', label: 'Home' },
                { href: '/governance', label: 'Governance' },
                { href: '/careers', label: 'Careers' },
                { href: '/legal', label: 'Legal', active: true },
                { href: 'https://mail.tauos.org', label: 'TauMail', external: true },
                { href: 'https://cloud.tauos.org', label: 'TauCloud', external: true }
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={`transition-all duration-300 hover:scale-105 focus-tau ${
                    item.active ? 'text-purple-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Legal &</span>
              <br />
              <span className="tau-gradient">Compliance</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Transparency and legal compliance are core to our mission. Here's everything you need to know about our legal framework.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Company Information</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              TauOS is developed and maintained by AR Holdings Group, a privacy-first technology company.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="glass-strong p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-purple-400">AR Holdings Group</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Building className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Company Name</h4>
                      <p className="text-gray-300 text-sm">AR Holdings Group</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Website</h4>
                      <p className="text-gray-300 text-sm">https://www.arholdings.group</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Contact</h4>
                      <p className="text-gray-300 text-sm">legal@tauos.org</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="glass-strong p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-blue-400">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  AR Holdings Group is committed to building privacy-first technology that puts users back in control of their digital lives. 
                  We believe privacy is a fundamental human right that should be protected by default.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">Privacy-first development</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">Open source commitment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">User sovereignty</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Licensing */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Licensing</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              TauOS uses an open-core licensing model that balances openness with sustainability.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: "Core OS",
                license: "GPL v3",
                description: "The core operating system and kernel components are licensed under GPL v3 for maximum openness."
              },
              {
                icon: GitBranch,
                title: "Applications",
                license: "MIT License",
                description: "Most TauOS applications are licensed under MIT for broad adoption and compatibility."
              },
              {
                icon: Shield,
                title: "Proprietary Components",
                license: "Commercial License",
                description: "Some advanced features and enterprise components use commercial licensing."
              }
            ].map((component, index) => (
              <motion.div
                key={component.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-strong p-8 rounded-2xl text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <component.icon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{component.title}</h3>
                <div className="mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">
                    {component.license}
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed">{component.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Compliance */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Privacy & Compliance</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We take privacy and legal compliance seriously. Here's how we protect your rights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="glass-strong p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-green-400">GDPR Compliance</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Data Minimization</h4>
                      <p className="text-gray-300 text-sm">We collect only the data necessary for service operation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Right to Deletion</h4>
                      <p className="text-gray-300 text-sm">Users can request complete data deletion at any time</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Data Portability</h4>
                      <p className="text-gray-300 text-sm">Export your data in standard formats</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="glass-strong p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-blue-400">Security Standards</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">End-to-End Encryption</h4>
                      <p className="text-gray-300 text-sm">All data is encrypted in transit and at rest</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Zero-Knowledge Architecture</h4>
                      <p className="text-gray-300 text-sm">We cannot access your encrypted data</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Regular Security Audits</h4>
                      <p className="text-gray-300 text-sm">Independent security assessments conducted annually</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Terms of Service */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Terms of Service</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our commitment to transparency and user rights in clear, understandable terms.
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                title: "User Rights",
                description: "You have the right to privacy, data control, and transparency. We will never sell your data or use it for purposes you haven't explicitly agreed to.",
                icon: Users,
                color: "text-green-400"
              },
              {
                title: "Service Availability",
                description: "We strive for 99.9% uptime but cannot guarantee uninterrupted service. We will notify users of planned maintenance in advance.",
                icon: Globe,
                color: "text-blue-400"
              },
              {
                title: "Limitation of Liability",
                description: "TauOS is provided 'as is' without warranties. We are not liable for damages arising from use of our software or services.",
                icon: AlertTriangle,
                color: "text-yellow-400"
              },
              {
                title: "Updates and Changes",
                description: "We may update these terms with 30 days notice. Continued use constitutes acceptance of new terms.",
                icon: Info,
                color: "text-purple-400"
              }
            ].map((term, index) => (
              <motion.div
                key={term.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-strong p-8 rounded-2xl border border-white/10"
              >
                <div className="flex items-start space-x-6">
                  <div className={`w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <term.icon className={`w-6 h-6 ${term.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">{term.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{term.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Contact Information</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions about our legal framework? We're here to help.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Legal Inquiries",
                email: "legal@tauos.org",
                description: "For legal questions, compliance issues, or terms of service inquiries"
              },
              {
                title: "Privacy Support",
                email: "privacy@tauos.org",
                description: "For privacy-related questions, data requests, or GDPR inquiries"
              },
              {
                title: "General Support",
                email: "support@tauos.org",
                description: "For general questions about TauOS and our services"
              }
            ].map((contact, index) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-strong p-8 rounded-2xl text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{contact.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{contact.description}</p>
                <a 
                  href={`mailto:${contact.email}`}
                  className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                >
                  {contact.email}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-strong p-12 rounded-2xl"
          >
            <h2 className="text-3xl font-bold mb-6">Questions About Our Legal Framework?</h2>
            <p className="text-xl text-gray-300 mb-8">
              We believe in transparency and are happy to answer any questions about our legal policies and compliance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="mailto:legal@tauos.org"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-lg font-semibold flex items-center space-x-3 transition-all duration-300 hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                <span>Contact Legal Team</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="/governance"
                className="px-8 py-4 border border-white/20 rounded-xl text-lg font-semibold flex items-center space-x-3 transition-all duration-300 hover:bg-white/10"
              >
                <Heart className="w-5 h-5" />
                <span>Learn About Governance</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 