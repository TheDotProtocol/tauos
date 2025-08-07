'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail,
  Shield,
  Lock,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Globe,
  Search,
  Edit3,
  FileText,
  Inbox,
  Send,
  Star,
  Archive,
  Settings,
  Bell,
  User,
  ChevronRight,
  Play,
  Sparkles,
  Key,
  Smartphone,
  Monitor,
  Tablet,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Heart,
  Code,
  GitBranch,
  Github,
  Twitter,
  Linkedin,
  Clock,
  Calendar,
  MessageSquare,
  Video,
  Phone as PhoneIcon,
  FileImage,
  FileVideo,
  FileAudio,
  FileText as FileTextIcon,
  FolderOpen,
  Share2,
  Copy,
  Trash2,
  MoreHorizontal,
  Plus,
  Minus,
  X,
  Check,
  AlertCircle,
  Info,
  ExternalLink,
  Download as DownloadIcon,
  Upload,
  RefreshCw,
  RotateCcw,
  Save,
  Eye,
  EyeOff as EyeOffIcon,
  Unlock,
  Key as KeyIcon,
  Fingerprint,
  Shield as ShieldIcon,
  Zap as ZapIcon,
  Globe as GlobeIcon,
  Cloud,
  Database as DatabaseIcon,
  Server as ServerIcon,
  Cpu as CpuIcon,
  HardDrive as HardDriveIcon,
  Wifi as WifiIcon,
  Battery as BatteryIcon,
  Smartphone as SmartphoneIcon,
  Monitor as MonitorIcon,
  Tablet as TabletIcon,
  Server as ServerIcon2,
  Database as DatabaseIcon2,
  Cpu as CpuIcon2,
  HardDrive as HardDriveIcon2,
  Wifi as WifiIcon2,
  Battery as BatteryIcon2,
  Smartphone as SmartphoneIcon2,
  Monitor as MonitorIcon2,
  Tablet as TabletIcon2,
  Server as ServerIcon3,
  Database as DatabaseIcon3,
  Cpu as CpuIcon3,
  HardDrive as HardDriveIcon3,
  Wifi as WifiIcon3,
  Battery as BatteryIcon3,
  Smartphone as SmartphoneIcon3,
  Monitor as MonitorIcon3,
  Tablet as TabletIcon3
} from 'lucide-react';

