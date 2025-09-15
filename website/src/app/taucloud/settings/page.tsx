'use client';
// TauCloud Settings - User Preferences & Account Management - v1.0

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, User, Shield, Bell, Palette, HardDrive, 
  Key, Trash2, Download, Upload, Eye, EyeOff,
  Save, X, Check, AlertCircle, Info, Lock, Unlock,
  Smartphone, Monitor, Globe, Database, Zap
} from 'lucide-react';
import Link from 'next/link';

export default function TauCloudSettings() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    avatarUrl: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('tauos_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      loadProfile();
    } else {
      window.location.href = '/taucloud';
    }
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('tauos_token');
      const response = await fetch('https://tauos-47am.vercel.app/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          fullName: data.user.fullName || '',
          email: data.user.email || '',
          username: data.user.username || '',
          avatarUrl: data.user.avatarUrl || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('tauos_token');
      const response = await fetch('https://tauos-47am.vercel.app/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          avatarUrl: formData.avatarUrl
        })
      });

      if (response.ok) {
        // Update local storage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('tauos_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('tauos_token');
      const response = await fetch('https://tauos-47am.vercel.app/api/profile/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      if (response.ok) {
        alert('Password updated successfully!');
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        alert('Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password');
    } finally {
      setSaving(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'storage', label: 'Storage', icon: HardDrive },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
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
              <Link href="/taucloud/dashboard" className="flex items-center space-x-2">
                <img src="/brand/tauos-logo.svg" alt="TauOS" className="w-10 h-10" />
                <div>
                  <h1 className="text-xl font-bold text-white">TauCloud</h1>
                  <p className="text-sm text-gray-400">Settings</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                        {formData.avatarUrl ? (
                          <img src={formData.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{formData.fullName || 'No name set'}</h3>
                        <p className="text-gray-400">{formData.email}</p>
                        <button className="mt-2 text-sm text-yellow-400 hover:text-yellow-300">
                          Change Avatar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                          placeholder="Enter your username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Avatar URL
                        </label>
                        <input
                          type="url"
                          value={formData.avatarUrl}
                          onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200 disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={formData.currentPassword}
                              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 pr-12"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={formData.newPassword}
                              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                              placeholder="Enter new password"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleChangePassword}
                          disabled={saving || !formData.currentPassword || !formData.newPassword}
                          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200 disabled:opacity-50"
                        >
                          {saving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                          ) : (
                            <Key className="w-4 h-4" />
                          )}
                          <span>{saving ? 'Updating...' : 'Update Password'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-8">
                      <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-yellow-400" />
                          <div>
                            <p className="text-white font-medium">2FA is not enabled</p>
                            <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Storage Tab */}
              {activeTab === 'storage' && profile && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Storage Usage</h2>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Storage Overview</h3>
                        <span className="text-sm text-gray-400">
                          {formatFileSize(profile.storage.used)} of {formatFileSize(profile.storage.limit)} used
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(profile.storage.usedPercent, 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-white">{profile.storage.usedPercent.toFixed(1)}%</p>
                          <p className="text-sm text-gray-400">Used</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">{formatFileSize(profile.storage.available)}</p>
                          <p className="text-sm text-gray-400">Available</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">{formatFileSize(profile.storage.limit)}</p>
                          <p className="text-sm text-gray-400">Total</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-800/50 rounded-xl">
                        <div className="flex items-center space-x-3 mb-3">
                          <Database className="w-5 h-5 text-blue-400" />
                          <h4 className="font-semibold text-white">Storage Breakdown</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Documents</span>
                            <span className="text-white">2.1 GB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Images</span>
                            <span className="text-white">1.8 GB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Videos</span>
                            <span className="text-white">3.2 GB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Other</span>
                            <span className="text-white">0.9 GB</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-800/50 rounded-xl">
                        <div className="flex items-center space-x-3 mb-3">
                          <Zap className="w-5 h-5 text-yellow-400" />
                          <h4 className="font-semibold text-white">Quick Actions</h4>
                        </div>
                        <div className="space-y-2">
                          <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                            Clean up duplicate files
                          </button>
                          <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                            Empty trash
                          </button>
                          <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                            Upgrade storage
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Display Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                          <div>
                            <p className="text-white font-medium">Dark Mode</p>
                            <p className="text-gray-400 text-sm">Use dark theme for better viewing</p>
                          </div>
                          <div className="w-12 h-6 bg-yellow-400 rounded-full relative">
                            <div className="w-5 h-5 bg-black rounded-full absolute right-0.5 top-0.5"></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                          <div>
                            <p className="text-white font-medium">Compact View</p>
                            <p className="text-gray-400 text-sm">Show more files in less space</p>
                          </div>
                          <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                            <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">File Management</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                          <div>
                            <p className="text-white font-medium">Auto-sync</p>
                            <p className="text-gray-400 text-sm">Automatically sync files across devices</p>
                          </div>
                          <div className="w-12 h-6 bg-yellow-400 rounded-full relative">
                            <div className="w-5 h-5 bg-black rounded-full absolute right-0.5 top-0.5"></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                          <div>
                            <p className="text-white font-medium">Smart Folders</p>
                            <p className="text-gray-400 text-sm">Automatically organize files by type</p>
                          </div>
                          <div className="w-12 h-6 bg-yellow-400 rounded-full relative">
                            <div className="w-5 h-5 bg-black rounded-full absolute right-0.5 top-0.5"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Notification Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-white font-medium">Email Notifications</p>
                          <p className="text-gray-400 text-sm">Receive updates via email</p>
                        </div>
                        <div className="w-12 h-6 bg-yellow-400 rounded-full relative">
                          <div className="w-5 h-5 bg-black rounded-full absolute right-0.5 top-0.5"></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-white font-medium">File Sharing</p>
                          <p className="text-gray-400 text-sm">Get notified when files are shared with you</p>
                        </div>
                        <div className="w-12 h-6 bg-yellow-400 rounded-full relative">
                          <div className="w-5 h-5 bg-black rounded-full absolute right-0.5 top-0.5"></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-white font-medium">Storage Alerts</p>
                          <p className="text-gray-400 text-sm">Warn when storage is running low</p>
                        </div>
                        <div className="w-12 h-6 bg-yellow-400 rounded-full relative">
                          <div className="w-5 h-5 bg-black rounded-full absolute right-0.5 top-0.5"></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-white font-medium">Security Updates</p>
                          <p className="text-gray-400 text-sm">Important security and privacy updates</p>
                        </div>
                        <div className="w-12 h-6 bg-yellow-400 rounded-full relative">
                          <div className="w-5 h-5 bg-black rounded-full absolute right-0.5 top-0.5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
