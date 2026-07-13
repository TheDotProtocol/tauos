'use client';

import AppShell from '@/components/apps/AppShell';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Shield, Lock, Eye, CheckCircle, AlertCircle, 
  ArrowRight, Users, Zap, Star, ArrowLeft, Search,
  Download, Filter, Settings, Heart, BarChart3, Activity,
  Monitor, Smartphone, Laptop, Smartphone as Mobile
} from 'lucide-react';
import Link from 'next/link';

const PLATFORM_ICONS = {
  windows: Monitor,
  macos: Laptop,
  'macos-arm': Laptop,
  linux: Globe,
  android: Mobile,
  ios: Smartphone,
};

export default function TauBrowserLanding() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [downloads, setDownloads] = useState(null);
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
      title: "Built-in Ad Blocking",
      description: "Block ads, trackers, and malicious content automatically. Browse faster and safer."
    },
    {
      icon: Lock,
      title: "Privacy by Default",
      description: "No data collection, no tracking, no cookies. Your browsing stays private."
    },
    {
      icon: Eye,
      title: "No Data Mining",
      description: "We don't collect your browsing history, search queries, or personal information."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed with minimal resource usage. Browse without lag or slowdowns."
    }
  ];

  const downloadOptions = downloads?.all ?? [];

  useEffect(() => {
    fetch('/api/taubrowser/downloads')
      .then((r) => r.json())
      .then((data) => setDownloads(data))
      .catch(() => {});
  }, []);

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/taubrowser/auth/register', {
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
        
        alert('✅ Registration successful! Welcome to TauBrowser!');
        // Redirect to dashboard
        window.location.href = '/taubrowser/dashboard';
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
      const response = await fetch('/api/taubrowser/auth/login', {
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
        window.location.href = '/taubrowser/dashboard';
      } else {
        alert('❌ Error: ' + result.error);
      }
    } catch (error) {
      alert('❌ Connection error: ' + error.message);
    }
  };

  return (
    <AppShell
      title="Tau Browser"
      subtitle="Privacy-first browsing built into the TAU CORE stack."
      variant="marketing"
    >
      {/* Hero + Downloads */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Truly Private Browsing
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              If Safari says private, Tau Browser is the definition. Zero telemetry, built-in ad &amp; tracker blocking, encrypted sync across your devices.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => setShowRegistration(true)}
                className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25"
              >
                Create Free Account
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Sign In
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {(downloadOptions.length ? downloadOptions : [
              { id: 'windows', label: 'Windows', description: 'Loading...', url: '#', available: false },
            ]).map((opt, index) => {
              const Icon = PLATFORM_ICONS[opt.id] ?? Globe;
              const isRecommended = downloads?.recommended?.id === opt.id;
              return (
                <motion.a
                  key={opt.id}
                  href={opt.available ? opt.url : '#'}
                  target={opt.available ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 rounded-2xl border backdrop-blur-sm transition-all ${
                    isRecommended
                      ? 'border-yellow-400/50 bg-yellow-400/5'
                      : 'border-gray-800 bg-gray-900/30 hover:border-gray-600'
                  } ${!opt.available ? 'opacity-60 pointer-events-none' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{opt.label}</h3>
                        {isRecommended && (
                          <span className="text-xs px-2 py-0.5 bg-yellow-400/20 text-yellow-300 rounded-full">Recommended</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{opt.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {opt.available ? `Download ${opt.format ?? ''} · v${opt.version ?? '1.0'}` : 'Coming soon'}
                      </p>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Also at <strong className="text-gray-400">browser.tauos.org</strong> and <strong className="text-gray-400">taubrowser.com</strong>
          </p>
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
              Privacy-First Browsing
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built from the ground up with privacy and security as the foundation.
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

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Simple, secure, and private browsing in three easy steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Download className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">1. Download</h3>
              <p className="text-gray-400">Download TauBrowser and install it on your device.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">2. Browse</h3>
              <p className="text-gray-400">Browse the web with automatic privacy protection and ad blocking.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">3. Stay Private</h3>
              <p className="text-gray-400">Your browsing data stays on your device. No tracking, no collection.</p>
            </motion.div>
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
              <h2 className="text-2xl font-bold text-white">Get Started with TauBrowser</h2>
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
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
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
              <h2 className="text-2xl font-bold text-white">Sign In to TauBrowser</h2>
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
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
    </AppShell>
  );
}
