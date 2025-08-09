"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { EmailList } from "@/components/email/email-list";
import { EmailActions } from "@/components/email/email-actions";
import { ComposeModal } from "@/components/email/compose-modal";
import { FolderManager } from "@/components/email/folder-manager";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Mail, 
  Send, 
  Star, 
  Trash2, 
  Archive, 
  AlertCircle,
  Plus,
  Search,
  Settings,
  User,
  Shield,
  Lock,
  RefreshCw,
  Folder,
  Flag
} from "lucide-react";

// Mock data for demonstration
const mockEmails = [
  {
    id: "1",
    from: "john.doe@company.com",
    subject: "Project Update - Q4 Goals",
    preview: "Hi team, I wanted to share our progress on the Q4 objectives. We've made significant strides in...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    isStarred: true,
    hasAttachments: true,
    priority: "high" as const,
    folder: "inbox",
    isFlagged: false,
  },
  {
    id: "2",
    from: "support@tauos.org",
    subject: "Welcome to TauMail!",
    preview: "Welcome to your new privacy-first email experience. Your account has been successfully created...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    priority: "normal" as const,
    folder: "inbox",
    isFlagged: false,
  },
  {
    id: "3",
    from: "alice@startup.io",
    subject: "Meeting Tomorrow at 10 AM",
    preview: "Just a reminder about our meeting tomorrow. We'll be discussing the new feature roadmap...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    priority: "normal" as const,
    folder: "inbox",
    isFlagged: true,
  },
  {
    id: "4",
    from: "security@tauos.org",
    subject: "Account Security Alert",
    preview: "We detected a new login to your account from an unrecognized device. If this was you...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    isRead: false,
    isStarred: true,
    hasAttachments: false,
    priority: "high" as const,
    folder: "inbox",
    isFlagged: false,
  },
  {
    id: "5",
    from: "newsletter@tech.com",
    subject: "Weekly Tech Digest",
    preview: "This week's top stories: AI breakthroughs, new privacy regulations, and the future of...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
    isStarred: false,
    hasAttachments: true,
    priority: "low" as const,
    folder: "inbox",
    isFlagged: false,
  },
];

