'use client';

import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import { motion } from 'framer-motion';
import {
  Cookie, Shield, Lock, Eye, Users, Globe, Mail, Phone, MapPin,
  ArrowRight, ExternalLink, CheckCircle, Star, Zap, Code, Building,
  Target, Award, Heart, Scale, Monitor, Smartphone, FileText, Database
} from 'lucide-react';

export default function CookiesPolicyPage() {
  return (
    <MarketingPageShell
      title="Cookie Policy"
      subtitle="How we use cookies across TAU CORE properties."
    >
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
                Cookies Policy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              <span className="text-yellow-400 font-semibold">No Tracking Cookies</span> - We respect your privacy completely.
            </p>
          </motion.div>
        </div>
      </section>

      {/* No Tracking Cookies Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Cookie className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                No Tracking Cookies
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              TAU CORE™ uses only essential cookies for security and functionality. We do not use tracking cookies, analytics cookies, or any cookies that compromise your privacy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Essential Cookies Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Essential Cookies
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We use only the minimum cookies necessary for our services to function properly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "Authentication Tokens",
                description: "Secure tokens that keep you logged in to your account. These are essential for service functionality and cannot be disabled."
              },
              {
                icon: Shield,
                title: "Security Settings",
                description: "Cookies that store your security preferences and help protect your account from unauthorized access."
              },
              {
                icon: Eye,
                title: "Session Management",
                description: "Temporary cookies that manage your active session and ensure secure communication with our servers."
              }
            ].map((cookie, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <cookie.icon className="w-16 h-16 text-yellow-400 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">{cookie.title}</h3>
                <p className="text-gray-300 leading-relaxed">{cookie.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Don't Use Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Eye className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                What We Don't Use
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We never use cookies that compromise your privacy or track your behavior.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "No tracking cookies",
              "No analytics cookies",
              "No advertising cookies",
              "No social media cookies",
              "No third-party cookies",
              "No behavioral tracking"
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4 p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <p className="text-gray-300">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Control Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Your Control
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              You have complete control over your privacy and data.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Browser Settings",
                description: "You can control cookies through your browser settings. However, disabling essential cookies may affect service functionality."
              },
              {
                icon: Eye,
                title: "Transparency",
                description: "We're completely transparent about our cookie usage. You can see exactly what cookies we use and why."
              },
              {
                icon: Lock,
                title: "Privacy First",
                description: "Our cookie policy is designed with privacy as the foundation. We never use cookies to track or profile users."
              }
            ].map((control, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <control.icon className="w-16 h-16 text-yellow-400 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">{control.title}</h3>
                <p className="text-gray-300 leading-relaxed">{control.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Mail className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Questions About Cookies?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              If you have any questions about our cookie policy, please contact us.
            </p>
            
            <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Privacy Team</h3>
                  <p className="text-gray-300 mb-2">Email: <a href="mailto:privacy@tauos.org" className="text-yellow-400 hover:text-yellow-300">privacy@tauos.org</a></p>
                  <p className="text-gray-300 mb-2">Phone: +1 1800 TAU CORE™</p>
                  <p className="text-gray-300">Address: 2261 Market St, San Francisco, CA 94114</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Malaysia Office</h3>
                  <p className="text-gray-300 mb-2">Email: <a href="mailto:privacy@tauos.org" className="text-yellow-400 hover:text-yellow-300">privacy@tauos.org</a></p>
                  <p className="text-gray-300 mb-2">Phone: +60 178446206</p>
                  <p className="text-gray-300">Address: IB Tower, Level 33, Kuala Lumpur</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
