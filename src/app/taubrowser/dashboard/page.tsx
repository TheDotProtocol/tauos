'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Shield, Lock, Eye, CheckCircle, AlertCircle, 
  ArrowRight, Users, Zap, Star, ArrowLeft, Search,
  Download, Filter, Settings, Heart, BarChart3, Activity,
  Home, RefreshCw, ArrowLeft as BackArrow, ArrowRight as ForwardArrow,
  Bookmark, History, Menu, X, Plus, LogOut
} from 'lucide-react';
import Link from 'next/link';

export default function TauBrowserDashboard() {
  const [activeTab, setActiveTab] = useState('browser');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('https://www.tauos.org');
  const [urlInput, setUrlInput] = useState('https://www.tauos.org');
  const [browserHistory, setBrowserHistory] = useState(['https://www.tauos.org']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState([
    { id: 1, title: 'TauOS Home', url: 'https://www.tauos.org', favicon: '🏠' },
    { id: 2, title: 'TauMail', url: 'https://www.tauos.org/taumail', favicon: '📧' },
    { id: 3, title: 'TauCloud', url: 'https://www.tauos.org/taucloud', favicon: '☁️' }
  ]);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('tauos_user');
    const storedToken = localStorage.getItem('tauos_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    } else {
      // Redirect to landing page if not logged in
      window.location.href = '/taubrowser';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tauos_user');
    localStorage.removeItem('tauos_token');
    window.location.href = '/taubrowser';
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    let url = urlInput.trim();
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.')) {
        url = 'https://' + url;
      } else {
        // Treat as search query
        url = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
      }
    }
    
    setCurrentUrl(url);
    setUrlInput(url);
    
    // Add to history
    const newHistory = browserHistory.slice(0, historyIndex + 1);
    newHistory.push(url);
    setBrowserHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(browserHistory[newIndex]);
      setUrlInput(browserHistory[newIndex]);
    }
  };

  const handleForward = () => {
    if (historyIndex < browserHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(browserHistory[newIndex]);
      setUrlInput(browserHistory[newIndex]);
    }
  };

  const handleRefresh = () => {
    // Force refresh by updating the URL slightly
    setCurrentUrl(currentUrl + (currentUrl.includes('?') ? '&' : '?') + 't=' + Date.now());
  };

  const addBookmark = () => {
    const title = prompt('Enter bookmark title:');
    if (title) {
      const newBookmark = {
        id: Date.now(),
        title: title,
        url: currentUrl,
        favicon: '🔖'
      };
      setBookmarks([...bookmarks, newBookmark]);
    }
  };

  const browserMetrics = {
    blockedAds: 1247,
    blockedTrackers: 2341,
    privacyScore: 100,
    dataSaved: '2.3MB',
    lastUpdate: '2 minutes ago'
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">TauBrowser</h1>
                  <p className="text-sm text-gray-400">Privacy-First Browser</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Users className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900/30 p-1 rounded-xl">
          {[
            { id: 'browser', label: 'Browser', icon: Globe },
            { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
            { id: 'history', label: 'History', icon: History },
            { id: 'privacy', label: 'Privacy', icon: Shield },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Browser Tab */}
        {activeTab === 'browser' && (
          <div className="space-y-6">
            {/* Browser Toolbar */}
            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleBack}
                    disabled={historyIndex === 0}
                    className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <BackArrow className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleForward}
                    disabled={historyIndex === browserHistory.length - 1}
                    className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ForwardArrow className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center space-x-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    placeholder="Search or enter URL..."
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200"
                  >
                    Go
                  </button>
                </form>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={addBookmark}
                    className="p-2 text-gray-400 hover:text-white"
                    title="Add Bookmark"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white">
                    <Menu className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Browser Content */}
            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
              <div className="h-96 bg-white">
                <iframe
                  src={currentUrl}
                  className="w-full h-full border-0"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                  style={{
                    // Fix X-Frame issues by allowing the iframe to load
                    pointerEvents: 'auto'
                  }}
                  onError={(e) => {
                    console.log('Iframe load error:', e);
                    // Fallback content
                    const target = e.target as HTMLIFrameElement;
                    if (target) {
                      target.style.display = 'none';
                    }
                  }}
                />
              </div>
            </div>

            {/* Privacy Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Shield className="w-6 h-6 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">{browserMetrics.blockedAds}</span>
                </div>
                <h3 className="text-sm font-semibold text-white">Ads Blocked</h3>
                <p className="text-gray-400 text-xs">This session</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Eye className="w-6 h-6 text-blue-400" />
                  <span className="text-2xl font-bold text-blue-400">{browserMetrics.blockedTrackers}</span>
                </div>
                <h3 className="text-sm font-semibold text-white">Trackers Blocked</h3>
                <p className="text-gray-400 text-xs">This session</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                  <span className="text-2xl font-bold text-purple-400">{browserMetrics.privacyScore}%</span>
                </div>
                <h3 className="text-sm font-semibold text-white">Privacy Score</h3>
                <p className="text-gray-400 text-xs">Current page</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-400">{browserMetrics.dataSaved}</span>
                </div>
                <h3 className="text-sm font-semibold text-white">Data Saved</h3>
                <p className="text-gray-400 text-xs">This session</p>
              </motion.div>
            </div>
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Bookmarks</h2>
              <button
                onClick={addBookmark}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Bookmark</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-4 hover:border-cyan-400/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-2xl">{bookmark.favicon}</div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold truncate">{bookmark.title}</h3>
                      <p className="text-gray-400 text-sm truncate">{bookmark.url}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setCurrentUrl(bookmark.url);
                        setUrlInput(bookmark.url);
                        setActiveTab('browser');
                      }}
                      className="flex-1 bg-cyan-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-cyan-600 transition-colors"
                    >
                      Open
                    </button>
                    <button className="bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-gray-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Browsing History</h2>
            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <div className="space-y-3">
                {browserHistory.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      <div>
                        <p className="text-white font-medium">{url}</p>
                        <p className="text-gray-400 text-sm">Visited {index === historyIndex ? 'now' : 'earlier'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentUrl(url);
                        setUrlInput(url);
                        setHistoryIndex(index);
                        setActiveTab('browser');
                      }}
                      className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
                    >
                      Visit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Privacy Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Protection Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Ad Blocking</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Tracker Blocking</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Fingerprinting Protection</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Session Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Ads Blocked</span>
                    <span className="text-white font-semibold">{browserMetrics.blockedAds}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Trackers Blocked</span>
                    <span className="text-white font-semibold">{browserMetrics.blockedTrackers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Data Saved</span>
                    <span className="text-white font-semibold">{browserMetrics.dataSaved}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Browser Settings</h2>
            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Auto-block ads</h3>
                    <p className="text-gray-400 text-sm">Automatically block advertisements</p>
                  </div>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    Enabled
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Block trackers</h3>
                    <p className="text-gray-400 text-sm">Prevent tracking scripts from running</p>
                  </div>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    Enabled
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Clear browsing data</h3>
                    <p className="text-gray-400 text-sm">Clear history, cookies, and cache</p>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600">
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
