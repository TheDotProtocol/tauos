'use client';

import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  Smartphone,
  Play,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function MobilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showDemo, setShowDemo] = useState(false);
  const [apps, setApps] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState(null);

  useEffect(() => {
    const loadMobileData = async () => {
      try {
        // Load mobile apps
        const appsResponse = await fetch('/api/mobile/apps');
        const appsData = await appsResponse.json();
        if (appsData.success) {
          setApps(appsData.apps);
        }

        // Load device status
        const statusResponse = await fetch('/api/mobile/device/status');
        const statusData = await statusResponse.json();
        if (statusData.success) {
          setDeviceStatus(statusData.status);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load mobile data:', error);
        setIsLoading(false);
      }
    };

    loadMobileData();
  }, []);

  if (isLoading) {
    return (
      <MarketingPageShell
        title="Tau Mobile"
        subtitle="Your phone. Your rules. Mobile OS from Tau Core Inc."
        hero={false}
      >
        <div className="flex items-center justify-center min-h-[50vh] px-6">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <Smartphone className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading mobile interface…</p>
          </motion.div>
        </div>
      </MarketingPageShell>
    );
  }

  return (
    <MarketingPageShell
      title="Tau Mobile"
      subtitle="Your phone. Your rules. Mobile OS from Tau Core Inc."
      hero={false}
    >
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-end gap-3 mb-8">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
          >
            <Play className="w-4 h-4" />
            {showDemo ? 'Hide Demo' : 'Try Mobile UI'}
          </button>
          <a href="/download" className="flex items-center gap-2 px-6 py-3 border border-primary text-primary font-semibold hover:bg-primary/10">
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
        {!showDemo ? (
          // Landing content
          <div className="space-y-12">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Experience Tau OS Mobile
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                The future of mobile computing. Experience a privacy-first mobile operating system 
                with integrated AI capabilities and seamless app ecosystem.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setShowDemo(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
                >
                  <Play className="w-5 h-5" />
                  Try Mobile UI
                </button>
                <button className="flex items-center gap-2 px-8 py-4 border border-yellow-400 text-yellow-400 rounded-lg font-semibold text-lg hover:bg-yellow-400 hover:text-black transition-all duration-200">
                  <Download className="w-5 h-5" />
                  Download Now
                </button>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Native Mobile Experience</h3>
                <p className="text-gray-400">
                  Full mobile OS with dialer, messaging, camera, and all essential smartphone features.
                </p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">AI-Powered Assistant</h3>
                <p className="text-gray-400">
                  Voice-activated AI assistant with "Tau" wake word for hands-free operation.
                </p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Complete App Ecosystem</h3>
                <p className="text-gray-400">
                  All Tau OS services available: Mail, Cloud, ID, Store, Browser, and more.
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          // Mobile UI Demo
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-80 h-[700px] bg-gray-800 rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="h-8 bg-black flex items-center justify-between px-6 text-white text-sm">
                    <span>9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>
                  {/* Mobile UI Content */}
                  <iframe
                    src="/mobile-ui/index.html"
                    className="w-full h-[calc(100%-2rem)] border-0"
                    title="Tau OS Mobile UI Demo"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </MarketingPageShell>
  );
}
