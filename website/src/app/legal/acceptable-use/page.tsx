'use client';

import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, Users, Globe, Mail, Phone, MapPin,
  ArrowRight, ExternalLink, CheckCircle, Star, Zap, Code, Building,
  Target, Award, Heart, Scale, Monitor, Smartphone, FileText, Database, Lock
} from 'lucide-react';

export default function AcceptableUsePolicyPage() {
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
                Acceptable Use Policy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Guidelines for using TauOS services responsibly and maintaining a <span className="text-yellow-400 font-semibold">safe, secure, and respectful environment</span> for all users.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Prohibited Activities Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Prohibited Activities
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The following activities are strictly prohibited when using TauOS services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: AlertTriangle,
                title: "Illegal Activities",
                description: "Any activities that violate applicable laws or regulations are strictly prohibited."
              },
              {
                icon: Users,
                title: "Spam & Harassment",
                description: "Spam, harassment, abuse, or any form of harmful communication is not allowed."
              },
              {
                icon: Shield,
                title: "Malware Distribution",
                description: "Distribution of malware, viruses, or any harmful content is strictly prohibited."
              },
              {
                icon: Lock,
                title: "Security Compromise",
                description: "Attempting to compromise system security or gain unauthorized access is forbidden."
              },
              {
                icon: FileText,
                title: "IP Violations",
                description: "Violation of intellectual property rights or copyright infringement is not allowed."
              },
              {
                icon: Users,
                title: "Account Abuse",
                description: "Creating multiple accounts to circumvent restrictions is strictly prohibited."
              }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <activity.icon className="w-16 h-16 text-yellow-400 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">{activity.title}</h3>
                <p className="text-gray-300 leading-relaxed">{activity.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enforcement Section */}
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
              <Scale className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Enforcement
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Violations of this policy may result in account suspension or termination.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                title: "Investigation Process",
                description: "We reserve the right to investigate any reported violations of this policy. Our team will review all reports and take appropriate action based on the severity of the violation.",
                icon: Eye
              },
              {
                title: "Account Actions",
                description: "Depending on the nature and severity of the violation, we may issue warnings, temporarily suspend accounts, or permanently terminate accounts.",
                icon: Shield
              }
            ].map((enforcement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <enforcement.icon className="w-16 h-16 text-yellow-400 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">{enforcement.title}</h3>
                <p className="text-gray-300 leading-relaxed">{enforcement.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reporting Violations Section */}
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
              <Mail className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Reporting Violations
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Help us maintain a safe environment by reporting any violations of this policy.
            </p>
          </motion.div>

          <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">How to Report</h3>
              <p className="text-gray-300 mb-6">
                If you encounter any violations of this Acceptable Use Policy, please report them immediately.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-white mb-4">Email Reports</h4>
                <p className="text-gray-300 mb-2">Send detailed reports to:</p>
                <p className="text-yellow-400 font-semibold">abuse@tauos.org</p>
                <p className="text-gray-400 text-sm mt-2">Include screenshots and relevant details</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-4">Response Time</h4>
                <p className="text-gray-300 mb-2">We typically respond to reports within:</p>
                <p className="text-yellow-400 font-semibold">24-48 hours</p>
                <p className="text-gray-400 text-sm mt-2">For urgent security issues</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Questions About This Policy?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              If you have any questions about this Acceptable Use Policy, please contact us.
            </p>
            
            <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Legal Team</h3>
                  <p className="text-gray-300 mb-2">Email: <a href="mailto:legal@tauos.org" className="text-yellow-400 hover:text-yellow-300">legal@tauos.org</a></p>
                  <p className="text-gray-300 mb-2">Phone: +1 1800 TauOS</p>
                  <p className="text-gray-300">Address: 2261 Market St, San Francisco, CA 94114</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Malaysia Office</h3>
                  <p className="text-gray-300 mb-2">Email: <a href="mailto:legal@tauos.org" className="text-yellow-400 hover:text-yellow-300">legal@tauos.org</a></p>
                  <p className="text-gray-300 mb-2">Phone: +60 178446206</p>
                  <p className="text-gray-300">Address: IB Tower, Level 33, Kuala Lumpur</p>
                </div>
              </div>
            </div>
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