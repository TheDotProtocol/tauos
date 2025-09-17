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
  Sparkles,
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
  Mail as MailIcon,
  Rocket,
  Target,
  Award,
  Lightbulb,
  Bug,
  Share,
  Home,
  Store
} from 'lucide-react';

export default function TauOSLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [detectedOS, setDetectedOS] = useState<string>('');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Detect user's operating system
  useEffect(() => {
    const detectOS = () => {
      const userAgent = navigator.userAgent;
      let os = 'Unknown';
      let arch = 'x64';
      
      if (userAgent.indexOf('Win') !== -1) {
        os = 'Windows';
        if (userAgent.indexOf('WOW64') !== -1 || userAgent.indexOf('Win64') !== -1) {
          arch = 'x64';
        } else {
          arch = 'x86';
        }
      } else if (userAgent.indexOf('Mac') !== -1) {
        os = 'macOS';
        if (userAgent.indexOf('Intel') !== -1) {
          arch = 'Intel';
        } else if (userAgent.indexOf('Apple') !== -1) {
          arch = 'Apple Silicon';
        }
      } else if (userAgent.indexOf('Linux') !== -1) {
        os = 'Linux';
        if (userAgent.indexOf('x86_64') !== -1) {
          arch = 'x64';
        } else if (userAgent.indexOf('aarch64') !== -1) {
          arch = 'ARM64';
        }
      }
      
      setDetectedOS(`${os} (${arch})`);
    };

    detectOS();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'community', 'get-involved'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
                <img 
                  src="/brand/tauos-logo.svg" 
                  alt="TauOS Logo" 
                  className="w-12 h-12"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <Terminal className="w-12 h-12 text-yellow-400 hidden" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Tau OS
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Product Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                  <span>Product</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <a href="/desktop" className="p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <div className="font-medium text-white">Desktop</div>
                        <div className="text-sm text-gray-400">Download & install</div>
                      </a>
                      <a href="/mobile" className="p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <div className="font-medium text-white">Mobile</div>
                        <div className="text-sm text-gray-400">Preview available</div>
                      </a>
                    </div>
                    <div className="border-t border-gray-800 pt-3 space-y-2">
                      <a href="/taumail" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <MailIcon className="w-5 h-5 text-blue-400" />
                        <div>
                          <div className="font-medium text-white">TauMail</div>
                          <div className="text-sm text-gray-400">✅ Working - Private email</div>
                        </div>
                      </a>
                      <a href="/taucloud" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <Cloud className="w-5 h-5 text-green-400" />
                        <div>
                          <div className="font-medium text-white">TauCloud</div>
                          <div className="text-sm text-gray-400">🔄 In Development - Encrypted storage</div>
                        </div>
                      </a>
                      <a href="/tauid" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <Shield className="w-5 h-5 text-purple-400" />
                        <div>
                          <div className="font-medium text-white">TauID</div>
                          <div className="text-sm text-gray-400">🔄 In Development - Decentralized identity</div>
                        </div>
                      </a>
                      <a href="/taustore" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <Folder className="w-5 h-5 text-orange-400" />
                        <div>
                          <div className="font-medium text-white">TauStore</div>
                          <div className="text-sm text-gray-400">🔄 In Development - Privacy-scored apps</div>
                        </div>
                      </a>
                      <a href="/taubrowser" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <Globe className="w-5 h-5 text-cyan-400" />
                        <div>
                          <div className="font-medium text-white">TauBrowser</div>
                          <div className="text-sm text-gray-400">🔄 In Development - Privacy browser</div>
                        </div>
                      </a>
                      <a href="/tauai" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        <div>
                          <div className="font-medium text-white">TauAI</div>
                          <div className="text-sm text-gray-400">✅ Working - Privacy-native AI</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enterprise Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                  <span>Enterprise</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 space-y-3">
                    <a href="/enterprise/mdm" className="p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <div className="font-medium text-white">MDM & OTA</div>
                      <div className="text-sm text-gray-400">Device management & updates</div>
                    </a>
                    <a href="/enterprise/security" className="p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <div className="font-medium text-white">Security</div>
                      <div className="text-sm text-gray-400">Compliance & policies</div>
                    </a>
                    <a href="/pricing" className="p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <div className="font-medium text-white">Pricing</div>
                      <div className="text-sm text-gray-400">Plans & enterprise</div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Developers */}
              <a href="/developers" className="text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                Developers
              </a>

              {/* Company Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                  <span>Company</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 space-y-2">
                    <a href="/about" className="p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <div className="font-medium text-white">About</div>
                      <div className="text-sm text-gray-400">Our mission & values</div>
                    </a>
                    <a href="/governance" className="p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <div className="font-medium text-white">Governance</div>
                      <div className="text-sm text-gray-400">Foundation & structure</div>
                    </a>
                    <a href="/investors" className="p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <div className="font-medium text-white">Investors</div>
                      <div className="text-sm text-gray-400">Financials & growth</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.a
              href="#downloads"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Download Beta</span>
            </motion.a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-yellow-400"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-4">
              {[
                { id: 'features', label: 'Features' },
                { id: 'community', label: 'Community' },
                { id: 'get-involved', label: 'Get Involved' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left py-2 text-sm font-medium transition-colors duration-200 ${
                    activeSection === item.id 
                      ? 'text-yellow-400' 
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                <Download className="w-4 h-4" />
                <span>Download Beta</span>
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Main Heading */}
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
              >
                <span className="text-white">Privacy isn't a feature.</span>
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                  It's the foundation.
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
              >
                TauOS is a complete, secure, zero-telemetry operating system for desktop and mobile—with first-party apps, encrypted services, and enterprise controls.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <a href="#downloads" className="group flex items-center space-x-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105">
                <Download className="w-6 h-6" />
                <span>Download TauOS Desktop</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a href="/taumail" className="flex items-center space-x-3 border-2 border-blue-400/30 text-blue-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-400/10 transition-all duration-300">
                <MailIcon className="w-6 h-6" />
                <span>Open TauMail</span>
              </a>

              <a href="/taucloud" className="flex items-center space-x-3 border-2 border-green-400/30 text-green-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-400/10 transition-all duration-300">
                <Cloud className="w-6 h-6" />
                <span>Open TauCloud</span>
              </a>

              <a href="/tauai" className="flex items-center space-x-3 border-2 border-yellow-400/30 text-yellow-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400/10 transition-all duration-300">
                <Sparkles className="w-6 h-6" />
                <span>Try TauAI</span>
              </a>
            </motion.div>

            {/* Trust Strip */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-6 pt-8"
            >
              {[
                'End-to-End Encryption',
                'Zero Telemetry', 
                'Open Standards',
                'GDPR & DPDP Ready',
                'Self-Hosted or Cloud'
              ].map((badge, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>{badge}</span>
                </div>
              ))}
            </motion.div>

            {/* Hero Notes */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-sm text-gray-500 italic"
            >
              No ads. No trackers. No data resale. Ever.
            </motion.p>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-8 pt-8"
            >
              {[
                { label: 'Active Users', value: '50K+' },
                { label: 'Contributors', value: '2.5K+' },
                { label: 'Countries', value: '120+' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-2 text-gray-400"
          >
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Us Section */}
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
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                About Us
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We built TauOS with one idea in mind: technology should belong to people, not the other way around.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Your Data, Your Control</h3>
                <p className="text-gray-300 leading-relaxed">
                  Your data, your conversations, your photos, your work — they're yours. TauOS, TauMail, and TauCloud are here to give you the tools to use technology freely and safely, without losing control of what matters most: your privacy.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  We don't track, we don't sell data, and we don't make you the product. We simply provide the platform — <span className="text-yellow-400 font-semibold">you stay in control.</span>
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Built for Everyone</h3>
                <p className="text-gray-300 leading-relaxed">
                  From kids discovering the internet for the first time, to grandparents staying connected, to professionals managing sensitive work — TauOS is built so that <span className="text-yellow-400 font-semibold">anyone, at any age, can use it with confidence.</span>
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                <div>
                  <div className="font-semibold text-white">Privacy by Design</div>
                  <div className="text-sm text-gray-400">Built from the ground up for your security</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                <h4 className="text-xl font-bold text-white mb-4">Our Promise</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Zero telemetry and tracking</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">End-to-end encryption by default</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Open source and auditable</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Self-hosted or trusted cloud</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Legal & Governance Section */}
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
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Legal & Governance
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              TauOS is developed and maintained under The Tau Foundation, a nonprofit organization inspired by the model of the Linux Foundation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Foundation Structure */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Company Structure</h3>
              
              <div className="space-y-6">
                <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                  <h4 className="text-xl font-bold text-white mb-3">The Tau Foundation (Nonprofit)</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Oversees governance, standards, and open-source development</li>
                    <li>• Protects community interests and ensures transparency</li>
                    <li>• Inspired by the model of the Linux Foundation</li>
                  </ul>
                </div>

                <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                  <h4 className="text-xl font-bold text-white mb-3">Tau LLC (For-profit operations arm)</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Provides hosting, support, and premium services</li>
                    <li>• Ensures financial sustainability while respecting user rights</li>
                    <li>• Operates under the guiding principles of the Tau Foundation</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Governance Principles */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Governance Principles</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-white">User First:</span>
                    <span className="text-gray-300"> We never sell or exploit your data.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-white">No Backdoors:</span>
                    <span className="text-gray-300"> We do not provide hidden access to anyone.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-white">Transparency:</span>
                    <span className="text-gray-300"> If we receive legal requests for data, we publish them in our transparency reports.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-white">Independent Review:</span>
                    <span className="text-gray-300"> Our policies and practices are reviewed by external advisors to ensure accountability.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Compliance</h3>
            <p className="text-gray-300 mb-6 max-w-3xl mx-auto">
              TauOS and related services comply with international privacy and consumer protection standards, including:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: 'GDPR', region: 'European Union', color: 'from-green-500 to-emerald-500' },
                { name: 'CCPA', region: 'California, USA', color: 'from-blue-500 to-cyan-500' },
                { name: 'PDPA', region: 'Asia', color: 'from-purple-500 to-pink-500' },
                { name: 'COPPA', region: 'Children\'s Privacy', color: 'from-yellow-500 to-orange-500' }
              ].map((standard, index) => (
                <div key={standard.name} className={`px-6 py-3 bg-gradient-to-r ${standard.color} rounded-xl text-white text-center`}>
                  <div className="font-bold">{standard.name}</div>
                  <div className="text-sm opacity-90">{standard.region}</div>
                </div>
              ))}
            </div>
            <p className="text-gray-300 mt-6 italic">
              No matter where you are, your rights are respected.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Snapshot Highlights Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Why Choose TauOS?
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Zero Telemetry',
                description: 'Collects nothing by default',
                icon: Shield,
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Encrypted Everything',
                description: 'Mail, files, identity',
                icon: Lock,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Unified UX',
                description: 'Desktop & mobile, light/dark',
                icon: Smartphone,
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Enterprise-Ready',
                description: 'MDM, OTA, policies, SSO',
                icon: Settings,
                color: 'from-yellow-500 to-orange-500'
              },
              {
                title: 'Open Standards',
                description: 'IMAP/SMTP, WebDAV/S3, DID:WEB',
                icon: Globe,
                color: 'from-indigo-500 to-purple-500'
              },
              {
                title: 'Sovereign Deployments',
                description: 'Your cloud or on-prem',
                icon: Cloud,
                color: 'from-rose-500 to-pink-500'
              }
            ].map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-12 h-12 ${highlight.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <highlight.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{highlight.title}</h3>
                <p className="text-gray-400 text-sm">{highlight.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <a href="#why-tauos" className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300">
              <ArrowRight className="w-5 h-5" />
              <span>See the Difference</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Product Overview
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A complete ecosystem of privacy-first applications and services.
            </p>
          </motion.div>

          {/* Desktop Environment */}
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-3xl font-bold mb-4 text-white">Desktop Environment</h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                A modern, performant desktop with glass-morphism UI, system dock, widgets, and 60fps animations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                { name: 'Tau Home', description: 'Quick actions & recent items', icon: Home },
                { name: 'Tau Browser', description: 'Hardened privacy settings', icon: Globe },
                { name: 'Tau Explorer', description: 'Files, tags, smart search', icon: Folder },
                { name: 'Tau Media Player', description: 'Media with sandboxed codecs', icon: Play },
                { name: 'Tau Settings', description: 'Fine-grained controls', icon: Settings },
                { name: 'Tau Store', description: 'Curated, privacy-scored apps', icon: Store }
              ].map((app, index) => (
                <motion.div
                  key={app.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-4 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-yellow-400/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-3">
                    <app.icon className="w-5 h-5 text-black" />
                  </div>
                  <h4 className="font-semibold text-white mb-1">{app.name}</h4>
                  <p className="text-sm text-gray-400">{app.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-lg text-gray-300 mb-4">Download: TauOS Desktop</p>
              <div className="flex flex-wrap justify-center gap-4">
                {['Windows', 'macOS', 'Linux'].map((platform) => (
                  <span key={platform} className="px-4 py-2 bg-gray-800/50 rounded-lg text-gray-300">
                    {platform}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Mobile Preview */}
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-3xl font-bold mb-4 text-white">Mobile (Preview)</h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                A privacy-first mobile experience built with React Native.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-white mb-4">Core Apps</h4>
                <div className="space-y-3">
                  {[
                    { name: 'TauPhone', description: 'Dialer, call history, in-call UI' },
                    { name: 'TauMessages', description: 'SMS/MMS, E2EE chats, ephemeral messages' },
                    { name: 'TauContacts', description: 'Groups, favorites, imports/exports' },
                    { name: 'TauSettings', description: 'Network, permissions, updates' }
                  ].map((app, index) => (
                    <div key={app.name} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-white">{app.name}</div>
                        <div className="text-sm text-gray-400">{app.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-white mb-4">Ecosystem Apps</h4>
                <div className="space-y-3">
                  {[
                    { name: 'TauMail', description: 'Gmail-style UX, E2EE' },
                    { name: 'TauCloud', description: 'iCloud-style storage with client-side encryption' },
                    { name: 'TauID', description: 'DID:WEB identity & verifiable credentials' },
                    { name: 'Tau Store', description: 'Install, rate by privacy score' }
                  ].map((app, index) => (
                    <div key={app.name} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-white">{app.name}</div>
                        <div className="text-sm text-gray-400">{app.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                <Smartphone className="w-5 h-5" />
                <span>Explore Mobile Preview</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* First-Party Services Section */}
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
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                First-Party Services
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Complete ecosystem of privacy-first applications and services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* TauMail */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-blue-400/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <MailIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">TauMail</h3>
                  <p className="text-blue-400 font-medium">✅ Working - Private Email</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">✅ Sovereign SMTP server running on Vultr</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">✅ Frontend integrated with working backend</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">✅ Email delivery to external inboxes working</span>
                </li>
              </ul>
              <button 
                onClick={() => window.open('/taumail', '_blank')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                Launch TauMail
              </button>
            </motion.div>

            {/* TauCloud */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-green-400/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">TauCloud</h3>
                  <p className="text-green-400 font-medium">🔄 In Development - Encrypted Storage</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">🔄 Backend infrastructure ready</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">🔄 Frontend UI in development</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">🔄 S3/WebDAV integration planned</span>
                </li>
              </ul>
              <button 
                onClick={() => window.open('/taucloud', '_blank')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
              >
                Preview TauCloud
              </button>
            </motion.div>

            {/* TauID */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-purple-400/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">TauID</h3>
                  <p className="text-purple-400 font-medium">🔄 In Development - Decentralized Identity</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">🔄 DID:WEB identities in planning</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">🔄 Verifiable credentials framework</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">🔄 Privacy dashboard design phase</span>
                </li>
              </ul>
              <button 
                onClick={() => window.open('/tauid', '_blank')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Learn about TauID
              </button>
            </motion.div>

            {/* TauStore */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-orange-400/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">TauStore</h3>
                  <p className="text-orange-400 font-medium">🔄 In Development - Curated & Transparent</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">🔄 Privacy scoring system in design</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">🔄 App categories and curation framework</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">🔄 Security audit pipeline planned</span>
                </li>
              </ul>
              <button 
                onClick={() => window.open('/taustore', '_blank')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
              >
                Preview TauStore
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
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
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Security & Privacy
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built-in protections that keep your data secure and private by default.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Built-in Protections */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Built-in Protections</h3>
              <div className="space-y-4">
                {[
                  'End-to-End Encryption (mail, files, messaging)',
                  'Sandboxed apps & permission prompts',
                  'Secure boot path & signed updates',
                  'Zero-trust defaults, zero telemetry',
                  'Strong crypto: bcrypt/argon2, JWT, TLS 1.3'
                ].map((protection, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">{protection}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Compliance & Documentation */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Compliance & Documentation</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl">
                  <h4 className="font-semibold text-white mb-2">Compliance</h4>
                  <p className="text-gray-300 text-sm mb-3">GDPR, DPDP-India, CCPA (guidance & DPA available)</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">GDPR</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">DPDP-India</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">CCPA</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Documentation</h4>
                  <div className="space-y-2">
                    <a href="/documents/tauos-security-whitepaper.html" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>Security Whitepaper</span>
                    </a>
                    <a href="/documents/tauos-data-protection-addendum.html" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>Data Protection Addendum (DPA)</span>
                    </a>
                    <a href="/documents/tauos-sub-processor-list.html" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>Sub-processor List</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300">
              <Shield className="w-5 h-5" />
              <span>Read Security Docs</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Enterprise Section */}
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
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Enterprise
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional-grade tools for organizations that demand privacy and control.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* MDM & Policies */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-blue-400/30 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">MDM & Policies</h3>
              <ul className="space-y-2 text-sm text-gray-300 mb-4">
                <li>• Device enrollment & posture checks</li>
                <li>• App whitelisting/blacklisting</li>
                <li>• Remote wipe / lock / rotate keys</li>
                <li>• Policy bundles: Privacy-Max, Balanced, Custom</li>
              </ul>
              <a href="/enterprise/mdm" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                Learn more →
              </a>
            </motion.div>

            {/* OTA Updates */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-green-400/30 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">OTA Updates</h3>
              <ul className="space-y-2 text-sm text-gray-300 mb-4">
                <li>• Staged rollouts, ring deployments</li>
                <li>• Delta updates, automatic rollback</li>
                <li>• Signed manifests, SHA256 verification</li>
                <li>• Admin dashboard & API</li>
              </ul>
              <a href="/enterprise/ota" className="text-green-400 hover:text-green-300 text-sm font-medium">
                Learn more →
              </a>
            </motion.div>

            {/* Identity & SSO */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-purple-400/30 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Identity & SSO</h3>
              <ul className="space-y-2 text-sm text-gray-300 mb-4">
                <li>• SAML/OIDC integration</li>
                <li>• SCIM provisioning</li>
                <li>• Org units, roles, audit trails</li>
                <li>• Zero-trust authentication</li>
              </ul>
              <a href="/enterprise/identity" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                Learn more →
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300">
                <Users className="w-5 h-5" />
                <span>Talk to Sales</span>
              </button>
              <button className="inline-flex items-center space-x-2 border-2 border-yellow-400/30 text-yellow-400 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400/10 transition-all duration-300">
                <Rocket className="w-5 h-5" />
                <span>Request a Pilot</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
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
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              TauOS Desktop is free to download. Services & enterprise tooling are licensed as below.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                tier: 'Starter',
                bestFor: 'Individuals',
                includes: ['TauMail & TauCloud (5 GB)', 'Basic support'],
                price: 'Free',
                color: 'from-green-500 to-emerald-500',
                popular: false
              },
              {
                tier: 'Pro',
                bestFor: 'Teams up to 25',
                includes: ['50 GB/user', 'Custom domains', 'Priority support'],
                price: '$499',
                period: '/ yr / org',
                color: 'from-blue-500 to-cyan-500',
                popular: false
              },
              {
                tier: 'Business',
                bestFor: '26–250 users',
                includes: ['MDM, OTA, SSO', 'DLP policies', '200 GB/user'],
                price: '$1,999',
                period: '/ yr / org',
                color: 'from-purple-500 to-pink-500',
                popular: true
              },
              {
                tier: 'Enterprise',
                bestFor: '250+',
                includes: ['Private hosting', 'Custom SLAs', 'On-prem, training'],
                price: 'Contact Sales',
                period: '',
                color: 'from-yellow-500 to-orange-500',
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-6 bg-gray-900/30 backdrop-blur-sm border rounded-2xl transition-all duration-300 ${
                  plan.popular 
                    ? 'border-yellow-400/50 shadow-lg shadow-yellow-400/10' 
                    : 'border-gray-800 hover:border-yellow-400/30'
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
                  <h3 className="text-xl font-bold text-white mb-2">{plan.tier}</h3>
                  <p className="text-sm text-gray-400 mb-4">{plan.bestFor}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-gray-400 ml-1">{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.includes.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg hover:shadow-yellow-400/25'
                    : 'border-2 border-gray-600 text-gray-300 hover:border-yellow-400/50 hover:text-yellow-400'
                }`}>
                  {plan.tier === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-gray-400 mb-4">Add-ons: Extra storage, dedicated relay, compliance packs, premium support.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300">
                <ArrowRight className="w-5 h-5" />
                <span>Compare Plans</span>
              </button>
              <button className="inline-flex items-center space-x-2 border-2 border-yellow-400/30 text-yellow-400 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400/10 transition-all duration-300">
                <Rocket className="w-5 h-5" />
                <span>Start Free</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Downloads Section */}
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
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Downloads
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get TauOS for your platform. All downloads include SHA256 checksums for verification.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Platform Detection */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12 p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Auto-detected Platform</h3>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Monitor className="w-8 h-8 text-yellow-400" />
                <span className="text-xl text-gray-300">{detectedOS}</span>
              </div>
              <p className="text-gray-400 text-sm">
                We detected you're on {detectedOS}. Download the {detectedOS} installer below.
              </p>
            </motion.div>

            {/* Download Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                {
                  platform: 'Windows',
                  file: 'TauOS Setup 1.0.0.exe',
                  size: '81.8 MB',
                  checksum: 'sha256:b7e30f51035d5cfaf6b60f309996300f08e4e5a0aaad3bc5affcaf01b657a426',
                  icon: Monitor,
                  color: 'from-blue-500 to-cyan-500',
                  recommended: detectedOS.includes('Windows'),
                  description: 'Full TauOS Desktop with all apps included'
                },
                {
                  platform: 'macOS',
                  file: 'TauOS-1.0.0.dmg',
                  size: '98.9 MB',
                  checksum: 'sha256:d5ae510bf9b269c6a4d92c38e3b8f1cd794b6ad6c000396eb8c1032c11652124',
                  icon: Smartphone,
                  color: 'from-gray-500 to-gray-700',
                  recommended: detectedOS.includes('macOS'),
                  description: 'Native macOS app with Intel & Apple Silicon support'
                },
                {
                  platform: 'Linux',
                  file: 'tauos-installer_1.0.0_amd64.deb',
                  size: '72.7 MB',
                  checksum: 'sha256:fadad76e73118add5be68f035d433ff0279d5dd4d240ce156b38b16b7ccd50d6',
                  icon: Terminal,
                  color: 'from-green-500 to-emerald-500',
                  recommended: detectedOS.includes('Linux'),
                  description: 'Universal Linux package (x64 & ARM64)'
                },
                {
                  platform: 'Mobile (Android)',
                  file: 'TauOS-Mobile-v1.0.0.apk',
                  size: '156 MB',
                  checksum: 'sha256:d4e5f6789012345678901234567890abcdef1234567890abcdef123456789',
                  icon: Phone,
                  color: 'from-purple-500 to-pink-500',
                  recommended: false,
                  description: 'TauOS Mobile with all privacy-first apps'
                },
                {
                  platform: 'ISO (Live)',
                  file: 'TauOS-Live-v1.0.0.iso',
                  size: '2.3 GB',
                  checksum: 'sha256:e5f6789012345678901234567890abcdef1234567890abcdef1234567890',
                  icon: Download,
                  color: 'from-orange-500 to-red-500',
                  recommended: false,
                  description: 'Bootable live system - try before install'
                }
              ].map((download, index) => (
                <motion.div
                  key={download.platform}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative p-6 bg-gray-900/30 backdrop-blur-sm border rounded-2xl transition-all duration-300 ${
                    download.recommended 
                      ? 'border-yellow-400/50 shadow-lg shadow-yellow-400/10' 
                      : 'border-gray-800 hover:border-yellow-400/30'
                  }`}
                >
                  {download.recommended && (
                    <div className="absolute -top-3 left-4">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
                        Recommended for you
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 ${download.color} rounded-xl flex items-center justify-center`}>
                      <download.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{download.platform}</h3>
                      <p className="text-sm text-gray-400">{download.file}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <p className="text-sm text-gray-300">{download.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Size:</span>
                      <span className="text-white">{download.size}</span>
                    </div>
                    <div className="text-xs text-gray-500 break-all">
                      {download.checksum}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      // Create download link for the actual installer file
                      const downloadUrl = `/downloads/${download.file}`;
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = download.file;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      
                      // Show success message
                      alert(`Downloading ${download.file}...\n\nFile size: ${download.size}\nChecksum: ${download.checksum}\n\nThis will install the complete TauOS operating system with all privacy-first applications!`);
                    }}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      download.recommended
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg hover:shadow-yellow-400/25'
                        : 'border-2 border-gray-600 text-gray-300 hover:border-yellow-400/50 hover:text-yellow-400'
                    }`}
                  >
                    {download.recommended ? 'Download Now' : 'Download'}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Verification Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Verify Downloads</h3>
                <p className="text-gray-300 mb-4">
                  How to verify checksums & signatures
                </p>
                <a href="/docs/verification" className="text-blue-400 hover:text-blue-300 font-medium">
                  View Documentation →
                </a>
              </div>
              
              <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300">
                <Download className="w-6 h-6" />
                <span>Download Now</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why TauOS Section */}
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
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Why TauOS?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The operating system that puts privacy and control first.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: 'Privacy by Default',
                description: 'No opt-outs; it starts private.',
                icon: Shield,
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Own Your Data',
                description: 'Self-host or choose a trusted region.',
                icon: Cloud,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Beautiful & Fast',
                description: 'Modern design, 60fps animations.',
                icon: Zap,
                color: 'from-yellow-500 to-orange-500'
              },
              {
                title: 'Open & Auditable',
                description: 'Open standards and transparent code paths.',
                icon: Code,
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Enterprise-Ready',
                description: 'Real governance, MDM, OTA, SSO.',
                icon: Settings,
                color: 'from-indigo-500 to-purple-500'
              }
            ].map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-12 h-12 ${reason.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <reason.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{reason.title}</h3>
                <p className="text-gray-400 text-sm">{reason.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <a href="#why-tauos" className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300">
              <ArrowRight className="w-5 h-5" />
              <span>See the Difference</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Developers Section */}
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
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Developers
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Build the future of privacy-first computing with our developer tools and APIs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: 'APIs',
                description: 'Mail, Cloud, OTA, MDM, Identity',
                icon: Code,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'SDKs',
                description: 'TypeScript/JS, Python (coming), CLI tools',
                icon: GitBranch,
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Guides',
                description: 'Building privacy-scored apps, signing, submissions',
                icon: FileText,
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Open Source',
                description: 'Contribution guidelines & roadmap',
                icon: Github,
                color: 'from-gray-500 to-gray-700'
              }
            ].map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{tool.title}</h3>
                <p className="text-gray-400 text-sm">{tool.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300">
                <FileText className="w-5 h-5" />
                <span>Read Developer Docs</span>
              </button>
              <button className="inline-flex items-center space-x-2 border-2 border-yellow-400/30 text-yellow-400 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400/10 transition-all duration-300">
                <Github className="w-5 h-5" />
                <span>Visit GitHub</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call-to-Action Band */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to take control of your computing?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already chosen privacy-first computing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#downloads" className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300">
                <Download className="w-6 h-6" />
                <span>Download TauOS</span>
              </a>
              <a href="/taumail" className="inline-flex items-center space-x-2 border-2 border-blue-400/30 text-blue-400 px-8 py-4 rounded-xl font-semibold hover:bg-blue-400/10 transition-all duration-300">
                <MailIcon className="w-6 h-6" />
                <span>Try TauMail</span>
              </a>
              <a href="/contact" className="inline-flex items-center space-x-2 border-2 border-yellow-400/30 text-yellow-400 px-8 py-4 rounded-xl font-semibold hover:bg-yellow-400/10 transition-all duration-300">
                <Users className="w-6 h-6" />
                <span>Contact Sales</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Join Our Community
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Be part of a global movement shaping the future of open-source technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: 'Active Contributors',
                description: 'Join thousands of developers worldwide',
                icon: Users,
                stats: '2,500+',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Open Repositories',
                description: 'Transparent development process',
                icon: GitBranch,
                stats: '150+',
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Global Downloads',
                description: 'Trusted by developers everywhere',
                icon: Download,
                stats: '50K+',
                color: 'from-purple-500 to-pink-500'
              }
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                  <section.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">{section.stats}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{section.title}</h3>
                <p className="text-gray-400">{section.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center space-x-6"
          >
            {[
              { icon: Github, label: 'GitHub' },
              { icon: Twitter, label: 'Twitter' },
              { icon: Linkedin, label: 'LinkedIn' },
              { icon: MailIcon, label: 'Email' }
            ].map((social, index) => (
              <motion.a
                key={social.label}
                href="#"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-12 h-12 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:border-yellow-400/30 transition-all duration-300 hover:scale-110"
              >
                <social.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section id="get-involved" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Get Involved
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to shape the future? Here's how you can contribute to Tau OS.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Contribute Code',
                description: 'Submit pull requests and help improve Tau OS',
                icon: Code,
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Report Bugs',
                description: 'Help us identify and fix issues',
                icon: Bug,
                color: 'from-red-500 to-pink-500'
              },
              {
                title: 'Write Docs',
                description: 'Improve documentation and guides',
                icon: FileText,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Spread the Word',
                description: 'Share Tau OS with your network',
                icon: Share,
                color: 'from-purple-500 to-pink-500'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <button className="group flex items-center space-x-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105 mx-auto">
              <Rocket className="w-6 h-6" />
              <span>Start Contributing Today</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
                  <img 
                    src="/brand/tauos-logo.svg" 
                    alt="TauOS Logo" 
                    className="w-12 h-12"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <Terminal className="w-12 h-12 text-yellow-400 hidden" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Tau OS
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Privacy-First Computing
              </p>
              <p className="text-gray-500 text-sm">
                © 2025 TauOS. All rights reserved.
              </p>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/legal/privacy" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="/legal/terms" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Terms of Service</a></li>
                <li><a href="/legal/dpa" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Data Protection Policy</a></li>
                <li><a href="/legal/cookies" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Cookies Policy</a></li>
                <li><a href="/legal/acceptable-use" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Acceptable Use</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">About</a></li>
                <li><a href="/press" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Press</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Careers</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="text-white font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li><a href="/blog" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Blog</a></li>
                <li><a href="https://x.com/tauos" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">X/Twitter</a></li>
                <li><a href="https://github.com/tauos" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">GitHub</a></li>
                <li><a href="https://mastodon.social/@tauos" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Mastodon</a></li>
                <li><a href="https://status.tauos.org" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Status</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Tau Foundation & Tau LLC</p>
                  <p className="text-gray-500 text-xs">2261 Market St, San Francisco, CA 94114</p>
                  <p className="text-gray-500 text-xs">+1 1800 TauOS</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">Malaysia Office</p>
                  <p className="text-gray-500 text-xs">IB Tower, Level 33, 8, Lrg Binjai</p>
                  <p className="text-gray-500 text-xs">Kuala Lumpur, 50450 Kuala Lumpur</p>
                  <p className="text-gray-500 text-xs">+60 178446206</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cookie Banner */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 sm:mb-0">
                We use only essential cookies for security and functionality. No tracking.{' '}
                <a href="/legal/cookies" className="text-yellow-400 hover:text-yellow-300 underline">
                  Learn more
                </a>
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Accept All
                </button>
                <button className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 