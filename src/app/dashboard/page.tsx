"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { EmailList } from "@/components/email/email-list";
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
  Lock
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
  },
];

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [emails, setEmails] = useState(mockEmails);

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
  };

  const handleEmailArchive = (emailId: string) => {
    // Move to archive logic
    console.log("Archive email:", emailId);
  };

  const filteredEmails = emails.filter(email => {
    switch (activeSection) {
      case "inbox":
        return true;
      case "sent":
        return false; // Would be sent emails
      case "starred":
        return email.isStarred;
      case "archive":
        return false; // Would be archived emails
      case "spam":
        return false; // Would be spam emails
      case "trash":
        return false; // Would be deleted emails
      default:
        return true;
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
      />

      {/* Main Content */}
      <div className="lg:ml-80 h-full flex flex-col">
        {/* Header */}
        <Header
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Email List */}
          <div className="w-full lg:w-1/2 border-r border-tau-dark-600">
            <div className="h-full flex flex-col">
              {/* Section Header */}
              <div className="p-4 border-b border-tau-dark-600">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white capitalize">
                    {activeSection}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      {filteredEmails.length} messages
                    </span>
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
                  onEmailSelect={setSelectedEmail}
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
    </div>
  );
} 