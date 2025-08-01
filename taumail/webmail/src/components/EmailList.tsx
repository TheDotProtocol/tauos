'use client';

import React from 'react';
import { StarIcon, ArchiveBoxIcon, TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

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

interface EmailListProps {
  emails: Email[];
  onEmailSelect: (email: Email) => void;
  onEmailAction: (emailId: string, action: string, value?: any) => void;
  mode: 'standard' | 'parental' | 'senior';
}

const EmailList: React.FC<EmailListProps> = ({ emails, onEmailSelect, onEmailAction, mode }) => {
  const isSeniorMode = mode === 'senior';
  const isParentalMode = mode === 'parental';

  return (
    <div className="flex-1 bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {mode === 'senior' ? 'Your Emails' : mode === 'parental' ? 'Messages' : 'Inbox'}
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {emails.map((email) => (
          <div
            key={email.id}
            onClick={() => onEmailSelect(email)}
            className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
              !email.isRead ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {email.from.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${!email.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {email.from}
                    </span>
                    {email.isImportant && (
                      <span className="text-red-500">⚠️</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {new Date(email.date).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-green-600">🔒</span>
                  </div>
                </div>
                
                <div className={`mt-1 ${!email.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                  {email.subject}
                </div>
                
                <p className="text-sm text-gray-500 truncate mt-1">
                  {email.body.substring(0, 100)}...
                </p>
                
                <div className="flex items-center space-x-2 mt-2">
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
      
      {emails.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="text-6xl mb-4">📧</div>
          <p className="text-lg font-medium">No emails found</p>
          <p className="text-sm">Your inbox is empty</p>
        </div>
      )}
    </div>
  );
};

export default EmailList; 