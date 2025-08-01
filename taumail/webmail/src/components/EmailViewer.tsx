'use client';

import React from 'react';

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

interface EmailViewerProps {
  email: Email | null;
  onEmailAction: (emailId: string, action: string, value?: any) => void;
}

const EmailViewer: React.FC<EmailViewerProps> = ({ email, onEmailAction }) => {
  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-6xl mb-4">📧</div>
          <h3 className="text-xl font-medium mb-2">No email selected</h3>
          <p className="text-sm">Choose an email from the list to view its contents</p>
        </div>
      </div>
    );
  }

  const getSecurityBadge = (level: string) => {
    switch (level) {
      case 'encrypted':
        return <span className="text-green-600">🔒 Encrypted</span>;
      case 'verified':
        return <span className="text-blue-600">✓ Verified</span>;
      default:
        return <span className="text-gray-600">• Standard</span>;
    }
  };

  return (
    <div className="flex-1 p-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Email Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{email.subject}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span><strong>From:</strong> {email.from}</span>
                <span><strong>Date:</strong> {new Date(email.date).toLocaleString()}</span>
                {getSecurityBadge(email.securityLevel)}
              </div>
            </div>
          </div>
          
          {/* Security Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm text-green-800">
              <span>🔒</span>
              <span>This email is end-to-end encrypted and secure</span>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {email.body}
          </div>
        </div>

        {/* Email Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>Sent via TauMail — End-to-End Encrypted</p>
            <p>0 trackers, 0 ads served, 100% encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailViewer; 