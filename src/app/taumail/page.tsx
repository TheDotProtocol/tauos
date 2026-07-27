'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Eye,
  Globe,
  ArrowRight,
  Building2,
  Inbox,
  Send,
  Star,
  CheckCircle,
  X,
} from 'lucide-react';
import AppShell from '@/components/apps/AppShell';
import { isDemoLogin, startDemoSession } from '@/lib/taumail-demo';

type MailDomainOption = {
  domain: string;
  label: string;
  organization: string;
  mxHost: string;
  comingSoon?: boolean;
};

const CONSUMER_DOMAIN = 'taumail.org';

const features = [
  {
    icon: Shield,
    title: 'End-to-end encryption',
    description: 'Military-grade security from sender to recipient.',
  },
  {
    icon: Lock,
    title: 'Zero-knowledge',
    description: 'We cannot read your mail. Privacy is absolute.',
  },
  {
    icon: Eye,
    title: 'No tracking',
    description: 'No ads, no pixels, no data collection. Ever.',
  },
  {
    icon: Globe,
    title: 'Open standards',
    description: 'IMAP and SMTP — use any email client you like.',
  },
];

const comparisons = [
  { feature: 'No ads or data mining', taumail: true, gmail: false, outlook: false, proton: true },
  { feature: 'Free @taumail.org address', taumail: true, gmail: true, outlook: true, proton: false },
  { feature: 'Custom domain for business', taumail: true, gmail: true, outlook: true, proton: true },
  { feature: 'Zero-knowledge architecture', taumail: true, gmail: false, outlook: false, proton: true },
  { feature: 'No AI training on your mail', taumail: true, gmail: false, outlook: false, proton: true },
  { feature: 'Open IMAP / SMTP standards', taumail: true, gmail: true, outlook: true, proton: true },
  { feature: 'Built into TAU CORE ecosystem', taumail: true, gmail: false, outlook: false, proton: false },
  { feature: 'Transparent, privacy-first pricing', taumail: true, gmail: false, outlook: false, proton: true },
];

