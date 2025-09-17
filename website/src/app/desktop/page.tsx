'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  Monitor,
  Smartphone,
  ArrowRight,
  Check,
  Star,
  Zap,
  Shield,
  Lock,
  Eye,
  Terminal,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Settings,
  Users,
  Globe,
  Mail,
  Cloud,
  Folder,
  Image,
  Music,
  Video,
  Archive,
  Sparkles,
  ChevronDown,
  Play,
  Pause,
  Volume2,
  Wifi as WifiIcon,
  Battery as BatteryIcon,
  Clock
} from 'lucide-react';

export default function DesktopPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeApp, setActiveApp] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const apps = [
    { id: 'taumail', name: 'TauMail', icon: Mail, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { id: 'taucloud', name: 'TauCloud', icon: Cloud, color: 'text-green-400', bg: 'bg-green-500/20' },
    { id: 'tauid', name: 'TauID', icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { id: 'taustore', name: 'TauStore', icon: Folder, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    { id: 'taubrowser', name: 'TauBrowser', icon: Globe, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    { id: 'settings', name: 'Settings', icon: Settings, color: 'text-gray-400', bg: 'bg-gray-500/20' },
    { id: 'terminal', name: 'Terminal', icon: Terminal, color: 'text-green-400', bg: 'bg-green-500/20' },
    { id: 'files', name: 'Files', icon: Archive, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { id: 'media', name: 'Media', icon: Video, color: 'text-pink-400', bg: 'bg-pink-500/20' },
    { id: 'music', name: 'Music', icon: Music, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
    { id: 'photos', name: 'Photos', icon: Image, color: 'text-rose-400', bg: 'bg-rose-500/20' },
    { id: 'tauai', name: 'TauAI', icon: Sparkles, color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
  ];

  const systemInfo = {
    cpu: 'Intel Core i7-12700K',
    ram: '32GB DDR4',
    storage: '1TB NVMe SSD',
    gpu: 'NVIDIA RTX 4080',
    os: 'TauOS Desktop 1.0.0'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-8 relative">
            <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
              <Terminal className="w-10 h-10 text-black" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-yellow-400/30 border-t-yellow-400 rounded-2xl"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            TauOS Desktop
          </h1>
          <p className="text-gray-400 mb-8">Initializing System...</p>
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Welcome Screen */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 1 }}
          onAnimationComplete={() => setShowWelcome(false)}
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-8 relative">
              <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <Terminal className="w-12 h-12 text-black" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-yellow-400/30 border-t-yellow-400 rounded-2xl"
              />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              TauOS Desktop
            </h1>
            <p className="text-xl text-gray-400">Privacy-First Operating System</p>
          </div>
        </motion.div>
      )}

      {/* Desktop Interface */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Menu Bar */}
        <div className="bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-black" />
                </div>
                <span className="font-semibold">TauOS</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="hover:text-yellow-400 cursor-pointer">File</span>
                <span className="hover:text-yellow-400 cursor-pointer">Edit</span>
                <span className="hover:text-yellow-400 cursor-pointer">View</span>
                <span className="hover:text-yellow-400 cursor-pointer">Go</span>
                <span className="hover:text-yellow-400 cursor-pointer">Window</span>
                <span className="hover:text-yellow-400 cursor-pointer">Help</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <WifiIcon className="w-4 h-4 text-green-400" />
                <span>WiFi</span>
              </div>
              <div className="flex items-center space-x-2">
                <BatteryIcon className="w-4 h-4 text-green-400" />
                <span>100%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                TauOS Desktop
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Experience the future of privacy-first computing with our hybrid desktop interface. 
                Combining the best of macOS, Windows, and Linux in one unified experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Download className="w-4 h-4" />
                  Download TauOS Desktop
                </button>
                <button className="flex items-center gap-2 px-6 py-3 border border-yellow-400 text-yellow-400 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-200">
                  <Play className="w-4 h-4" />
                  Watch Demo
                </button>
              </div>
            </motion.div>

            {/* System Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 text-yellow-400">System Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Cpu className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-400">Processor</div>
                  <div className="font-semibold">{systemInfo.cpu}</div>
                </div>
                <div className="text-center">
                  <HardDrive className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-400">Memory</div>
                  <div className="font-semibold">{systemInfo.ram}</div>
                </div>
                <div className="text-center">
                  <Archive className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-400">Storage</div>
                  <div className="font-semibold">{systemInfo.storage}</div>
                </div>
                <div className="text-center">
                  <Monitor className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-400">Graphics</div>
                  <div className="font-semibold">{systemInfo.gpu}</div>
                </div>
              </div>
            </motion.div>

            {/* App Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 text-yellow-400">Built-in Applications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {apps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => setActiveApp(app.id)}
                    className="group cursor-pointer"
                  >
                    <div className={`w-20 h-20 ${app.bg} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                      <app.icon className={`w-8 h-8 ${app.color}`} />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors">
                        {app.name}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            >
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <Shield className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-bold mb-3 text-white">Privacy-First</h3>
                <p className="text-gray-400">
                  Zero telemetry, end-to-end encryption, and local AI processing ensure your data stays private.
                </p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <Zap className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold mb-3 text-white">High Performance</h3>
                <p className="text-gray-400">
                  Optimized for speed and efficiency with 60fps animations and responsive design.
                </p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <Users className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-3 text-white">User-Friendly</h3>
                <p className="text-gray-400">
                  Intuitive interface combining the best of macOS, Windows, and Linux experiences.
                </p>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-xl p-8"
            >
              <h2 className="text-3xl font-bold mb-4 text-white">Ready to Experience TauOS Desktop?</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Download the world's first privacy-native AI operating system and take control of your computing.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Download className="w-5 h-5" />
                  Download for Windows
                </button>
                <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Download className="w-5 h-5" />
                  Download for macOS
                </button>
                <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Download className="w-5 h-5" />
                  Download for Linux
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
