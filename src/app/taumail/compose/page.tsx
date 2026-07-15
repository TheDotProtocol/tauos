'use client';

import DashboardShell from '@/components/apps/DashboardShell';
import TauMailSubNav from '@/components/apps/TauMailSubNav';
import React, { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Inbox, Send, Archive, Trash2, Star, Search, Plus, 
  Filter, Download, Reply, Forward, MoreVertical, Users, 
  Shield, Lock, Eye, CheckCircle, AlertCircle, BarChart3, 
  Activity, Settings, Calendar, Clock, LogOut, User, X,
  RefreshCw, ChevronLeft, Paperclip, Bold, Italic, Link as LinkIcon,
  AlignLeft, AlignCenter, AlignRight, List
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TauMailDemoBanner from '@/components/apps/TauMailDemoBanner';
import { useTauMailSession } from '@/hooks/useTauMailSession';
import { isDemoSession } from '@/lib/taumail-demo';
import {
  TAUMAIL_MAX_ATTACHMENT_BYTES,
  TAUMAIL_MAX_FILES,
  formatAttachmentSize,
  validateFilesForCompose,
} from '@/lib/taumail-attachments';

type ComposeAttachment = {
  id: string;
  file: File;
  previewUrl?: string;
};

export default function TauMailCompose() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-gray-400">Loading compose…</div>}>
      <TauMailComposeInner />
    </Suspense>
  );
}

