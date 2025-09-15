'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Mail, Settings, LogOut, Key, Fingerprint, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface IdentityProfile {
  id: string;
  profile_name: string;
  profile_type: string;
  is_primary: boolean;
  created_at: string;
}

export default function TauIDDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<IdentityProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [newProfile, setNewProfile] = useState({
    profile_name: '',
    profile_type: 'personal'
  });

  useEffect(() => {
    const token = localStorage.getItem('tauos_token');
    if (!token) {
      window.location.href = '/tauid/login';
      return;
    }

    // Load user data and profiles
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('tauos_token');
      const response = await fetch('https://tauos-zbtm.vercel.app/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setProfiles(data.profiles || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('tauos_token');
      const response = await fetch('https://tauos-zbtm.vercel.app/api/identity-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProfile)
      });

      if (response.ok) {
        setNewProfile({ profile_name: '', profile_type: 'personal' });
        setShowCreateProfile(false);
        loadUserData(); // Reload profiles
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tauos_token');
    window.location.href = '/tauid';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Loading your identity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold">TauOS</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user?.full_name || user?.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Identity Dashboard</h1>
            <p className="text-gray-400 text-lg">Manage your secure digital identity and profiles</p>
          </div>

          {/* User Info Card */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.full_name || 'Unknown User'}</h2>
                <p className="text-gray-400">{user?.email}</p>
                <p className="text-sm text-gray-500">@{user?.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">Email Status</span>
                </div>
                <p className={`text-sm ${user?.email_verified ? 'text-green-400' : 'text-red-400'}`}>
                  {user?.email_verified ? 'Verified' : 'Unverified'}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">Identity Status</span>
                </div>
                <p className={`text-sm ${user?.is_verified ? 'text-green-400' : 'text-yellow-400'}`}>
                  {user?.is_verified ? 'Verified' : 'Pending'}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Key className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">Security Level</span>
                </div>
                <p className="text-sm text-green-400">High</p>
              </div>
            </div>
          </div>

          {/* Identity Profiles */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Identity Profiles</h3>
              <button
                onClick={() => setShowCreateProfile(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                <span>Create Profile</span>
              </button>
            </div>

            {profiles.length === 0 ? (
              <div className="text-center py-12">
                <Fingerprint className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-4">No identity profiles created yet</p>
                <p className="text-gray-500">Create your first profile to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.map((profile) => (
                  <div key={profile.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg">{profile.profile_name}</h4>
                      {profile.is_primary && (
                        <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-semibold">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3 capitalize">{profile.profile_type}</p>
                    <p className="text-gray-500 text-xs">
                      Created: {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create Profile Modal */}
          {showCreateProfile && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 w-full max-w-md mx-4">
                <h3 className="text-xl font-bold mb-4">Create New Profile</h3>
                <form onSubmit={handleCreateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profile Name
                    </label>
                    <input
                      type="text"
                      value={newProfile.profile_name}
                      onChange={(e) => setNewProfile({ ...newProfile, profile_name: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Enter profile name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profile Type
                    </label>
                    <select
                      value={newProfile.profile_type}
                      onChange={(e) => setNewProfile({ ...newProfile, profile_type: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    >
                      <option value="personal">Personal</option>
                      <option value="business">Business</option>
                      <option value="developer">Developer</option>
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateProfile(false)}
                      className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}