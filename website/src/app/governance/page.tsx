'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  GitBranch, 
  Heart, 
  Star, 
  Code, 
  Shield, 
  Globe, 
  Zap,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  MessageCircle,
  Vote,
  FileText,
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function GovernancePage() {
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
                { href: '/governance', label: 'Governance', active: true },
                { href: '/careers', label: 'Careers' },
                { href: '/legal', label: 'Legal' },
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
              <span className="text-white">TauOS</span>
              <br />
              <span className="tau-gradient">Collective</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Welcome to the TauOS Collective, where the future of computing is shaped by the community, 
              for the community. Join us in building the most privacy-focused, user-friendly operating system.
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>1,247 Contributors</span>
              </div>
              <div className="flex items-center space-x-2">
                <GitBranch className="w-5 h-5" />
                <span>2,891 Commits</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>15.2k Stars</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Constitution Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Our Constitution</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The living document that guides our community and defines our core principles.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Privacy First",
                description: "User privacy is non-negotiable. Every feature, every line of code must respect user autonomy."
              },
              {
                icon: Globe,
                title: "Open Source",
                description: "Transparency and collaboration are fundamental. All code is open for review and contribution."
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Decisions are made by the community, not by a single entity. Your voice matters."
              },
              {
                icon: Zap,
                title: "Performance",
                description: "Speed and efficiency are core values. TauOS should run smoothly on any hardware."
              },
              {
                icon: Heart,
                title: "User Experience",
                description: "Beautiful, intuitive design that delights users without compromising functionality."
              },
              {
                icon: Code,
                title: "Innovation",
                description: "Pushing the boundaries of what's possible while maintaining stability and security."
              }
            ].map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-strong p-8 rounded-2xl border border-white/10"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <principle.icon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">{principle.title}</h3>
                <p className="text-gray-300 leading-relaxed">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contributor Guidelines */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Getting Started</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to contribute? Here's how to get involved in the TauOS community.
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
                <h3 className="text-2xl font-bold mb-6 text-purple-400">Code of Conduct</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Be Respectful</h4>
                      <p className="text-gray-300 text-sm">Treat all community members with respect and kindness.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Be Inclusive</h4>
                      <p className="text-gray-300 text-sm">Welcome contributors from all backgrounds and experience levels.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Be Constructive</h4>
                      <p className="text-gray-300 text-sm">Provide helpful feedback and focus on solutions.</p>
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
                <h3 className="text-2xl font-bold mb-6 text-blue-400">Recognition System</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <div>
                      <h4 className="font-semibold text-white">Core Contributors</h4>
                      <p className="text-gray-300 text-sm">Long-term contributors with significant impact</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-white">Innovation Awards</h4>
                      <p className="text-gray-300 text-sm">Recognition for breakthrough contributions</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <div>
                      <h4 className="font-semibold text-white">Rising Stars</h4>
                      <p className="text-gray-300 text-sm">New contributors showing exceptional promise</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Roadmap */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Community Roadmap</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our quarterly milestones and current focus areas for the TauOS project.
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                quarter: "Q1 2025",
                title: "Foundation & Core",
                description: "Establishing the core architecture and basic functionality",
                status: "Completed",
                color: "text-green-400"
              },
              {
                quarter: "Q2 2025",
                title: "Ecosystem Development",
                description: "Building TauMail, TauCloud, and TauStore applications",
                status: "In Progress",
                color: "text-blue-400"
              },
              {
                quarter: "Q3 2025",
                title: "Mobile & AI",
                description: "Mobile development and AI integration features",
                status: "Planned",
                color: "text-purple-400"
              },
              {
                quarter: "Q4 2025",
                title: "Enterprise & Scale",
                description: "Enterprise features and large-scale deployment",
                status: "Planned",
                color: "text-yellow-400"
              }
            ].map((milestone, index) => (
              <motion.div
                key={milestone.quarter}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-strong p-8 rounded-2xl border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-6 h-6 text-purple-400" />
                    <span className="text-lg font-semibold text-white">{milestone.quarter}</span>
                  </div>
                  <span className={`text-sm font-semibold ${milestone.color}`}>
                    {milestone.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{milestone.title}</h3>
                <p className="text-gray-300">{milestone.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Voting System */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Governance System</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              How decisions are made in the TauOS community through transparent voting and discussion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "Discussion Period",
                description: "Proposals are discussed for 2 weeks before voting begins"
              },
              {
                icon: Vote,
                title: "Community Vote",
                description: "All contributors can vote on proposals based on their contribution level"
              },
              {
                icon: FileText,
                title: "Implementation",
                description: "Approved proposals are implemented by the community"
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-strong p-8 rounded-2xl text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Proposals */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Current Proposals</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Active governance proposals that need your input and vote.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                title: "Mobile App Development",
                description: "Proposal to develop native mobile applications for TauOS ecosystem",
                status: "Voting",
                votes: "1,247 votes",
                timeLeft: "3 days left"
              },
              {
                title: "AI Assistant Integration",
                description: "Integrate advanced AI capabilities into the TauOS desktop environment",
                status: "Discussion",
                votes: "892 votes",
                timeLeft: "1 week left"
              },
              {
                title: "Enterprise Features",
                description: "Add enterprise-grade security and management features",
                status: "Draft",
                votes: "156 votes",
                timeLeft: "2 weeks left"
              }
            ].map((proposal, index) => (
              <motion.div
                key={proposal.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-strong p-6 rounded-2xl border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{proposal.title}</h3>
                    <p className="text-gray-300 text-sm mb-3">{proposal.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{proposal.votes}</span>
                      <span>{proposal.timeLeft}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      proposal.status === 'Voting' ? 'bg-green-500/20 text-green-400' :
                      proposal.status === 'Discussion' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {proposal.status}
                    </span>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105">
                      Vote
                    </button>
                  </div>
                </div>
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
            <h2 className="text-3xl font-bold mb-6">Ready to Contribute?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the TauOS Collective and help shape the future of privacy-first computing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-lg font-semibold flex items-center space-x-3 transition-all duration-300 hover:scale-105">
                <Code className="w-5 h-5" />
                <span>Start Contributing</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 border border-white/20 rounded-xl text-lg font-semibold flex items-center space-x-3 transition-all duration-300 hover:bg-white/10">
                <MessageCircle className="w-5 h-5" />
                <span>Join Discussion</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 