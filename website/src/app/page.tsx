'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Download,
  Play,
  Shield,
  Cloud,
  Settings,
  ChevronDown,
  Menu,
  X,
  Check,
  Star,
  Globe,
  Smartphone,
  Monitor,
  Eye,
  Zap,
  Palette,
  Users,
  Lock,
  Send,
  FileText,
  Trash2,
  EyeOff,
  Folder,
  Image,
  Music,
  Video,
  Archive,
  Sparkles,
  ArrowRight,
  Terminal,
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
  Mail as MailIcon
} from 'lucide-react';

interface DownloadOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  file: string;
  size: string;
  checksum: string;
  recommended?: boolean;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
}

export default function TauOSLandingPage() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const [detectedOS, setDetectedOS] = useState<string>('');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedDownload, setSelectedDownload] = useState<DownloadOption | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const downloadOptions: DownloadOption[] = [
    {
      id: 'iso',
      name: 'TauOS ISO',
      description: 'Bootable ISO for any computer',
      icon: Monitor,
      file: 'tauos-simple-20250730.iso',
      size: '14.9 MB',
      checksum: 'sha256:83fe8b232072572a43018339b140c379e61a739162a12b59c308d31abeed8fa3',
      recommended: true
    },
    {
      id: 'dmg',
      name: 'macOS Installer',
      description: 'Native macOS application',
      icon: Smartphone,
      file: 'TauOS.dmg',
      size: '14.9 MB',
      checksum: 'sha256:83fe8b232072572a43018339b140c379e61a739162a12b59c308d31abeed8fa3'
    },
    {
      id: 'exe',
      name: 'Windows Installer',
      description: 'Windows executable installer',
      icon: Monitor,
      file: 'TauOS-Setup.exe',
      size: '14.9 MB',
      checksum: 'sha256:83fe8b232072572a43018339b140c379e61a739162a12b59c308d31abeed8fa3'
    },
    {
      id: 'linux',
      name: 'Linux Installer',
      description: 'Linux package and AppImage',
      icon: Terminal,
      file: 'TauOS-Linux.AppImage',
      size: '14.9 MB',
      checksum: 'sha256:83fe8b232072572a43018339b140c379e61a739162a12b59c308d31abeed8fa3'
    }
  ];

  const features: Feature[] = [
    {
      id: 'privacy',
      title: 'Privacy First',
      description: 'Zero telemetry, end-to-end encryption, and complete user control over your data.',
      icon: Shield,
      color: 'bg-purple-500/20',
      gradient: 'from-purple-500/20 to-blue-500/20'
    },
    {
      id: 'beauty',
      title: 'Beautiful Design',
      description: 'Modern glassmorphism interface with smooth animations and intuitive interactions.',
      icon: Palette,
      color: 'bg-pink-500/20',
      gradient: 'from-pink-500/20 to-purple-500/20'
    },
    {
      id: 'performance',
      title: 'Lightning Fast',
      description: 'Optimized for speed with minimal resource usage and instant boot times.',
      icon: Zap,
      color: 'bg-yellow-500/20',
      gradient: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      id: 'security',
      title: 'Enterprise Security',
      description: 'Advanced security features with sandboxing, encryption, and secure boot.',
      icon: Lock,
      color: 'bg-green-500/20',
      gradient: 'from-green-500/20 to-emerald-500/20'
    },
    {
      id: 'ecosystem',
      title: 'Complete Ecosystem',
      description: 'TauMail, TauCloud, and TauStore provide everything you need.',
      icon: Cloud,
      color: 'bg-blue-500/20',
      gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 'community',
      title: 'Open Source',
      description: 'Built by the community, for the community. Transparent and collaborative.',
      icon: Users,
      color: 'bg-indigo-500/20',
      gradient: 'from-indigo-500/20 to-purple-500/20'
    }
  ];

  useEffect(() => {
    // OS detection
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mac')) {
      setDetectedOS('mac');
    } else if (userAgent.includes('windows')) {
      setDetectedOS('windows');
    } else {
      setDetectedOS('linux');
    }

    // Intersection Observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const getRecommendedDownload = () => {
    return downloadOptions.find(option => option.recommended) || downloadOptions[0];
  };

  const handleDownload = (option: DownloadOption) => {
    setSelectedDownload(option);
    setShowDownloadModal(true);
  };

  const confirmDownload = () => {
    if (selectedDownload) {
      console.log(`Downloading ${selectedDownload.name}...`);
      setShowDownloadModal(false);
      setSelectedDownload(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.1),transparent_50%)]" />
        <motion.div 
          style={{ y }}
          className="absolute inset-0 opacity-30"
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </motion.div>
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
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">τ</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  TauOS
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:flex items-center space-x-8"
            >
              {[
                { href: '#features', label: 'Features' },
                { href: '#interface', label: 'TauOS Interface' },
                { href: '#download', label: 'Download' },
                { href: '#about', label: 'About' },
                { href: 'https://mail.tauos.org', label: 'TauMail', external: true },
                { href: 'https://cloud.tauos.org', label: 'TauCloud', external: true },
                { href: '/governance', label: 'Governance' },
                { href: '/careers', label: 'Careers' }
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 focus-tau"
                >
                  {item.label}
                </a>
              ))}
            </motion.div>

            {/* Mobile menu button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors focus-tau"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            initial={false}
            animate={isMenuOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-white/10">
              {[
                { href: '#features', label: 'Features' },
                { href: '#interface', label: 'TauOS Interface' },
                { href: '#download', label: 'Download' },
                { href: '#about', label: 'About' },
                { href: 'https://mail.tauos.org', label: 'TauMail', external: true },
                { href: 'https://cloud.tauos.org', label: 'TauCloud', external: true },
                { href: '/governance', label: 'Governance' },
                { href: '/careers', label: 'Careers' }
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Main Heading */}
            <div className="space-y-6">
              <motion.h1 
                className="text-responsive-lg font-black leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-white">TauOS is the world's first</span>
                <br />
                <span className="tau-gradient">privacy-native operating system</span>
                <br />
                <span className="text-blue-400">built for the modern user</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Experience computing the way it should be: private, beautiful, and yours. Built from the ground up with zero telemetry, end-to-end encryption, and complete user sovereignty.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button
                onClick={() => handleDownload(getRecommendedDownload() || downloadOptions[0])}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-lg font-semibold flex items-center space-x-3 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 focus-tau"
              >
                <Download className="w-5 h-5" />
                <span>Download TauOS</span>
                {detectedOS && (
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                    for {detectedOS === 'mac' ? 'macOS' : detectedOS === 'windows' ? 'Windows' : 'Linux'}
                  </span>
                )}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button className="px-8 py-4 border border-white/20 rounded-xl text-lg font-semibold flex items-center space-x-3 transition-all duration-300 hover:bg-white/10 hover:scale-105 focus-tau backdrop-blur-sm">
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
              <Sparkles className="w-8 h-8 text-purple-400" />
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

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Why Choose <span className="tau-gradient">TauOS</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience computing the way it should be: private, beautiful, and yours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section id="interface" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">TauOS Interface</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of computing with our beautiful, intuitive interface designed for productivity and privacy.
            </p>
          </motion.div>

          {/* Interface Carousel */}
          <div className="relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-6 pb-8">
              {[
                {
                  title: "Desktop Dashboard",
                  description: "The central hub of TauOS featuring modular widgets, quick settings, and the iconic τ launcher with glassmorphism effects.",
                  color: "from-purple-500/20 to-blue-500/20",
                  icon: "τ",
                  features: ["Widget System", "Quick Actions", "System Status"],
                  image: "/images/desktop-dashboard.png",
                  hasImage: true
                },
                {
                  title: "TauMail Interface",
                  description: "Complete email solution with Gmail-style interface, encryption badges, and seamless integration with privacy controls.",
                  color: "from-red-500/20 to-pink-500/20",
                  icon: "✉",
                  features: ["End-to-End Encryption", "Zero Tracking", "Custom Domains"],
                  image: "/images/taumail-interface.png",
                  hasImage: true
                },
                {
                  title: "TauCloud Storage",
                  description: "Private cloud storage with client-side encryption, file management, and cross-platform sync with beautiful UI.",
                  color: "from-blue-500/20 to-cyan-500/20",
                  icon: "☁",
                  features: ["Client-Side Encryption", "File Management", "Cross-Platform Sync"],
                  image: "/images/taucloud-interface.png",
                  hasImage: true
                },
                {
                  title: "System Settings",
                  description: "Comprehensive system configuration with privacy controls, security settings, and customization options.",
                  color: "from-green-500/20 to-emerald-500/20",
                  icon: "⚙",
                  features: ["Privacy Controls", "Security Settings", "Customization"],
                  image: "/images/settings-interface.png",
                  hasImage: true
                },
                {
                  title: "Tau Browser",
                  description: "Privacy-first web browser with security indicators, ad blocking, and fingerprinting protection.",
                  color: "from-yellow-500/20 to-orange-500/20",
                  icon: "🌐",
                  features: ["Privacy Protection", "Ad Blocking", "Security Indicators"],
                  image: "/images/browser-interface.png",
                  hasImage: true
                },
                {
                  title: "Tau Store",
                  description: "Application marketplace with privacy scoring, category filtering, and one-click installation.",
                  color: "from-indigo-500/20 to-purple-500/20",
                  icon: "🛒",
                  features: ["Privacy Scoring", "App Discovery", "One-Click Install"],
                  image: "/images/store-interface.png",
                  hasImage: true
                },
                {
                  title: "Mobile Interface",
                  description: "TauOS mobile experience with touch-optimized interface, biometric authentication, and privacy controls.",
                  color: "from-pink-500/20 to-rose-500/20",
                  icon: "📱",
                  features: ["Touch Optimized", "Biometric Auth", "Privacy Controls"],
                  image: "/images/mobile-interface.png",
                  hasImage: true
                }
              ].map((interfaceItem, index) => (
                <motion.div
                  key={interfaceItem.title}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-80 snap-center"
                >
                  <div className="glass-strong p-8 rounded-2xl border border-white/10 h-full">
                    <div className={`w-16 h-16 bg-gradient-to-br ${interfaceItem.color} rounded-2xl flex items-center justify-center mb-6`}>
                      <span className="text-2xl">{interfaceItem.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white">{interfaceItem.title}</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">{interfaceItem.description}</p>
                    
                    {/* Screenshot Placeholder */}
                    {interfaceItem.hasImage && (
                      <div className="mb-6 relative">
                        <div className="w-full h-48 rounded-xl border border-white/10 overflow-hidden">
                          <img 
                            src={interfaceItem.image.replace('.png', '.svg')} 
                            alt={`${interfaceItem.title} Interface`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute top-2 right-2 bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                          Preview
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {interfaceItem.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Carousel Navigation */}
            <div className="flex justify-center space-x-2 mt-8">
              {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                <button
                  key={index}
                  className="w-3 h-3 bg-gray-600 rounded-full hover:bg-purple-400 transition-colors"
                  onClick={() => {
                    const container = document.querySelector('.flex.overflow-x-auto');
                    if (container) {
                      container.scrollTo({
                        left: index * 320,
                        behavior: 'smooth'
                      });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Get <span className="tau-gradient">TauOS</span> Today
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the right version for your system. All downloads include SHA256 checksums for verification.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {downloadOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => handleDownload(option)}
              >
                <div className="glass-strong p-8 rounded-2xl border border-white/10 transition-all duration-300 hover:scale-105 hover:border-purple-500/50">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    {option.recommended && (
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{option.name}</h3>
                  <p className="text-gray-300 mb-4">{option.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{option.size}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Checksums */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 glass-strong p-8 rounded-2xl"
          >
            <h3 className="text-lg font-bold mb-4">SHA256 Checksums</h3>
            <div className="space-y-2 text-sm">
              {downloadOptions.map((option) => (
                <div key={option.id} className="flex justify-between">
                  <span className="text-gray-400">{option.file}:</span>
                  <span className="text-gray-300 code-font">{option.checksum}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              🧬 About <span className="tau-gradient">TauOS</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              TauOS is the world's first privacy-native operating system built for the modern user.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold mb-6 text-purple-400">We believe an operating system should be:</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mt-1">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🔐 Private</h4>
                    <p className="text-gray-300 text-sm">No telemetry, tracking, or spyware. Your digital life belongs to you, not to corporations or governments.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mt-1">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🌍 Open</h4>
                    <p className="text-gray-300 text-sm">Built on secure Linux foundations, TauOS gives you the transparency and control you deserve.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mt-1">
                    <Monitor className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🖱️ User-Friendly</h4>
                    <p className="text-gray-300 text-sm">No terminal required. No complex configurations. No steep learning curves.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center mt-1">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">💨 Fast</h4>
                    <p className="text-gray-300 text-sm">Lightweight and responsive on almost any hardware. Boot fast, run fast, stay fast.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mt-1">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">🎨 Beautiful</h4>
                    <p className="text-gray-300 text-sm">Design that delights without distraction. Every pixel crafted to enhance your experience.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold mb-6 text-blue-400">The TauOS Story</h3>
              <p className="text-gray-300 mb-6">
                Developed by a tight knit forward futuristic thinking minds with zero bloat and zero compromises, TauOS marks the beginning of a new era in computing — one where you are back in control.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Built for Real People</h4>
                  <p className="text-gray-300 text-sm">We didn't build TauOS for tech enthusiasts or system administrators. We built it for students, professionals, creators, and families who want their computers to work for them, not against them.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Privacy by Design</h4>
                  <p className="text-gray-300 text-sm">In a world where every click is tracked and every keystroke is monetized, TauOS stands as a beacon of digital sovereignty. We believe privacy isn't a feature — it's the foundation of human dignity in the digital age.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">The Future of Computing</h4>
                  <p className="text-gray-300 text-sm">TauOS isn't just an operating system — it's a statement. A statement that technology can be both powerful and respectful, both beautiful and secure, both accessible and uncompromising.</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-xl text-gray-300 italic">
              Join the revolution. Take back control. Experience TauOS.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">τ</span>
                </div>
                <span className="text-xl font-bold">TauOS</span>
              </div>
              <p className="text-gray-300">
                The future of computing, built for privacy and security.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">TauOS</a></li>
                <li><a href="https://mail.tauos.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TauMail</a></li>
                <li><a href="https://cloud.tauos.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TauCloud</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="/governance" className="hover:text-white transition-colors">Governance</a></li>
                <li><a href="/legal" className="hover:text-white transition-colors">Legal</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Forum</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TauOS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Download Modal */}
      {showDownloadModal && selectedDownload && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDownloadModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-strong p-8 rounded-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4">Download {selectedDownload.name}</h3>
            <p className="text-gray-300 mb-6">{selectedDownload.description}</p>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">File:</span>
                <span className="text-white code-font">{selectedDownload.file}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Size:</span>
                <span className="text-white">{selectedDownload.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Checksum:</span>
                <span className="text-white code-font text-xs">{selectedDownload.checksum}</span>
              </div>
            </div>
            <div className="flex space-x-4 mt-8">
              <button
                onClick={confirmDownload}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Download
              </button>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="flex-1 border border-white/20 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 