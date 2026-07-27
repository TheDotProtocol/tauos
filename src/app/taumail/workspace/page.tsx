'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Building2,
  Globe,
  Shield,
  Users,
  Mail,
  ArrowRight,
  CheckCircle,
  Server,
  Lock,
  ExternalLink,
} from 'lucide-react';
import AppShell from '@/components/apps/AppShell';

/** Paste Stripe Payment Link URLs here after creating them in Stripe Dashboard */
const STRIPE_STARTER_LINK = process.env.NEXT_PUBLIC_STRIPE_WORKSPACE_STARTER_LINK ?? '';
const STRIPE_BUSINESS_LINK = process.env.NEXT_PUBLIC_STRIPE_WORKSPACE_BUSINESS_LINK ?? '';

/** Google Workspace list prices (USD/user/mo, annual commitment). Source: workspace.google.com/pricing */
const GOOGLE = {
  starterPerUser: 7,
  standardPerUser: 14,
  plusPerUser: 22,
} as const;

/** Tau Mail Workspace pricing — must stay in sync with plan cards below */
const TAU = {
  starterFlat: 15,
  starterMaxUsers: 10,
  businessPerUser: 10,
  businessMaxUsers: 25,
} as const;

function fmtUsd(amount: number) {
  return `$${amount.toLocaleString('en-US')}`;
}

const plans = [
  {
    name: 'Starter',
    mailboxes: `Up to ${TAU.starterMaxUsers} users`,
    domains: '1 custom domain',
    price: fmtUsd(TAU.starterFlat),
    period: '/month',
    priceNote: `Flat rate — ${fmtUsd(TAU.starterFlat / TAU.starterMaxUsers)}/user at max team size`,
    badge: 'Public Beta',
    highlight: false,
    available: true,
    stripeLink: STRIPE_STARTER_LINK,
    cta: 'Subscribe',
    planId: 'starter',
  },
  {
    name: 'Business',
    mailboxes: `Up to ${TAU.businessMaxUsers} users`,
    domains: 'Up to 3 custom domains',
    price: fmtUsd(TAU.businessPerUser),
    period: '/user/month',
    priceNote: `${TAU.businessMaxUsers} users = ${fmtUsd(TAU.businessPerUser * TAU.businessMaxUsers)}/mo total`,
    badge: 'Popular',
    highlight: true,
    available: true,
    stripeLink: STRIPE_BUSINESS_LINK,
    cta: 'Subscribe',
    planId: 'business',
  },
  {
    name: 'Enterprise',
    mailboxes: 'Unlimited users',
    domains: 'Unlimited domains',
    price: 'Contact us',
    period: '',
    priceNote: 'Volume pricing below Google Business Plus ($22/user/mo)',
    badge: null,
    highlight: false,
    available: true,
    contactEmail: 'sales@tauos.org',
    cta: 'Contact sales',
    planId: 'enterprise',
  },
];

const pricingComparison = [
  {
    tier: 'Business Starter',
    googleLabel: `${fmtUsd(GOOGLE.starterPerUser)}/user/mo`,
    tauLabel: `Tau Mail Starter — ${fmtUsd(TAU.starterFlat)}/mo flat (${TAU.starterMaxUsers} users max)`,
    exampleUsers: TAU.starterMaxUsers,
    googleTotal: GOOGLE.starterPerUser * TAU.starterMaxUsers,
    tauTotal: TAU.starterFlat,
  },
  {
    tier: 'Business Standard',
    googleLabel: `${fmtUsd(GOOGLE.standardPerUser)}/user/mo`,
    tauLabel: `Tau Mail Business — ${fmtUsd(TAU.businessPerUser)}/user/mo`,
    exampleUsers: TAU.businessMaxUsers,
    googleTotal: GOOGLE.standardPerUser * TAU.businessMaxUsers,
    tauTotal: TAU.businessPerUser * TAU.businessMaxUsers,
  },
  {
    tier: 'Business Plus',
    googleLabel: `${fmtUsd(GOOGLE.plusPerUser)}/user/mo`,
    tauLabel: 'Tau Mail Enterprise — custom pricing',
    exampleUsers: 50,
    googleTotal: GOOGLE.plusPerUser * 50,
    tauTotal: null as number | null,
  },
];