const mockFolders = [
  { id: "inbox", name: "Inbox", color: "#4ECDC4", emailCount: 5, isSystem: true },
  { id: "sent", name: "Sent", color: "#45B7D1", emailCount: 0, isSystem: true },
  { id: "starred", name: "Starred", color: "#FFEAA7", emailCount: 2, isSystem: true },
  { id: "archive", name: "Archive", color: "#96CEB4", emailCount: 0, isSystem: true },
  { id: "work", name: "Work", color: "#FF6B6B", emailCount: 3, isSystem: false },
  { id: "personal", name: "Personal", color: "#DDA0DD", emailCount: 1, isSystem: false },
];

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [emails, setEmails] = useState(mockEmails);
  const [folders, setFolders] = useState(mockFolders);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isFolderManagerOpen, setIsFolderManagerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Email selection handlers
  const handleEmailSelect = (emailId: string) => {
    setSelectedEmail(emailId);
    if (!selectedEmails.includes(emailId)) {
      setSelectedEmails([...selectedEmails, emailId]);
    }
  };

  const handleEmailDeselect = (emailId: string) => {
    setSelectedEmails(selectedEmails.filter(id => id !== emailId));
    if (selectedEmail === emailId) {
      setSelectedEmail(null);
    }
  };

  const handleSelectAll = () => {
    const allEmailIds = filteredEmails.map(email => email.id);
    setSelectedEmails(allEmailIds);
  };

  const handleDeselectAll = () => {
    setSelectedEmails([]);
    setSelectedEmail(null);
  };

  // Email action handlers
  const handleEmailStar = (emailId: string) => {
    setEmails(emails.map(email => 
      email.id === emailId 
        ? { ...email, isStarred: !email.isStarred }
        : email
    ));
  };

  const handleEmailDelete = (emailId: string) => {
    setEmails(emails.filter(email => email.id !== emailId));
    if (selectedEmail === emailId) {
      setSelectedEmail(null);
    }
    setSelectedEmails(selectedEmails.filter(id => id !== emailId));
  };

  const handleEmailArchive = (emailId: string) => {
    setEmails(emails.map(email => 
      email.id === emailId 
        ? { ...email, folder: "archive" }
        : email
    ));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleComposeSend = async (emailData: any) => {
    // Simulate sending email
    console.log("Sending email:", emailData);
    // Add to sent folder
    const newEmail = {
      id: Date.now().toString(),
      from: "user@tauos.org",
      subject: emailData.subject,
      preview: emailData.body.substring(0, 100) + "...",
      timestamp: new Date(),
      isRead: true,
      isStarred: false,
      hasAttachments: emailData.attachments.length > 0,
      priority: emailData.priority,
      folder: "sent",
      isFlagged: false,
    };
    setEmails([newEmail, ...emails]);
  };

  const handleComposeSave = (emailData: any) => {
    console.log("Saving draft:", emailData);
  };

  const handleCreateFolder = (name: string, color: string) => {
    const newFolder = {
      id: Date.now().toString(),
      name,
      color,
      emailCount: 0,
      isSystem: false,
    };
    setFolders([...folders, newFolder]);
  };

  const handleUpdateFolder = (id: string, name: string, color: string) => {
    setFolders(folders.map(folder => 
      folder.id === id 
        ? { ...folder, name, color }
        : folder
    ));
  };

  const handleDeleteFolder = (id: string) => {
    setFolders(folders.filter(folder => folder.id !== id));
    // Move emails from deleted folder to inbox
    setEmails(emails.map(email => 
      email.folder === id 
        ? { ...email, folder: "inbox" }
        : email
    ));
  };

  const handleMoveToFolder = (emailIds: string[], folderId: string) => {
    setEmails(emails.map(email => 
      emailIds.includes(email.id)
        ? { ...email, folder: folderId }
        : email
    ));
    setSelectedEmails([]);
  };

  const handleBulkActions = {
    onArchive: (emailIds: string[]) => {
      setEmails(emails.map(email => 
        emailIds.includes(email.id)
          ? { ...email, folder: "archive" }
          : email
      ));
      setSelectedEmails([]);
    },
    onDelete: (emailIds: string[]) => {
      setEmails(emails.filter(email => !emailIds.includes(email.id)));
      setSelectedEmails([]);
      if (selectedEmail && emailIds.includes(selectedEmail)) {
        setSelectedEmail(null);
      }
    },
    onStar: (emailIds: string[]) => {
      setEmails(emails.map(email => 
        emailIds.includes(email.id)
          ? { ...email, isStarred: true }
          : email
      ));
    },
    onUnstar: (emailIds: string[]) => {
      setEmails(emails.map(email => 
        emailIds.includes(email.id)
          ? { ...email, isStarred: false }
          : email
      ));
    },
    onMarkAsRead: (emailIds: string[]) => {
      setEmails(emails.map(email => 
        emailIds.includes(email.id)
          ? { ...email, isRead: true }
          : email
      ));
    },
    onMarkAsUnread: (emailIds: string[]) => {
      setEmails(emails.map(email => 
        emailIds.includes(email.id)
          ? { ...email, isRead: false }
          : email
      ));
    },
    onFlag: (emailIds: string[]) => {
      setEmails(emails.map(email => 
        emailIds.includes(email.id)
          ? { ...email, isFlagged: true }
          : email
      ));
    },
    onUnflag: (emailIds: string[]) => {
      setEmails(emails.map(email => 
        emailIds.includes(email.id)
          ? { ...email, isFlagged: false }
          : email
      ));
    },
    onCopy: (emailIds: string[]) => {
      console.log("Copying emails:", emailIds);
    },
    onDownload: (emailIds: string[]) => {
      console.log("Downloading emails:", emailIds);
    },
    onShare: (emailIds: string[]) => {
      console.log("Sharing emails:", emailIds);
    },
    onReply: (emailId: string) => {
      console.log("Replying to email:", emailId);
      setIsComposeOpen(true);
    },
    onForward: (emailId: string) => {
      console.log("Forwarding email:", emailId);
      setIsComposeOpen(true);
    },
  };

  const filteredEmails = emails.filter(email => {
    switch (activeSection) {
      case "inbox":
        return email.folder === "inbox";
      case "sent":
        return email.folder === "sent";
      case "starred":
        return email.isStarred;
      case "archive":
        return email.folder === "archive";
      case "spam":
        return email.folder === "spam";
      case "trash":
        return email.folder === "trash";
      default:
        // Check if it's a custom folder
        return email.folder === activeSection;
    }
  });

  return (
    <div className="h-screen bg-tau-dark-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onCompose={() => setIsComposeOpen(true)}
        onRefresh={handleRefresh}
        folders={folders}
      />

      {/* Main Content */}
      <div className="h-full flex flex-col">
        {/* Header */}
        <Header
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Email Actions Toolbar */}
        <EmailActions
          selectedEmails={selectedEmails}
          onRefresh={handleRefresh}
          onArchive={handleBulkActions.onArchive}
          onDelete={handleBulkActions.onDelete}
          onStar={handleBulkActions.onStar}
          onUnstar={handleBulkActions.onUnstar}
          onMoveToFolder={handleMoveToFolder}
          onReply={handleBulkActions.onReply}
          onForward={handleBulkActions.onForward}
          onMarkAsRead={handleBulkActions.onMarkAsRead}
          onMarkAsUnread={handleBulkActions.onMarkAsUnread}
          onFlag={handleBulkActions.onFlag}
          onUnflag={handleBulkActions.onUnflag}
          onCopy={handleBulkActions.onCopy}
          onDownload={handleBulkActions.onDownload}
          onShare={handleBulkActions.onShare}
          isRefreshing={isRefreshing}
          showFolderManager={() => setIsFolderManagerOpen(true)}
        />

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Email List */}
          <div className="w-full lg:w-1/2 border-r border-tau-dark-600">
            <div className="h-full flex flex-col">
              {/* Section Header */}
              <div className="p-4 border-b border-tau-dark-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold text-white capitalize">
                      {activeSection}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">
                        {filteredEmails.length} messages
                      </span>
                      {selectedEmails.length > 0 && (
                        <span className="text-sm text-tau-primary">
                          ({selectedEmails.length} selected)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeselectAll}
                    >
                      Clear
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Email List */}
              <div className="flex-1">
                <EmailList
                  emails={filteredEmails}
                  selectedEmail={selectedEmail}
                  onEmailSelect={handleEmailSelect}
                  onEmailStar={handleEmailStar}
                  onEmailDelete={handleEmailDelete}
                  onEmailArchive={handleEmailArchive}
                />
              </div>
            </div>
          </div>

          {/* Email Detail */}
          <div className="hidden lg:block lg:w-1/2">
            <AnimatePresence mode="wait">
              {selectedEmail ? (
                <motion.div
                  key={selectedEmail}
                  className="h-full p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card variant="glass" className="h-full">
                    <div className="space-y-4">
                      {/* Email Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-tau-gradient rounded-full flex items-center justify-center">
                            <span className="text-tau-dark-900 font-bold">J</span>
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">John Doe</h3>
                            <p className="text-gray-400 text-sm">john.doe@company.com</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Archive className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Email Subject */}
                      <div>
                        <h2 className="text-xl font-semibold text-white mb-2">
                          Project Update - Q4 Goals
                        </h2>
                        <p className="text-gray-400 text-sm">
                          Today at 2:30 PM
                        </p>
                      </div>

                      {/* Email Body */}
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed">
                          Hi team,
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                          I wanted to share our progress on the Q4 objectives. We've made significant strides in our key initiatives and I'm excited to see the momentum we're building.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                          Key highlights from this quarter:
                        </p>
                        <ul className="text-gray-300 list-disc list-inside space-y-1">
                          <li>Successfully launched the new privacy features</li>
                          <li>Achieved 99.9% uptime across all services</li>
                          <li>Reduced response time by 40%</li>
                          <li>Onboarded 500+ new enterprise customers</li>
                        </ul>
                        <p className="text-gray-300 leading-relaxed">
                          Let's keep this momentum going into Q1. I'll schedule a team meeting next week to discuss our roadmap for the new year.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                          Best regards,<br />
                          John
                        </p>
                      </div>

                      {/* Security Badge */}
                      <div className="flex items-center space-x-2 p-3 bg-tau-dark-700 rounded-lg">
                        <Shield className="w-4 h-4 text-tau-primary" />
                        <span className="text-sm text-gray-300">
                          This email was encrypted and verified by TauMail
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  className="h-full flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center">
                    <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Select an email to read
                    </h3>
                    <p className="text-gray-400">
                      Choose an email from the list to view its contents
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={handleComposeSend}
        onSave={handleComposeSave}
      />

      {/* Folder Manager Modal */}
      <FolderManager
        isOpen={isFolderManagerOpen}
        onClose={() => setIsFolderManagerOpen(false)}
        folders={folders}
        onCreateFolder={handleCreateFolder}
        onUpdateFolder={handleUpdateFolder}
        onDeleteFolder={handleDeleteFolder}
        onMoveToFolder={(emailId, folderId) => handleMoveToFolder([emailId], folderId)}
        selectedEmailId={selectedEmails.length === 1 ? selectedEmails[0] : undefined}
      />
    </div>
  );
}
