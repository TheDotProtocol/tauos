'use client';
// Force rebuild - Backend URL updated to production Vercel deployment

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Shield, Lock, Eye, CheckCircle, AlertCircle, 
  ArrowRight, Users, Globe, Zap, Star, ArrowLeft,
  Monitor, Laptop, Smartphone as Mobile, Download
} from 'lucide-react';
import Link from 'next/link';

export default function TauMailLanding() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const features = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Your emails are encrypted from sender to recipient with military-grade security."
    },
    {
      icon: Lock,
      title: "Zero-Knowledge Architecture",
      description: "We can't read your emails even if we wanted to. Your privacy is absolute."
    },
    {
      icon: Eye,
      title: "No Tracking",
      description: "No ads, no tracking, no data collection. Just pure email communication."
    },
    {
      icon: Globe,
      title: "Open Standards",
      description: "Built on IMAP/SMTP standards. Use any email client you prefer."
    }
  ];

  const downloadOptions = [
    {
      icon: Monitor,
      title: "Windows",
      description: "Windows 10/11 (64-bit)",
      downloadUrl: "#",
      comingSoon: true
    },
    {
      icon: Laptop,
      title: "macOS",
      description: "macOS 10.15+ (Intel & Apple Silicon)",
      downloadUrl: "#",
      comingSoon: true
    },
    {
      icon: Globe,
      title: "Linux",
      description: "Ubuntu, Debian, Fedora, Arch",
      downloadUrl: "#",
      comingSoon: true
    },
    {
      icon: Mobile,
      title: "Mobile",
      description: "iOS & Android (Coming Soon)",
      downloadUrl: "#",
      comingSoon: true
    }
  ];

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('https://tauos-47am.vercel.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...registrationData,
          email: `${registrationData.username}@tauos.org`
        })
      });
      const result = await response.json();
      if (response.ok) {
        // Store user data and token
        localStorage.setItem('tauos_user', JSON.stringify(result.user));
        localStorage.setItem('tauos_token', result.token);
        
        alert('✅ Registration successful! Welcome to TauOS Mail!');
        // Redirect to dashboard
        window.location.href = '/taumail/dashboard';
      } else {
        alert('❌ Error: ' + result.error);
      }
    } catch (error) {
      alert('❌ Connection error: ' + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('https://tauos-47am.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });
      const result = await response.json();
      if (response.ok) {
        // Store user data and token
        localStorage.setItem('tauos_user', JSON.stringify(result.user));
        localStorage.setItem('tauos_token', result.token);
        
        alert('✅ Login successful! Welcome back!');
        // Redirect to dashboard
        window.location.href = '/taumail/dashboard';
      } else {
        alert('❌ Error: ' + result.error);
      }
    } catch (error) {
      alert('❌ Connection error: ' + error.message);
    }
  };

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
                TauMail
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Private email that puts you in control. <span className="text-yellow-400 font-semibold">End-to-end encryption, zero tracking, and complete privacy by design</span>.
              <br />
              <span className="text-lg text-gray-400">@tauos.org Email • 100% Encrypted • Zero Data Access</span>
            </p>
          </motion.div>

          <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <button
              onClick={() => setShowRegistration(true)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200 flex items-center"
            >
              Get @tauos.org Email
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800/50 transition-all duration-200"
            >
              Sign In
            </button>
          </motion.div>

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Download TauMail</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {downloadOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <option.icon className="w-6 h-6 text-black" />
              </div>
                  <h3 className="text-lg font-bold text-white mb-2">{option.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{option.description}</p>
                  <button
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      option.comingSoon
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg hover:shadow-yellow-400/25'
                    }`}
                    disabled={option.comingSoon}
                  >
                    {option.comingSoon ? 'Coming Soon' : 'Download'}
                </button>
              </motion.div>
              ))}
          </div>
            <p className="text-gray-400 mt-6 text-sm">
              Desktop apps will be available via OTA updates. Web version available now.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">50K+</div>
              <div className="text-gray-400">Active Users</div>
                  </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
                  </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">Zero</div>
              <div className="text-gray-400">Data Collection</div>
              </div>
            </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Privacy by Design
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every feature is built with your privacy and security as the foundation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Get Your @tauos.org Email</h2>
              <button
                onClick={() => setShowRegistration(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={registrationData.username}
                    onChange={(e) => setRegistrationData({...registrationData, username: e.target.value})}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                    placeholder="yourname"
                    required
                  />
                  <div className="px-4 py-3 bg-gray-700 border border-l-0 border-gray-700 rounded-r-lg text-gray-300">
                    @tauos.org
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={registrationData.fullName}
                  onChange={(e) => setRegistrationData({...registrationData, fullName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  placeholder="Your full name"
                  required
                />
          </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={registrationData.password}
                  onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  placeholder="Create a strong password"
                  required
                />
        </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
              >
                Create Account
              </button>
            </form>
            
            <p className="text-center text-sm text-gray-400 mt-4">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setShowRegistration(false);
                  setShowLogin(true);
                }}
                className="text-yellow-400 hover:text-yellow-300"
              >
                Sign in
              </button>
            </p>
          </motion.div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Sign In</h2>
              <button
                onClick={() => setShowLogin(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  placeholder="yourname@tauos.org"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  placeholder="Your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
              >
                Sign In
              </button>
            </form>
            
            <p className="text-center text-sm text-gray-400 mt-4">
              Don't have an account?{' '}
                <button 
                  onClick={() => {
                  setShowLogin(false);
                  setShowRegistration(true);
                }}
                className="text-yellow-400 hover:text-yellow-300"
              >
                Create one
                </button>
            </p>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/legal/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/legal/dpa" className="text-gray-400 hover:text-white">Data Protection</Link></li>
                <li><Link href="/legal/cookies" className="text-gray-400 hover:text-white">Cookies Policy</Link></li>
                <li><Link href="/legal/acceptable-use" className="text-gray-400 hover:text-white">Acceptable Use</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
                <li><Link href="/status" className="text-gray-400 hover:text-white">Status</Link></li>
              </ul>
              </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="/press" className="text-gray-400 hover:text-white">Press</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Community</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="https://github.com/tauos" className="text-gray-400 hover:text-white">GitHub</Link></li>
                <li><Link href="https://x.com/tauos" className="text-gray-400 hover:text-white">Twitter</Link></li>
                <li><Link href="https://mastodon.social/@tauos" className="text-gray-400 hover:text-white">Mastodon</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TauOS. All rights reserved. Privacy-first computing.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 