'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail,
  Shield,
  Search,
  Plus,
  Settings,
  User,
  Inbox,
  Send,
  Star,
  Trash,
  Archive,
  Filter,
  MoreVertical,
  Download,
  Lock,
  Eye,
  EyeOff,
  FileText,
  Trash2
} from 'lucide-react';

// Updated TauMail page with improved UI design - Force deployment
export default function TauMailPage() {
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const emails = [
    {
      id: 1,
      sender: 'TauOS Team',
      subject: 'Welcome to TauMail - Your Privacy-First Email',
      preview: 'Welcome to TauMail! Your inbox is now protected with end-to-end encryption...',
      time: '2 hours ago',
      isRead: false,
      isStarred: true,
      isEncrypted: true
    },
    {
      id: 2,
      sender: 'Security Update',
      subject: 'Your Privacy Matters - Zero Tracking Confirmed',
      preview: 'Your TauMail account is running with zero telemetry and complete privacy...',
      time: '1 day ago',
      isRead: true,
      isStarred: false,
      isEncrypted: true
    },
    {
      id: 3,
      sender: 'TauCloud Integration',
      subject: 'Seamless File Sharing with TauCloud',
      preview: 'Share files securely with your TauCloud integration. All files are encrypted...',
      time: '3 days ago',
      isRead: true,
      isStarred: false,
      isEncrypted: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">TauMail</span>
              </div>
              <div className="hidden md:flex items-center space-x-6 ml-8">
                <a href="#" className="text-red-600 font-medium">Inbox</a>
                <a href="#" className="text-gray-500 hover:text-gray-700">Sent</a>
                <a href="#" className="text-gray-500 hover:text-gray-700">Drafts</a>
                <a href="#" className="text-gray-500 hover:text-gray-700">Trash</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mail"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Compose Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowCompose(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Compose</span>
              </button>
            </div>

            {/* Email List */}
            <div className="bg-white rounded-lg shadow-sm border">
              {emails.map((email) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    selectedEmail === email.id ? 'bg-blue-50 border-blue-200' : ''
                  } ${!email.isRead ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedEmail(email.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 flex-1">
                      <input type="checkbox" className="rounded" />
                      {email.isStarred ? (
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      ) : (
                        <Star className="w-4 h-4 text-gray-300" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${!email.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                            {email.sender}
                          </span>
                          {email.isEncrypted && (
                            <Shield className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`${!email.isRead ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                            {email.subject}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm truncate">{email.preview}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{email.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Privacy Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Privacy Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">End-to-End Encryption</span>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Zero Telemetry</span>
                  <div className="flex items-center space-x-2">
                    <EyeOff className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Enabled</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">No Tracking</span>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Protected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Your Mail</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Inbox</span>
                  <span className="text-sm font-medium text-gray-900">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sent</span>
                  <span className="text-sm font-medium text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Drafts</span>
                  <span className="text-sm font-medium text-gray-900">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage Used</span>
                  <span className="text-sm font-medium text-gray-900">45 MB</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">TauMail Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>End-to-end encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <EyeOff className="w-4 h-4 text-green-500" />
                  <span>Zero telemetry</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>No tracking pixels</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-green-500" />
                  <span>Self-host option</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">New Message</h3>
              <button
                onClick={() => setShowCompose(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-4">
              <input
                type="email"
                placeholder="To"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <textarea
                placeholder="Write your message..."
                rows={8}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center justify-between p-4 border-t">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Message will be encrypted</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 