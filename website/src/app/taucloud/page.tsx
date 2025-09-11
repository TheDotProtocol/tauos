'use client';

import { motion } from 'framer-motion';
import {
  Cloud, Lock, Eye, Upload, Download, Shield, Database, Globe,
  ArrowRight, ExternalLink, CheckCircle, Star, Zap, Code, Building,
  Target, Mail, Award, Heart, Scale, Monitor, Smartphone, Users
} from 'lucide-react';

export default function TauCloudPage() {
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
                TauCloud
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Private cloud storage that puts you in control. <span className="text-yellow-400 font-semibold">Client-side encryption, zero-knowledge architecture, and complete privacy by design</span>.
              <br />
              <span className="text-lg text-gray-400">1TB Free Storage • 100% Encrypted • Zero Data Access</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy by Design Section */}
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
                Privacy by Design
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every feature is built with your <span className="text-yellow-400 font-semibold">privacy and security as the foundation</span>.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Lock,
                title: "Client-Side Encryption",
                description: "Your files are encrypted on your device before upload. We can't see your data even if we wanted to."
              },
              {
                icon: Eye,
                title: "Zero-Knowledge Storage",
                description: "End-to-end encryption ensures your files remain private. Only you have the keys to decrypt them."
              },
              {
                icon: Shield,
                title: "No Data Mining",
                description: "We don't scan, analyze, or monetize your files. Your privacy is absolute and uncompromised."
              },
              {
                icon: Globe,
                title: "Open Standards",
                description: "Built on WebDAV and S3 standards. Access your files from any compatible client or app."
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
              <Cloud className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Simple, secure, and private file storage in three easy steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload",
                description: "Upload your files through our secure web interface or compatible apps with automatic encryption.",
                icon: Upload
              },
              {
                step: "2",
                title: "Encrypt",
                description: "Files are encrypted on your device before being stored on our servers. We never see your data.",
                icon: Lock
              },
              {
                step: "3",
                title: "Access",
                description: "Access your files anywhere, anytime, with complete privacy and security protection.",
                icon: Download
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

      {/* Features Section */}
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
              <Database className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need for secure, private cloud storage.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Easy File Upload",
                description: "Drag and drop files or use our secure web interface. Support for all file types and sizes."
              },
              {
                icon: Download,
                title: "Instant Sync",
                description: "Your files sync instantly across all your devices. Access your data anywhere, anytime."
              },
              {
                icon: Shield,
                title: "End-to-End Encryption",
                description: "Military-grade encryption protects your files. Only you have the keys to decrypt them."
              },
              {
                icon: Globe,
                title: "Cross-Platform Access",
                description: "Access your files from any device with our web interface or compatible mobile apps."
              },
              {
                icon: Users,
                title: "Secure Sharing",
                description: "Share files securely with end-to-end encryption. Control who can access your shared content."
              },
              {
                icon: Database,
                title: "Version History",
                description: "Keep track of file changes with automatic versioning. Restore previous versions anytime."
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

      {/* Storage Plans Section */}
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
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Storage Plans
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the perfect plan for your privacy-first cloud storage needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                storage: "1TB",
                price: "$0",
                period: "forever",
                features: [
                  "1TB encrypted storage",
                  "End-to-end encryption",
                  "Cross-platform sync",
                  "Basic sharing",
                  "Version history"
                ],
                recommended: false
              },
              {
                name: "Pro",
                storage: "10TB",
                price: "$9",
                period: "month",
                features: [
                  "10TB encrypted storage",
                  "Advanced sharing controls",
                  "Priority support",
                  "Extended version history",
                  "API access"
                ],
                recommended: true
              },
              {
                name: "Enterprise",
                storage: "Unlimited",
                price: "Custom",
                period: "contact us",
                features: [
                  "Unlimited storage",
                  "Custom integrations",
                  "Dedicated support",
                  "Advanced security",
                  "SLA guarantee"
                ],
                recommended: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-8 bg-gray-900/30 backdrop-blur-sm border rounded-2xl hover:border-yellow-400/30 transition-all duration-300 ${
                  plan.recommended ? 'border-yellow-400/50 ring-2 ring-yellow-400/20' : 'border-gray-800'
                }`}
              >
                {plan.recommended && (
                  <div className="text-center mb-4">
                    <span className="px-3 py-1 bg-yellow-400 text-black text-sm font-semibold rounded-full">Recommended</span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-yellow-400 mb-2">{plan.storage}</div>
                  <div className="text-gray-300">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-lg">/{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                  plan.recommended
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg hover:shadow-yellow-400/25'
                    : 'border-2 border-gray-600 text-gray-300 hover:border-yellow-400/50 hover:text-yellow-400'
                }`}>
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
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
              <Cloud className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Start Your Private Cloud
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Take control of your data with the most secure and private cloud storage available.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300">
                Get Started Free
              </button>
              <button className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-xl font-semibold hover:border-yellow-400/50 hover:text-yellow-400 transition-all duration-300">
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