export default function TauMailPage() {
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "End-to-End Encryption",
      description: "Your emails are encrypted before they leave your device with military-grade AES-256 encryption",
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: <EyeOff className="w-8 h-8 text-blue-500" />,
      title: "Zero Tracking",
      description: "No tracking pixels, no data mining, no surveillance. Complete privacy by design",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-500" />,
      title: "Custom Domains",
      description: "Use your own domain with full control. Professional email addresses for your brand",
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: <Server className="w-8 h-8 text-orange-500" />,
      title: "Self-Host Option",
      description: "Deploy on your own servers for maximum control and complete sovereignty",
      color: "from-orange-500/20 to-red-500/20"
    }
  ];

  const stats = [
    { number: "99.9%", label: "Uptime Guarantee", icon: <Zap className="w-6 h-6 text-yellow-500" /> },
    { number: "256-bit", label: "AES Encryption", icon: <Lock className="w-6 h-6 text-green-500" /> },
    { number: "0", label: "Tracking Pixels", icon: <EyeOff className="w-6 h-6 text-blue-500" /> },
    { number: "∞", label: "Custom Domains", icon: <Globe className="w-6 h-6 text-purple-500" /> }
  ];

  const integrations = [
    { name: "TauCloud", icon: <Cloud className="w-6 h-6 text-blue-500" />, desc: "Seamless file sharing" },
    { name: "TauCalendar", icon: <Calendar className="w-6 h-6 text-green-500" />, desc: "Smart scheduling" },
    { name: "TauContacts", icon: <Users className="w-6 h-6 text-purple-500" />, desc: "Contact management" },
    { name: "TauTasks", icon: <CheckCircle className="w-6 h-6 text-orange-500" />, desc: "Task organization" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.1),transparent_50%)]" />
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 80%, rgba(139,92,246,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(59,130,246,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(16,185,129,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, rgba(139,92,246,0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  TauMail
                </span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-6"
            >
              <a href="/" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
                Back to TauOS
              </a>
              <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                Sign In
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Main Heading */}
              <div className="space-y-6">
                <motion.h1 
                  className="text-6xl md:text-7xl font-black leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="text-white">Secure, smart, and</span>
                  <br />
                  <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    private email
                  </span>
                  <br />
                  <span className="text-blue-400">for everyone</span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Get more done with TauMail. Now integrated with TauCloud, TauCalendar, and more, all in one place. 
                  Built with privacy-first principles and zero tracking.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <button className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-lg font-semibold flex items-center space-x-3 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button className="px-8 py-4 border border-white/20 rounded-xl text-lg font-semibold flex items-center space-x-3 transition-all duration-300 hover:bg-white/10 hover:scale-105 backdrop-blur-sm">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </motion.div>

              {/* Floating Elements */}
              <motion.div 
                className="absolute top-1/4 left-1/4 opacity-20"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-8 h-8 text-red-400" />
              </motion.div>
              
              <motion.div 
                className="absolute top-1/3 right-1/4 opacity-20"
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-6 h-6 text-blue-400" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">TauAI in </span>
              <span className="bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">TauMail</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Save time managing your inbox at home or on the go with TauAI. Use TauAI with your TauOS Premium plan 
              for personal use or as part of your TauOS Workspace plan for work.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Write better emails with the help of AI",
                description: "TauAI in TauMail can compose well-written drafts or replies for you to edit, personalize and quickly hit send.",
                icon: <Edit3 className="w-12 h-12 text-red-400" />,
                color: "from-red-500/20 to-pink-500/20"
              },
              {
                title: "Search your inbox in a whole new way",
                description: "TauAI can answer complex questions from your inbox or TauCloud files to help find what you're looking for.",
                icon: <Search className="w-12 h-12 text-blue-400" />,
                color: "from-blue-500/20 to-cyan-500/20"
              },
              {
                title: "See the important details, summarized",
                description: "Stay on top of lengthy email chains with built-in email summarization powered by TauAI.",
                icon: <FileText className="w-12 h-12 text-green-400" />,
                color: "from-green-500/20 to-emerald-500/20"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${feature.color} border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
                  <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Email that's <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">secure</span>, 
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> private</span>, and 
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> puts you in control</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mt-1">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">We never use your TauMail content for any ads purposes</h3>
                    <p className="text-gray-300 text-lg">TauMail uses industry-leading encryption for all messages you receive and send. We never use your TauMail content to personalize ads.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mt-1">
                    <EyeOff className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">TauMail keeps over a billion people safe every day</h3>
                    <p className="text-gray-300 text-lg">TauMail blocks 99.9% of spam, malware, and dangerous links from ever reaching your inbox.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mt-1">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">The most advanced phishing protections available</h3>
                    <p className="text-gray-300 text-lg">When a suspicious email arrives that could be legitimate, TauMail lets you know, keeping you in control.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mt-1">
                    <Key className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Best-in-class controls over emails you send</h3>
                    <p className="text-gray-300 text-lg">Confidential Mode lets you set expirations and require recipients to verify by text. You can also remove options to forward, copy, download, and print.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mt-1">
                    <Fingerprint className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">End-to-end encryption by default</h3>
                    <p className="text-gray-300 text-lg">All your emails are encrypted with AES-256 before transmission. Only you and your recipients can read the content.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mt-1">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Custom domains with full control</h3>
                    <p className="text-gray-300 text-lg">Use your own domain for professional email addresses. Full DNS control and custom branding options.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Get more done with <span className="bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">TauMail</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stay connected and get organized. Start a Chat, jump into a video call with Meet, or collaborate in a Doc, all right from TauMail.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${feature.color} border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
                  <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              TauMail is now part of <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">TauOS Workspace</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Collaborate faster, from any device, anytime, all in one place. TauOS Workspace is a set of productivity 
              and collaboration tools that helps individuals, teams, and businesses stay on top of everything.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {integration.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">{integration.name}</h3>
                  <p className="text-gray-300 leading-relaxed">{integration.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-12 border border-white/10 backdrop-blur-sm"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-gray-300">Join thousands of users who have taken control of their email privacy</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <label className="block text-lg font-semibold text-gray-200">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 text-lg"
                />
                <button 
                  onClick={() => {
                    if (email) {
                      // Redirect to actual TauMail application for registration
                      window.open('https://mail.tauos.org', '_blank');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  Create Free Account
                </button>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Already have an account?</p>
                  <button 
                    onClick={() => window.open('https://mail.tauos.org', '_blank')}
                    className="text-red-400 hover:text-red-300 transition-colors text-sm underline"
                  >
                    Sign in to TauMail
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <label className="block text-lg font-semibold text-gray-200">Custom Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="yourdomain.com"
                  className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 text-lg"
                />
                <button 
                  onClick={() => {
                    if (domain) {
                      // Redirect to actual TauMail application for domain configuration
                      window.open('https://mail.tauos.org', '_blank');
                    }
                  }}
                  className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-white py-4 rounded-xl font-semibold text-lg border border-gray-600 transition-all duration-300 hover:scale-105"
                >
                  Configure Domain
                </button>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Need help with setup?</p>
                  <a href="#" className="text-red-400 hover:text-red-300 transition-colors text-sm underline">
                    View Documentation
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400">
                By signing up, you agree to our{' '}
                <a href="#" className="text-red-400 hover:text-red-300 transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-red-400 hover:text-red-300 transition-colors">Privacy Policy</a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">TauMail</span>
            </div>
            
            <div className="flex space-x-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="/" className="hover:text-white transition-colors">Back to TauOS</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 