export default function TauMailLanding() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [domains, setDomains] = useState<MailDomainOption[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>(CONSUMER_DOMAIN);
  const [isConsumerHost, setIsConsumerHost] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [registrationData, setRegistrationData] = useState({
    password: '',
    username: '',
    fullName: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const host = window.location.hostname.toLowerCase();
    const onConsumer = host === 'taumail.org' || host === 'www.taumail.org' || host === 'taumail.localhost';
    setIsConsumerHost(onConsumer);
    if (onConsumer) setSelectedDomain(CONSUMER_DOMAIN);

    fetch('/api/taumail/domains')
      .then((r) => r.json())
      .then((data) => {
        if (data.domains?.length) {
          setDomains(data.domains);
          if (onConsumer) {
            setSelectedDomain(CONSUMER_DOMAIN);
          } else {
            setSelectedDomain(data.defaultDomain || CONSUMER_DOMAIN);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const response = await fetch('/api/taumail/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registrationData,
          domain: selectedDomain,
          email: `${registrationData.username}@${selectedDomain}`,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('tauos_user', JSON.stringify(result.user));
        localStorage.setItem('tauos_token', result.token);
        window.location.href = '/taumail/dashboard';
      } else {
        setAuthError(result.error || 'Registration failed');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    if (isDemoLogin(loginData.email, loginData.password)) {
      startDemoSession();
      window.location.href = '/taumail/inbox';
      return;
    }

    try {
      const response = await fetch('/api/taumail/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('tauos_user', JSON.stringify(result.user));
        localStorage.setItem('tauos_token', result.token);
        window.location.href = '/taumail/dashboard';
      } else {
        setAuthError(result.error || 'Invalid email or password');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const registerableDomains = domains.length
    ? domains.filter((d) => !d.comingSoon)
    : [{ domain: CONSUMER_DOMAIN, label: 'Tau Mail', organization: 'Tau Mail', mxHost: 'mail.taumail.org' }];

  return (
    <AppShell
      title="Tau Mail"
      subtitle={
        isConsumerHost
          ? 'Secure, smart, and easy to use email — by Tau Core.'
          : 'Private email on the TAU CORE™ stack — zero tracking, built for everyone.'
      }
      variant="marketing"
    >
      {/* Gmail-style hero */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-black pointer-events-none" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — marketing */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
                Secure email for{' '}
                <span className="bg-gradient-to-r from-[#FFF0B3] via-primary to-[#FFD700] bg-clip-text text-transparent">
                  everyone
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg leading-relaxed">
                Tau Mail is privacy-first email that&apos;s easy to use and easy to love. Create a free{' '}
                <span className="text-yellow-400 font-medium">@{CONSUMER_DOMAIN}</span> address or sign in
                with your company mailbox.
              </p>

              {/* Inbox preview mockup */}
              <div className="hidden md:block relative max-w-md">
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/10 rounded-2xl blur-xl opacity-70" />
                <div className="relative bg-gray-900/90 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-black/40">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-xs text-gray-500 font-mono">mail.taumail.org</span>
                  </div>
                  <div className="p-4 space-y-2">
                    {[
                      { from: 'Tau Core', subject: 'Welcome to Tau Mail', unread: true },
                      { from: 'Security', subject: 'Your inbox is encrypted', unread: true },
                      { from: 'Team', subject: 'Public beta is live', unread: false },
                    ].map((m) => (
                      <div
                        key={m.subject}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          m.unread ? 'bg-yellow-400/5 border border-yellow-400/20' : 'bg-gray-800/30'
                        }`}
                      >
                        <Inbox className={`w-4 h-4 shrink-0 ${m.unread ? 'text-yellow-400' : 'text-gray-500'}`} />
                        <div className="min-w-0 flex-1">
                          <div className={`text-sm truncate ${m.unread ? 'text-white font-medium' : 'text-gray-400'}`}>
                            {m.from}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{m.subject}</div>
                        </div>
                        {m.unread && <Star className="w-3 h-3 text-yellow-400 shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right — auth card (Gmail-style) */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
            >
              <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/80 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#FFF0B3] to-[#FFD700] bg-clip-text text-transparent mb-1">
                    Tau Mail
                  </div>
                  <p className="text-sm text-gray-400">
                    {authMode === 'signin' ? 'Sign in to continue to your inbox' : 'Create your free email address'}
                  </p>
                </div>

                {/* Tab toggle */}
                <div className="flex rounded-lg bg-gray-800/80 p-1 mb-6">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signin'); setAuthError(''); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                      authMode === 'signin'
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                      authMode === 'signup'
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Create account
                  </button>
                </div>

                {authError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                    {authError}
                  </div>
                )}

                {authMode === 'signin' ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30"
                        placeholder="Email address"
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                      <input
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30"
                        placeholder="Your password"
                        autoComplete="current-password"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all disabled:opacity-60"
                    >
                      {authLoading ? 'Signing in…' : 'Sign in'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegistration} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Choose your address</label>
                      <div className="flex">
                        <input
                          type="text"
                          value={registrationData.username}
                          onChange={(e) =>
                            setRegistrationData({ ...registrationData, username: e.target.value })
                          }
                          className="flex-1 min-w-0 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                          placeholder="yourname"
                          required
                        />
                        <select
                          value={selectedDomain}
                          onChange={(e) => setSelectedDomain(e.target.value)}
                          className="px-3 py-3 bg-gray-700 border border-l-0 border-gray-700 rounded-r-lg text-gray-200 text-sm focus:outline-none focus:border-yellow-400 max-w-[140px]"
                        >
                          {registerableDomains.map((d) => (
                            <option key={d.domain} value={d.domain}>
                              @{d.domain}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Full name</label>
                      <input
                        type="text"
                        value={registrationData.fullName}
                        onChange={(e) =>
                          setRegistrationData({ ...registrationData, fullName: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                      <input
                        type="password"
                        value={registrationData.password}
                        onChange={(e) =>
                          setRegistrationData({ ...registrationData, password: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all disabled:opacity-60"
                    >
                      {authLoading ? 'Creating…' : 'Create account'}
                    </button>
                  </form>
                )}

              </div>

              {/* Business CTA */}
              <div className="mt-6 p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-400/20 to-orange-500/20 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-1">Tau Mail for business</div>
                    <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                      Custom domain email for your team — like Google Workspace, without the tracking.
                    </p>
                    <a
                      href="https://workspace.taumail.org"
                      className="inline-flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300 font-medium"
                    >
                      workspace.taumail.org
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-10 border-y border-white/5 bg-gray-900/20">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-yellow-400">Free</div>
            <div className="text-xs md:text-sm text-gray-400 mt-1">@{CONSUMER_DOMAIN} signup</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-yellow-400">99.9%</div>
            <div className="text-xs md:text-sm text-gray-400 mt-1">Uptime</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-yellow-400">Zero</div>
            <div className="text-xs md:text-sm text-gray-400 mt-1">Data collection</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Privacy by design</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every feature is built with your privacy and security as the foundation.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-gray-900/30 border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-colors"
              >
                <div className="w-11 h-11 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Tau Mail */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-gray-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Tau Mail beats the rest
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Gmail scans your inbox for ads. Outlook feeds Microsoft&apos;s ecosystem. ProtonMail locks
              you into their apps. Tau Mail gives you privacy, standards, and control — without the trade-offs.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900/40">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-4 text-gray-400 font-medium">Feature</th>
                  <th className="p-4 text-yellow-400 font-bold">Tau Mail</th>
                  <th className="p-4 text-gray-400 font-medium">Gmail</th>
                  <th className="p-4 text-gray-400 font-medium">Outlook</th>
                  <th className="p-4 text-gray-400 font-medium">ProtonMail</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr key={row.feature} className="border-b border-gray-800/80 last:border-0">
                    <td className="p-4 text-gray-300">{row.feature}</td>
                    {(['taumail', 'gmail', 'outlook', 'proton'] as const).map((col) => (
                      <td key={col} className="p-4 text-center">
                        {row[col] ? (
                          <CheckCircle
                            className={`w-5 h-5 mx-auto ${col === 'taumail' ? 'text-yellow-400' : 'text-green-500'}`}
                          />
                        ) : (
                          <X className="w-5 h-5 mx-auto text-gray-600" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            {[
              {
                title: 'vs Gmail',
                text: 'No ads, no scanning, no AI training on your conversations. Your inbox stays yours.',
              },
              {
                title: 'vs Outlook',
                text: 'No Microsoft lock-in. Real IMAP/SMTP — use Apple Mail, Thunderbird, or any client.',
              },
              {
                title: 'vs ProtonMail',
                text: 'Free consumer tier, business custom domains from $15/mo, and full ecosystem integration.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 bg-gray-900/30 border border-gray-800 rounded-xl hover:border-yellow-400/20 transition-colors"
              >
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <Send className="w-10 h-10 text-yellow-400 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-8">
            Create a free @{CONSUMER_DOMAIN} address in seconds, or sign in with your existing company mailbox.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all"
            >
              Create free account
            </button>
            <Link
              href="https://workspace.taumail.org"
              className="inline-flex items-center gap-2 px-8 py-3 border border-gray-600 text-white rounded-xl font-semibold hover:bg-gray-800/50 transition-all"
            >
              <Building2 className="w-4 h-4" />
              Business workspace
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No ads
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Open standards
            </span>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
