'use client';

import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, MessageCircle, Users, Globe, Building, Clock,
  ArrowRight, ExternalLink, CheckCircle, Star, Zap, Shield, Lock, Eye
} from 'lucide-react';

export default function ContactPage() {
  return (
    <MarketingPageShell
      title="Contact"
      subtitle="Reach Tau Core Inc. — support, partnerships, and press."
    >
      {/* Contact Methods Section */}
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
              <MessageCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Get in Touch
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Multiple ways to reach us depending on your needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Mail,
                title: "General Inquiries",
                description: "Questions about Tau OS, partnerships, or general information",
                contact: "hello@tauos.org",
                responseTime: "24 hours"
              },
              {
                icon: Users,
                title: "Support",
                description: "Technical support and help with Tau OS services",
                contact: "support@tauos.org",
                responseTime: "24 hours"
              },
              {
                icon: Building,
                title: "Press & Media",
                description: "Media inquiries, press releases, and interview requests",
                contact: "press@tauos.org",
                responseTime: "48 hours"
              },
              {
                icon: Globe,
                title: "Partnerships",
                description: "Business partnerships and collaboration opportunities",
                contact: "partnerships@tauos.org",
                responseTime: "72 hours"
              }
            ].map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300 group cursor-pointer"
                onClick={() => window.location.href = `mailto:${method.contact}`}
              >
                <method.icon className="w-12 h-12 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-3">{method.title}</h3>
                <p className="text-gray-300 mb-4">{method.description}</p>
                <div className="space-y-2">
                  <p className="text-yellow-400 font-semibold">{method.contact}</p>
                  <p className="text-sm text-gray-400">Response time: {method.responseTime}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations Section */}
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
              <MapPin className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Our Offices
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Visit us at our offices around the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                city: "San Francisco, USA",
                address: "2261 Market St, San Francisco, CA 94114",
                phone: "+1 1800 Tau OS",
                email: "hello@tauos.org",
                description: "Our headquarters and main development center"
              },
              {
                city: "Kuala Lumpur, Malaysia",
                address: "IB Tower, Level 33, 8, Lrg Binjai, Kuala Lumpur, 50450 Kuala Lumpur",
                phone: "+60 178446206",
                email: "malaysia@tauos.org",
                description: "Asia-Pacific operations and regional support"
              }
            ].map((office, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{office.city}</h3>
                <p className="text-gray-300 mb-6">{office.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">{office.address}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">{office.phone}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">{office.email}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How quickly do you respond to inquiries?",
                answer: "We typically respond to general inquiries within 24 hours, support requests within 24 hours, and press inquiries within 48 hours."
              },
              {
                question: "Do you offer phone support?",
                answer: "Yes, we offer phone support during business hours. Call +1 1800 Tau OS for general inquiries or +60 178446206 for Asia-Pacific support."
              },
              {
                question: "Can I visit your offices?",
                answer: "Yes, we welcome visitors by appointment. Please contact us in advance to schedule a visit to either our San Francisco or Kuala Lumpur offices."
              },
              {
                question: "Do you have a community forum?",
                answer: "Yes, we have an active community forum where users can get help, share ideas, and connect with other Tau OS users worldwide."
              },
              {
                question: "How can I report a security issue?",
                answer: "For security vulnerabilities, please email security@tauos.org. We take security seriously and will respond promptly to all security reports."
              },
              {
                question: "Do you offer enterprise support?",
                answer: "Yes, we offer enterprise support and custom solutions. Contact partnerships@tauos.org to discuss your enterprise needs."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-white mb-4">{faq.question}</h3>
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
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
              <Mail className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Send Us a Message
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have a specific question or need? Send us a message and we'll get back to you as soon as possible.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
