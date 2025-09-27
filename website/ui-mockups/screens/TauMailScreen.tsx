import React, { useState } from 'react'
import { 
  EnvelopeIcon,
  InboxIcon,
  PaperAirplaneIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  DocumentIcon,
  TrashIcon,
  StarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PaperClipIcon,
  EyeIcon,
  LockClosedIcon,
  UserCircleIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { TauOSCard, TauOSButton, TauOSIcon } from '../components/TauOSTheme'

const TauMailScreen: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState(0)
  const [composeOpen, setComposeOpen] = useState(false)

  const emails = [
    {
      id: 1,
      from: 'support@tauos.org',
      subject: 'Welcome to TauMail - Your Privacy-First Email',
      preview: 'Thank you for choosing TauMail. Your emails are now protected with end-to-end encryption...',
      time: '2 hours ago',
      unread: true,
      encrypted: true,
      starred: false,
      attachments: 0
    },
    {
      id: 2,
      from: 'security@tauos.org',
      subject: 'Security Update - New Encryption Features',
      preview: 'We\'ve implemented additional security measures to protect your communications...',
      time: '1 day ago',
      unread: false,
      encrypted: true,
      starred: true,
      attachments: 1
    },
    {
      id: 3,
      from: 'admin@arholdings.group',
      subject: 'TauOS Development Update',
      preview: 'Latest updates on TauOS development including new features and improvements...',
      time: '3 days ago',
      unread: false,
      encrypted: false,
      starred: false,
      attachments: 0
    },
    {
      id: 4,
      from: 'newsletter@tauos.org',
      subject: 'TauOS Weekly Newsletter',
      preview: 'Stay updated with the latest news, features, and community highlights...',
      time: '1 week ago',
      unread: false,
      encrypted: false,
      starred: false,
      attachments: 0
    }
  ]

  const folders = [
    { name: 'Inbox', icon: InboxIcon, count: 12, active: true },
    { name: 'Sent', icon: PaperAirplaneIcon, count: 8 },
    { name: 'Drafts', icon: DocumentIcon, count: 2 },
    { name: 'Archive', icon: ArchiveBoxIcon, count: 45 },
    { name: 'Spam', icon: ExclamationTriangleIcon, count: 0 },
    { name: 'Trash', icon: TrashIcon, count: 3 }
  ]

  return (
    <div className="w-full h-screen bg-neutral-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-800 border-r border-neutral-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <EnvelopeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">TauMail</h1>
              <p className="text-neutral-400 text-xs">Privacy-First Email</p>
            </div>
          </div>
        </div>

        {/* Compose Button */}
        <div className="p-4">
          <TauOSButton 
            variant="primary" 
            size="lg" 
            className="w-full"
            onClick={() => setComposeOpen(true)}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Compose
          </TauOSButton>
        </div>

        {/* Folders */}
        <div className="flex-1 px-4">
          <nav className="space-y-1">
            {folders.map((folder) => (
              <button
                key={folder.name}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  folder.active 
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <folder.icon className="w-4 h-4" />
                  <span>{folder.name}</span>
                </div>
                <span className="text-xs text-neutral-500">{folder.count}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-neutral-700">
          <div className="flex items-center space-x-3">
            <UserCircleIcon className="w-8 h-8 text-neutral-400" />
            <div>
              <p className="text-white text-sm font-medium">admin@tauos.org</p>
              <p className="text-neutral-400 text-xs">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-neutral-700 rounded-lg px-3 py-2">
              <MagnifyingGlassIcon className="w-4 h-4 text-neutral-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search emails..."
                className="bg-transparent text-neutral-300 placeholder-neutral-500 outline-none text-sm w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <TauOSButton variant="ghost" size="sm">
              <EyeIcon className="w-4 h-4" />
            </TauOSButton>
            <TauOSButton variant="ghost" size="sm">
              <LockClosedIcon className="w-4 h-4" />
            </TauOSButton>
          </div>
        </div>

        {/* Email List and Preview */}
        <div className="flex-1 flex">
          {/* Email List */}
          <div className="w-96 bg-neutral-900 border-r border-neutral-700">
            <div className="p-4">
              <h2 className="text-white font-semibold mb-4">Inbox</h2>
              <div className="space-y-2">
                {emails.map((email, index) => (
                  <div
                    key={email.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedEmail === index 
                        ? 'bg-primary-500/20 border border-primary-500/30' 
                        : 'hover:bg-neutral-800 border border-transparent'
                    }`}
                    onClick={() => setSelectedEmail(index)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${email.unread ? 'bg-blue-400' : 'bg-transparent'}`}></div>
                        <span className={`text-sm font-medium ${email.unread ? 'text-white' : 'text-neutral-300'}`}>
                          {email.from}
                        </span>
                        {email.encrypted && (
                          <LockClosedIcon className="w-3 h-3 text-green-400" />
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {email.starred && <StarIcon className="w-3 h-3 text-yellow-400" />}
                        {email.attachments > 0 && <PaperClipIcon className="w-3 h-3 text-neutral-400" />}
                        <span className="text-xs text-neutral-500">{email.time}</span>
                      </div>
                    </div>
                    <h3 className={`text-sm font-medium mb-1 ${email.unread ? 'text-white' : 'text-neutral-300'}`}>
                      {email.subject}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2">
                      {email.preview}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Email Preview */}
          <div className="flex-1 bg-neutral-900">
            {selectedEmail !== null && (
              <div className="h-full flex flex-col">
                {/* Email Header */}
                <div className="p-6 border-b border-neutral-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        {emails[selectedEmail].subject}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-neutral-400">
                        <span>From: {emails[selectedEmail].from}</span>
                        <span>•</span>
                        <span>{emails[selectedEmail].time}</span>
                        {emails[selectedEmail].encrypted && (
                          <>
                            <span>•</span>
                            <span className="text-green-400 flex items-center">
                              <LockClosedIcon className="w-3 h-3 mr-1" />
                              Encrypted
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TauOSButton variant="ghost" size="sm">
                        <StarIcon className="w-4 h-4" />
                      </TauOSButton>
                      <TauOSButton variant="ghost" size="sm">
                        <PaperAirplaneIcon className="w-4 h-4" />
                      </TauOSButton>
                      <TauOSButton variant="ghost" size="sm">
                        <TrashIcon className="w-4 h-4" />
                      </TauOSButton>
                    </div>
                  </div>
                </div>

                {/* Email Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-neutral-300 leading-relaxed">
                      {emails[selectedEmail].preview}
                    </p>
                    <p className="text-neutral-300 leading-relaxed mt-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-neutral-300 leading-relaxed mt-4">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                </div>

                {/* Email Actions */}
                <div className="p-6 border-t border-neutral-700">
                  <div className="flex items-center space-x-3">
                    <TauOSButton variant="primary" size="sm">
                      <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                      Reply
                    </TauOSButton>
                    <TauOSButton variant="secondary" size="sm">
                      Forward
                    </TauOSButton>
                    <TauOSButton variant="ghost" size="sm">
                      Archive
                    </TauOSButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {composeOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <TauOSCard className="w-2/3 h-3/4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">New Message</h3>
              <button 
                onClick={() => setComposeOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">To:</label>
                <input 
                  type="email" 
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500"
                  placeholder="recipient@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Subject:</label>
                <input 
                  type="text" 
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500"
                  placeholder="Enter subject..."
                />
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-neutral-300 mb-1">Message:</label>
                <textarea 
                  className="w-full h-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 resize-none"
                  placeholder="Type your message here..."
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-neutral-700">
              <div className="flex items-center space-x-2">
                <TauOSButton variant="ghost" size="sm">
                  <PaperClipIcon className="w-4 h-4" />
                </TauOSButton>
                <TauOSButton variant="ghost" size="sm">
                  <LockClosedIcon className="w-4 h-4" />
                </TauOSButton>
              </div>
              
              <div className="flex items-center space-x-2">
                <TauOSButton variant="ghost" size="sm" onClick={() => setComposeOpen(false)}>
                  Cancel
                </TauOSButton>
                <TauOSButton variant="primary" size="sm">
                  <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                  Send
                </TauOSButton>
              </div>
            </div>
          </TauOSCard>
        </div>
      )}
    </div>
  )
}

export default TauMailScreen 