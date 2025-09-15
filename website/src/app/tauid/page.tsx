'use client';

import { motion } from 'framer-motion';
import {
  Shield, Lock, Eye, Fingerprint, Key, Database, Users, Globe,
  ArrowRight, ExternalLink, CheckCircle, Star, Zap, Code, Building,
  Target, Mail, Award, Heart, Scale, Monitor, Smartphone
} from 'lucide-react';

export default function TauIDPage() {
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
                TauID
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Your <span className="text-yellow-400 font-semibold">secure digital identity</span>. Zero-knowledge authentication, biometric security, and complete privacy protection.
              <br />
              <span className="text-lg text-gray-400">Zero Data Access • 100% Encrypted • Biometric Security</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy-First Identity Section */}
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
                Privacy-First Identity
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your identity, your control. Built with <span className="text-yellow-400 font-semibold">zero-knowledge architecture and biometric security</span>.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Eye,
                title: "Zero-Knowledge Identity",
                description: "Your identity data is encrypted and stored locally. We never see your personal information."
              },
              {
                icon: Fingerprint,
                title: "Biometric Authentication",
                description: "Secure login with fingerprint, face recognition, and other biometric methods."
              },
              {
                icon: Lock,
                title: "End-to-End Encryption",
                description: "All identity data is encrypted with keys only you control. Complete privacy guaranteed."
              },
              {
                icon: Globe,
                title: "Universal Identity",
                description: "One secure identity that works across all TauOS applications and services."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
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
              <Key className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Secure identity management in three simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Identity",
                description: "Set up your secure digital identity with biometric authentication and local encryption.",
                icon: Shield
              },
              {
                step: "2",
                title: "Encrypt Data",
                description: "Your identity data is encrypted locally with keys only you control. Complete privacy guaranteed.",
                icon: Lock
              },
              {
                step: "3",
                title: "Secure Access",
                description: "Use your identity across all TauOS apps with complete privacy and security protection.",
                icon: Key
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-yellow-400 text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <step.icon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features Section */}
      <section id="features" className="py-20 bg-black">
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
                Security Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced security measures to protect your digital identity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Fingerprint,
                title: "Biometric Security",
                description: "Fingerprint, face recognition, and other biometric authentication methods for maximum security."
              },
              {
                icon: Database,
                title: "Local Storage",
                description: "All identity data is stored locally on your device. We never have access to your personal information."
              },
              {
                icon: Key,
                title: "Zero-Knowledge Proofs",
                description: "Prove your identity without revealing any personal information using advanced cryptographic techniques."
              },
              {
                icon: Shield,
                title: "Hardware Security",
                description: "Leverage secure hardware elements and trusted execution environments for maximum protection."
              },
              {
                icon: Eye,
                title: "Privacy by Design",
                description: "Every feature is designed with privacy as the foundation. No data collection, no tracking, no compromises."
              },
              {
                icon: Globe,
                title: "Cross-Platform",
                description: "Use your identity across all TauOS applications and services with seamless, secure authentication."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
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
              <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Use Cases
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Secure your digital life across all TauOS applications and services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "TauMail Authentication",
                description: "Securely access your private email with biometric authentication and zero-knowledge identity verification.",
                icon: "📧"
              },
              {
                title: "TauCloud Access",
                description: "Protect your encrypted cloud storage with secure identity verification and local key management.",
                icon: "☁️"
              },
              {
                title: "TauStore Purchases",
                description: "Make secure app purchases and manage your digital library with privacy-protected identity verification.",
                icon: "🛒"
              },
              {
                title: "TauBrowser Profiles",
                description: "Maintain separate browsing profiles and secure bookmarks with encrypted identity management.",
                icon: "🌐"
              }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{useCase.title}</h3>
                <p className="text-gray-300 leading-relaxed">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Secure Your Identity
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Take control of your digital identity with the most secure and private authentication system available.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  // Redirect to registration page or show registration modal
                  window.location.href = 'https://tauos-zbtm.vercel.app/api/register';
                }}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
              >
                Create Identity
              </button>
              <button 
                onClick={() => {
                  // Scroll to features section or show more info
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-xl font-semibold hover:border-yellow-400/50 hover:text-yellow-400 transition-all duration-300"
              >
                Learn More
              </button>
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