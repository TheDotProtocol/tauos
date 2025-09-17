'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  Smartphone,
  Monitor,
  ArrowRight,
  Check,
  Star,
  Zap,
  Shield,
  Lock,
  Eye,
  Phone,
  MessageCircle,
  Camera,
  MapPin,
  Cloud,
  Settings,
  Users,
  Globe,
  Mail,
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
  Wifi,
  Battery,
  Clock,
  Heart,
  Bell,
  Search,
  Plus,
  Minus,
  RotateCcw,
  Power
} from 'lucide-react';

export default function MobilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeApp, setActiveApp] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const apps = [
    { id: 'phone', name: 'Phone', icon: Phone, color: 'text-green-400', bg: 'bg-green-500/20' },
    { id: 'messages', name: 'Messages', icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { id: 'camera', name: 'Camera', icon: Camera, color: 'text-gray-400', bg: 'bg-gray-500/20' },
    { id: 'photos', name: 'Photos', icon: Image, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { id: 'maps', name: 'Maps', icon: MapPin, color: 'text-red-400', bg: 'bg-red-500/20' },
    { id: 'taumail', name: 'TauMail', icon: Mail, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { id: 'taucloud', name: 'TauCloud', icon: Cloud, color: 'text-green-400', bg: 'bg-green-500/20' },
    { id: 'taustore', name: 'TauStore', icon: Folder, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    { id: 'taubrowser', name: 'TauBrowser', icon: Globe, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    { id: 'settings', name: 'Settings', icon: Settings, color: 'text-gray-400', bg: 'bg-gray-500/20' },
    { id: 'music', name: 'Music', icon: Music, color: 'text-pink-400', bg: 'bg-pink-500/20' },
    { id: 'tauai', name: 'TauAI', icon: Sparkles, color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Privacy-First Design',
      description: 'Zero telemetry, end-to-end encryption, and local AI processing ensure your data stays private.',
      color: 'text-green-400'
    },
    {
      icon: Zap,
      title: 'AI-Powered Experience',
      description: 'TauAI integration with voice commands, predictive intelligence, and smart automation.',
      color: 'text-yellow-400'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'MDM, OTA updates, and compliance features for organizations that demand privacy.',
      color: 'text-blue-400'
    },
    {
      icon: Users,
      title: 'Unified Ecosystem',
      description: 'Seamless integration with TauOS desktop and all privacy-first applications.',
      color: 'text-purple-400'
    }
  ];

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
              <Smartphone className="w-10 h-10 text-black" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-yellow-400/30 border-t-yellow-400 rounded-2xl"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            TauOS Mobile
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
                <Smartphone className="w-12 h-12 text-black" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-yellow-400/30 border-t-yellow-400 rounded-2xl"
              />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              TauOS Mobile
            </h1>
            <p className="text-xl text-gray-400">Privacy-First Mobile Experience</p>
          </div>
        </motion.div>
      )}

      {/* Mobile Interface */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Status Bar */}
        <div className="bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">TauOS</span>
              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-4">
              <Wifi className="w-4 h-4 text-green-400" />
              <Battery className="w-4 h-4 text-green-400" />
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                TauOS Mobile
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Experience the future of privacy-first mobile computing. 
                Built with React Native and designed for complete data sovereignty.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Download className="w-4 h-4" />
                  Download for Android
                </button>
                <button className="flex items-center gap-2 px-6 py-3 border border-yellow-400 text-yellow-400 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-200">
                  <Play className="w-4 h-4" />
                  Watch Demo
                </button>
              </div>
            </motion.div>

            {/* Mobile Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-12"
            >
              <div className="relative">
                {/* Phone Frame */}
                <div className="w-80 h-[600px] bg-gray-800 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-3 text-sm">
                      <span className="font-semibold">TauOS</span>
                      <div className="flex items-center space-x-2">
                        <Wifi className="w-4 h-4 text-green-400" />
                        <Battery className="w-4 h-4 text-green-400" />
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Home Screen */}
                    <div className="px-6 py-4">
                      <div className="text-center mb-8">
                        <div className="text-2xl font-bold text-white mb-2">
                          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-gray-400">
                          {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                      </div>

                      {/* App Grid */}
                      <div className="grid grid-cols-4 gap-4 mb-8">
                        {apps.slice(0, 8).map((app, index) => (
                          <motion.div
                            key={app.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                            className="text-center"
                          >
                            <div className={`w-14 h-14 ${app.bg} rounded-2xl flex items-center justify-center mb-2 mx-auto`}>
                              <app.icon className={`w-6 h-6 ${app.color}`} />
                            </div>
                            <div className="text-xs text-gray-400">{app.name}</div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Dock */}
                      <div className="absolute bottom-4 left-6 right-6">
                        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-4">
                          <div className="flex justify-around">
                            {apps.slice(8, 12).map((app, index) => (
                              <div key={app.id} className="text-center">
                                <div className={`w-12 h-12 ${app.bg} rounded-xl flex items-center justify-center mb-1`}>
                                  <app.icon className={`w-5 h-5 ${app.color}`} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                </motion.div>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center"
                >
                  <feature.icon className={`w-12 h-12 ${feature.color} mx-auto mb-4`} />
                  <h3 className="text-lg font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* App Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-8 text-center text-yellow-400">Built-in Applications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {apps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="text-center group cursor-pointer"
                  >
                    <div className={`w-16 h-16 ${app.bg} rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-200`}>
                      <app.icon className={`w-7 h-7 ${app.color}`} />
                    </div>
                    <div className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors">
                      {app.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-xl p-8"
            >
              <h2 className="text-3xl font-bold mb-4 text-white">Ready to Experience TauOS Mobile?</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Download the world's first privacy-native mobile operating system and take control of your mobile computing.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Download className="w-5 h-5" />
                  Download for Android
                </button>
                <button className="flex items-center gap-2 px-8 py-4 border border-yellow-400 text-yellow-400 rounded-lg font-semibold text-lg hover:bg-yellow-400 hover:text-black transition-all duration-200">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
