'use client';
// TauCloud Dashboard - Ultimate File Storage System - v1.0

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, Upload, Download, Share2, Folder, File, Image, Video, 
  Music, Archive, Search, Filter, MoreVertical, Star, Trash2, 
  Eye, Lock, Unlock, Users, Settings, LogOut, User, Plus,
  Grid, List, RefreshCw, CheckCircle, AlertCircle, BarChart3,
  Activity, Calendar, Clock, Shield, Zap, Globe, Smartphone,
  FolderPlus, FileText, FileImage, FileVideo, 
  FileArchive, FileCode, FileSpreadsheet,
  Copy, Edit, Move, RotateCcw, EyeOff, Mail, Send,
  HardDrive, Wifi, WifiOff, AlertTriangle, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function TauCloudDashboard() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('name'); // name, size, date, type
  const [sortOrder, setSortOrder] = useState('asc'); // asc or desc
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [storageInfo, setStorageInfo] = useState({
    used: 0,
    limit: 100 * 1024 * 1024 * 1024, // 100GB default
    usedPercent: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState('synced'); // syncing, synced, error
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Check if user is logged in and load data
  useEffect(() => {
    const storedUser = localStorage.getItem('tauos_user');
    const storedToken = localStorage.getItem('tauos_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      loadFiles();
      loadStorageInfo();
      loadRecentActivity();
    } else {
      window.location.href = '/taucloud';
    }
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadFiles = async () => {
    try {
      const token = localStorage.getItem('tauos_token');
      const response = await fetch('/api/taucloud/files/list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      } else {
        // Demo data for development
        setFiles([
          {
            id: 1,
            original_name: 'Project Presentation.pdf',
            filename: 'project-presentation.pdf',
            file_size: 2048576,
            mime_type: 'application/pdf',
            created_at: new Date().toISOString(),
            is_public: false,
            download_count: 0
          },
          {
            id: 2,
            original_name: 'Team Photo.jpg',
            filename: 'team-photo.jpg',
            file_size: 1024000,
            mime_type: 'image/jpeg',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            is_public: true,
            download_count: 5
          },
          {
            id: 3,
            original_name: 'Meeting Recording.mp4',
            filename: 'meeting-recording.mp4',
            file_size: 52428800,
            mime_type: 'video/mp4',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            is_public: false,
            download_count: 2
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const loadStorageInfo = async () => {
    try {
      const token = localStorage.getItem('tauos_token');
      const response = await fetch('/api/taucloud/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStorageInfo({
          used: data.storage.used,
          limit: data.storage.limit,
          usedPercent: data.storage.usedPercent
        });
      }
    } catch (error) {
      console.error('Error loading storage info:', error);
    }
  };

  const loadRecentActivity = () => {
    // Demo recent activity
    setRecentActivity([
      { id: 1, action: 'uploaded', file: 'Project Presentation.pdf', time: '2 minutes ago', user: 'You' },
      { id: 2, action: 'shared', file: 'Team Photo.jpg', time: '1 hour ago', user: 'You' },
      { id: 3, action: 'downloaded', file: 'Meeting Recording.mp4', time: '3 hours ago', user: 'John Doe' },
      { id: 4, action: 'created', file: 'New Folder', time: '1 day ago', user: 'You' }
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('tauos_user');
    localStorage.removeItem('tauos_token');
    window.location.href = '/taucloud';
  };

  const handleFileUpload = async (files) => {
    setLoading(true);
    setSyncStatus('syncing');
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const token = localStorage.getItem('tauos_token');
        const response = await fetch('/api/taucloud/files/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        
        if (response.ok) {
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
          await loadFiles();
          await loadStorageInfo();
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    
    setLoading(false);
    setSyncStatus('synced');
    setShowUploadModal(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredFiles = files.filter(file => 
    file.original_name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    let aVal, bVal;
    switch (sortBy) {
      case 'name':
        aVal = a.original_name.toLowerCase();
        bVal = b.original_name.toLowerCase();
        break;
      case 'size':
        aVal = a.file_size;
        bVal = b.file_size;
        break;
      case 'date':
        aVal = new Date(a.created_at);
        bVal = new Date(b.created_at);
        break;
      case 'type':
        aVal = a.mime_type;
        bVal = b.mime_type;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/brand/tauos-logo.svg" alt="TauOS" className="w-10 h-10" />
                <div>
                  <h1 className="text-xl font-bold text-white">TauCloud</h1>
                  <p className="text-sm text-gray-400">Ultimate File Storage</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Sync Status */}
              <div className="flex items-center space-x-2">
                {syncStatus === 'syncing' ? (
                  <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />
                ) : syncStatus === 'synced' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-sm text-gray-300">
                  {syncStatus === 'syncing' ? 'Syncing...' : 
                   syncStatus === 'synced' ? 'Synced' : 'Sync Error'}
                </span>
              </div>

              {/* Online Status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-400" />
                )}
                <span className="text-sm text-gray-300">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Storage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Storage Used</p>
                <p className="text-2xl font-bold text-white">
                  {formatFileSize(storageInfo.used)}
                </p>
                <p className="text-sm text-gray-400">
                  {storageInfo.usedPercent.toFixed(1)}% of {formatFileSize(storageInfo.limit)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(storageInfo.usedPercent, 100)}%` }}
              ></div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Files</p>
                <p className="text-2xl font-bold text-white">{files.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <File className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>All synced</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Shared Files</p>
                <p className="text-2xl font-bold text-white">
                  {files.filter(f => f.is_public).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-400">
              <Globe className="w-4 h-4 mr-1" />
              <span>Public access</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Downloads</p>
                <p className="text-2xl font-bold text-white">
                  {files.reduce((sum, f) => sum + f.download_count, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-400">
              <Activity className="w-4 h-4 mr-1" />
              <span>This month</span>
            </div>
          </motion.div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Files</span>
            </button>
            
            <button
              onClick={() => setShowCreateFolderModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FolderPlus className="w-5 h-5" />
              <span>New Folder</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 w-64"
              />
            </div>
            
            <Link 
              href="/taucloud/search"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Advanced Search</span>
            </Link>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400/50"
            >
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="date">Date</option>
              <option value="type">Type</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>

            <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* File Grid/List */}
        <div 
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`min-h-96 rounded-2xl border-2 border-dashed transition-all duration-200 ${
            dragOver 
              ? 'border-yellow-400 bg-yellow-400/10' 
              : 'border-gray-700 bg-gray-900/30'
          }`}
        >
          {dragOver && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Upload className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <p className="text-xl font-semibold text-white">Drop files here to upload</p>
                <p className="text-gray-400">Release to start uploading</p>
              </div>
            </div>
          )}

          {!dragOver && (
            <div className="p-6">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-12">
                  <Cloud className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No files yet</h3>
                  <p className="text-gray-500 mb-6">Upload your first files to get started</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
                  >
                    Upload Files
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4' : 'space-y-2'}>
                  {filteredFiles.map((file) => {
                    const FileIcon = getFileIcon(file.mime_type);
                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`group relative ${
                          viewMode === 'grid' 
                            ? 'p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 cursor-pointer' 
                            : 'flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 cursor-pointer'
                        }`}
                      >
                        {viewMode === 'grid' ? (
                          <>
                            <div className="flex flex-col items-center text-center">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3">
                                <FileIcon className="w-6 h-6 text-white" />
                              </div>
                              <h4 className="text-sm font-medium text-white truncate w-full mb-1">
                                {file.original_name}
                              </h4>
                              <p className="text-xs text-gray-400">
                                {formatFileSize(file.file_size)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(file.created_at)}
                              </p>
                            </div>
                            
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex space-x-1">
                                <button className="p-1 bg-gray-700 rounded hover:bg-gray-600">
                                  <Eye className="w-3 h-3 text-white" />
                                </button>
                                <button className="p-1 bg-gray-700 rounded hover:bg-gray-600">
                                  <Share2 className="w-3 h-3 text-white" />
                                </button>
                                <button className="p-1 bg-gray-700 rounded hover:bg-gray-600">
                                  <MoreVertical className="w-3 h-3 text-white" />
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                              <FileIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-white truncate">
                                {file.original_name}
                              </h4>
                              <p className="text-xs text-gray-400">
                                {formatFileSize(file.file_size)} • {formatDate(file.created_at)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {file.is_public && (
                                <Globe className="w-4 h-4 text-green-400" />
                              )}
                              <button className="p-1 text-gray-400 hover:text-white">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Activity Sidebar */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors text-center group"
                >
                  <Upload className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 mx-auto mb-2" />
                  <p className="text-sm text-white">Upload</p>
                </button>
                <button className="p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors text-center group">
                  <Share2 className="w-6 h-6 text-blue-400 group-hover:text-blue-300 mx-auto mb-2" />
                  <p className="text-sm text-white">Share</p>
                </button>
                <button 
                  onClick={() => setShowCreateFolderModal(true)}
                  className="p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors text-center group"
                >
                  <FolderPlus className="w-6 h-6 text-green-400 group-hover:text-green-300 mx-auto mb-2" />
                  <p className="text-sm text-white">Folder</p>
                </button>
                <Link href="/taucloud/settings" className="p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors text-center group">
                  <Settings className="w-6 h-6 text-gray-400 group-hover:text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-white">Settings</p>
                </Link>
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">
                        <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-medium">{activity.file}</span>
                      </p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Upload Files</h2>
              <p className="text-gray-400">Select files to upload to TauCloud</p>
            </div>

            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-yellow-400 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-white font-semibold mb-2">Click to select files</p>
                <p className="text-gray-400 text-sm">or drag and drop files here</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                className="hidden"
              />

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Create Folder</h2>
              <p className="text-gray-400">Enter a name for your new folder</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Folder name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateFolderModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}