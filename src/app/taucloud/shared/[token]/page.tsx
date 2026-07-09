'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppShell from '@/components/apps/AppShell';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Download, Share2, Eye, Lock, Clock, User, File, 
  FileImage, FileVideo, Music, FileText,
  FileSpreadsheet, FileArchive, FileCode, AlertCircle,
  CheckCircle, X, Copy, ExternalLink
} from 'lucide-react';

export default function SharedFileViewer({ params }) {
  const [file, setFile] = useState(null);
  const [share, setShare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    loadSharedFile();
  }, [params.token]);

  const loadSharedFile = async () => {
    try {
      const response = await fetch(`/api/taucloud/shared/${params.token}`);
      
      if (response.ok) {
        const data = await response.json();
        setFile(data.file);
        setShare(data.share);
        
        // Check if password is required
        if (data.share.password_hash) {
          setPasswordRequired(true);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Shared file not found');
      }
    } catch (error) {
      setError('Failed to load shared file');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    try {
      const response = await fetch(`/api/taucloud/shared/${params.token}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (response.ok) {
        setPasswordRequired(false);
      } else {
        setPasswordError('Incorrect password');
      }
    } catch (error) {
      setPasswordError('Failed to verify password');
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) return FileImage;
    if (mimeType.startsWith('video/')) return FileVideo;
    if (mimeType.startsWith('audio/')) return Music;
    if (mimeType.includes('pdf')) return File;
    if (mimeType.includes('word')) return FileText;
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return FileSpreadsheet;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return FileArchive;
    if (mimeType.includes('text/') || mimeType.includes('code')) return FileCode;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <AppShell title="Tau Cloud" subtitle="Shared file">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4" />
            <p className="text-gray-400">Loading shared file...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Tau Cloud" subtitle="Shared file">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">File Not Available</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button asChild>
              <Link href="/taucloud">Go to Tau Cloud</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (passwordRequired) {
    return (
      <AppShell title="Tau Cloud" subtitle="Password protected share">
        <div className="flex min-h-[50vh] items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-gray-900/30 border border-gray-800 rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <Lock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Password Required</h1>
              <p className="text-gray-400">This shared file is password protected</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="Enter file password"
                  required
                />
                {passwordError && (
                  <p className="text-red-400 text-sm mt-2">{passwordError}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Access File
              </Button>
            </form>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  const FileIcon = getFileIcon(file.mimeType);

  return (
    <AppShell title="Tau Cloud" subtitle="Shared file">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
          <Button variant="outline" onClick={copyShareLink}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button asChild>
            <Link href="/taucloud">
              <ExternalLink className="w-4 h-4 mr-2" />
              Go to Tau Cloud
            </Link>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
        >
          {/* File Info */}
          <div className="flex items-start space-x-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <FileIcon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{file.originalName}</h1>
              <div className="flex items-center space-x-6 text-gray-400">
                <div className="flex items-center space-x-2">
                  <File className="w-4 h-4" />
                  <span>{formatFileSize(file.fileSize)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Shared by {file.sharedBy}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(file.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Share Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-white">Downloads</span>
              </div>
              <p className="text-2xl font-bold text-white">{share.downloadCount}</p>
            </div>
            
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Share2 className="w-5 h-5 text-green-400" />
                <span className="font-semibold text-white">Permission</span>
              </div>
              <p className="text-lg font-semibold text-white capitalize">{share.permission}</p>
            </div>
            
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold text-white">Expires</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {share.expiresAt ? formatDate(share.expiresAt) : 'Never'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1">
              <Download className="w-5 h-5 mr-2" />
              Download File
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="w-5 h-5 mr-2" />
              Share Again
            </Button>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800 rounded-xl">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-300 mb-1">Secure File Sharing</h3>
                <p className="text-blue-200 text-sm">
                  This file is shared securely through TauCloud. The file is encrypted and 
                  access is controlled by the owner. Download responsibly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
