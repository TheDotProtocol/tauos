'use client';

import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import { motion } from 'framer-motion';
import {
  Newspaper, Download, Mail, ExternalLink, Calendar, Users, Globe, Award,
  ArrowRight, CheckCircle, Star, Zap, Shield, Lock, Eye, Code, Building, FileText
} from 'lucide-react';

export default function PressPage() {
  return (
    <MarketingPageShell
      title="Press"
      subtitle="News, media assets, and announcements from Tau Core Inc."
    >
      {/* Press Kit Section */}
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
              <Download className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Press Kit
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Download our complete press kit with logos, images, and media resources.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Download,
                title: "Logo Pack",
                description: "High-resolution logos in various formats",
                size: "25 MB"
              },
              {
                icon: Globe,
                title: "Screenshots",
                description: "UI screenshots and interface images",
                size: "50 MB"
              },
              {
                icon: Users,
                title: "Team Photos",
                description: "Official team and leadership photos",
                size: "30 MB"
              },
              {
                icon: FileText,
                title: "Brand Guidelines",
                description: "Complete brand and style guidelines",
                size: "15 MB"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300 group cursor-pointer"
              >
                <item.icon className="w-12 h-12 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300 mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{item.size}</span>
                  <div className="flex items-center text-yellow-400 group-hover:text-yellow-300 transition-colors">
                    <span className="text-sm font-medium">Download</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases Section */}
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
              <Newspaper className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Press Releases
              </span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                title: "Tau OS Launches World's First Privacy-First Operating System",
                date: "September 11, 2025",
                summary: "Tau OS officially launches with complete email, cloud, and identity services, offering users a truly private computing experience.",
                category: "Product Launch"
              },
              {
                title: "Tau Core Inc. Announces Open Source Governance Model",
                date: "August 15, 2025",
                summary: "Tau Core Inc. reveals its governance structure, ensuring community-driven development and transparent decision-making.",
                category: "Governance"
              },
              {
                title: "Tau OS Partners with Leading Privacy Organizations",
                date: "July 20, 2025",
                summary: "Strategic partnerships with privacy advocacy groups to promote digital rights and user sovereignty.",
                category: "Partnerships"
              },
              {
                title: "Tau OS Achieves 99.9% Uptime in Beta Testing",
                date: "June 10, 2025",
                summary: "Comprehensive beta testing shows exceptional reliability and performance across all Tau OS services.",
                category: "Performance"
              }
            ].map((release, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 text-sm rounded-full">{release.category}</span>
                      <span className="text-gray-400 text-sm">{release.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{release.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{release.summary}</p>
                  </div>
                  <ExternalLink className="w-6 h-6 text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage Section */}
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
                Media Coverage
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              What the media is saying about Tau OS and the privacy-first computing movement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                outlet: "TechCrunch",
                title: "Tau OS Challenges Big Tech with Privacy-First OS",
                date: "September 10, 2025",
                excerpt: "A new operating system that puts privacy first could be the answer to growing concerns about data surveillance."
              },
              {
                outlet: "Wired",
                title: "The Operating System That Refuses to Spy on You",
                date: "September 8, 2025",
                excerpt: "Tau OS represents a fundamental shift in how we think about computing and digital privacy."
              },
              {
                outlet: "Ars Technica",
                title: "Tau OS: A Complete Privacy-First Computing Platform",
                date: "September 5, 2025",
                excerpt: "From email to cloud storage, Tau OS offers a complete alternative to surveillance capitalism."
              }
            ].map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-yellow-400 font-semibold">{article.outlet}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{article.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{article.excerpt}</p>
                <p className="text-gray-400 text-xs">{article.date}</p>
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
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Mail className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Press Contact
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              For media inquiries, interview requests, or press materials, contact our press team.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: Mail,
                title: "Press Inquiries",
                description: "General press questions and interview requests",
                contact: "press@tauos.org",
                responseTime: "24 hours"
              },
              {
                icon: Users,
                title: "Media Relations",
                description: "Partnership opportunities and media collaborations",
                contact: "media@tauos.org",
                responseTime: "48 hours"
              }
            ].map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <contact.icon className="w-16 h-16 text-yellow-400 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">{contact.title}</h3>
                <p className="text-gray-300 leading-relaxed mb-4">{contact.description}</p>
                <div className="space-y-2">
                  <p className="text-yellow-400 font-semibold">{contact.contact}</p>
                  <p className="text-sm text-gray-400">Response time: {contact.responseTime}</p>
                </div>
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
            <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Press Office</h3>
                  <p className="text-gray-300 mb-2">Tau Core Inc. & Tau Core Inc.</p>
                  <p className="text-gray-300 mb-2">2261 Market St, San Francisco, CA 94114</p>
                  <p className="text-gray-300 mb-2">Phone: +1 1800 Tau OS</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">International</h3>
                  <p className="text-gray-300 mb-2">Malaysia Office</p>
                  <p className="text-gray-300 mb-2">IB Tower, Level 33, Kuala Lumpur</p>
                  <p className="text-gray-300 mb-2">Phone: +60 178446206</p>
                </div>
              </div>
            </div>

            <a
              href="mailto:press@tauos.org"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Press Team</span>
            </a>
          </motion.div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
