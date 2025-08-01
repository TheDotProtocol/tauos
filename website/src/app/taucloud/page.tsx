'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud,
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
  Folder,
  Image,
  Music,
  Video,
  Archive
} from 'lucide-react';

export default function TauCloudPage() {
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-purple-400" />,
      title: "Client-Side Encryption",
      description: "Files are encrypted before they reach our servers"
    },
    {
      icon: <EyeOff className="w-6 h-6 text-purple-400" />,
      title: "Zero-Knowledge Privacy",
      description: "We can't see your files, even if we wanted to"
    },
    {
      icon: <Download className="w-6 h-6 text-purple-400" />,
      title: "Self-Host Option",
      description: "Deploy on your own infrastructure for maximum control"
    },
    {
      icon: <Globe2 className="w-6 h-6 text-purple-400" />,
      title: "Cross-Platform Sync",
      description: "Access your files from any device, anywhere"
    }
  ];

  const storagePlans = [
    {
      name: "Free",
      storage: "5 GB",
      price: "$0",
      features: ["Client-side encryption", "Zero-knowledge privacy", "Cross-platform sync", "Basic support"]
    },
    {
      name: "Pro",
      storage: "100 GB",
      price: "$5/month",
      features: ["Everything in Free", "Advanced sharing", "Version history", "Priority support"]
    },
    {
      name: "Enterprise",
      storage: "1 TB",
      price: "$20/month",
      features: ["Everything in Pro", "Custom domains", "Admin dashboard", "Dedicated support"]
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
                  <Cloud className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TauCloud</span>
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
                Welcome to TauCloud
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Private, Secure Cloud Storage for Everyone
              </p>
              <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                Store your files with complete privacy. TauCloud uses client-side encryption 
                and zero-knowledge architecture to ensure your data stays yours.
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
                View Plans
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
              Why Choose TauCloud?
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
              See TauCloud in Action
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the privacy-first cloud storage interface designed for complete control
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* TauCloud Interface Screenshot */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Cloud className="w-5 h-5" />
                    <span className="font-bold text-lg">TauCloud</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Encrypted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">2.1 GB / 5 GB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Interface */}
              <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-gray-50 border-r border-gray-200">
                  <div className="p-4">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium mb-4">
                      Upload Files
                    </button>
                    <nav className="space-y-2">
                      <a href="#" className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 text-blue-700">
                        <Folder className="w-4 h-4" />
                        <span>Files</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                        <Image className="w-4 h-4" />
                        <span>Photos</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                        <Music className="w-4 h-4" />
                        <span>Music</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                        <Video className="w-4 h-4" />
                        <span>Videos</span>
                      </a>
                    </nav>
                  </div>
                </div>

                {/* File Grid */}
                <div className="flex-1">
                  <div className="border-b border-gray-200">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                            Upload
                          </button>
                          <button className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded text-sm">
                            New Folder
                          </button>
                        </div>
                        <div className="text-sm text-gray-500">
                          2.1 GB of 5 GB used
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg border-2 border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <div className="text-center">
                          <div className="flex justify-center mb-3">
                            <FileText className="w-8 h-8 text-blue-500" />
                          </div>
                          <div className="flex items-center justify-center mb-2">
                            <span className="text-sm font-medium text-gray-900 truncate max-w-full">
                              TauOS Documentation.pdf
                            </span>
                            <Shield className="w-4 h-4 text-green-500 ml-1" />
                          </div>
                          <p className="text-xs text-gray-500">2.3 MB</p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg border-2 border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <div className="text-center">
                          <div className="flex justify-center mb-3">
                            <Folder className="w-8 h-8 text-blue-500" />
                          </div>
                          <div className="flex items-center justify-center mb-2">
                            <span className="text-sm font-medium text-gray-900 truncate max-w-full">
                              Project Screenshots
                            </span>
                            <Shield className="w-4 h-4 text-green-500 ml-1" />
                          </div>
                          <p className="text-xs text-gray-500">15 items</p>
                          <p className="text-xs text-gray-400">1 day ago</p>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg border-2 border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <div className="text-center">
                          <div className="flex justify-center mb-3">
                            <Image className="w-8 h-8 text-green-500" />
                          </div>
                          <div className="flex items-center justify-center mb-2">
                            <span className="text-sm font-medium text-gray-900 truncate max-w-full">
                              vacation-photos.jpg
                            </span>
                            <Shield className="w-4 h-4 text-green-500 ml-1" />
                          </div>
                          <p className="text-xs text-gray-500">4.1 MB</p>
                          <p className="text-xs text-gray-400">3 days ago</p>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg border-2 border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <div className="text-center">
                          <div className="flex justify-center mb-3">
                            <FileText className="w-8 h-8 text-blue-500" />
                          </div>
                          <div className="flex items-center justify-center mb-2">
                            <span className="text-sm font-medium text-gray-900 truncate max-w-full">
                              presentation.pptx
                            </span>
                            <Shield className="w-4 h-4 text-green-500 ml-1" />
                          </div>
                          <p className="text-xs text-gray-500">8.7 MB</p>
                          <p className="text-xs text-gray-400">1 week ago</p>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg border-2 border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <div className="text-center">
                          <div className="flex justify-center mb-3">
                            <Music className="w-8 h-8 text-purple-500" />
                          </div>
                          <div className="flex items-center justify-center mb-2">
                            <span className="text-sm font-medium text-gray-900 truncate max-w-full">
                              Music Collection
                            </span>
                            <Shield className="w-4 h-4 text-green-500 ml-1" />
                          </div>
                          <p className="text-xs text-gray-500">127 items</p>
                          <p className="text-xs text-gray-400">2 weeks ago</p>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg border-2 border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <div className="text-center">
                          <div className="flex justify-center mb-3">
                            <Archive className="w-8 h-8 text-orange-500" />
                          </div>
                          <div className="flex items-center justify-center mb-2">
                            <span className="text-sm font-medium text-gray-900 truncate max-w-full">
                              backup-2025.zip
                            </span>
                            <Shield className="w-4 h-4 text-green-500 ml-1" />
                          </div>
                          <p className="text-xs text-gray-500">156 MB</p>
                          <p className="text-xs text-gray-400">1 month ago</p>
                        </div>
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
                <h3 className="text-lg font-semibold mb-2">Client-Side Encryption</h3>
                <p className="text-gray-400 text-sm">Files encrypted before upload</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <EyeOff className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Zero-Knowledge</h3>
                <p className="text-gray-400 text-sm">We can't see your files</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <Lock className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Complete Control</h3>
                <p className="text-gray-400 text-sm">Your data, your rules</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Storage Plans Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Start free and upgrade as you grow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storagePlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-gray-800 rounded-lg p-8 ${
                  plan.name === "Pro" ? "ring-2 ring-purple-500" : ""
                }`}
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-purple-400 mb-2">{plan.price}</div>
                  <div className="text-gray-400">{plan.storage} storage</div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  plan.name === "Pro" 
                    ? "bg-purple-600 hover:bg-purple-700 text-white" 
                    : "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                }`}>
                  {plan.name === "Free" ? "Get Started" : "Choose Plan"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* File Types Preview */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Store Everything Securely
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              All your files, encrypted and synced across devices
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Folder className="w-12 h-12 text-blue-400" />, name: "Documents", desc: "PDFs, Word docs, spreadsheets" },
              { icon: <Image className="w-12 h-12 text-green-400" />, name: "Photos", desc: "High-resolution images and albums" },
              { icon: <Music className="w-12 h-12 text-purple-400" />, name: "Music", desc: "Your music library, anywhere" },
              { icon: <Video className="w-12 h-12 text-red-400" />, name: "Videos", desc: "HD videos and movies" }
            ].map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  {type.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{type.name}</h3>
                <p className="text-gray-400 text-sm">{type.desc}</p>
              </motion.div>
            ))}
          </div>
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
              <p className="text-gray-400">Join thousands of users who have taken control of their data privacy</p>
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
                <Cloud className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold">TauCloud</span>
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