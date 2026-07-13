'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppShell from '@/components/apps/AppShell';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Download, Share2, Lock, Clock, File,
  FileImage, FileVideo, Music, FileText,
  FileSpreadsheet, FileArchive, FileCode, AlertCircle,
  CheckCircle, Copy, ExternalLink
} from 'lucide-react';

export default function SharedFileViewer({ params }) {
  const [file, setFile] = useState(null);
  const [share, setShare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

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
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Shared file not found');
      }
    } catch {
      setError('Failed to load shared file');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`/api/taucloud/shared/${params.token}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok && data.url) {
        window.open(data.url, '_blank');
        await loadSharedFile();
      } else {
        alert(data.error || 'Download failed');
      }
    } catch {
      alert('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const getFileIcon = (mimeType) => {
    if (!mimeType) return File;
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
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
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

  const FileIcon = getFileIcon(file.mime_type);

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
          <div className="flex items-start space-x-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <FileIcon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{file.original_name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-400">
                <div className="flex items-center space-x-2">
                  <File className="w-4 h-4" />
                  <span>{formatFileSize(file.file_size)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(file.uploaded_at)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Download className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-white">Downloads</span>
              </div>
              <p className="text-2xl font-bold text-white">{share.download_count ?? 0}</p>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold text-white">Expires</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {share.expires_at ? formatDate(share.expires_at) : 'Never'}
              </p>
            </div>
          </div>

          {share.password_required && (
            <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-800 rounded-xl flex items-center gap-3">
              <Lock className="w-5 h-5 text-yellow-400" />
              <p className="text-yellow-200 text-sm">This share is password protected (coming soon).</p>
            </div>
          )}

          <Button className="w-full sm:w-auto" onClick={handleDownload} disabled={downloading}>
            <Download className="w-5 h-5 mr-2" />
            {downloading ? 'Preparing...' : 'Download File'}
          </Button>

          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800 rounded-xl">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-300 mb-1">Secure File Sharing</h3>
                <p className="text-blue-200 text-sm">
                  This file is shared securely through Tau Cloud. Download links expire and access is controlled by the owner.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
