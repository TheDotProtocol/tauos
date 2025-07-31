'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  PaperAirplaneIcon, 
  TrashIcon, 
  StarIcon,
  ArchiveBoxIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  Cog6ToothIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  labels: string[];
  attachments: string[];
}

interface Folder {
  id: string;
  name: string;
  count: number;
  icon: any;
}

export default function TauMailInterface() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [loading, setLoading] = useState(true);

  const folders: Folder[] = [
    { id: 'inbox', name: 'Inbox', count: 12, icon: EnvelopeIcon },
    { id: 'sent', name: 'Sent', count: 8, icon: PaperAirplaneIcon },
    { id: 'drafts', name: 'Drafts', count: 3, icon: ArchiveBoxIcon },
    { id: 'trash', name: 'Trash', count: 5, icon: TrashIcon },
    { id: 'spam', name: 'Spam', count: 2, icon: FolderIcon },
  ];

  // Mock data for demonstration
  useEffect(() => {
    const mockEmails: Email[] = [
      {
        id: '1',
        from: 'admin@tauos.org',
        to: 'user@tauos.org',
        subject: 'Welcome to TauMail! 🐢',
        body: 'Welcome to your new privacy-first email experience. TauMail is designed to keep your communications secure and private.',
        timestamp: new Date('2025-07-30T10:00:00'),
        read: false,
        starred: true,
        labels: ['important'],
        attachments: []
      },
      {
        id: '2',
        from: 'security@tauos.org',
        to: 'user@tauos.org',
        subject: 'Security Update Available',
        body: 'A new security update is available for your TauOS system. Please update at your earliest convenience.',
        timestamp: new Date('2025-07-30T09:30:00'),
        read: true,
        starred: false,
        labels: ['security'],
        attachments: []
      },
      {
        id: '3',
        from: 'support@taucloud.org',
        to: 'user@tauos.org',
        subject: 'Your TauCloud Storage',
        body: 'Your TauCloud storage is ready! You now have 10GB of secure, encrypted cloud storage available.',
        timestamp: new Date('2025-07-30T08:45:00'),
        read: true,
        starred: false,
        labels: ['cloud'],
        attachments: []
      }
    ];

    setEmails(mockEmails);
    setLoading(false);
  }, []);

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    if (!email.read) {
      setEmails(prev => prev.map(e => 
        e.id === email.id ? { ...e, read: true } : e
      ));
    }
  };

  const handleStarEmail = (emailId: string) => {
    setEmails(prev => prev.map(e => 
      e.id === emailId ? { ...e, starred: !e.starred } : e
    ));
  };

  const handleDeleteEmail = (emailId: string) => {
    setEmails(prev => prev.filter(e => e.id !== emailId));
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null);
    }
    toast.success('Email moved to trash');
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-gray-800 border-r border-gray-700"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">τ</span>
            </div>
            <h1 className="text-xl font-bold">TauMail</h1>
          </div>

          {/* Compose Button */}
          <button
            onClick={() => setComposeOpen(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Compose</span>
          </button>

          {/* Search */}
          <div className="mt-6 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Folders */}
          <nav className="mt-8">
            <ul className="space-y-2">
              {folders.map((folder) => {
                const Icon = folder.icon;
                return (
                  <li key={folder.id}>
                    <button
                      onClick={() => setCurrentFolder(folder.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        currentFolder === folder.id
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span>{folder.name}</span>
                      </div>
                      <span className="text-sm bg-gray-600 px-2 py-1 rounded-full">
                        {folder.count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold capitalize">{currentFolder}</h2>
              <p className="text-gray-400 text-sm">
                {filteredEmails.length} emails
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <UserCircleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Email List and Detail */}
        <div className="flex-1 flex">
          {/* Email List */}
          <div className="w-1/2 border-r border-gray-700 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {filteredEmails.map((email) => (
                  <motion.div
                    key={email.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedEmail?.id === email.id
                        ? 'bg-purple-600 bg-opacity-20'
                        : 'hover:bg-gray-800'
                    } ${!email.read ? 'bg-blue-600 bg-opacity-10' : ''}`}
                    onClick={() => handleEmailClick(email)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm truncate">
                            {email.from}
                          </span>
                          {email.starred && (
                            <StarIcon className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          )}
                        </div>
                        <h3 className={`text-sm mt-1 truncate ${
                          !email.read ? 'font-semibold' : ''
                        }`}>
                          {email.subject}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 truncate">
                          {email.body}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {format(email.timestamp, 'MMM d, h:mm a')}
                          </span>
                          {email.labels.length > 0 && (
                            <div className="flex space-x-1">
                              {email.labels.map((label) => (
                                <span
                                  key={label}
                                  className="text-xs px-2 py-1 bg-gray-600 rounded-full"
                                >
                                  {label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarEmail(email.id);
                          }}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                          <StarIcon className={`w-4 h-4 ${
                            email.starred ? 'text-yellow-400 fill-current' : 'text-gray-400'
                          }`} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEmail(email.id);
                          }}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                          <TrashIcon className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Email Detail */}
          <div className="flex-1 bg-gray-900">
            {selectedEmail ? (
              <div className="h-full flex flex-col">
                {/* Email Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">
                        {selectedEmail.subject}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>From: {selectedEmail.from}</span>
                        <span>To: {selectedEmail.to}</span>
                        <span>{format(selectedEmail.timestamp, 'MMM d, yyyy h:mm a')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        <PaperAirplaneIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        <ArchiveBoxIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEmail(selectedEmail.id)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed">
                      {selectedEmail.body}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <EnvelopeIcon className="w-16 h-16 mx-auto mb-4" />
                  <p>Select an email to read</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {composeOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">New Message</h3>
              <button
                onClick={() => setComposeOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">To:</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="recipient@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject:</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message:</label>
                <textarea
                  rows={8}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Type your message here..."
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Attach
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setComposeOpen(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 