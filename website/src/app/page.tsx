'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  Play,
  Shield,
  Cloud,
  Mail,
  Settings,
  ChevronDown,
  Menu,
  X,
  Check,
  Star,
  Globe,
  Smartphone,
  Monitor,
  Eye,
  Zap,
  Palette,
  Users,
  Lock
} from 'lucide-react';

interface DownloadOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  file: string;
  size: string;
  checksum: string;
  recommended?: boolean;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

export default function TauOSLandingPage() {
  // Debug log to verify deployment
  console.log('TauOS Landing Page loaded successfully!');
  
  // Add a visible debug indicator
  useEffect(() => {
    // Create a debug indicator
    const debugDiv = document.createElement('div');
    debugDiv.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #10b981;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 9999;
      font-family: monospace;
    `;
    debugDiv.textContent = '✅ TauOS Live';
    document.body.appendChild(debugDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
      if (debugDiv.parentNode) {
        debugDiv.parentNode.removeChild(debugDiv);
      }
    }, 5000);
  }, []);
  
  const [detectedOS, setDetectedOS] = useState<string>('');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedDownload, setSelectedDownload] = useState<DownloadOption | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const downloadOptions: DownloadOption[] = [
    {
      id: 'iso',
      name: 'TauOS ISO',
      description: 'Bootable ISO for any computer',
      icon: Monitor,
      file: 'tauos-simple-20250730.iso',
      size: '14.9 MB',
      checksum: 'sha256:abc123...',
      recommended: true
    },
    {
      id: 'mac',
      name: 'macOS Installer',
      description: 'Native macOS application',
      icon: Monitor,
      file: 'TauOS.dmg',
      size: '45.2 MB',
      checksum: 'sha256:def456...'
    },
    {
      id: 'windows',
      name: 'Windows Installer',
      description: 'Windows executable installer',
      icon: Monitor,
      file: 'TauOS-Setup.exe',
      size: '38.7 MB',
      checksum: 'sha256:ghi789...'
    },
    {
      id: 'linux',
      name: 'Linux Installer',
      description: 'Linux package and AppImage',
      icon: Monitor,
      file: 'TauOS-Linux.AppImage',
      size: '52.1 MB',
      checksum: 'sha256:jkl012...'
    }
  ];

  const features: Feature[] = [
    {
      id: 'gui',
      title: 'Fully GUI-Based',
      description: 'No command line. No jargon. Just a clean, intuitive interface that works like magic for both techies and first-timers.',
      icon: Monitor,
      color: 'bg-purple-600'
    },
    {
      id: 'privacy',
      title: 'Privacy by Default',
      description: 'No telemetry. No trackers. TauOS doesn\'t spy on you. Your data stays yours — fully encrypted and fully respected.',
      icon: Shield,
      color: 'bg-green-600'
    },
    {
      id: 'beautiful',
      title: 'Drop-Dead Gorgeous',
      description: 'Dark matte black UI, electric purple highlights, glassmorphism effects, and fluid animations. It doesn\'t just run — it feels alive.',
      icon: Palette,
      color: 'bg-blue-600'
    },
    {
      id: 'fast',
      title: 'Blazing Fast Setup',
      description: 'Install in minutes, not hours. TauOS boots from USB, installs with a couple of clicks, and gets you productive immediately.',
      icon: Zap,
      color: 'bg-yellow-600'
    },
    {
      id: 'ready',
      title: 'Mass Market Ready',
      description: 'From Tau Browser to Tau Mail and TauCloud, all your essentials are ready out-of-the-box — polished, secure, and easy to use.',
      icon: Check,
      color: 'bg-red-600'
    },
    {
      id: 'freedom',
      title: 'Built for a Post-Google World',
      description: 'You don\'t need Big Tech anymore. TauOS is your escape pod — secure, independent, and finally yours.',
      icon: Lock,
      color: 'bg-indigo-600'
    }
  ];

  useEffect(() => {
    // Detect OS for smart download button
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mac')) {
      setDetectedOS('mac');
    } else if (userAgent.includes('windows')) {
      setDetectedOS('windows');
    } else {
      setDetectedOS('linux');
    }
  }, []);

  const getRecommendedDownload = () => {
    return downloadOptions.find(option => option.recommended) || downloadOptions[0];
  };

  const handleDownload = (option: DownloadOption) => {
    setSelectedDownload(option);
    setShowDownloadModal(true);
  };

  const confirmDownload = () => {
    if (selectedDownload) {
      // Simulate download
      console.log(`Downloading ${selectedDownload.name}...`);
      setShowDownloadModal(false);
      setSelectedDownload(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">τ</span>
                </div>
                <span className="text-xl font-bold">TauOS</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#download" className="text-gray-300 hover:text-white transition-colors">
                Download
              </a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                About
              </a>
              <a href="/taumail" className="text-gray-300 hover:text-white transition-colors">
                TauMail
              </a>
              <a href="/taucloud" className="text-gray-300 hover:text-white transition-colors">
                TauCloud
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-800"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#download" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">
                  Download
                </a>
                <a href="#about" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">
                  About
                </a>
                <a href="/taumail" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">
                  TauMail
                </a>
                <a href="/taucloud" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">
                  TauCloud
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-white">TauOS isn't just another Linux distro</span>
                <br />
                <span className="text-purple-400">— it's a radical reinvention</span>
                <br />
                <span className="text-blue-400">of the operating system</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
                Designed for everyday users who demand privacy, beauty, and simplicity. Experience computing the way it should be: private, beautiful, and yours.
              </p>
              
              {/* Download Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => handleDownload(getRecommendedDownload() || downloadOptions[0])}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center space-x-2 transition-colors"
                >
                  <Download className="w-6 h-6" />
                  <span>Download TauOS</span>
                  {detectedOS && (
                    <span className="text-sm bg-purple-700 px-2 py-1 rounded">
                      for {detectedOS === 'mac' ? 'macOS' : detectedOS === 'windows' ? 'Windows' : detectedOS === 'linux' ? 'Linux' : 'Linux'}
                    </span>
                  )}
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center space-x-2 transition-colors">
                  <Play className="w-6 h-6" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose TauOS?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience computing the way it should be: private, beautiful, and yours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">TauOS Interface</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of computing with our beautiful, intuitive interface designed for productivity and privacy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Homepage Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 text-purple-400">Homepage Dashboard</h3>
                <p className="text-gray-300 mb-4">
                  The central hub of TauOS, featuring modular widgets, quick settings, and the iconic τ launcher. 
                  Everything you need is just one click away.
                </p>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-6 min-h-[200px]">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">τ</span>
                        </div>
                        <span className="text-white font-semibold">TauOS Dashboard</span>
                      </div>
                      <div className="text-white text-sm">Welcome back, User</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-white text-sm font-semibold mb-2">Quick Actions</div>
                        <div className="space-y-2">
                          <div className="bg-purple-600/20 rounded px-3 py-2 text-white text-sm">TauMail</div>
                          <div className="bg-blue-600/20 rounded px-3 py-2 text-white text-sm">TauCloud</div>
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-white text-sm font-semibold mb-2">System Status</div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-white text-sm">
                            <span>CPU</span>
                            <span className="text-green-400">12%</span>
                          </div>
                          <div className="flex justify-between text-white text-sm">
                            <span>Memory</span>
                            <span className="text-yellow-400">45%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* TauMail Interface */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 text-red-400">TauMail Suite</h3>
                <p className="text-gray-300 mb-4">
                  Complete email solution with Gmail-style interface, encryption badges, and seamless integration. 
                  Your private email, your way.
                </p>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-white rounded-lg min-h-[200px]">
                    <div className="bg-red-600 text-white p-3 rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">TauMail</span>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">Inbox (3)</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">Welcome to TauMail</div>
                            <div className="text-gray-600 text-xs">TauOS Team • 2 hours ago</div>
                          </div>
                          <Shield className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">Security Update Available</div>
                            <div className="text-gray-600 text-xs">System • 1 day ago</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* TauCloud Interface */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 text-blue-400">TauCloud Storage</h3>
                <p className="text-gray-300 mb-4">
                  Secure cloud storage with client-side encryption, file sharing, and zero-knowledge architecture. 
                  Your files, your control.
                </p>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-white rounded-lg min-h-[200px]">
                    <div className="bg-blue-600 text-white p-3 rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">TauCloud</span>
                        <div className="flex items-center space-x-2">
                          <Cloud className="w-4 h-4" />
                          <span className="text-sm">2.1 GB used</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-blue-600 font-bold">📁</span>
                          </div>
                          <div className="text-xs font-semibold">Documents</div>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-green-600 font-bold">🖼️</span>
                          </div>
                          <div className="text-xs font-semibold">Photos</div>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-purple-600 font-bold">🎵</span>
                          </div>
                          <div className="text-xs font-semibold">Music</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Settings Interface */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 text-green-400">System Settings</h3>
                <p className="text-gray-300 mb-4">
                  Comprehensive system configuration with privacy controls, security settings, and customization options. 
                  Every setting, every choice is yours.
                </p>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-white rounded-lg min-h-[200px]">
                    <div className="bg-gray-100 p-3 rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">TauOS Settings</span>
                        <Settings className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">Privacy Mode</span>
                          <div className="w-10 h-6 bg-purple-600 rounded-full relative">
                            <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">Auto Updates</span>
                          <div className="w-10 h-6 bg-gray-300 rounded-full relative">
                            <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">Encryption</span>
                          <Shield className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Download TauOS</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the right version for your system. All downloads include SHA256 checksums for verification.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {downloadOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-gray-800 p-6 rounded-lg border-2 transition-all hover:scale-105 ${
                  option.recommended ? 'border-purple-500' : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                {option.recommended && (
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-yellow-400 font-semibold">Recommended</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-3 mb-4">
                  <option.icon className="w-8 h-8 text-purple-400" />
                  <h3 className="text-xl font-semibold">{option.name}</h3>
                </div>
                
                <p className="text-gray-300 mb-4">{option.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">File:</span>
                    <span className="text-gray-300">{option.file}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Size:</span>
                    <span className="text-gray-300">{option.size}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDownload(option)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Download
                </button>
              </motion.div>
            ))}
          </div>

          {/* Checksums */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-4">SHA256 Checksums</h3>
            <div className="space-y-2 text-sm">
              {downloadOptions.map((option) => (
                <div key={option.id} className="flex justify-between">
                  <span className="text-gray-400">{option.file}:</span>
                  <span className="text-gray-300 font-mono">{option.checksum}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">🧬 About TauOS</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              TauOS is the world's first privacy-native operating system built for the modern user. Designed from the ground up in under 10 hours by AI and human engineers, it combines the elegance of macOS, the speed of Linux, and the security of a bunker.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-purple-400">We believe an operating system should be:</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mt-1">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🔐 Private</h4>
                    <p className="text-gray-300 text-sm">No telemetry, tracking, or spyware. Your digital life belongs to you, not to corporations or governments.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mt-1">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🌍 Open</h4>
                    <p className="text-gray-300 text-sm">Built on secure Linux foundations, TauOS gives you the transparency and control you deserve.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mt-1">
                    <Monitor className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🖱️ User-Friendly</h4>
                    <p className="text-gray-300 text-sm">No terminal required. No complex configurations. No steep learning curves.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center mt-1">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">💨 Fast</h4>
                    <p className="text-gray-300 text-sm">Lightweight and responsive on almost any hardware. Boot fast, run fast, stay fast.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mt-1">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🎨 Beautiful</h4>
                    <p className="text-gray-300 text-sm">Design that delights without distraction. Every pixel crafted to enhance your experience.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">The TauOS Story</h3>
              <p className="text-gray-300 mb-6">
                Developed by a tight knit forward futuristic thinking minds with zero bloat and zero compromises, TauOS marks the beginning of a new era in computing — one where you are back in control.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Built for Real People</h4>
                  <p className="text-gray-300 text-sm">We didn't build TauOS for tech enthusiasts or system administrators. We built it for students, professionals, creators, and families who want their computers to work for them, not against them.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Privacy by Design</h4>
                  <p className="text-gray-300 text-sm">In a world where every click is tracked and every keystroke is monetized, TauOS stands as a beacon of digital sovereignty. We believe privacy isn't a feature — it's the foundation of human dignity in the digital age.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">The Future of Computing</h4>
                  <p className="text-gray-300 text-sm">TauOS isn't just an operating system — it's a statement. A statement that technology can be both powerful and respectful, both beautiful and secure, both accessible and uncompromising.</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-xl text-gray-300 italic">
              Join the revolution. Take back control. Experience TauOS.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TauMail Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">✉️ TauMail</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your inbox, finally private.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-red-400">TauMail is the official email client of TauOS</h3>
              <p className="text-gray-300 mb-6">
                Built from scratch to give you total control over your communication. In a world where email has become a surveillance tool, TauMail stands as your digital sanctuary.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">📧 Modern UI</h4>
                    <p className="text-gray-300 text-sm">Clean, intuitive, and fully GUI-based. Everything you need is right where you expect it to be.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🔒 End-to-End Encryption</h4>
                    <p className="text-gray-300 text-sm">Your emails stay between you and your recipient. TauMail encrypts your messages before they leave your device.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">📂 Unified Inbox</h4>
                    <p className="text-gray-300 text-sm">Support for IMAP, SMTP, and custom domains. Connect all your email accounts in one place.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🔕 No Ads, No Tracking</h4>
                    <p className="text-gray-300 text-sm">Ever. TauMail doesn't mine your data or show creepy ads. Your inbox is your inbox.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🛡️ Smart Anti-Phishing</h4>
                    <p className="text-gray-300 text-sm">Visual indicators for sender trust. TauMail automatically analyzes incoming emails for potential threats.</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 mt-6 italic">
                TauMail doesn't mine your data or show creepy ads. It's your inbox, evolved.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 w-full max-w-md">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="bg-white rounded-lg min-h-[300px]">
                  <div className="bg-red-600 text-white p-3 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">TauMail</span>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">Inbox (5)</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Welcome to TauMail</div>
                          <div className="text-gray-600 text-xs">TauOS Team • 2 hours ago</div>
                        </div>
                        <Shield className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Your Privacy Matters</div>
                          <div className="text-gray-600 text-xs">Security Update • 1 day ago</div>
                        </div>
                        <Shield className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Zero Tracking Policy</div>
                          <div className="text-gray-600 text-xs">System • 3 days ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TauCloud Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">☁️ TauCloud</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              TauCloud is your encrypted file manager and cloud interface built right into TauOS.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 w-full max-w-md">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="bg-white rounded-lg min-h-[300px]">
                  <div className="bg-blue-600 text-white p-3 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">TauCloud</span>
                      <div className="flex items-center space-x-2">
                        <Cloud className="w-4 h-4" />
                        <span className="text-sm">2.1 GB used</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <span className="text-blue-600 font-bold">📁</span>
                        </div>
                        <div className="text-xs font-semibold">Documents</div>
                        <div className="text-xs text-gray-500">1.2 GB</div>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <span className="text-green-600 font-bold">🖼️</span>
                        </div>
                        <div className="text-xs font-semibold">Photos</div>
                        <div className="text-xs text-gray-500">800 MB</div>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <span className="text-purple-600 font-bold">🎵</span>
                        </div>
                        <div className="text-xs font-semibold">Music</div>
                        <div className="text-xs text-gray-500">100 MB</div>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <span className="text-yellow-600 font-bold">📊</span>
                        </div>
                        <div className="text-xs font-semibold">Backups</div>
                        <div className="text-xs text-gray-500">50 MB</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Your Private, Encrypted Storage</h3>
              <p className="text-gray-300 mb-6">
                In an era where your files are stored on servers you don't control, accessed by algorithms you don't understand, and potentially viewed by people you don't know, TauCloud represents a fundamental shift in how we think about digital storage.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🗂️ File Explorer + Cloud in One</h4>
                    <p className="text-gray-300 text-sm">Manage files locally or in your encrypted TauCloud account. No more switching between different apps or services.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🔐 End-to-End Encryption</h4>
                    <p className="text-gray-300 text-sm">Every file is protected before it leaves your device. Your data remains private and secure, even from the service itself.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🧠 Smart Privacy Labels</h4>
                    <p className="text-gray-300 text-sm">Instantly see which files are public, private, or shared. Maintain control over your digital footprint.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🖱️ GUI-Based Drag & Drop</h4>
                    <p className="text-gray-300 text-sm">Intuitive design, no CLI needed. TauCloud makes file management as simple as it should be.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🧩 Works with Tau Apps</h4>
                    <p className="text-gray-300 text-sm">Seamlessly syncs with TauMail, Tau Media, and more. Your files are accessible across all TauOS applications.</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 mt-6 italic">
                TauCloud makes privacy feel native — like it should've always been.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tau Store Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">🛍️ Tau Store</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Apps you need. Privacy you deserve.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-green-400">Your Official App Marketplace</h3>
              <p className="text-gray-300 mb-6">
                Tau Store is your official marketplace for apps, tools, themes, and updates — all curated to meet the TauOS standard of privacy-first and zero-bloat.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🚫 No Ads. No Trackers. No Spyware.</h4>
                    <p className="text-gray-300 text-sm">Every app in the Tau Store is vetted for security, usability, and respect for user data.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🧠 Smart Categories</h4>
                    <p className="text-gray-300 text-sm">From productivity tools to creative suites, AI assistants to blockchain wallets — everything is organized and accessible.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🎨 Themes & Customization</h4>
                    <p className="text-gray-300 text-sm">Switch up your entire OS look with custom icon packs, UI themes, and animations — all drag-and-drop ready.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">📦 One-Click Installs</h4>
                    <p className="text-gray-300 text-sm">No sudo. No scripts. Just tap, install, and go. All apps are GUI-optimized for TauOS.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🔐 Verified by TauSec</h4>
                    <p className="text-gray-300 text-sm">Every app is audited by our internal security layer and labeled for transparency and trust.</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 mt-6 italic">
                Finally, apps that work for you, not the other way around.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 w-full max-w-md">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="bg-white rounded-lg min-h-[300px]">
                  <div className="bg-green-600 text-white p-3 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Tau Store</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Featured Apps</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-purple-600 font-bold text-sm">τ</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Tau Browser</div>
                          <div className="text-gray-600 text-xs">Privacy-first web browser</div>
                        </div>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs">Install</button>
                      </div>
                      <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">📧</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">TauMail</div>
                          <div className="text-gray-600 text-xs">Secure email client</div>
                        </div>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs">Install</button>
                      </div>
                      <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <span className="text-yellow-600 font-bold text-sm">🎵</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Tau Media Player</div>
                          <div className="text-gray-600 text-xs">Privacy-first media player</div>
                        </div>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs">Install</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">τ</span>
                </div>
                <span className="text-xl font-bold">TauOS</span>
              </div>
              <p className="text-gray-300">
                The future of computing, built for privacy and security.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">TauOS</a></li>
                <li><a href="/taumail" className="hover:text-white transition-colors">TauMail</a></li>
                <li><a href="/taucloud" className="hover:text-white transition-colors">TauCloud</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Forum</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TauOS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Download Modal */}
      {showDownloadModal && selectedDownload && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-xl font-semibold mb-4">Download {selectedDownload.name}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-300 mb-2">{selectedDownload.description}</p>
                <div className="bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-300">File: {selectedDownload.file}</p>
                  <p className="text-sm text-gray-300">Size: {selectedDownload.size}</p>
                  <p className="text-sm text-gray-300">Checksum: {selectedDownload.checksum}</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDownload}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 