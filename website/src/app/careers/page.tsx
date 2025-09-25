'use client';

import { motion } from 'framer-motion';
import {
  Users, Heart, Zap, Globe, Code, Palette, Shield, Rocket,
  CheckCircle, Clock, MapPin, DollarSign, Award, MessageCircle,
  ArrowRight, Mail, ExternalLink, Star, Building, Target
} from 'lucide-react';

export default function CareersPage() {
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
                Careers
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Join us in building the <span className="text-yellow-400 font-semibold">future of privacy-first computing</span>.
              <br />
              Help us create technology that truly serves humanity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Work With Us Section */}
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
              <Heart className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Why Work With Us
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're not just building software—we're <span className="text-yellow-400 font-semibold">fighting for digital freedom</span>.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: "Meaningful Mission",
                description: "Work on technology that protects privacy and empowers users worldwide."
              },
              {
                icon: Globe,
                title: "Global Impact",
                description: "Your work affects millions of users and shapes the future of computing."
              },
              {
                icon: Code,
                title: "Open Source",
                description: "Contribute to open-source projects that anyone can audit and improve."
              },
              {
                icon: Users,
                title: "Great Team",
                description: "Work with passionate, talented people who share your values."
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

      {/* Benefits Section */}
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
              <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Benefits & Perks
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We believe in taking care of our team with comprehensive benefits and a great work environment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: "Competitive Salary",
                description: "Market-rate compensation with equity options and performance bonuses."
              },
              {
                icon: Clock,
                title: "Flexible Hours",
                description: "Work when you're most productive with flexible scheduling and remote options."
              },
              {
                icon: Shield,
                title: "Health & Wellness",
                description: "Comprehensive health insurance, mental health support, and wellness programs."
              },
              {
                icon: Code,
                title: "Learning Budget",
                description: "Annual budget for conferences, courses, and professional development."
              },
              {
                icon: Globe,
                title: "Remote Work",
                description: "Work from anywhere with full remote support and co-working allowances."
              },
              {
                icon: Heart,
                title: "Work-Life Balance",
                description: "Unlimited PTO, sabbaticals, and policies that support your personal life."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <benefit.icon className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
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
              <Rocket className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Open Positions
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join our team and help build the future of privacy-first computing.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                title: "Senior Software Engineer - Core Systems",
                department: "Engineering",
                location: "Remote / San Francisco",
                type: "Full-time",
                description: "Build the core operating system components and low-level infrastructure that powers TauOS."
              },
              {
                title: "Privacy Engineer - Security & Cryptography",
                department: "Security",
                location: "Remote / San Francisco",
                type: "Full-time",
                description: "Design and implement privacy-preserving technologies and cryptographic systems."
              },
              {
                title: "Frontend Developer - User Experience",
                department: "Product",
                location: "Remote / San Francisco",
                type: "Full-time",
                description: "Create beautiful, intuitive user interfaces for all TauOS applications and services."
              },
              {
                title: "DevOps Engineer - Infrastructure",
                department: "Engineering",
                location: "Remote / San Francisco",
                type: "Full-time",
                description: "Build and maintain the infrastructure that keeps TauOS services running smoothly."
              },
              {
                title: "Community Manager - Developer Relations",
                department: "Community",
                location: "Remote / San Francisco",
                type: "Full-time",
                description: "Build and nurture our developer community, organize events, and create educational content."
              },
              {
                title: "Product Manager - Privacy Features",
                department: "Product",
                location: "Remote / San Francisco",
                type: "Full-time",
                description: "Define and prioritize privacy features that protect users while maintaining usability."
              }
            ].map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">{position.title}</h3>
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 text-sm rounded-full">{position.department}</span>
                      <span className="text-gray-400 text-sm flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {position.location}
                      </span>
                      <span className="text-gray-400 text-sm">{position.type}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{position.description}</p>
                  </div>
                  <ExternalLink className="w-6 h-6 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
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
                Our Culture
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're building more than software—we're building a <span className="text-yellow-400 font-semibold">movement for digital freedom</span>.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Privacy First",
                description: "Every decision we make is evaluated through the lens of user privacy and data protection. We don't just talk about privacy—we live it."
              },
              {
                icon: Globe,
                title: "Open & Transparent",
                description: "We believe in open communication, transparent processes, and making our work accessible to everyone. No hidden agendas, no corporate politics."
              },
              {
                icon: Heart,
                title: "Mission-Driven",
                description: "We're here because we believe technology should serve humanity, not exploit it. Every team member is passionate about our mission."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <value.icon className="w-16 h-16 text-yellow-400 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process Section */}
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
              <CheckCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Application Process
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our hiring process is designed to be fair, transparent, and respectful of your time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Apply",
                description: "Submit your application with resume and cover letter through our careers portal."
              },
              {
                step: "2",
                title: "Initial Review",
                description: "Our team reviews your application and reaches out within 5 business days."
              },
              {
                step: "3",
                title: "Interview",
                description: "Technical and cultural fit interviews with team members and leadership."
              },
              {
                step: "4",
                title: "Decision",
                description: "We make a decision and extend an offer to successful candidates."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 bg-yellow-400 text-black rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
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
              <Mail className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Ready to Join Us?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Don't see a position that fits? We're always looking for talented people who share our mission.
            </p>
            
            <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">General Applications</h3>
                  <p className="text-gray-300 mb-2">Email: <a href="mailto:careers@tauos.org" className="text-yellow-400 hover:text-yellow-300">careers@tauos.org</a></p>
                  <p className="text-gray-300 mb-2">Phone: +1 1800 TauOS</p>
                  <p className="text-gray-300">Address: 2261 Market St, San Francisco, CA 94114</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Internships</h3>
                  <p className="text-gray-300 mb-2">Email: <a href="mailto:internships@tauos.org" className="text-yellow-400 hover:text-yellow-300">internships@tauos.org</a></p>
                  <p className="text-gray-300 mb-2">Malaysia: IB Tower, Level 33, Kuala Lumpur</p>
                  <p className="text-gray-300">Phone: +60 178446206</p>
                </div>
              </div>
            </div>

            <a
              href="mailto:careers@tauos.org"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              <span>Apply Now</span>
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