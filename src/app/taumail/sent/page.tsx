'use client';

import DashboardShell from '@/components/apps/DashboardShell';
import TauMailSubNav from '@/components/apps/TauMailSubNav';
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

export default function TauMailSent() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Check if user is logged in and load sent emails
  useEffect(() => {
    const storedUser = localStorage.getItem('tauos_user');
    const storedToken = localStorage.getItem('tauos_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      loadSentEmails();
    } else {
      // Redirect to landing page if not logged in
      window.location.href = '/taumail';
    }
  }, []);

  const loadSentEmails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('tauos_token');
      const response = await fetch('/api/taumail/emails/sent', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSentEmails(data.emails || []);
      } else {
        console.log('No sent emails endpoint available');
        setSentEmails([]);
      }
    } catch (error) {
      console.error('Error loading sent emails:', error);
      setSentEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tauos_user');
    localStorage.removeItem('tauos_token');
    window.location.href = '/taumail';
  };

  const filteredEmails = sentEmails.filter(email => 
    email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.recipient_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.body?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  

  return (
    <DashboardShell
      title="Tau Mail"
      subtitle="Sent mail"
      userLabel={user?.email}
      onLogout={handleLogout}
      loading={!isLoggedIn}
      
    >
      <TauMailSubNav />
      {/* Sent Items Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Send className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Sent Items</h1>
              <p className="text-gray-400">{sentEmails.length} emails sent</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadSentEmails}
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
              placeholder="Search sent emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
            />
          </div>
        </div>

        {/* Sent Emails List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading sent emails...</p>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="p-8 text-center">
              <Send className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No sent emails</h3>
              <p className="text-gray-500">You haven't sent any emails yet or no emails match your search.</p>
              <Link
                href="/taumail/compose"
                className="inline-flex items-center space-x-2 mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Compose First Email</span>
              </Link>
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
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-black font-semibold text-sm">
                          {email.recipient_email?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-300">
                            To: {email.recipient_email}
                          </p>
                          <div className="w-2 h-2 bg-green-500 rounded-full" title="Sent successfully"></div>
                        </div>
                        <p className="text-sm text-gray-400">
                          {new Date(email.sent_at).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm mt-1 text-white font-medium">
                        {email.subject}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {email.body?.substring(0, 100)}...
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
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-black font-semibold text-lg">
                    {selectedEmail.recipient_email?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">To: {selectedEmail.recipient_email}</p>
                  <p className="text-gray-400 text-sm">
                    Sent: {new Date(selectedEmail.sent_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedEmail.body}</p>
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
    </DashboardShell>
  );
}
