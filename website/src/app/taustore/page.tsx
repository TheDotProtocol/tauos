'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Star, Download, Shield, Search, Filter, 
  Grid, List, Heart, Eye, CheckCircle, AlertCircle, 
  BarChart3, Settings, Plus, Edit3, Trash2, Users, 
  Smartphone, Monitor, Tablet, Zap, Key, Database, ArrowRight, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function TauStoreLanding() {
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
  ];

  const featuredApps = [
    {
      name: 'TauMail',
      category: 'Productivity',
      rating: 4.9,
      downloads: 1247,
      privacyScore: 100,
      verified: true,
      description: 'Secure email client with end-to-end encryption',
      icon: '📧'
    },
    {
      name: 'TauCloud',
      category: 'Storage',
      rating: 4.8,
      downloads: 1189,
      privacyScore: 98,
      verified: true,
      description: 'Private cloud storage with zero-knowledge encryption',
      icon: '☁️'
    },
    {
      name: 'TauBrowser',
      category: 'Internet',
      rating: 4.7,
      downloads: 1156,
      privacyScore: 95,
      verified: true,
      description: 'Privacy-first web browser with built-in ad blocking',
      icon: '🌐'
    }
  ];

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://tauos-cbh3.vercel.app/api/auth/register', {
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
        
        alert('✅ Registration successful! Welcome to TauStore!');
        // Redirect to dashboard
        window.location.href = '/taustore/dashboard';
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
      const response = await fetch('https://tauos-cbh3.vercel.app/api/auth/login', {
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
        window.location.href = '/taustore/dashboard';
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
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/brand/tauos-logo.svg" alt="TauOS" className="w-10 h-10" />
                <span className="text-xl font-bold text-white">TauOS</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2 inline" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                TauStore
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                The privacy-first app store. Discover, download, and enjoy apps 
                that respect your privacy and protect your data.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button
                onClick={() => setShowRegistration(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 flex items-center"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800/50 transition-all duration-200"
              >
                Sign In
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">1000+</div>
                <div className="text-gray-400">Privacy Apps</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
                <div className="text-gray-400">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">Zero</div>
                <div className="text-gray-400">Tracking</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Apps Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Featured Apps
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the most popular privacy-first applications in our store.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredApps.map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-purple-400/30 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl">{app.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{app.name}</h3>
                    <p className="text-gray-400 text-sm">{app.category}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{app.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{app.rating}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">{app.privacyScore}%</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200">
                  Download
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Why Choose TauStore?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're building the future of app distribution with privacy and security at its core.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-purple-400/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
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
              <h2 className="text-2xl font-bold text-white">Get Started with TauStore</h2>
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
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  placeholder="Create a strong password"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
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
                className="text-purple-400 hover:text-purple-300"
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
              <h2 className="text-2xl font-bold text-white">Sign In to TauStore</h2>
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  placeholder="Your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
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
                className="text-purple-400 hover:text-purple-300"
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