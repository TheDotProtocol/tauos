'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  StarIcon, 
  StarIcon as StarIconSolid,
  ArchiveBoxIcon,
  TrashIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  CloudArrowUpIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  FolderIcon,
  TagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  SortAscendingIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';

interface Email {
  id: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  date: Date;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  hasAttachments: boolean;
  folder: string;
  category: 'family' | 'school' | 'finance' | 'health' | 'work' | 'other';
  securityLevel: 'encrypted' | 'verified' | 'standard';
}

interface EnhancedEmailListProps {
  emails: Email[];
  onEmailSelect: (email: Email) => void;
  onEmailAction: (emailId: string, action: string, value?: any) => void;
  mode: 'standard' | 'parental' | 'senior';
}

export const EnhancedEmailList: React.FC<EnhancedEmailListProps> = ({
  emails,
  onEmailSelect,
  onEmailAction,
  mode
}) => {
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'sender' | 'subject' | 'category'>('date');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: FolderIcon, color: 'bg-blue-500' },
    { id: 'sent', name: 'Sent', icon: FolderIcon, color: 'bg-green-500' },
    { id: 'drafts', name: 'Drafts', icon: FolderIcon, color: 'bg-yellow-500' },
    { id: 'archive', name: 'Archive', icon: FolderIcon, color: 'bg-gray-500' },
    { id: 'trash', name: 'Trash', icon: FolderIcon, color: 'bg-red-500' }
  ];

  const categories = [
    { id: 'family', name: 'Family', color: 'bg-pink-100 text-pink-800' },
    { id: 'school', name: 'School', color: 'bg-blue-100 text-blue-800' },
    { id: 'finance', name: 'Finance', color: 'bg-green-100 text-green-800' },
    { id: 'health', name: 'Health', color: 'bg-red-100 text-red-800' },
    { id: 'work', name: 'Work', color: 'bg-purple-100 text-purple-800' }
  ];

  const handleDragStart = (e: React.DragEvent, emailId: string) => {
    setDragItem(emailId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    setDragOverFolder(folderId);
  };

  const handleDrop = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    if (dragItem) {
      onEmailAction(dragItem, 'move', folderId);
      setDragItem(null);
      setDragOverFolder(null);
    }
  };

  const handleEmailSelect = (email: Email, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select
      const newSelected = new Set(selectedEmails);
      if (newSelected.has(email.id)) {
        newSelected.delete(email.id);
      } else {
        newSelected.add(email.id);
      }
      setSelectedEmails(newSelected);
    } else {
      // Single select
      setSelectedEmails(new Set([email.id]));
      onEmailSelect(email);
    }
  };

  const filteredEmails = emails
    .filter(email => {
      if (filterCategory !== 'all' && email.category !== filterCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          email.subject.toLowerCase().includes(query) ||
          email.from.toLowerCase().includes(query) ||
          email.body.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'sender':
          return a.from.localeCompare(b.from);
        case 'subject':
          return a.subject.localeCompare(b.subject);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const getCategoryColor = (category: string) => {
    return categories.find(c => c.id === category)?.color || 'bg-gray-100 text-gray-800';
  };

  const getSecurityIcon = (securityLevel: string) => {
    switch (securityLevel) {
      case 'encrypted':
        return <LockClosedIcon className="h-4 w-4 text-green-500" />;
      case 'verified':
        return <ShieldCheckIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <EyeIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="enhanced-email-list">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="sender">Sender</option>
              <option value="subject">Subject</option>
              <option value="category">Category</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode */}
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              {viewMode === 'list' ? 'Grid' : 'List'}
            </button>

            {/* Security Info */}
            <button
              onClick={() => setShowSecurityInfo(!showSecurityInfo)}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ShieldCheckIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Security Info Panel */}
        {showSecurityInfo && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <ShieldCheckIcon className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Security Status</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Encryption:</span> End-to-End
              </div>
              <div>
                <span className="font-medium">Trackers:</span> 0 Detected
              </div>
              <div>
                <span className="font-medium">Data Location:</span> Your Server
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Folders */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {folders.map(folder => {
            const Icon = folder.icon;
            return (
              <div
                key={folder.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  dragOverFolder === folder.id 
                    ? 'bg-blue-100 border-2 border-blue-300' 
                    : 'hover:bg-gray-100'
                }`}
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDrop={(e) => handleDrop(e, folder.id)}
              >
                <div className={`w-3 h-3 rounded-full ${folder.color}`} />
                <Icon className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {folder.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Email List */}
      <div className={`email-list ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4' : 'divide-y divide-gray-200'}`}>
        {filteredEmails.map(email => (
          <div
            key={email.id}
            draggable
            onDragStart={(e) => handleDragStart(e, email.id)}
            onClick={(e) => handleEmailSelect(email, e)}
            className={`email-item cursor-pointer transition-all duration-200 ${
              selectedEmails.has(email.id) ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
            } ${viewMode === 'grid' ? 'p-4 border border-gray-200 rounded-lg' : 'p-4'}`}
          >
            <div className="flex items-start space-x-3">
              {/* Selection Checkbox */}
              <input
                type="checkbox"
                checked={selectedEmails.has(email.id)}
                onChange={(e) => {
                  const newSelected = new Set(selectedEmails);
                  if (e.target.checked) {
                    newSelected.add(email.id);
                  } else {
                    newSelected.delete(email.id);
                  }
                  setSelectedEmails(newSelected);
                }}
                className="mt-1"
              />

              {/* Security Icon */}
              <div className="flex-shrink-0">
                {getSecurityIcon(email.securityLevel)}
              </div>

              {/* Email Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${email.isRead ? 'text-gray-900' : 'text-black font-semibold'}`}>
                      {email.from}
                    </span>
                    {email.category !== 'other' && (
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(email.category)}`}>
                        {categories.find(c => c.id === email.category)?.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {email.hasAttachments && (
                      <PaperClipIcon className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(email.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className={`mt-1 ${email.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                  {email.subject}
                </div>

                {viewMode === 'grid' && (
                  <div className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {email.body.substring(0, 100)}...
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEmailAction(email.id, 'star', !email.isStarred);
                    }}
                    className="p-1 text-gray-400 hover:text-yellow-500"
                  >
                    {email.isStarred ? (
                      <StarIconSolid className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <StarIcon className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEmailAction(email.id, 'archive');
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <ArchiveBoxIcon className="h-4 w-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEmailAction(email.id, 'delete');
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEmails.length === 0 && (
        <div className="text-center py-12">
          <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No emails found' : 'No emails yet'}
          </h3>
          <p className="text-gray-500">
            {searchQuery ? 'Try adjusting your search terms' : 'Start by composing your first email'}
          </p>
        </div>
      )}
    </div>
  );
}; 