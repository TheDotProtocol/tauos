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
  RefreshCw, ChevronLeft, Edit, Save
} from 'lucide-react';
import Link from 'next/link';
import TauMailDemoBanner from '@/components/apps/TauMailDemoBanner';
import { useTauMailSession } from '@/hooks/useTauMailSession';
import { getDemoDrafts, isDemoSession } from '@/lib/taumail-demo';

export default function TauMailDrafts() {
  const { user, isLoggedIn, isDemo, logout } = useTauMailSession();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isLoggedIn) loadDrafts();
  }, [isLoggedIn, isDemo]);

  const loadDrafts = async () => {
    setLoading(true);
    try {
      if (isDemoSession(localStorage.getItem('tauos_token'))) {
        setDrafts(getDemoDrafts());
        return;
      }
      const savedDrafts = localStorage.getItem('tauos_drafts');
      if (savedDrafts) {
        setDrafts(JSON.parse(savedDrafts));
      } else {
        // Demo drafts
        setDrafts([
          {
            id: 1,
            to: 'john.doe@company.com',
            subject: 'Project Update - Q4 Goals',
            text: 'Hi John,\n\nI wanted to update you on our Q4 objectives and the progress we\'ve made so far...',
            lastModified: new Date().toISOString(),
            isDraft: true
          },
          {
            id: 2,
            to: 'team@company.com',
            subject: 'Weekly Team Meeting',
            text: 'Hello Team,\n\nThis is a reminder about our weekly team meeting scheduled for...',
            lastModified: new Date(Date.now() - 86400000).toISOString(),
            isDraft: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading drafts:', error);
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => logout();

  const handleEditDraft = (draft) => {
    // Navigate to compose with draft data
    const composeData = {
      to: draft.to,
      subject: draft.subject,
      text: draft.text,
      isDraft: true,
      draftId: draft.id
    };
    localStorage.setItem('tauos_compose_data', JSON.stringify(composeData));
    window.location.href = '/taumail/compose';
  };

  const handleDeleteDraft = (draftId) => {
    const updatedDrafts = drafts.filter(draft => draft.id !== draftId);
    setDrafts(updatedDrafts);
    localStorage.setItem('tauos_drafts', JSON.stringify(updatedDrafts));
  };

  const filteredDrafts = drafts.filter(draft => 
    draft.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  

  return (
    <DashboardShell
      title="Tau Mail"
      subtitle="Drafts"
      userLabel={user?.email}
      onLogout={handleLogout}
      loading={!isLoggedIn}
      
    >
      <TauMailSubNav />
      {isDemo && <TauMailDemoBanner />}
      {/* Drafts Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Archive className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Drafts</h1>
              <p className="text-gray-400">{drafts.length} saved drafts</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadDrafts}
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
              <span>New Draft</span>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search drafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
            />
          </div>
        </div>

        {/* Drafts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading drafts...</p>
            </div>
          ) : filteredDrafts.length === 0 ? (
            <div className="p-8 text-center">
              <Archive className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No drafts found</h3>
              <p className="text-gray-500">You don't have any saved drafts or no drafts match your search.</p>
              <Link
                href="/taumail/compose"
                className="inline-flex items-center space-x-2 mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Draft</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {filteredDrafts.map((draft) => (
                <div 
                  key={draft.id} 
                  className="p-6 hover:bg-gray-800/30 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {draft.to.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-300">
                            To: {draft.to}
                          </p>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Draft"></div>
                        </div>
                        <p className="text-sm text-gray-400">
                          {new Date(draft.lastModified).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm mt-1 text-white font-medium">
                        {draft.subject}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {draft.text.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEditDraft(draft)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="Edit draft"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 className="w-4 h-4" />
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
    </DashboardShell>
  );
}
