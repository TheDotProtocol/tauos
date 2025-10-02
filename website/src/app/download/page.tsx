'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Monitor, 
  Smartphone, 
  Laptop, 
  Server,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Globe,
  Lock,
  Star
} from 'lucide-react';

export default function DownloadPage() {
  const [detectedOS, setDetectedOS] = useState<string>('');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  // Auto-detect user's operating system
  useEffect(() => {
    const detectOS = () => {
      const userAgent = navigator.userAgent;
      const platform = navigator.platform;
      
      if (userAgent.includes('Windows')) {
        return 'Windows';
      } else if (userAgent.includes('Mac')) {
        return 'macOS';
      } else if (userAgent.includes('Linux')) {
        return 'Linux';
      } else if (userAgent.includes('Android')) {
        return 'Android';
      } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        return 'iOS';
      } else {
        return 'Unknown';
      }
    };

    setDetectedOS(detectOS());
  }, []);

  // Simulate download progress
  const startDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setDownloadComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const getDownloadUrl = (os: string) => {
    const baseUrl = 'https://github.com/TheDotProtocol/tauos/releases/latest/download';
    
    switch (os) {
      case 'Windows':
        return `${baseUrl}/TauOS-Setup.exe`;
      case 'macOS':
        return `${baseUrl}/TauOS.dmg`;
      case 'Linux':
        return `${baseUrl}/TauOS-Linux.AppImage`;
      case 'Android':
        return `${baseUrl}/TauOS-Android.apk`;
      case 'iOS':
        return `${baseUrl}/TauOS-iOS.ipa`;
      default:
        return `${baseUrl}/TauOS-Linux.AppImage`;
    }
  };

  const getOSIcon = (os: string) => {
    switch (os) {
      case 'Windows':
        return Monitor;
      case 'macOS':
        return Laptop;
      case 'Linux':
        return Server;
      case 'Android':
        return Smartphone;
      case 'iOS':
        return Smartphone;
      default:
        return Monitor;
    }
  };

  const OSIcon = getOSIcon(detectedOS);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src="/brand/tauos-logo.svg" alt="TauOS" className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold text-white">TauOS</h1>
                <p className="text-sm text-gray-400">Download</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">v1.0.0</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">Production Ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Download <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">TauOS</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            The privacy-first operating system with Linux 6.14, GNOME 46, and universal hardware support.
            <br />
            <span className="text-purple-400 font-semibold">Ready to install on any device.</span>
          </p>
        </motion.div>

        {/* Auto-Detection Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <OSIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Auto-Detected System</h2>
                <p className="text-gray-400">We've detected your operating system</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-white">{detectedOS}</p>
              <p className="text-sm text-gray-400">Compatible</p>
            </div>
          </div>

          {/* Download Button */}
          {!downloadComplete ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startDownload}
              disabled={isDownloading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Downloading... {downloadProgress}%</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download TauOS for {detectedOS}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full bg-green-500/10 border border-green-500/20 text-green-400 px-8 py-4 rounded-xl flex items-center justify-center space-x-3"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Download Complete! Run the installer to begin setup.</span>
            </motion.div>
          )}

          {/* Progress Bar */}
          {isDownloading && (
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${downloadProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">100% Security Hardened</h3>
            <p className="text-gray-400 text-sm">
              Pen test audit compliance with zero vulnerabilities. Your privacy is protected by design.
            </p>
          </div>

          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Universal Hardware Support</h3>
            <p className="text-gray-400 text-sm">
              Works on ANY device. Intel, AMD, ARM - we support them all with automatic driver detection.
            </p>
          </div>

          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Latest Technology</h3>
            <p className="text-gray-400 text-sm">
              Linux 6.14 kernel with GNOME 46 desktop. Cutting-edge performance and modern UI.
            </p>
          </div>
        </motion.div>

        {/* Alternative Downloads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6">Alternative Downloads</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Windows', 'macOS', 'Linux', 'Android'].map((os) => {
              const Icon = getOSIcon(os);
              return (
                <motion.a
                  key={os}
                  href={getDownloadUrl(os)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-purple-500/50 transition-all duration-300"
                >
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span className="text-white font-medium">{os}</span>
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Installation Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">🚀 Installation Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Download</h4>
              <p className="text-gray-400 text-sm">Auto-detect and download the correct version</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Setup</h4>
              <p className="text-gray-400 text-sm">Language selection, EULA, and legal agreements</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <h4 className="font-semibold text-white mb-2">TauID</h4>
              <p className="text-gray-400 text-sm">Create your TauOS account and credentials</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Install</h4>
              <p className="text-gray-400 text-sm">Automatic installation with OTA updates</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
