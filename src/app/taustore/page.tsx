'use client';

import AppShell from '@/components/apps/AppShell';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Star, Download, Shield, Search, Filter, 
  Grid, List, Heart, Eye, CheckCircle, AlertCircle, 
  BarChart3, Settings, Plus, Edit3, Trash2, Users, 
  Smartphone, Monitor, Tablet, Zap, Key, Database, ArrowRight, ArrowLeft,
  Globe, Lock, Award, Code, Building, Target, Mail, Upload
} from 'lucide-react';

export default function TauStorePage() {
  return (
    <AppShell
      title="Tau Store"
      subtitle="Curated, privacy-scored apps for Tau OS."
      variant="marketing"
    >
      {/* Featured Apps Section */}
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
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Featured Apps
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the most popular privacy-first applications in our store.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📧",
                title: "TauMail",
                category: "Productivity",
                description: "Secure email client with end-to-end encryption",
                rating: 4.9,
                downloads: "100%",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: "☁️",
                title: "TauCloud",
                category: "Storage",
                description: "Private cloud storage with zero-knowledge encryption",
                rating: 4.8,
                downloads: "98%",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: "🌐",
                title: "TauBrowser",
                category: "Internet",
                description: "Privacy-first web browser with built-in ad blocking",
                rating: 4.7,
                downloads: "95%",
                color: "from-purple-500 to-indigo-500"
              }
            ].map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{app.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{app.title}</h3>
                  <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 text-sm rounded-full">{app.category}</span>
                </div>
                
                <p className="text-gray-300 text-center mb-6">{app.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-semibold">{app.rating}</span>
                  </div>
                  <div className="text-gray-400 text-sm">{app.downloads} Downloads</div>
                </div>
                
                <button className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 group-hover:scale-105">
                  Download
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose TauStore Section */}
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
              <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Why Choose TauStore?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're building the future of app distribution with <span className="text-yellow-400 font-semibold">privacy and security at its core</span>.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Privacy-First Apps",
                description: "Every app is vetted for privacy and security. No data mining, no tracking, no compromises."
              },
              {
                icon: CheckCircle,
                title: "Verified Developers",
                description: "All developers are verified and their apps are thoroughly audited for security and privacy."
              },
              {
                icon: Star,
                title: "Quality Guaranteed",
                description: "Only the highest quality apps make it to our store. Every app is tested and reviewed."
              },
              {
                icon: Download,
                title: "Instant Access",
                description: "Download and install apps instantly with our secure, privacy-focused distribution system."
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

      {/* App Categories Section */}
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
              <Grid className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                App Categories
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Browse apps by category and find exactly what you need.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { icon: "📧", name: "Email", count: "12" },
              { icon: "☁️", name: "Storage", count: "8" },
              { icon: "🌐", name: "Browser", count: "5" },
              { icon: "📱", name: "Mobile", count: "25" },
              { icon: "🔒", name: "Security", count: "18" },
              { icon: "⚡", name: "Productivity", count: "32" },
              { icon: "🎨", name: "Design", count: "15" },
              { icon: "🎵", name: "Media", count: "20" },
              { icon: "📊", name: "Business", count: "14" },
              { icon: "🎮", name: "Games", count: "28" },
              { icon: "🔧", name: "Tools", count: "22" },
              { icon: "📚", name: "Education", count: "16" }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300 text-center cursor-pointer group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
                <p className="text-gray-400 text-sm">{category.count} apps</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
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
              <Code className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                For Developers
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Publish your privacy-first apps and reach users who value their digital freedom.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Easy Publishing",
                description: "Submit your apps through our streamlined review process. Get your privacy-first apps to users quickly and securely."
              },
              {
                icon: Shield,
                title: "Privacy Standards",
                description: "We help you meet the highest privacy standards. Our guidelines ensure your apps protect user data and respect privacy."
              },
              {
                icon: Users,
                title: "Growing Community",
                description: "Join a community of developers who are building the future of privacy-first computing. Connect, collaborate, and grow together."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <feature.icon className="w-16 h-16 text-yellow-400 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
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
              <ShoppingBag className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Get Started Today
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join thousands of users who have already discovered the power of privacy-first apps.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300">
                Browse Apps
              </button>
              <button className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-xl font-semibold hover:border-yellow-400/50 hover:text-yellow-400 transition-all duration-300">
                Developer Portal
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </AppShell>
  );
}
