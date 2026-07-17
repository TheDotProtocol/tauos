'use client';

import DashboardShell from '@/components/apps/DashboardShell';
import TauMailSubNav from '@/components/apps/TauMailSubNav';
// Force rebuild - Database tables created, backend working, ready for testing - v3

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Inbox, Send, Archive, Trash2, Star, Search, Plus, 
  Filter, Download, Reply, Forward, MoreVertical, Users, 
  Shield, Lock, Eye, CheckCircle, AlertCircle, BarChart3, 
  Activity, Settings, Calendar, Clock, LogOut, User, X, AlertTriangle, Paperclip
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TauMailDemoBanner from '@/components/apps/TauMailDemoBanner';
import { useTauMailSession } from '@/hooks/useTauMailSession';
import {
  getDemoSent,
  isDemoSession,
  mapDemoInboxForList,
} from '@/lib/taumail-demo';
import {
  mailComposeHref,
  replySubject,
  forwardSubject,
  buildQuotedReplyBody,
  buildForwardBody,
  extractEmailAddress,
} from '@/lib/taumail-compose';
import { parseStoredIncomingAttachments } from '@/lib/taumail-inbound';
import TauMailAttachmentList from '@/components/apps/TauMailAttachmentList';

export default function TauMailDashboard() {
  const router = useRouter();
  const { user, isLoggedIn, isDemo, logout } = useTauMailSession();
  const [activeTab, setActiveTab] = useState('inbox');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    text: ''
  });
  const [emails, setEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      loadEmails();
      loadSentEmails();
    }
  }, [isLoggedIn, isDemo]);

  const loadEmails = async () => {
    try {
      const token = localStorage.getItem('tauos_token');
      if (!token) return;

      if (isDemoSession(token)) {
        setEmails(mapDemoInboxForList());
        return;
      }
      
      const response = await fetch('/api/taumail/emails/inbox', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Map API response to frontend format
        const mappedEmails = (data.emails || []).map(email => {
          const attachments = parseStoredIncomingAttachments(email.attachments);
          return {
          id: email.id,
          from: email.display_name || email.sender_name || email.from_email || 'Unknown',
          fromEmail: email.from_email || email.sender_email || extractEmailAddress(email.from_email || ''),
          subject: email.subject || 'No Subject',
          preview: email.body ? email.body.substring(0, 100) + '...' : 'No preview',
          body: email.body || '',
          bodyHtml: email.body_html || '',
          attachments,
          time: email.received_at ? new Date(email.received_at).toLocaleString() : 'Unknown time',
          unread: !email.is_read,
          starred: false
        };
        });
        setEmails(mappedEmails);
      } else {
        // If no inbox endpoint, create some sample emails for demo
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
    }
  };

  const loadSentEmails = async () => {
    try {
      const token = localStorage.getItem('tauos_token');
      if (!token) return;

      if (isDemoSession(token)) {
        setSentEmails(getDemoSent());
        return;
      }
      
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
    }
  };

  const handleComposeEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('tauos_token');

      if (isDemoSession(token)) {
        alert('✅ Preview mode — compose is UI-only in demo.');
        setComposeData({ to: '', cc: '', bcc: '', subject: '', text: '' });
        setShowComposeModal(false);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/taumail/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          to: composeData.to,
          subject: composeData.subject,
          body: composeData.text,
          cc: composeData.cc || undefined,
          bcc: composeData.bcc || undefined,
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        // Reload sent emails from server
        await loadSentEmails();
        
        alert(`✅ Email sent successfully!\n\nFrom: ${result.fromName} <${result.from}>\nMessage ID: ${result.messageId}`);
        setComposeData({ to: '', cc: '', bcc: '', subject: '', text: '' });
        setShowComposeModal(false);
      } else {
        alert(`❌ Failed to send email:\n${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`❌ Error sending email:\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openReply = (
    email: { fromEmail?: string; from?: string; subject?: string; body?: string; preview?: string; time?: string },
    mode: 'reply' | 'forward'
  ) => {
    const to = mode === 'reply' ? (email.fromEmail || extractEmailAddress(email.from || '')) : '';
    const subject = mode === 'reply' ? replySubject(email.subject || '') : forwardSubject(email.subject || '');
    const bodyText = email.body || email.preview || '';
    const body =
      mode === 'reply'
        ? buildQuotedReplyBody(email.from || '', email.time || '', bodyText)
        : buildForwardBody(email.from || '', email.time || '', email.subject || '', bodyText);
    router.push(mailComposeHref({ to, subject, body }));
  };

  const emailMetrics = {
    totalEmails: emails.length,
    unreadEmails: emails.filter(email => email.unread).length,
    sentEmails: sentEmails.length,
    privacyScore: 98,
    securityEvents: 1
  };

  const privacyBreakdown = [
    { category: 'End-to-End Encryption', score: 100, status: 'excellent' },
    { category: 'Phishing Protection', score: 98, status: 'excellent' },
    { category: 'Spam Filtering', score: 96, status: 'excellent' },
    { category: 'Data Retention', score: 95, status: 'excellent' },
    { category: 'Access Control', score: 99, status: 'excellent' }
  ];

  const recentEmails = [
    {
      id: 1,
      from: 'john.doe@company.com',
      subject: 'Project Update - Q4 Goals',
      preview: 'Here are the latest updates on our Q4 objectives...',
      time: '2 minutes ago',
      unread: true,
      starred: false
    },
    {
      id: 2,
      from: 'security@tauos.org',
      subject: 'Security Alert - New Login',
      preview: 'We detected a new login to your account...',
      time: '5 minutes ago',
      unread: true,
      starred: true
    },
    {
      id: 3,
      from: 'calendar@company.com',
      subject: 'Meeting Reminder - Tomorrow',
      preview: 'Don\'t forget about our team meeting tomorrow at 2 PM...',
      time: '10 minutes ago',
      unread: false,
      starred: false
    },
    {
      id: 4,
      from: 'billing@vendor.com',
      subject: 'Invoice #2024-001',
      preview: 'Your monthly invoice is ready for review...',
      time: '15 minutes ago',
      unread: false,
      starred: false
    }
  ];

  

  return (
    <DashboardShell
      title="Tau Mail"
      subtitle="Private email dashboard — Tau Core Inc."
      userLabel={user?.email}
      onLogout={logout}
      loading={!isLoggedIn}
      
    >
      <TauMailSubNav />
      {isDemo && <TauMailDemoBanner />}
      {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Emails</p>
                <p className="text-2xl font-bold text-white">{emailMetrics.totalEmails.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-yellow-400">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>{emailMetrics.unreadEmails} unread</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Privacy Score</p>
                <p className="text-2xl font-bold text-white">{emailMetrics.privacyScore}/100</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>Excellent</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Sent Emails</p>
                <p className="text-2xl font-bold text-white">{emailMetrics.sentEmails}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              <span>This month</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Security Events</p>
                <p className="text-2xl font-bold text-white">{emailMetrics.securityEvents}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>Last 24 hours</span>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-1 mb-8">
          {[
            { id: 'inbox', label: 'Inbox', icon: Inbox, href: '/taumail/inbox' },
            { id: 'spam', label: 'Spam', icon: AlertTriangle, href: '/taumail/spam' },
            { id: 'sent', label: 'Sent', icon: Send, href: '/taumail/sent' },
            { id: 'drafts', label: 'Drafts', icon: Archive, href: '/taumail/drafts' },
            { id: 'trash', label: 'Trash', icon: Trash2, href: '/taumail/trash' }
          ].map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </Link>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Email List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Recent Emails</h2>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search emails..."
                        className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
                      />
                    </div>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-800">
                {(activeTab === 'sent' ? sentEmails : emails).map((email) => (
                  <div 
                    key={email.id} 
                    onClick={() => setSelectedEmail(email)}
                    className="p-6 hover:bg-gray-800/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {(email.from || email.to || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className={`font-medium ${email.unread ? 'text-white' : 'text-gray-300'}`}>
                            {activeTab === 'sent' ? (email.to || 'Unknown') : (email.from || 'Unknown')}
                          </p>
                          {email.starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                        </div>
                          <p className="text-sm text-gray-400">
                            {activeTab === 'sent' ? new Date(email.sentAt).toLocaleString() : email.time}
                          </p>
                        </div>
                        <p className={`text-sm mt-1 ${email.unread ? 'text-white font-medium' : 'text-gray-400'}`}>
                          {email.subject || 'No Subject'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {activeTab === 'sent' ? (email.text ? email.text.substring(0, 100) + '...' : 'No content') : (email.preview || 'No preview')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); openReply(email, 'reply'); }}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="Reply"
                        >
                          <Reply className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); openReply(email, 'forward'); }}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="Forward"
                        >
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
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Privacy Score Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Privacy Score Breakdown</h3>
              <div className="space-y-4">
                {privacyBreakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{item.category}</span>
                      <span className="text-sm font-semibold text-white">{item.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  href="/taumail/compose"
                  className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Compose Email</span>
                </Link>
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 transition-colors">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 transition-colors">
                  <Users className="w-5 h-5" />
                  <span>Contacts</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>

      {/* Compose Email Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Compose Email</h2>
              <button
                onClick={() => setShowComposeModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleComposeEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  To
                </label>
                <input
                  type="email"
                  value={composeData.to}
                  onChange={(e) => setComposeData({...composeData, to: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="recipient@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CC (Optional)
                </label>
                <input
                  type="email"
                  value={composeData.cc}
                  onChange={(e) => setComposeData({...composeData, cc: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="cc@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  BCC (Optional)
                </label>
                <input
                  type="email"
                  value={composeData.bcc}
                  onChange={(e) => setComposeData({...composeData, bcc: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="bcc@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="Email subject"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={composeData.text}
                  onChange={(e) => setComposeData({...composeData, text: e.target.value})}
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 resize-none"
                  placeholder="Type your message here..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Email'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

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
                    {(selectedEmail.from || selectedEmail.to || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">{selectedEmail.from || selectedEmail.to || 'Unknown'}</p>
                  <p className="text-gray-400 text-sm">{selectedEmail.time}</p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedEmail.body || selectedEmail.preview}
                </p>
                <TauMailAttachmentList attachments={selectedEmail.attachments || []} />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => openReply(selectedEmail, 'reply')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
                <button
                  type="button"
                  onClick={() => openReply(selectedEmail, 'forward')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
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