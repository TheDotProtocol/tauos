'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  Monitor,
  Play,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function DesktopPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showDemo, setShowDemo] = useState(false);
  const [apps, setApps] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    const loadDesktopData = async () => {
      try {
        // Load desktop apps
        const appsResponse = await fetch('/api/desktop/apps');
        const appsData = await appsResponse.json();
        if (appsData.success) {
          setApps(appsData.apps);
        }

        // Load system status
        const statusResponse = await fetch('/api/desktop/system/status');
        const statusData = await statusResponse.json();
        if (statusData.success) {
          setSystemStatus(statusData.status);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load desktop data:', error);
        setIsLoading(false);
      }
    };

    loadDesktopData();
  }, []);

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
              <Monitor className="w-10 h-10 text-black" />
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
          <p className="text-gray-400 mb-8">Loading Desktop Interface...</p>
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded flex items-center justify-center">
              <Monitor className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                TauOS Desktop
              </h1>
              <p className="text-sm text-gray-400">Privacy-Native AI Operating System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
            >
              <Play className="w-4 h-4" />
              {showDemo ? 'Hide Demo' : 'Try Desktop UI'}
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border border-yellow-400 text-yellow-400 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-200">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8">
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
                Experience TauOS Desktop
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                The world's first privacy-native AI operating system. Experience seamless integration 
                of all your favorite applications with cutting-edge AI capabilities.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setShowDemo(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
                >
                  <Play className="w-5 h-5" />
                  Try Desktop UI
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
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Native Desktop Experience</h3>
                <p className="text-gray-400">
                  Full desktop environment with window management, taskbar, and native app integration.
                </p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">AI-Powered Workflow</h3>
                <p className="text-gray-400">
                  Integrated AI assistant that understands context and helps you work more efficiently.
                </p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Seamless Integration</h3>
                <p className="text-gray-400">
                  All TauOS services integrated: Mail, Cloud, ID, Store, Browser, and more.
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          // Desktop UI Demo
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800"
          >
            <div className="h-8 bg-gray-800 flex items-center px-4 space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="h-[800px]">
              <iframe
                src="/desktop-ui/index.html"
                className="w-full h-full border-0"
                title="TauOS Desktop UI Demo"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}