'use client';

import DashboardShell from '@/components/apps/DashboardShell';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Download, Bookmark, History, Settings, LogOut,
  Trash2, RefreshCw, Globe, Lock, Eye, Zap, ExternalLink, Plus
} from 'lucide-react';
import Link from 'next/link';

function authHeaders() {
  const token = localStorage.getItem('tauos_token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export default function TauBrowserDashboard() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState(null);
  const [privacy, setPrivacy] = useState(null);
  const [downloads, setDownloads] = useState(null);
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [syncRes, dlRes] = await Promise.all([
        fetch('/api/taubrowser/sync', { headers: authHeaders() }),
        fetch('/api/taubrowser/downloads'),
      ]);
      if (syncRes.ok) {
        const data = await syncRes.json();
        setBookmarks(data.bookmarks ?? []);
        setHistory(data.history ?? []);
        setSettings(data.settings);
        setPrivacy(data.privacy);
      }
      if (dlRes.ok) {
        setDownloads(await dlRes.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('tauos_user');
    const storedToken = localStorage.getItem('tauos_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      loadData();
    } else {
      window.location.href = '/taubrowser';
    }
  }, [loadData]);

  const handleLogout = () => {
    localStorage.removeItem('tauos_user');
    localStorage.removeItem('tauos_token');
    window.location.href = '/taubrowser';
  };

  const toggleSetting = async (key) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    await fetch('/api/taubrowser/settings', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ [key]: next[key] }),
    });
  };

  const addBookmark = async (e) => {
    e.preventDefault();
    if (!newBookmark.title || !newBookmark.url) return;
    const res = await fetch('/api/taubrowser/bookmarks', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(newBookmark),
    });
    if (res.ok) {
      setNewBookmark({ title: '', url: '' });
      loadData();
    }
  };

  const removeBookmark = async (id) => {
    await fetch(`/api/taubrowser/bookmarks?id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    loadData();
  };

  const clearHistory = async () => {
    if (!confirm('Clear all synced browsing history?')) return;
    await fetch('/api/taubrowser/history', { method: 'DELETE', headers: authHeaders() });
    loadData();
  };

  const formatBytes = (n) => {
    if (!n) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(n) / Math.log(k));
    return `${parseFloat((n / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Privacy', icon: Settings },
    { id: 'download', label: 'Download App', icon: Download },
  ];

  return (
    <DashboardShell
      title="Tau Browser"
      subtitle="Account sync & privacy dashboard — install the native app to browse."
      userLabel={user?.email}
      onLogout={handleLogout}
      loading={!isLoggedIn || loading}
      fullWidth
    >
      {/* Native app CTA */}
      <div className="mb-8 p-6 rounded-2xl border border-yellow-400/30 bg-yellow-400/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-yellow-400" />
              Install Tau Browser
            </h2>
            <p className="text-gray-400 mt-1">
              Real private browsing happens in the native app — ad blocking, tracker protection, and zero telemetry.
            </p>
          </div>
          {downloads?.recommended?.available && (
            <a
              href={downloads.recommended.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold shrink-0"
            >
              <Download className="w-5 h-5" />
              Download for {downloads.recommended.label}
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-yellow-400 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
        <button onClick={loadData} className="ml-auto p-2 text-gray-400 hover:text-white" title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {activeTab === 'overview' && privacy && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Ads Blocked', value: privacy.blockedAds, icon: Shield, color: 'from-green-500 to-emerald-500' },
            { label: 'Trackers Blocked', value: privacy.blockedTrackers, icon: Eye, color: 'from-blue-500 to-cyan-500' },
            { label: 'Requests Blocked', value: privacy.blockedRequests, icon: Lock, color: 'from-purple-500 to-pink-500' },
            { label: 'Data Saved', value: formatBytes(privacy.dataSavedBytes), icon: Zap, color: 'from-yellow-400 to-orange-500' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-gray-900/30 border border-gray-800 rounded-2xl"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          <form onSubmit={addBookmark} className="flex flex-col sm:flex-row gap-2">
            <input
              placeholder="Title"
              value={newBookmark.title}
              onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
            <input
              placeholder="https://..."
              value={newBookmark.url}
              onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
            <button type="submit" className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>
          {bookmarks.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">No bookmarks synced yet. Add some or sync from the native app.</p>
          ) : (
            bookmarks.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-4 bg-gray-900/30 border border-gray-800 rounded-xl">
                <div>
                  <p className="font-medium text-white">{b.title}</p>
                  <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline">{b.url}</a>
                </div>
                <button onClick={() => removeBookmark(b.id)} className="p-2 text-gray-400 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={clearHistory} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Clear history
            </button>
          </div>
          {history.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">No history synced yet.</p>
          ) : (
            history.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 border-b border-gray-800">
                <div>
                  <p className="text-white text-sm">{h.title || h.url}</p>
                  <p className="text-xs text-gray-500">{new Date(h.visited_at).toLocaleString()}</p>
                </div>
                <a href={h.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'settings' && settings && (
        <div className="space-y-3 max-w-lg">
          {[
            { key: 'block_ads', label: 'Block ads', desc: 'Block advertising networks and banners' },
            { key: 'block_trackers', label: 'Block trackers', desc: 'Stop analytics and cross-site tracking' },
            { key: 'fingerprint_protection', label: 'Fingerprint protection', desc: 'Reduce browser fingerprinting surface' },
            { key: 'https_only', label: 'HTTPS only', desc: 'Upgrade connections to HTTPS when possible' },
            { key: 'do_not_track', label: 'Do Not Track', desc: 'Send DNT header on every request' },
            { key: 'clear_on_exit', label: 'Clear on exit', desc: 'Wipe session data when closing the browser' },
          ].map((s) => (
            <div key={s.key} className="flex items-center justify-between p-4 bg-gray-900/30 border border-gray-800 rounded-xl">
              <div>
                <p className="font-medium text-white">{s.label}</p>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
              <button
                onClick={() => toggleSetting(s.key)}
                className={`w-12 h-6 rounded-full transition-colors ${settings[s.key] ? 'bg-yellow-400' : 'bg-gray-700'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings[s.key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'download' && downloads && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {downloads.all.map((opt) => (
            <a
              key={opt.id}
              href={opt.available ? opt.url : '#'}
              target={opt.available ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`p-6 rounded-2xl border border-gray-800 bg-gray-900/30 hover:border-gray-600 ${!opt.available ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <h3 className="font-bold text-white">{opt.label}</h3>
              <p className="text-sm text-gray-400 mt-1">{opt.description}</p>
              <p className="text-xs text-yellow-400 mt-2">
                {opt.available ? `Download ${opt.format}` : 'Coming soon'}
              </p>
            </a>
          ))}
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-gray-800 flex flex-wrap gap-4 text-sm text-gray-500">
        <Link href="/taumail" className="hover:text-white">Tau Mail</Link>
        <Link href="/taucloud" className="hover:text-white">Tau Cloud</Link>
        <Link href="/tauid" className="hover:text-white">Tau ID</Link>
        <Link href="/tauai" className="hover:text-white">Tau AI</Link>
      </div>
    </DashboardShell>
  );
}