const savingsExamples = pricingComparison
  .filter((row) => row.tauTotal !== null)
  .map((row) => {
    const saved = row.googleTotal - (row.tauTotal as number);
    const pct = Math.round((saved / row.googleTotal) * 100);
    return {
      tier: row.tier,
      users: row.exampleUsers,
      googleTotal: row.googleTotal,
      tauTotal: row.tauTotal as number,
      saved,
      pct,
    };
  });

const features = [
  {
    icon: Globe,
    title: 'Your domain, your brand',
    description: 'Use @yourcompany.com — not a generic address. MX, SPF, and DKIM handled for you.',
  },
  {
    icon: Users,
    title: 'Team management',
    description: 'Add mailboxes, reset passwords, and manage aliases from one admin console.',
  },
  {
    icon: Shield,
    title: 'Privacy by default',
    description: 'Zero tracking, encrypted transport, and no ads — the same Tau Mail stack your team trusts.',
  },
  {
    icon: Server,
    title: 'Dedicated mail node',
    description: 'Hosted on the TAU CORE phone mail node with 99.9% uptime and real SMTP/IMAP support.',
  },
];

export default function TauMailWorkspacePage() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [domain, setDomain] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleInterest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AppShell
      title="Tau Mail Workspace"
      subtitle="Professional email for your company — custom domains, team admin, zero tracking."
      variant="marketing"
    >
      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-orange-500/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-300 text-sm mb-6">
                <Building2 className="w-4 h-4" />
                Tau Mail for Business
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Email that matches{' '}
                <span className="bg-gradient-to-r from-[#FFF0B3] via-primary to-[#FFD700] bg-clip-text text-transparent">
                  your brand
                </span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
                Set up professional mailboxes on your own domain. Same privacy-first Tau Mail stack,
                built for teams — from $15/month.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#plans"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all"
                >
                  View plans
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/taumail"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-600 text-white rounded-xl font-semibold hover:bg-gray-800/50 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Personal @taumail.org
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-3xl blur-2xl opacity-60" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/80 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Admin console</div>
                    <div className="text-xs text-gray-500">workspace.taumail.org</div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Add team mailboxes on your domain',
                    'Configure MX / SPF / DKIM',
                    'Reset passwords & manage aliases',
                    'View usage across organizations',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 rounded-xl bg-black/40 border border-gray-800">
                  <div className="text-xs text-gray-500 mb-2">Example mailboxes</div>
                  <div className="space-y-1.5 font-mono text-sm">
                    <div className="text-yellow-400/90">ceo@yourcompany.com</div>
                    <div className="text-gray-400">finance@yourcompany.com</div>
                    <div className="text-gray-400">support@yourcompany.com</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything your team needs
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Google Workspace-style admin for Tau Mail — without the tracking or data mining.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-3">Plans</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">
            All plans include end-to-end privacy. Cancel anytime.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-2xl border flex flex-col ${
                  plan.highlight
                    ? 'border-yellow-400/50 bg-yellow-400/5 shadow-lg shadow-yellow-400/10'
                    : 'border-gray-800 bg-gray-900/30'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {plan.badge && (
                    <span
                      className={`text-xs uppercase tracking-wide font-semibold ${
                        plan.highlight ? 'text-yellow-400' : 'text-gray-400'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{plan.name}</h3>
                <ul className="space-y-2 text-sm text-gray-400 mb-6 flex-1">
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-yellow-400 shrink-0" />
                    {plan.mailboxes}
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-yellow-400 shrink-0" />
                    {plan.domains}
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-yellow-400 shrink-0" />
                    End-to-end privacy
                  </li>
                </ul>
                <div className="mb-5">
                  <span className="text-2xl font-bold text-yellow-400">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 text-sm">{plan.period}</span>}
                  {plan.priceNote && (
                    <p className="text-xs text-gray-500 mt-1.5">{plan.priceNote}</p>
                  )}
                  {plan.contactEmail && (
                    <p className="text-sm text-gray-400 mt-2">
                      <a href={`mailto:${plan.contactEmail}`} className="text-yellow-400 hover:text-yellow-300">
                        {plan.contactEmail}
                      </a>
                    </p>
                  )}
                </div>
                {plan.contactEmail ? (
                  <a
                    href={`mailto:${plan.contactEmail}?subject=Tau%20Mail%20Workspace%20Enterprise`}
                    className="w-full py-2.5 text-center border border-gray-600 text-white rounded-lg font-semibold hover:bg-gray-800/50 transition-all text-sm"
                  >
                    {plan.cta}
                  </a>
                ) : plan.available ? (
                  <a
                    href={plan.stripeLink || `#get-started?plan=${plan.planId}`}
                    {...(plan.stripeLink
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="w-full py-2.5 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all text-sm"
                  >
                    {plan.cta}
                    {plan.stripeLink && <ExternalLink className="w-3.5 h-3.5" />}
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-2.5 text-center bg-gray-800 text-gray-500 rounded-lg font-semibold cursor-not-allowed text-sm"
                  >
                    {plan.cta}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-14">
            <h3 className="text-lg font-semibold text-white text-center mb-2">
              How we compare to Google Workspace
            </h3>
            <p className="text-gray-500 text-center text-sm mb-6 max-w-2xl mx-auto">
              Same tier alignment as Google — with transparent math. Google prices are per user;
              Tau Mail Starter is a flat team rate, Business is per user at a lower rate.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/40">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-4 text-gray-400 font-medium">Tier</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Google Workspace</th>
                    <th className="text-left p-4 text-yellow-400 font-medium">Tau Mail Workspace</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Example total</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingComparison.map((row) => (
                    <tr key={row.tier} className="border-b border-gray-800/80 last:border-0">
                      <td className="p-4 text-gray-300 font-medium">{row.tier}</td>
                      <td className="p-4 text-gray-400">{row.googleLabel}</td>
                      <td className="p-4 text-gray-300">{row.tauLabel}</td>
                      <td className="p-4 text-gray-400 whitespace-nowrap">
                        {row.tauTotal !== null ? (
                          <>
                            <span className="text-gray-500">{row.exampleUsers} users: </span>
                            Google {fmtUsd(row.googleTotal)}
                            <span className="text-gray-600"> vs </span>
                            Tau {fmtUsd(row.tauTotal)}
                          </>
                        ) : (
                          <>
                            <span className="text-gray-500">{row.exampleUsers} users: </span>
                            Google {fmtUsd(row.googleTotal)}
                            <span className="text-gray-600"> — contact sales</span>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {savingsExamples.map((ex) => (
                <div
                  key={ex.tier}
                  className="p-4 rounded-xl border border-gray-800 bg-gray-900/30 text-sm"
                >
                  <div className="text-white font-medium mb-1">{ex.tier}</div>
                  <p className="text-gray-400 leading-relaxed">
                    {ex.users} users — Google {fmtUsd(ex.googleTotal)}/mo vs Tau {fmtUsd(ex.tauTotal)}/mo.
                    <span className="text-yellow-400/90"> Save {fmtUsd(ex.saved)}/mo ({ex.pct}%).</span>
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 text-center mt-4">
              Google rates: Business Starter {fmtUsd(GOOGLE.starterPerUser)}/user, Standard{' '}
              {fmtUsd(GOOGLE.standardPerUser)}/user, Plus {fmtUsd(GOOGLE.plusPerUser)}/user (USD, annual plan).
            </p>
          </div>
        </div>
      </section>

      {/* Interest form */}
      <section id="get-started" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Get started</h2>
            <p className="text-gray-400">
              Subscribe or sign up and we&apos;ll provision your workspace within a few minutes.
            </p>
          </div>

          {submitted ? (
            <div className="text-center p-8 bg-green-500/10 border border-green-500/30 rounded-2xl">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Request received</h3>
              <p className="text-gray-400">
                We&apos;ll contact you at <span className="text-yellow-400">{email}</span> to configure{' '}
                <span className="text-yellow-400">{domain || 'your domain'}</span>.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleInterest}
              className="p-8 bg-gray-900/60 border border-gray-800 rounded-2xl space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Work email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                  placeholder="you@yourcompany.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                  placeholder="Your Company Inc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Domain for email
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                  placeholder="yourcompany.com"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all"
              >
                Request workspace
              </button>
              <p className="text-xs text-gray-500 text-center">
                Already provisioned?{' '}
                <Link href="/taumail" className="text-yellow-400 hover:text-yellow-300">
                  Sign in to Tau Mail
                </Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </AppShell>
  );
}
