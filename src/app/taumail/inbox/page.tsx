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
  RefreshCw, ChevronLeft, Paperclip
} from 'lucide-react';
import Link from 'next/link';
import TauMailDemoBanner from '@/components/apps/TauMailDemoBanner';
import { useTauMailSession } from '@/hooks/useTauMailSession';
import { isDemoSession, mapDemoInboxForList } from '@/lib/taumail-demo';
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
import { useRouter } from 'next/navigation';

export default function TauMailInbox() {
  const router = useRouter();
  const { user, isLoggedIn, isDemo, logout } = useTauMailSession();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load emails once session is ready
  useEffect(() => {
    if (isLoggedIn) {
      loadEmails();
    }
  }, [isLoggedIn, isDemo]);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('tauos_token');

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
          starred: false,
          messageId: email.message_id || null,
        };
        });
        setEmails(mappedEmails);
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

  const markAsRead = async (emailId: number) => {
    if (isDemo) {
      setEmails((prev) =>
        prev.map((email) => (email.id === emailId ? { ...email, unread: false } : email))
      );
      return;
    }

    try {
      const token = localStorage.getItem('tauos_token');
      const response = await fetch('/api/taumail/emails/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ emailId })
      });
      
      if (response.ok) {
        // Update local state
        setEmails(emails.map(email => 
          email.id === emailId ? { ...email, unread: false } : email
        ));
        console.log('Email marked as read');
      }
    } catch (error) {
      console.error('Error marking email as read:', error);
    }
  };

  const openReply = (email: { fromEmail?: string; from?: string; subject?: string; body?: string; time?: string }, mode: 'reply' | 'forward') => {
    const to = mode === 'reply' ? (email.fromEmail || extractEmailAddress(email.from || '')) : '';
    const subject = mode === 'reply' ? replySubject(email.subject || '') : forwardSubject(email.subject || '');
    const body =
      mode === 'reply'
        ? buildQuotedReplyBody(email.from || '', email.time || '', email.body || '')
        : buildForwardBody(email.from || '', email.time || '', email.subject || '', email.body || '');
    router.push(mailComposeHref({ to, subject, body }));
  };

  const filteredEmails = emails.filter(email => 
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  

  return (
    <DashboardShell
      title="Tau Mail"
      subtitle="Inbox"
      userLabel={user?.email}
      onLogout={logout}
      loading={!isLoggedIn}
      
    >
      <TauMailSubNav />
      {isDemo && <TauMailDemoBanner />}
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
                          {(email.from || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className={`font-medium ${email.unread ? 'text-white' : 'text-gray-300'}`}>
                            {email.from || 'Unknown'}
                          </p>
                          {email.starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                        </div>
                        <p className="text-sm text-gray-400">{email.time}</p>
                      </div>
                      <p className={`text-sm mt-1 ${email.unread ? 'text-white font-medium' : 'text-gray-400'}`}>
                        {email.subject || 'No Subject'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {email.preview || 'No preview'}
                      </p>
                      {email.attachments?.length > 0 && (
                        <p className="text-xs text-yellow-400/80 mt-1 flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          {email.attachments.length} attachment{email.attachments.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {email.unread && (
                        <button
                        onClick={(e) => { e.stopPropagation(); markAsRead(email.id); }}
                        className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      )}
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
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {(selectedEmail.from || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">{selectedEmail.from || 'Unknown'}</p>
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
