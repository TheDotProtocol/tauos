/* Ported from src/app/legal/privacy/page.tsx — content preserved from legacy site */
import { motion } from 'framer-motion';
import {
  Shield, Lock, Eye, Users, Database, Globe, Mail, Phone, MapPin,
  ArrowRight, ExternalLink, CheckCircle, Star, Zap, Code, Building,
  Target, Award, Heart, Scale, Monitor, Smartphone, FileText
} from 'lucide-react';

export function PrivacyContent() {
  return (
    <div className="min-h-screen bg-black text-white">
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
                Privacy Policy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              <span className="text-yellow-400 font-semibold">Effective Date:</span> September 12, 2025
              <br />
              <span className="text-yellow-400 font-semibold">Last Updated:</span> September 12, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Commitment Section */}
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
              <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Our Commitment to Privacy
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              At TauCore™, privacy isn't just a feature—it's our foundation. We believe that your data belongs to you, and we've built our entire ecosystem around this principle. This Privacy Policy explains how we collect, use, and protect your information when you use TauCore™ services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Information We Collect Section */}
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
              <Database className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Information We Collect
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                title: "Account Information",
                description: "When you create an account, we collect only the essential information needed to provide our services:",
                items: [
                  "Email address (for account verification and communication)",
                  "Username (chosen by you)",
                  "Password (encrypted and never stored in plain text)",
                  "Full name (optional, for personalization)"
                ]
              },
              {
                title: "Usage Data",
                description: "We collect minimal usage data to improve our services:",
                items: [
                  "App performance metrics (anonymized)",
                  "Error logs (for debugging, no personal data)",
                  "Feature usage statistics (aggregated and anonymous)"
                ]
              }
            ].map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
                <p className="text-gray-300 mb-6">{section.description}</p>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Use Information Section */}
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
                How We Use Your Information
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We use your information solely to provide and improve our services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "To provide TauMail, TauCloud, TauID, and other TauCore™ services",
              "To authenticate your identity and secure your account",
              "To send important service notifications (not marketing)",
              "To improve our applications and fix bugs",
              "To ensure compliance with legal obligations"
            ].map((use, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4 p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <p className="text-gray-300">{use}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sharing Section */}
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
              <Lock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Data Sharing and Disclosure
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              <span className="text-yellow-400 font-semibold">We do not sell, rent, or trade your personal information.</span>
            </p>
          </motion.div>

          <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
            <p className="text-lg text-gray-300 mb-6">
              We may share your information only in these limited circumstances:
            </p>
            <ul className="space-y-4">
              {[
                "With your explicit consent",
                "To comply with legal obligations or court orders",
                "To protect our rights, property, or safety",
                "With service providers who help us operate our services (under strict confidentiality agreements)"
              ].map((circumstance, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">{circumstance}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Data Security Section */}
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
              <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Data Security
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We implement industry-leading security measures to protect your data.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "End-to-end encryption for all communications",
              "Zero-knowledge architecture for file storage",
              "Regular security audits and penetration testing",
              "Secure data centers with physical and digital security",
              "Employee access controls and background checks"
            ].map((measure, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4 p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <p className="text-gray-300">{measure}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Rights Section */}
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
              <Scale className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Your Rights
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              You have the following rights regarding your personal data.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "Access: Request a copy of your personal data",
              "Rectification: Correct inaccurate or incomplete data",
              "Erasure: Request deletion of your personal data",
              "Portability: Export your data in a machine-readable format",
              "Restriction: Limit how we process your data",
              "Objection: Object to certain types of data processing"
            ].map((right, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4 p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <p className="text-gray-300">{right}</p>
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
                Contact Us
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              If you have any questions about this Privacy Policy or our data practices, please contact us.
            </p>
            
            <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Privacy Team</h3>
                  <p className="text-gray-300 mb-2">Email: <a href="mailto:privacy@tauos.org" className="text-yellow-400 hover:text-yellow-300">privacy@tauos.org</a></p>
                  <p className="text-gray-300 mb-2">Phone: +1 1800 TauCore™</p>
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

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <img src="/brand/tauos-logo.svg" alt="TauCore™" className="h-8 w-auto" />
              <span className="text-xl font-bold text-white">Tau OS</span>
            </div>
            <p className="text-gray-400">© 2026 Tau Foundation & Tau LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}