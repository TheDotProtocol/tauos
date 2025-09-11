'use client';

import { motion } from 'framer-motion';
import {
  FileText, Shield, Lock, Eye, CheckCircle, Users, Building, Globe,
  Mail, ExternalLink, ArrowRight, Scale, Heart, Target, Zap
} from 'lucide-react';

export default function DataProtectionAddendumPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src="/brand/tauos-logo.svg" alt="TauOS" className="h-8 w-auto" />
              <span className="text-xl font-bold text-white">Tau OS</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="/developers" className="text-gray-300 hover:text-white transition-colors">Developers</a>
              <a href="/governance" className="text-gray-300 hover:text-white transition-colors">Governance</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Data Protection Addendum
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Comprehensive data protection framework ensuring <span className="text-yellow-400 font-semibold">privacy, security, and compliance</span>.
              <br />
              This addendum supplements our Privacy Policy and Terms of Service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Data Protection Framework
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our <span className="text-yellow-400 font-semibold">comprehensive approach</span> to data protection ensures your privacy is never compromised.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Lock,
                title: "Data Minimization",
                description: "We collect only the data necessary for service functionality and user experience."
              },
              {
                icon: Eye,
                title: "Transparency",
                description: "Clear documentation of what data we collect, how we use it, and who has access."
              },
              {
                icon: Shield,
                title: "Security by Design",
                description: "Privacy and security considerations are built into every aspect of our systems."
              },
              {
                icon: Users,
                title: "User Control",
                description: "You have complete control over your data with easy access, modification, and deletion."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <item.icon className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Categories Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <FileText className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Data Categories & Processing
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Account Data",
                description: "Email addresses, usernames, and authentication information. Processed for account management and service delivery.",
                legalBasis: "Contractual necessity and legitimate interest"
              },
              {
                icon: Mail,
                title: "Communication Data",
                description: "Email content, metadata, and communication logs. Processed for email service functionality and security.",
                legalBasis: "Contractual necessity and legitimate interest"
              },
              {
                icon: Globe,
                title: "Usage Data",
                description: "Service usage patterns, performance metrics, and system logs. Processed for service improvement and security.",
                legalBasis: "Legitimate interest and consent"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <item.icon className="w-16 h-16 text-yellow-400 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed mb-4">{item.description}</p>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-yellow-400 font-semibold">Legal Basis:</p>
                  <p className="text-sm text-gray-300">{item.legalBasis}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rights Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Scale className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Your Data Rights
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Under GDPR, CCPA, and other privacy laws, you have comprehensive rights over your personal data.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              "Right to Access - Request a copy of all personal data we hold about you",
              "Right to Rectification - Correct inaccurate or incomplete personal data",
              "Right to Erasure - Request deletion of your personal data",
              "Right to Portability - Receive your data in a structured, machine-readable format",
              "Right to Restrict Processing - Limit how we process your personal data",
              "Right to Object - Object to processing based on legitimate interests"
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4 p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <p className="text-gray-300">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Measures Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Lock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Security Measures
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              "End-to-end encryption for all data in transit and at rest",
              "Regular security audits and penetration testing",
              "Access controls and multi-factor authentication",
              "Data anonymization and pseudonymization techniques",
              "Secure data centers with physical and logical security",
              "Incident response procedures and breach notification protocols"
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4 p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <p className="text-gray-300">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Mail className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Data Protection Contact
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              For data protection inquiries, rights requests, or privacy concerns, contact our Data Protection Officer.
            </p>
            
            <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Data Protection Officer</h3>
                  <p className="text-gray-300 mb-2">Email: <a href="mailto:privacy@tauos.org" className="text-yellow-400 hover:text-yellow-300">privacy@tauos.org</a></p>
                  <p className="text-gray-300 mb-2">Phone: +1 1800 TauOS</p>
                  <p className="text-gray-300">Response time: 72 hours</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Legal Department</h3>
                  <p className="text-gray-300 mb-2">Email: <a href="mailto:legal@tauos.org" className="text-yellow-400 hover:text-yellow-300">legal@tauos.org</a></p>
                  <p className="text-gray-300 mb-2">Address: 2261 Market St, San Francisco, CA 94114</p>
                  <p className="text-gray-300">Malaysia: IB Tower, Level 33, Kuala Lumpur</p>
                </div>
              </div>
            </div>

            <a
              href="mailto:privacy@tauos.org"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Data Protection Officer</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <img src="/brand/tauos-logo.svg" alt="TauOS" className="h-8 w-auto" />
              <span className="text-xl font-bold text-white">Tau OS</span>
            </div>
            <p className="text-gray-400">© 2025 Tau Foundation & Tau LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
