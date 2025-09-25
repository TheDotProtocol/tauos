'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Star, Shield, Users, Zap, Globe, Server, 
  Lock, Database, Activity, Settings, Bell, 
  ArrowRight, Download, Mail, Cloud, User, Key
} from 'lucide-react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('yearly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals and small teams',
      price: { monthly: 0, yearly: 0 },
      features: [
        'TauMail & TauCloud (5 GB)',
        'Basic support',
        'Standard encryption',
        'Community forum access',
        'Basic privacy controls'
      ],
      cta: 'Start Free',
      popular: false,
      icon: User
    },
    {
      name: 'Pro',
      description: 'For growing teams up to 25 users',
      price: { monthly: 49, yearly: 499 },
      features: [
        '50 GB/user storage',
        'Custom domains',
        'Priority support',
        'Advanced security features',
        'Team collaboration tools',
        'API access',
        'Advanced privacy controls'
      ],
      cta: 'Start Pro Trial',
      popular: true,
      icon: Users
    },
    {
      name: 'Business',
      description: 'For organizations with 26-250 users',
      price: { monthly: 199, yearly: 1999 },
      features: [
        '200 GB/user storage',
        'MDM & OTA management',
        'SSO integration',
        'DLP policies',
        'Advanced compliance',
        'Dedicated support',
        'Custom integrations',
        'Audit trails'
      ],
      cta: 'Contact Sales',
      popular: false,
      icon: Shield
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with 250+ users',
      price: { monthly: 'Custom', yearly: 'Custom' },
      features: [
        'Unlimited storage',
        'Private hosting',
        'Custom SLAs',
        'On-premise deployment',
        'Training & onboarding',
        '24/7 dedicated support',
        'Custom compliance',
        'White-label options'
      ],
      cta: 'Contact Sales',
      popular: false,
      icon: Server
    }
  ];

  const addOns = [
    {
      name: 'Extra Storage',
      description: 'Additional storage for your team',
      price: { monthly: 2, yearly: 20 },
      unit: 'per 100GB/month'
    },
    {
      name: 'Dedicated Relay',
      description: 'Private email infrastructure',
      price: { monthly: 15, yearly: 150 },
      unit: 'per month'
    },
    {
      name: 'Compliance Pack',
      description: 'GDPR, SOC 2, ISO 27001 compliance',
      price: { monthly: 25, yearly: 250 },
      unit: 'per month'
    },
    {
      name: 'Premium Support',
      description: 'Priority support with SLA guarantees',
      price: { monthly: 20, yearly: 200 },
      unit: 'per month'
    },
    {
      name: 'TauAI Pro',
      description: 'Advanced AI features and voice commands',
      price: { monthly: 10, yearly: 100 },
      unit: 'per user/month'
    },
    {
      name: 'Custom Branding',
      description: 'White-label customization and branding',
      price: { monthly: 50, yearly: 500 },
      unit: 'one-time setup'
    },
    {
      name: 'API Access',
      description: 'Advanced API access and webhooks',
      price: { monthly: 5, yearly: 50 },
      unit: 'per month'
    },
    {
      name: 'Backup & Recovery',
      description: 'Automated backups and disaster recovery',
      price: { monthly: 8, yearly: 80 },
      unit: 'per month'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src="/brand/tauos-logo.svg" alt="TauOS" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-white">Pricing</h1>
                <p className="text-sm text-gray-400">Choose the right plan for your needs</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Choose the plan that fits your privacy and security needs. All plans include our core privacy-first features.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
              Yearly
              <span className="ml-1 text-yellow-400">(Save 15%)</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-yellow-400/50 shadow-lg shadow-yellow-400/10'
                  : 'bg-gray-900/30 backdrop-blur-sm border-gray-800 hover:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  {typeof plan.price[billingCycle as keyof typeof plan.price] === 'number' ? (
                    <div>
                      <span className="text-3xl font-bold text-white">
                        ${plan.price[billingCycle as keyof typeof plan.price]}
                      </span>
                      <span className="text-gray-400 ml-1">
                        /{billingCycle === 'monthly' ? 'mo' : 'year'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-white">
                      {plan.price[billingCycle as keyof typeof plan.price]}
                    </div>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg hover:shadow-yellow-400/25'
                    : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 hover:border-gray-600'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Add-ons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Add-ons & Extensions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <div
                key={addon.name}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-gray-700 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-white mb-2">{addon.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{addon.description}</p>
                <div className="mb-4">
                  {typeof addon.price[billingCycle as keyof typeof addon.price] === 'number' ? (
                    <div>
                      <span className="text-2xl font-bold text-white">
                        ${addon.price[billingCycle as keyof typeof addon.price]}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">
                        {addon.unit}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xl font-bold text-white">
                      {addon.price[billingCycle as keyof typeof addon.price]}
                    </div>
                  )}
                </div>
                <button className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                  Add to Plan
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">Is there a free trial?</h3>
                <p className="text-gray-400">Yes, all paid plans come with a 14-day free trial. No credit card required.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">What about data privacy?</h3>
                <p className="text-gray-400">All plans include our zero-knowledge encryption. We never have access to your data.</p>
              </div>
              <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">Can I self-host?</h3>
                <p className="text-gray-400">Enterprise plans include self-hosting options. Contact sales for details.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <div className="p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-800 rounded-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Join thousands of organizations that trust TauOS for their privacy and security needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                Start Free Trial
              </button>
              <button className="border border-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200">
                Contact Sales
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
