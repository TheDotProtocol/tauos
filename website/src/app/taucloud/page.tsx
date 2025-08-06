'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud,
  Shield,
  Lock,
  EyeOff,
  Download,
  Globe,
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Globe2,
  FileText,
  Folder,
  Image,
  Music,
  Video,
  Archive,
  Search,
  Filter,
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
  Smartphone as Phone,
  Heart,
  Code,
  GitBranch,
  Github,
  Twitter,
  Linkedin,
  Clock,
  Calendar,
  MessageSquare,
  FileImage,
  FileVideo,
  FileAudio,
  FileText as FileTextIcon,
  FolderOpen,
  Share2,
  Copy,
  Trash2,
  Edit3,
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

export default function TauCloudPage() {
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Client-Side Encryption",
      description: "Files are encrypted before they reach our servers with AES-256 encryption",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: <EyeOff className="w-8 h-8 text-green-500" />,
      title: "Zero-Knowledge Privacy",
      description: "We can't see your files, even if we wanted to. Complete privacy by design",
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: <Server className="w-8 h-8 text-purple-500" />,
      title: "Self-Host Option",
      description: "Deploy on your own infrastructure for maximum control and complete sovereignty",
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: <Globe2 className="w-8 h-8 text-orange-500" />,
      title: "Cross-Platform Sync",
      description: "Access your files from any device, anywhere, with seamless synchronization",
      color: "from-orange-500/20 to-red-500/20"
    }
  ];

  const storagePlans = [
    {
      name: "Free",
      storage: "5 GB",
      price: "$0",
      features: ["Client-side encryption", "Zero-knowledge privacy", "Cross-platform sync", "Basic support"]
    },
    {
      name: "Pro",
      storage: "100 GB",
      price: "$5/month",
      features: ["Everything in Free", "Advanced sharing", "Version history", "Priority support"]
    },
    {
      name: "Enterprise",
      storage: "1 TB",
      price: "$20/month",
      features: ["Everything in Pro", "Custom domains", "Admin dashboard", "Dedicated support"]
    }
  ];

  const fileTypes = [
    { icon: <Folder className="w-12 h-12 text-blue-400" />, name: "Documents", desc: "PDFs, Word docs, spreadsheets" },
    { icon: <Image className="w-12 h-12 text-green-400" />, name: "Photos", desc: "High-resolution images and albums" },
    { icon: <Music className="w-12 h-12 text-purple-400" />, name: "Music", desc: "Your music library, anywhere" },
    { icon: <Video className="w-12 h-12 text-red-400" />, name: "Videos", desc: "HD videos and movies" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.1),transparent_50%)]" />
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 80%, rgba(59,130,246,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(16,185,129,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(139,92,246,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, rgba(59,130,246,0.1) 0%, transparent 50%)"
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Cloud className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  TauCloud
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
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg">
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
                  <span className="text-white">Private, secure cloud</span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                    storage for everyone
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Store your files with complete privacy. TauCloud uses client-side encryption 
                  and zero-knowledge architecture to ensure your data stays yours.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-lg font-semibold flex items-center space-x-3 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
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
                <Sparkles className="w-8 h-8 text-blue-400" />
              </motion.div>
              
              <motion.div 
                className="absolute top-1/3 right-1/4 opacity-20"
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-6 h-6 text-green-400" />
              </motion.div>
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
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">TauCloud</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built with privacy-first principles and modern security standards
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

      {/* File Types Section */}
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
              Store <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Everything</span> Securely
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              All your files, encrypted and synced across devices
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {fileTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  {type.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{type.name}</h3>
                <p className="text-gray-400 text-sm">{type.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Storage Plans Section */}
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
              Choose Your <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Plan</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start free and upgrade as you grow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storagePlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 backdrop-blur-sm ${
                  plan.name === "Pro" ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-blue-400 mb-2">{plan.price}</div>
                  <div className="text-gray-400">{plan.storage} storage</div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                  plan.name === "Pro" 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white" 
                    : "bg-gray-700/50 hover:bg-gray-600/50 text-white border border-gray-600"
                }`}>
                  {plan.name === "Free" ? "Get Started" : "Choose Plan"}
                </button>
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
              <p className="text-xl text-gray-300">Join thousands of users who have taken control of their data privacy</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <label className="block text-lg font-semibold text-gray-200">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-lg"
                />
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105">
                  Create Free Account
                </button>
              </div>

              <div className="space-y-6">
                <label className="block text-lg font-semibold text-gray-200">Custom Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="yourdomain.com"
                  className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-lg"
                />
                <button className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-white py-4 rounded-xl font-semibold text-lg border border-gray-600 transition-all duration-300 hover:scale-105">
                  Configure Domain
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400">
                By signing up, you agree to our{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</a>
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">TauCloud</span>
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