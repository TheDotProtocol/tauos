'use client';

import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import { motion } from 'framer-motion';
import {
  HelpCircle, Search, Mail, MessageCircle, Book, FileText, Users, Globe,
  ArrowRight, ExternalLink, CheckCircle, Star, Zap, Shield, Lock,
  Monitor, Smartphone, Download, Settings, Bug, Lightbulb
} from 'lucide-react';

export default function HelpPage() {
  return (
    <MarketingPageShell
      title="Help Center"
      subtitle="Guides and answers for Tau OS and TAU CORE apps."
    >
      {/* Quick Help Section */}
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
              <HelpCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Quick Help
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get started quickly with our most common questions and solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Download,
                title: "Installation",
                description: "Download and install TAU CORE™ on your system",
                link: "/#downloads"
              },
              {
                icon: Mail,
                title: "TauMail Setup",
                description: "Set up your @tauos.org email account",
                link: "/taumail"
              },
              {
                icon: Globe,
                title: "TauCloud Access",
                description: "Access your encrypted cloud storage",
                link: "/taucloud"
              },
              {
                icon: Settings,
                title: "Configuration",
                description: "Configure privacy and security settings",
                link: "/settings"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300 group cursor-pointer"
                onClick={() => window.location.href = item.link}
              >
                <item.icon className="w-12 h-12 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300 mb-4">{item.description}</p>
                <div className="flex items-center text-yellow-400 group-hover:text-yellow-300 transition-colors">
                  <span className="text-sm font-medium">Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              <Book className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                question: "How do I install TAU CORE™?",
                answer: "Download the installer for your platform from our downloads page. Run the installer and follow the setup wizard to install TAU CORE™ with all applications."
              },
              {
                question: "Is TAU CORE™ free to use?",
                answer: "Yes, TAU CORE™ is completely free and open-source. We believe privacy should be accessible to everyone, not just those who can afford it."
              },
              {
                question: "How do I create a @tauos.org email?",
                answer: "Visit our TauMail page, click 'Get TAU CORE™ Email', and register with your desired username. Your @tauos.org email will be ready immediately."
              },
              {
                question: "Is my data really private?",
                answer: "Absolutely. We use end-to-end encryption, zero-telemetry architecture, and open-source code. Your data never leaves your control."
              },
              {
                question: "Can I use TAU CORE™ on my existing computer?",
                answer: "Yes! TAU CORE™ can be installed alongside Windows, macOS, or Linux. You can also run it in a virtual machine or as a live system."
              },
              {
                question: "How do I get support?",
                answer: "Contact us at support@tauos.org, join our community forums, or check our documentation. We typically respond within 24 hours."
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
                <h3 className="text-xl font-bold text-white mb-4">{item.question}</h3>
                <p className="text-gray-300 leading-relaxed">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Channels Section */}
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
              <MessageCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Support Channels
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Multiple ways to get help and connect with our community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Mail,
                title: "Email Support",
                description: "Direct support via email for technical issues and questions",
                contact: "support@tauos.org",
                responseTime: "24 hours"
              },
              {
                icon: Users,
                title: "Community Forum",
                description: "Connect with other users and get community-driven help",
                contact: "community.tauos.org",
                responseTime: "Real-time"
              },
              {
                icon: FileText,
                title: "Documentation",
                description: "Comprehensive guides and technical documentation",
                contact: "docs.tauos.org",
                responseTime: "Always available"
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
                <div className="space-y-2">
                  <p className="text-yellow-400 font-semibold">{item.contact}</p>
                  <p className="text-sm text-gray-400">Response time: {item.responseTime}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
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
              <FileText className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Helpful Resources
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              "Installation Guide - Step-by-step installation instructions",
              "User Manual - Complete guide to using TAU CORE™ applications",
              "Security Guide - Best practices for privacy and security",
              "Troubleshooting - Common issues and solutions",
              "API Documentation - For developers and integrations",
              "Video Tutorials - Visual guides for complex procedures"
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
                Still Need Help?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            
            <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">General Support</h3>
                  <p className="text-gray-300 mb-2">Email: <a href="mailto:support@tauos.org" className="text-yellow-400 hover:text-yellow-300">support@tauos.org</a></p>
                  <p className="text-gray-300 mb-2">Phone: +1 1800 TAU CORE™</p>
                  <p className="text-gray-300">Response time: 24 hours</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Technical Issues</h3>
                  <p className="text-gray-300 mb-2">Email: <a href="mailto:tech@tauos.org" className="text-yellow-400 hover:text-yellow-300">tech@tauos.org</a></p>
                  <p className="text-gray-300 mb-2">GitHub: github.com/tauos/issues</p>
                  <p className="text-gray-300">Response time: 48 hours</p>
                </div>
              </div>
            </div>

            <a
              href="mailto:support@tauos.org"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Support</span>
            </a>
          </motion.div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
