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
  RefreshCw, ChevronLeft, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import TauMailDemoBanner from '@/components/apps/TauMailDemoBanner';
import { useTauMailSession } from '@/hooks/useTauMailSession';
import { getDemoSpam, isDemoSession } from '@/lib/taumail-demo';

export default function TauMailSpam() {
  const { user, isLoggedIn, isDemo, logout } = useTauMailSession();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isLoggedIn) loadSpamEmails();
  }, [isLoggedIn, isDemo]);

  const loadSpamEmails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('tauos_token');

      if (isDemoSession(token)) {
        setEmails(getDemoSpam());
        return;
      }

      const response = await fetch('/api/taumail/emails/spam', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEmails(data.emails || []);
      } else {
        console.log('No spam emails found');
        setEmails([]);
      }
    } catch (error) {
      console.error('Error loading spam emails:', error);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => logout();

  const filteredEmails = emails.filter(email => 
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  

  return (
    <DashboardShell
      title="Tau Mail"
      subtitle="Spam folder"
      userLabel={user?.email}
      onLogout={handleLogout}
      loading={!isLoggedIn}
      
    >
      <TauMailSubNav />
      {isDemo && <TauMailDemoBanner />}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
          {/* Navigation */}
          <div className="border-b border-gray-800 bg-gray-800/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Link href="/taumail/dashboard" className="flex items-center space-x-2 text-gray-400 hover:text-white">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </Link>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h1 className="text-xl font-semibold text-white">Spam Folder</h1>
                </div>
              </div>
              
              <button
                onClick={loadSpamEmails}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search spam emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Email List */}
          <div className="divide-y divide-gray-800">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No spam emails</h3>
                <p className="text-gray-400">Your spam folder is empty. Great job keeping it clean!</p>
              </div>
            ) : (
              filteredEmails.map((email, index) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 hover:bg-gray-800/50 cursor-pointer transition-colors ${
                    selectedEmail?.id === email.id ? 'bg-gray-800/50 border-r-4 border-yellow-400' : ''
                  }`}
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white truncate">
                          {email.from}
                        </p>
                        <p className="text-sm text-gray-400">
                          {email.time}
                        </p>
                      </div>
                      
                      <p className="text-sm font-medium text-white mt-1">
                        {email.subject}
                      </p>
                      
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {email.preview}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {!email.unread && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
    </DashboardShell>
  );
}
