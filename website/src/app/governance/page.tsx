'use client';

import { motion } from 'framer-motion';
import {
  Building, Users, Shield, Eye, Heart, Target, Zap, Globe,
  ArrowRight, Mail, ExternalLink, CheckCircle, Star,
  GitBranch, Code, Server, Database, Smartphone, Monitor,
  Tablet, Award, TrendingUp, Clock, Calendar, Scale, Lock,
  FileText, GitCommit, GitMerge, GitPullRequest
} from 'lucide-react';

export default function GovernancePage() {
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
              <a href="/governance" className="text-yellow-400 font-semibold">Governance</a>
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
                Governance
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              The Tau Project is built on <span className="text-yellow-400 font-semibold">trust, transparency, and independence</span>.
              <br />
              To ensure long-term sustainability and openness, governance is split between <span className="text-yellow-400 font-semibold">The Tau Foundation</span> and <span className="text-yellow-400 font-semibold">Tau LLC</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Tau Foundation Section */}
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
              <Building className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                The Tau Foundation
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The Tau Foundation is a <span className="text-yellow-400 font-semibold">non-profit entity</span>, modeled after the Linux Foundation, that safeguards the vision of Tau OS.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Community Oversight",
                description: "Ensuring contributions remain open, transparent, and community-driven."
              },
              {
                icon: Code,
                title: "Open Standards",
                description: "Defining and maintaining Tau's technical direction, free from corporate lock-in."
              },
              {
                icon: Scale,
                title: "Neutral Governance",
                description: "No single company, government, or individual can dominate decision-making."
              },
              {
                icon: Eye,
                title: "Transparency",
                description: "Publishing policies, sub-processor lists, and open meeting notes."
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              The foundation acts as the <span className="text-yellow-400 font-semibold">guardian of the Tau ecosystem</span>, ensuring Tau OS remains sovereign and open to all.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tau LLC Section */}
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
              <Code className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Tau LLC
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Tau LLC is the <span className="text-yellow-400 font-semibold">for-profit arm</span> that builds commercial value while maintaining community alignment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Server,
                title: "Commercial Applications",
                description: "Builds commercial applications and enterprise solutions on Tau OS."
              },
              {
                icon: Users,
                title: "Professional Support",
                description: "Provides paid support, consulting, and integrations for businesses."
              },
              {
                icon: TrendingUp,
                title: "Research & Development",
                description: "Helps fund ongoing research and development of the Tau ecosystem."
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Tau LLC operates <span className="text-yellow-400 font-semibold">under the oversight of the Tau Foundation</span> to maintain alignment with community principles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Governance Model Section */}
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
                Governance Model
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: GitCommit,
                title: "Technical Steering Committee (TSC)",
                description: "Composed of senior contributors and security experts. Guides technical direction, system architecture, and feature development."
              },
              {
                icon: Users,
                title: "Community Board",
                description: "Represents developers, users, and partners. Ensures inclusivity and fairness in governance."
              },
              {
                icon: Award,
                title: "Advisory Council",
                description: "External experts in law, ethics, and technology. Provides independent oversight and accountability."
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
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency & Legal Section */}
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
                Transparency & Legal
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              "All governance documents, Data Protection Addendum (DPA), and Sub-processor Lists are public.",
              "Foundation meetings are documented and published openly.",
              "Tau Foundation ensures Tau OS is legally incorporated, transparent, and accountable to its users."
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

      {/* Why This Matters Section */}
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
              <Globe className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Why This Matters
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Most operating systems are controlled by a single corporation with closed decision-making. Tau flips that model:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Shield,
                title: "The Foundation protects users.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: TrendingUp,
                title: "The Company builds value.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Users,
                title: "The Community drives innovation.",
                color: "from-purple-500 to-indigo-500"
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
                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
              <p className="text-2xl md:text-3xl font-bold text-white">
                Together, this ensures Tau is <span className="text-yellow-400">built to last for generations, not quarterly profits</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <a
              href="mailto:verify@tauos.org"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              <span>Learn more or get involved</span>
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