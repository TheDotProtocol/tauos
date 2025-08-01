'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail,
  Shield,
  Lock,
  EyeOff,
  Download,
  Globe,
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Globe2,
  FileText,
  Inbox,
  Send,
  Star,
  Archive
} from 'lucide-react';

export default function TauMailPage() {
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-purple-400" />,
      title: "End-to-End Encryption",
      description: "Your emails are encrypted before they leave your device"
    },
    {
      icon: <EyeOff className="w-6 h-6 text-purple-400" />,
      title: "Zero Tracking",
      description: "No tracking pixels, no data mining, complete privacy"
    },
    {
      icon: <Globe2 className="w-6 h-6 text-purple-400" />,
      title: "Custom Domains",
      description: "Use your own domain with full control"
    },
    {
      icon: <Download className="w-6 h-6 text-purple-400" />,
      title: "Self-Host Option",
      description: "Deploy on your own servers for maximum control"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TauMail</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">
                Back to TauOS
              </a>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome to TauMail
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Encrypted, Sovereign Email for Everyone
              </p>
              <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                Take back control of your digital communication. TauMail provides end-to-end encryption, 
                zero tracking, and complete privacy - just like email should be.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-medium text-lg flex items-center justify-center space-x-2 transition-colors">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-medium text-lg border border-gray-600 transition-colors">
                Use with My Domain
              </button>
            </motion.div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose TauMail?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Built with privacy-first principles and modern security standards
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-700 rounded-lg p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See TauMail in Action
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the privacy-first email interface designed for the modern world
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* TauMail Interface Screenshot */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5" />
                    <span className="font-bold text-lg">TauMail</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Secure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Inbox (3)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Interface */}
              <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-gray-50 border-r border-gray-200">
                  <div className="p-4">
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium mb-4">
                      Compose
                    </button>
                    <nav className="space-y-2">
                      <a href="#" className="flex items-center space-x-3 p-2 rounded-lg bg-red-50 text-red-700">
                        <Inbox className="w-4 h-4" />
                        <span>Inbox</span>
                        <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full">3</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                        <Send className="w-4 h-4" />
                        <span>Sent</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                        <Star className="w-4 h-4" />
                        <span>Starred</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                        <Archive className="w-4 h-4" />
                        <span>Archive</span>
                      </a>
                    </nav>
                  </div>
                </div>

                {/* Email List */}
                <div className="flex-1">
                  <div className="border-b border-gray-200">
                    <div className="p-4">
                      <div className="flex items-center space-x-4">
                        <input type="checkbox" className="rounded" />
                        <button className="text-gray-400 hover:text-gray-600">
                          <Star className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-500">1-3 of 3</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    <div className="p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <input type="checkbox" className="rounded" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">TauOS Team</span>
                            <Shield className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">Welcome to TauMail - Your Privacy-First Email</span>
                          </div>
                          <p className="text-gray-600 text-sm truncate">Welcome to TauMail! Your inbox is now protected with end-to-end encryption...</p>
                        </div>
                        <div className="text-sm text-gray-500">2 hours ago</div>
                      </div>
                    </div>
                    
                    <div className="p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <input type="checkbox" className="rounded" />
                        <Star className="w-4 h-4 text-gray-300" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-600">Security Update</span>
                            <Shield className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">Your Privacy Matters - Zero Tracking Confirmed</span>
                          </div>
                          <p className="text-gray-600 text-sm truncate">Your TauMail account is running with zero telemetry and complete privacy...</p>
                        </div>
                        <div className="text-sm text-gray-500">1 day ago</div>
                      </div>
                    </div>
                    
                    <div className="p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <input type="checkbox" className="rounded" />
                        <Star className="w-4 h-4 text-gray-300" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-600">TauCloud Integration</span>
                            <Shield className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">Seamless File Sharing with TauCloud</span>
                          </div>
                          <p className="text-gray-600 text-sm truncate">Share files securely with your TauCloud integration. All files are encrypted...</p>
                        </div>
                        <div className="text-sm text-gray-500">3 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Indicators */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">End-to-End Encryption</h3>
                <p className="text-gray-400 text-sm">All emails encrypted before transmission</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <EyeOff className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Zero Tracking</h3>
                <p className="text-gray-400 text-sm">No tracking pixels or data mining</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <Lock className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Complete Privacy</h3>
                <p className="text-gray-400 text-sm">Your data stays yours, always</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800 rounded-2xl p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-gray-400">Join thousands of users who have taken control of their email privacy</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors">
                  Create Free Account
                </button>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">Custom Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="yourdomain.com"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium border border-gray-600 transition-colors">
                  Configure Domain
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                By signing up, you agree to our{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold">TauMail</span>
            </div>
            
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="/" className="hover:text-white transition-colors">Back to TauOS</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 