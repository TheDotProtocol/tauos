'use client';
// TauCloud - The Ultimate File Storage System - v1.0

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, Upload, Download, Share2, Folder, File, Image, Video, 
  Music, Archive, Search, Filter, MoreVertical, Star, Trash2, 
  Eye, Lock, Unlock, Users, Settings, LogOut, User, Plus,
  Grid, List, RefreshCw, CheckCircle, AlertCircle, BarChart3,
  Activity, Calendar, Clock, Shield, Zap, Globe, Smartphone
} from 'lucide-react';
import Link from 'next/link';

export default function TauCloudLanding() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    email: '', password: '', username: '', fullName: '' 
  });
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('tauos_user');
    const storedToken = localStorage.getItem('tauos_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://tauos-47am.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();
      
      if (response.ok) {
        localStorage.setItem('tauos_token', result.token);
        localStorage.setItem('tauos_user', JSON.stringify(result.user));
        setUser(result.user);
        setIsLoggedIn(true);
        setShowLogin(false);
        setLoginData({ email: '', password: '' });
      } else {
        alert(`Login failed: ${result.error}`);
      }
    } catch (error) {
      alert(`Login error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://tauos-47am.vercel.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });

      const result = await response.json();
      
      if (response.ok) {
        localStorage.setItem('tauos_token', result.token);
        localStorage.setItem('tauos_user', JSON.stringify(result.user));
        setUser(result.user);
        setIsLoggedIn(true);
        setShowRegister(false);
        setRegisterData({ email: '', password: '', username: '', fullName: '' });
      } else {
        alert(`Registration failed: ${result.error}`);
      }
    } catch (error) {
      alert(`Registration error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tauos_user');
    localStorage.removeItem('tauos_token');
    setUser(null);
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    // Redirect to dashboard
    window.location.href = '/taucloud/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/brand/tauos-logo.svg" alt="TauOS" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-white">TauCloud</h1>
                <p className="text-sm text-gray-400">Ultimate File Storage</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  TauCloud
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 mb-4">
                The Ultimate File Storage System
              </p>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Experience the future of cloud storage with unlimited space, 
                military-grade encryption, and real-time collaboration. 
                Make iCloud and Google Drive look outdated.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <button
                onClick={() => setShowRegister(true)}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-lg font-bold rounded-xl hover:shadow-2xl hover:shadow-yellow-400/25 transition-all duration-200"
              >
                Start Free Trial
              </button>
              <button className="px-8 py-4 border-2 border-gray-600 text-white text-lg font-semibold rounded-xl hover:border-yellow-400 hover:text-yellow-400 transition-all duration-200">
                Watch Demo
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose TauCloud?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built for the modern world with privacy, security, and performance at its core
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Military-Grade Encryption",
                description: "End-to-end encryption with zero-knowledge architecture. Your files are protected with AES-256 encryption.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast Sync",
                description: "Real-time synchronization across all your devices. Changes appear instantly everywhere.",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: Globe,
                title: "Unlimited Storage",
                description: "Never run out of space. Store unlimited files with our advanced compression technology.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "Smart Collaboration",
                description: "Share files instantly with granular permissions. Work together seamlessly.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Smartphone,
                title: "Cross-Platform",
                description: "Access your files from any device - desktop, mobile, tablet. Native apps for all platforms.",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Track file usage, storage patterns, and collaboration insights with detailed analytics.",
                color: "from-red-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-gray-700 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "∞", label: "Unlimited Storage", icon: Cloud },
              { number: "99.9%", label: "Uptime Guarantee", icon: CheckCircle },
              { number: "256-bit", label: "AES Encryption", icon: Lock },
              { number: "0ms", label: "Sync Latency", icon: Zap }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-black" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of users who have already made the switch to TauCloud
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowRegister(true)}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-lg font-bold rounded-xl hover:shadow-2xl hover:shadow-yellow-400/25 transition-all duration-200"
              >
                Start Your Free Trial
              </button>
              <button className="px-8 py-4 border-2 border-gray-600 text-white text-lg font-semibold rounded-xl hover:border-yellow-400 hover:text-yellow-400 transition-all duration-200">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to your TauCloud account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="your@email.com"
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="Your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => { setShowLogin(false); setShowRegister(true); }}
                  className="text-yellow-400 hover:text-yellow-300 font-semibold"
                >
                  Sign up here
                </button>
              </p>
            </div>

            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Join TauCloud</h2>
              <p className="text-gray-400">Create your account and start storing files</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={registerData.fullName}
                  onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="johndoe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="Create a strong password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => { setShowRegister(false); setShowLogin(true); }}
                  className="text-yellow-400 hover:text-yellow-300 font-semibold"
                >
                  Sign in here
                </button>
              </p>
            </div>

            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src="/brand/tauos-logo.svg" alt="TauOS" className="w-8 h-8" />
              <span className="text-xl font-bold text-white">TauCloud</span>
            </div>
            <p className="text-gray-400 mb-4">
              Part of the TauOS ecosystem - The future of computing
            </p>
            <p className="text-sm text-gray-500">
              © 2025 TauOS. All rights reserved. Privacy-first, security-focused, user-centric.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}