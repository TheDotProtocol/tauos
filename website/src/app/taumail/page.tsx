'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Inbox, Send, Archive, Trash2, Star, Search, Plus, 
  Filter, Download, Reply, Forward, MoreVertical, Users, 
  Shield, Lock, Eye, CheckCircle, AlertCircle, BarChart3, 
  Activity, Settings, Calendar, Clock
} from 'lucide-react';

export default function TauMailDashboard() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: ''
  });

  const emailMetrics = {
    totalEmails: 2847,
    unreadEmails: 23,
    sentEmails: 156,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'excellent': return 'text-green-400 bg-green-400/10';
      case 'good': return 'text-yellow-400 bg-yellow-400/10';
      case 'success': return 'text-green-400 bg-green-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src="/brand/tauos-logo.svg" alt="TauOS" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-white">TauMail</h1>
                <p className="text-sm text-gray-400">Private Email Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowRegistration(!showRegistration)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {showRegistration ? 'Hide Registration' : 'Get @tauos.org Email'}
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('https://tauos-cbh3.vercel.app/api/auth/send-test-email', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        to: 'saleenafalcon@gmail.com',
                        subject: 'TauOS Frontend Test',
                        text: 'This email was sent from the TauOS frontend interface!'
                      })
                    });
                    const result = await response.json();
                    if (response.ok) {
                      alert('✅ Email sent successfully! Check your inbox.');
                    } else {
                      alert('❌ Error: ' + result.error);
                    }
                  } catch (error) {
                    alert('❌ Connection error: ' + error.message);
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Test Email
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {showRegistration && (
        <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Get Your @tauos.org Email</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const response = await fetch('https://tauos-cbh3.vercel.app/api/auth/register', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        ...registrationData,
                        email: `${registrationData.username}@tauos.org`
                      })
                    });
                    const result = await response.json();
                    if (response.ok) {
                      alert('✅ Registration successful! You can now use your @tauos.org email.');
                      setShowRegistration(false);
                      setRegistrationData({ email: '', password: '', username: '', fullName: '' });
                    } else {
                      alert('❌ Error: ' + result.error);
                    }
                  } catch (error) {
                    alert('❌ Connection error: ' + error.message);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={registrationData.username}
                      onChange={(e) => setRegistrationData({...registrationData, username: e.target.value})}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                      placeholder="yourname"
                      required
                    />
                    <span className="px-3 py-2 bg-gray-700 border border-l-0 border-gray-700 rounded-r-lg text-gray-300">@tauos.org</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={registrationData.fullName}
                    onChange={(e) => setRegistrationData({...registrationData, fullName: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                    placeholder="Your Full Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={registrationData.password}
                    onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                    placeholder="Choose a secure password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
                >
                  Create @tauos.org Account
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <p className="text-2xl font-bold text-white">{emailMetrics.totalEmails}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Inbox className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-400">
              <Mail className="w-4 h-4 mr-1" />
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
            <div className="mt-4">
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${emailMetrics.privacyScore}%` }}
                ></div>
              </div>
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
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-400">
              <CheckCircle className="w-4 h-4 mr-1" />
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
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-yellow-400">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Last 24 hours</span>
            </div>
          </motion.div>
        </div>

        <div className="flex space-x-1 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-1 mb-8">
          {[
            { id: 'inbox', label: 'Inbox', icon: Inbox },
            { id: 'sent', label: 'Sent', icon: Send },
            { id: 'drafts', label: 'Drafts', icon: Archive },
            { id: 'trash', label: 'Trash', icon: Trash2 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {activeTab === 'inbox' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-6">Privacy Score Breakdown</h3>
                  <div className="space-y-4">
                    {privacyBreakdown.map((item) => (
                      <div key={item.category} className="p-4 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{item.category}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.score}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              item.score >= 95 ? 'bg-green-500' : 
                              item.score >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-6">Recent Emails</h3>
                  <div className="space-y-4">
                    {[
                      { subject: 'Project Update - Q4 Goals', sender: 'john.doe@company.com', time: '2 minutes ago', unread: true },
                      { subject: 'Security Alert - New Login', sender: 'security@tauos.org', time: '5 minutes ago', unread: false },
                      { subject: 'Meeting Reminder - Tomorrow', sender: 'calendar@company.com', time: '10 minutes ago', unread: false },
                      { subject: 'Invoice #2024-001', sender: 'billing@vendor.com', time: '15 minutes ago', unread: true }
                    ].map((email, index) => (
                      <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${email.unread ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-gray-800/30'}`}>
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${email.unread ? 'bg-blue-400' : 'bg-gray-400'}`}></div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${email.unread ? 'text-white' : 'text-gray-300'}`}>{email.subject}</p>
                          <p className="text-gray-400 text-xs">{email.sender}</p>
                          <p className="text-gray-500 text-xs">{email.time}</p>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'sent' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Sent Emails</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Plus className="w-4 h-4" />
                  <span>Compose Email</span>
                </button>
              </div>

              <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Recipient</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Subject</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Sent</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {[
                        { recipient: 'team@company.com', subject: 'Weekly Update', status: 'delivered', sent: '2 hours ago' },
                        { recipient: 'client@external.com', subject: 'Project Proposal', status: 'delivered', sent: '1 day ago' },
                        { recipient: 'support@vendor.com', subject: 'Technical Issue', status: 'delivered', sent: '2 days ago' }
                      ].map((email, index) => (
                        <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-white">{email.recipient}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-white">{email.subject}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(email.status)}`}>
                              {email.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">{email.sent}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                                <Reply className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'drafts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center py-12">
                <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Drafts</h3>
                <p className="text-gray-400 mb-6">You don't have any saved drafts</p>
                <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  Compose New Email
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'trash' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center py-12">
                <Trash2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Trash is Empty</h3>
                <p className="text-gray-400">Deleted emails will appear here</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 