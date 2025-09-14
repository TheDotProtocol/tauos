'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Inbox, Send, Archive, Trash2, Star, Search, Plus, 
  Filter, Download, Reply, Forward, MoreVertical, Users, 
  Shield, Lock, Eye, CheckCircle, AlertCircle, BarChart3, 
  Activity, Settings, Calendar, Clock, LogOut, User, X,
  RefreshCw, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

export default function TauMailInbox() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Check if user is logged in and load emails
  useEffect(() => {
    const storedUser = localStorage.getItem('tauos_user');
    const storedToken = localStorage.getItem('tauos_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      loadEmails();
    } else {
      // Redirect to landing page if not logged in
      window.location.href = '/taumail';
    }
  }, []);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('tauos_token');
      const response = await fetch('https://tauos-47am.vercel.app/api/emails/inbox', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEmails(data.emails || []);
      } else {
        // Fallback to demo emails for testing
        setEmails([
          {
            id: 1,
            from: 'welcome@tauos.org',
            subject: 'Welcome to TauOS Mail!',
            preview: 'Thank you for joining TauOS Mail. Your privacy-first email experience starts now.',
            time: 'Just now',
            unread: true,
            starred: false
          },
          {
            id: 2,
            from: 'support@tauos.org',
            subject: 'Your account is ready',
            preview: 'Your TauOS Mail account has been successfully set up and is ready to use.',
            time: '2 minutes ago',
            unread: true,
            starred: false
          },
          {
            id: 3,
            from: 'security@tauos.org',
            subject: 'Security Alert - New Login',
            preview: 'We detected a new login to your account from a new device.',
            time: '5 minutes ago',
            unread: false,
            starred: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading emails:', error);
      // Fallback to demo emails
      setEmails([
        {
          id: 1,
          from: 'welcome@tauos.org',
          subject: 'Welcome to TauOS Mail!',
          preview: 'Thank you for joining TauOS Mail. Your privacy-first email experience starts now.',
          time: 'Just now',
          unread: true,
          starred: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tauos_user');
    localStorage.removeItem('tauos_token');
    window.location.href = '/taumail';
  };

  const filteredEmails = emails.filter(email => 
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/taumail/dashboard" className="flex items-center space-x-2">
                <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-white" />
                <img src="/brand/tauos-logo.svg" alt="TauOS" className="w-8 h-8" />
                <div>
                  <h1 className="text-xl font-bold text-white">TauMail</h1>
                  <p className="text-sm text-gray-400">Inbox</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <User className="w-4 h-4" />
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
        {/* Inbox Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Inbox className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Inbox</h1>
              <p className="text-gray-400">{emails.length} emails</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadEmails}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/taumail/compose"
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Compose</span>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
            />
          </div>
        </div>

        {/* Email List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading emails...</p>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="p-8 text-center">
              <Inbox className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No emails found</h3>
              <p className="text-gray-500">Your inbox is empty or no emails match your search.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {filteredEmails.map((email) => (
                <div 
                  key={email.id} 
                  onClick={() => setSelectedEmail(email)}
                  className="p-6 hover:bg-gray-800/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {email.from.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className={`font-medium ${email.unread ? 'text-white' : 'text-gray-300'}`}>
                            {email.from}
                          </p>
                          {email.starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                        </div>
                        <p className="text-sm text-gray-400">{email.time}</p>
                      </div>
                      <p className={`text-sm mt-1 ${email.unread ? 'text-white font-medium' : 'text-gray-400'}`}>
                        {email.subject}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {email.preview}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-white transition-colors">
                        <Reply className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-white transition-colors">
                        <Forward className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedEmail.subject}</h2>
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {selectedEmail.from.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">{selectedEmail.from}</p>
                  <p className="text-gray-400 text-sm">{selectedEmail.time}</p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <p className="text-gray-300 leading-relaxed">{selectedEmail.preview}</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                  <Forward className="w-4 h-4" />
                  <span>Forward</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                  <Star className="w-4 h-4" />
                  <span>Star</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
