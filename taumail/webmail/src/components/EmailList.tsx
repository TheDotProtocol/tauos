'use client';

import React from 'react';
import { EnhancedEmailList } from './EnhancedEmailList';

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

export const EmailList: React.FC<EmailListProps> = (props) => {
  return <EnhancedEmailList {...props} />;
}; 