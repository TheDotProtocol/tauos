'use client';

import AppShell from '@/components/apps/AppShell';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, MessageCircle, Users, Zap, Phone, Video } from 'lucide-react';

export default function TauTalkLanding() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [registerData, setRegisterData] = useState({ username: '', fullName: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const features = [
    { icon: Lock, title: 'End-to-end encrypted', description: 'Messages encrypted on your device. Server never sees plaintext.' },
    { icon: MessageCircle, title: 'WhatsApp-style chats', description: 'Direct messages and group chats with read receipts and typing sync.' },
    { icon: Shield, title: 'Signal-grade privacy', description: 'No ads, no data mining, no phone number required — use your Tau ID.' },
    { icon: Zap, title: 'Telegram-speed delivery', description: 'Fast message delivery with encrypted sync across devices.' },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/tautalk/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...registerData,
        email: `${registerData.username}@tauos.org`,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('tauos_token', data.token);
      localStorage.setItem('tauos_user', JSON.stringify(data.user));
      window.location.href = '/tautalk/chat';
    } else {
      alert(data.error || 'Registration failed');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/tautalk/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('tauos_token', data.token);
      localStorage.setItem('tauos_user', JSON.stringify(data.user));
      window.location.href = '/tautalk/chat';
    } else {
      alert(data.error || 'Login failed');
    }
  };

  return (
    <AppShell
      title="Tau Talk"
      subtitle="Encrypted messaging — WhatsApp, Telegram & Signal in one. Part of TAU CORE."
      variant="marketing"
    >
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm mb-6">
              <Shield className="w-4 h-4" /> E2E Encrypted · Zero Telemetry
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Message without being the product
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Tau Talk combines the best of WhatsApp, Telegram, and Signal — encrypted chats, groups, and voice/video calls — all tied to your Tau ID.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowRegister(true)}
                className="px-8 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-black rounded-lg font-semibold"
              >
                Get Started Free
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Sign In
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Also at <strong className="text-gray-400">talk.tauos.org</strong> and <strong className="text-gray-400">tautalk.com</strong>
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl border border-gray-800 bg-gray-900/30"
            >
              <f.icon className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-12 px-4 text-center">
        <div className="flex justify-center gap-8 text-gray-400">
          <div className="flex items-center gap-2"><MessageCircle className="w-5 h-5" /> Chats</div>
          <div className="flex items-center gap-2"><Users className="w-5 h-5" /> Groups</div>
          <div className="flex items-center gap-2"><Phone className="w-5 h-5" /> Voice</div>
          <div className="flex items-center gap-2"><Video className="w-5 h-5" /> Video</div>
        </div>
      </section>

      {showRegister && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Create Tau Talk account</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex">
                <input
                  required
                  placeholder="username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white"
                />
                <span className="px-4 py-3 bg-gray-700 border border-l-0 border-gray-700 rounded-r-lg text-gray-300">@tauos.org</span>
              </div>
              <input
                required
                placeholder="Full name"
                value={registerData.fullName}
                onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              <input
                required
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              <button type="submit" className="w-full py-3 bg-green-500 text-black rounded-lg font-semibold">Create Account</button>
            </form>
            <button onClick={() => setShowRegister(false)} className="mt-4 text-gray-400 text-sm w-full">Cancel</button>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Sign in to Tau Talk</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                required
                type="email"
                placeholder="you@tauos.org"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              <input
                required
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              <button type="submit" className="w-full py-3 bg-green-500 text-black rounded-lg font-semibold">Sign In</button>
            </form>
            <button onClick={() => setShowLogin(false)} className="mt-4 text-gray-400 text-sm w-full">Cancel</button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
