'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Heart, 
  Zap, 
  Globe, 
  Code, 
  Palette, 
  Shield, 
  Rocket,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
  Award,
  MessageCircle,
  ArrowRight,
  Mail,
  Linkedin,
  Github,
  Twitter
} from 'lucide-react';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <a href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">τ</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  TauOS
                </span>
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:flex items-center space-x-8"
            >
              {[
                { href: '/', label: 'Home' },
                { href: '/governance', label: 'Governance' },
                { href: '/careers', label: 'Careers', active: true },
                { href: '/legal', label: 'Legal' },
                { href: 'https://mail.tauos.org', label: 'TauMail', external: true },
                { href: 'https://cloud.tauos.org', label: 'TauCloud', external: true }
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={`transition-all duration-300 hover:scale-105 focus-tau ${
                    item.active ? 'text-purple-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Join the</span>
              <br />
              <span className="tau-gradient">Revolution</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Help us build the future of privacy-first computing. Work on cutting-edge technology 
              that puts users first and challenges the status quo.
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Fully Remote</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Bleeding Edge Tech</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Mission Driven</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Current Openings</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join our team and help shape the future of privacy-first computing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                title: "UI/UX Designer",
                department: "Design",
                location: "Remote",
                type: "Full-time",
                description: "Create beautiful, intuitive interfaces that put privacy first. Design the future of computing.",
                requirements: [
                  "5+ years of UI/UX design experience",
                  "Strong portfolio of privacy-focused designs",
                  "Experience with design systems and component libraries",
                  "Passion for open source and privacy"
                ],
                benefits: [
                  "Competitive salary + equity",
                  "Fully remote work",
                  "Flexible hours",
                  "Latest hardware and tools"
                ]
              },
              {
                title: "Full Stack Developer",
                department: "Engineering",
                location: "Remote",
                type: "Full-time",
                description: "Build the core applications and infrastructure that power TauOS. Work on cutting-edge technology.",
                requirements: [
                  "3+ years of full-stack development",
                  "Experience with React, Node.js, and TypeScript",
                  "Knowledge of Linux and system programming",
                  "Commitment to privacy and security"
                ],
                benefits: [
                  "Competitive salary + equity",
                  "Fully remote work",
                  "Flexible hours",
                  "Latest hardware and tools"
                ]
              },
              {
                title: "DevOps Engineer",
                department: "Engineering",
                location: "Remote",
                type: "Full-time",
                description: "Build and maintain the infrastructure that keeps TauOS running smoothly and securely.",
                requirements: [
                  "3+ years of DevOps experience",
                  "Experience with Docker, Kubernetes, and cloud platforms",
                  "Knowledge of security best practices",
                  "Passion for automation and reliability"
                ],
                benefits: [
                  "Competitive salary + equity",
                  "Fully remote work",
                  "Flexible hours",
                  "Latest hardware and tools"
                ]
              },
              {
                title: "Security Engineer",
                department: "Security",
                location: "Remote",
                type: "Full-time",
                description: "Ensure TauOS remains the most secure and privacy-focused operating system available.",
                requirements: [
                  "3+ years of security engineering experience",
                  "Experience with Linux security and cryptography",
                  "Knowledge of threat modeling and penetration testing",
                  "Commitment to privacy-first security"
                ],
                benefits: [
                  "Competitive salary + equity",
                  "Fully remote work",
                  "Flexible hours",
                  "Latest hardware and tools"
                ]
              }
            ].map((job, index) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-strong p-8 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{job.title}</h3>
                    <p className="text-gray-400 mb-4">{job.department}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      {job.type}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">{job.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {job.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-gray-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      {job.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-gray-300 text-sm">
                          <Award className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105">
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Our Culture</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're building more than software — we're building a movement for privacy and user sovereignty.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Mission Driven",
                description: "Every line of code we write serves our mission to put users back in control of their digital lives."
              },
              {
                icon: Globe,
                title: "Fully Remote",
                description: "Work from anywhere in the world. We believe talent knows no geographical boundaries."
              },
              {
                icon: Zap,
                title: "Bleeding Edge",
                description: "Work with the latest technologies and push the boundaries of what's possible."
              },
              {
                icon: Users,
                title: "Collaborative",
                description: "We believe the best ideas come from diverse teams working together openly."
              },
              {
                icon: Shield,
                title: "Privacy First",
                description: "Privacy isn't just a feature — it's the foundation of everything we build."
              },
              {
                icon: Rocket,
                title: "Fast Moving",
                description: "We move quickly, iterate often, and ship features that users actually want."
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-strong p-8 rounded-2xl text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Benefits & Perks</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We take care of our team so you can focus on building amazing things.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: DollarSign,
                title: "Competitive Salary",
                description: "Top-tier compensation with equity in a growing company"
              },
              {
                icon: Globe,
                title: "Remote First",
                description: "Work from anywhere with flexible hours and time zones"
              },
              {
                icon: Award,
                title: "Learning Budget",
                description: "Annual budget for courses, conferences, and books"
              },
              {
                icon: Heart,
                title: "Health & Wellness",
                description: "Comprehensive health insurance and wellness programs"
              },
              {
                icon: Code,
                title: "Latest Hardware",
                description: "Top-of-the-line equipment and tools to do your best work"
              },
              {
                icon: Users,
                title: "Team Events",
                description: "Regular team retreats and virtual social events"
              },
              {
                icon: Shield,
                title: "Privacy Focused",
                description: "Work on technology that actually protects user privacy"
              },
              {
                icon: Rocket,
                title: "Early Contributor",
                description: "Join early and help shape the future of computing"
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-strong p-6 rounded-2xl text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{benefit.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Application Process</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We believe in a thoughtful, human-centered hiring process that respects your time and expertise.
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Story-Based Application",
                description: "Tell us your story. We want to understand your journey, your passion for privacy, and why you want to join TauOS."
              },
              {
                step: "2",
                title: "Technical Discussion",
                description: "A collaborative technical discussion where we explore your skills and how they align with our needs."
              },
              {
                step: "3",
                title: "Team Interview",
                description: "Meet the team and learn about our culture, values, and the challenges we're tackling."
              },
              {
                step: "4",
                title: "Offer & Onboarding",
                description: "Welcome to the team! We'll get you set up with everything you need to succeed."
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-strong p-8 rounded-2xl border border-white/10"
              >
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-strong p-12 rounded-2xl"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Join Us?</h2>
            <p className="text-xl text-gray-300 mb-8">
              We're always looking for talented individuals who share our passion for privacy and innovation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-lg font-semibold flex items-center space-x-3 transition-all duration-300 hover:scale-105">
                <Mail className="w-5 h-5" />
                <span>Apply Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 border border-white/20 rounded-xl text-lg font-semibold flex items-center space-x-3 transition-all duration-300 hover:bg-white/10">
                <MessageCircle className="w-5 h-5" />
                <span>Learn More</span>
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-6 text-gray-400">
              <a href="mailto:careers@tauos.org" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span>careers@tauos.org</span>
              </a>
              <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 