function TauMailComposeInner() {
  const searchParams = useSearchParams();
  const { user, isLoggedIn, isDemo, logout } = useTauMailSession();
  const [composeData, setComposeData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    text: ''
  });
  const [loading, setLoading] = useState(false);
  const [showCC, setShowCC] = useState(false);
  const [showBCC, setShowBCC] = useState(false);
  const [attachments, setAttachments] = useState<ComposeAttachment[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [attachError, setAttachError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const attachmentTotalBytes = attachments.reduce((sum, a) => sum + a.file.size, 0);

  const addFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files);
    if (attachments.length + list.length > TAUMAIL_MAX_FILES) {
      setAttachError(`Maximum ${TAUMAIL_MAX_FILES} attachments per email`);
      return;
    }

    const check = validateFilesForCompose(list, attachmentTotalBytes);
    if (check.ok === false) {
      setAttachError(check.error);
      return;
    }

    setAttachError('');
    const next: ComposeAttachment[] = list.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));
    setAttachments((prev) => [...prev, ...next]);
  }, [attachments.length, attachmentTotalBytes]);

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const item = prev.find((a) => a.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((a) => a.id !== id);
    });
    setAttachError('');
  };

  useEffect(() => {
    const to = searchParams.get('to');
    const cc = searchParams.get('cc');
    const subject = searchParams.get('subject');
    const body = searchParams.get('body');
    if (to || cc || subject || body) {
      setComposeData((prev) => ({
        ...prev,
        to: to ?? prev.to,
        cc: cc ?? prev.cc,
        subject: subject ?? prev.subject,
        text: body ?? prev.text,
      }));
      if (cc) setShowCC(true);
    }
  }, [searchParams]);

  const handleComposeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('tauos_token');

      if (isDemoSession(token)) {
        alert('✅ Preview mode — message saved locally (not sent).\n\nOpen Sent or Inbox to continue exploring the UI.');
        setComposeData({ to: '', cc: '', bcc: '', subject: '', text: '' });
        setLoading(false);
        return;
      }

      const attachmentRefs = [];
      for (const a of attachments) {
        const prepRes = await fetch('/api/taumail/emails/attachments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            filename: a.file.name,
            contentType: a.file.type || 'application/octet-stream',
            size: a.file.size,
          }),
        });
        const prep = await prepRes.json();
        if (!prepRes.ok) {
          throw new Error(prep.error || prep.details || 'Failed to prepare attachment upload');
        }

        const uploadRes = await fetch(prep.uploadUrl, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${prep.token}`,
            'Content-Type': a.file.type || 'application/octet-stream',
            'x-upsert': 'true',
          },
          body: a.file,
        });
        if (!uploadRes.ok) {
          throw new Error(`Failed to upload ${a.file.name}`);
        }

        attachmentRefs.push({
          attachmentId: prep.attachmentId,
          path: prep.path,
          filename: a.file.name,
          contentType: a.file.type || 'application/octet-stream',
          size: a.file.size,
        });
      }

      const response = await fetch('/api/taumail/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          to: composeData.to,
          cc: composeData.cc || undefined,
          bcc: composeData.bcc || undefined,
          subject: composeData.subject,
          body: composeData.text,
          attachments: attachmentRefs.length ? attachmentRefs : undefined,
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        const hint = result.deliverabilityHint ? `\n\nNote: ${result.deliverabilityHint}` : '';
        alert(`✅ Email sent successfully!\n\nFrom: ${result.fromName} <${result.from}>\nTo: ${composeData.to}${result.attachmentCount ? `\nAttachments: ${result.attachmentCount}` : ''}\nMessage ID: ${result.messageId}${hint}`);
        setComposeData({ to: '', cc: '', bcc: '', subject: '', text: '' });
        attachments.forEach((a) => { if (a.previewUrl) URL.revokeObjectURL(a.previewUrl); });
        setAttachments([]);
        // Redirect to sent items
        window.location.href = '/taumail/sent';
      } else {
        const detail = result.details ? `\n\nDetails: ${result.details}` : '';
        alert(`❌ Failed to send email:\n${result.error || 'Unknown error'}${detail}`);
      }
    } catch (error) {
      alert(`❌ Error sending email:\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => logout();

  

  return (
    <DashboardShell
      title="Tau Mail"
      subtitle="Compose message"
      userLabel={user?.email}
      onLogout={handleLogout}
      loading={!isLoggedIn}
      
    >
      <TauMailSubNav />
      {isDemo && <TauMailDemoBanner />}
      {/* Compose Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Compose Email</h1>
              <p className="text-gray-400">Send a secure, encrypted email</p>
            </div>
          </div>
        </div>

        {/* Compose Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
        >
          <form onSubmit={handleComposeEmail} className="space-y-6">
            {/* To Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                To <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={composeData.to}
                onChange={(e) => setComposeData({...composeData, to: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                placeholder="recipient@example.com"
                required
              />
            </div>

            {/* CC Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  CC
                </label>
                <button
                  type="button"
                  onClick={() => setShowCC(!showCC)}
                  className="text-yellow-400 hover:text-yellow-300 text-sm"
                >
                  {showCC ? 'Hide CC' : 'Add CC'}
                </button>
              </div>
              {showCC && (
                <input
                  type="email"
                  value={composeData.cc}
                  onChange={(e) => setComposeData({...composeData, cc: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="cc@example.com"
                />
              )}
            </div>

            {/* BCC Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  BCC
                </label>
                <button
                  type="button"
                  onClick={() => setShowBCC(!showBCC)}
                  className="text-yellow-400 hover:text-yellow-300 text-sm"
                >
                  {showBCC ? 'Hide BCC' : 'Add BCC'}
                </button>
              </div>
              {showBCC && (
                <input
                  type="email"
                  value={composeData.bcc}
                  onChange={(e) => setComposeData({...composeData, bcc: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="bcc@example.com"
                />
              )}
            </div>

            {/* Subject Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={composeData.subject}
                onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                placeholder="Email subject"
                required
              />
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message <span className="text-red-400">*</span>
              </label>
              <div
                className={`border rounded-lg overflow-hidden transition-colors ${
                  dragOver ? 'border-yellow-400 ring-1 ring-yellow-400/50' : 'border-gray-700'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  if (e.currentTarget === e.target) setDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
                }}
              >
                {/* Formatting Toolbar */}
                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center space-x-2">
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Bold className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Italic className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-600 mx-2"></div>
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <AlignRight className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-600 mx-2"></div>
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <List className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                <textarea
                  value={composeData.text}
                  onChange={(e) => setComposeData({...composeData, text: e.target.value})}
                  rows={12}
                  className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none resize-none"
                  placeholder="Type your message here… Drag and drop files or images to attach (max 15 MB total)."
                  required
                />

                {dragOver && (
                  <div className="px-4 py-3 bg-yellow-400/10 border-t border-yellow-400/30 text-yellow-300 text-sm text-center">
                    Drop files to attach
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) addFiles(e.target.files);
                  e.target.value = '';
                }}
              />

              {attachError && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {attachError}
                </p>
              )}

              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{attachments.length} attachment{attachments.length !== 1 ? 's' : ''}</span>
                    <span>
                      {formatAttachmentSize(attachmentTotalBytes)} / {formatAttachmentSize(TAUMAIL_MAX_ATTACHMENT_BYTES)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 max-w-full"
                      >
                        {a.previewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.previewUrl} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                        ) : (
                          <Paperclip className="w-4 h-4 shrink-0 text-yellow-400" />
                        )}
                        <span className="truncate max-w-[160px]" title={a.file.name}>{a.file.name}</span>
                        <span className="text-gray-500 text-xs shrink-0">{formatAttachmentSize(a.file.size)}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(a.id)}
                          className="p-0.5 text-gray-400 hover:text-red-400 shrink-0"
                          aria-label={`Remove ${a.file.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                  <span>Attach</span>
                  {attachments.length > 0 && (
                    <span className="text-xs bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded">
                      {attachments.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Encrypt</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link
                  href="/taumail/dashboard"
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold py-2 px-6 rounded-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 p-4 bg-green-900/20 border border-green-800 rounded-lg"
        >
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-green-400 mb-1">End-to-End Encryption</h3>
              <p className="text-sm text-gray-300">
                Your email is encrypted before transmission and can only be decrypted by the intended recipient. 
                Even we cannot read your messages.
              </p>
            </div>
          </div>
        </motion.div>
    </DashboardShell>
  );
}
