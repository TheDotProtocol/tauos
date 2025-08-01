'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud,
  Shield,
  Upload,
  Download,
  Share,
  Trash,
  Settings,
  User,
  Folder,
  File,
  Image,
  Music,
  Video,
  Archive,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Search,
  Grid,
  List
} from 'lucide-react';

// Updated TauCloud page with improved UI design - Force deployment
export default function TauCloudPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const files = [
    {
      id: 1,
      name: 'TauOS Documentation.pdf',
      type: 'pdf',
      size: '2.3 MB',
      modified: '2 hours ago',
      isEncrypted: true
    },
    {
      id: 2,
      name: 'Project Screenshots',
      type: 'folder',
      size: '15 items',
      modified: '1 day ago',
      isEncrypted: true
    },
    {
      id: 3,
      name: 'vacation-photos.jpg',
      type: 'image',
      size: '4.1 MB',
      modified: '3 days ago',
      isEncrypted: true
    },
    {
      id: 4,
      name: 'presentation.pptx',
      type: 'document',
      size: '8.7 MB',
      modified: '1 week ago',
      isEncrypted: true
    },
    {
      id: 5,
      name: 'Music Collection',
      type: 'folder',
      size: '127 items',
      modified: '2 weeks ago',
      isEncrypted: true
    },
    {
      id: 6,
      name: 'backup-2025.zip',
      type: 'archive',
      size: '156 MB',
      modified: '1 month ago',
      isEncrypted: true
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <Folder className="w-8 h-8 text-blue-500" />;
      case 'image':
        return <Image className="w-8 h-8 text-green-500" />;
      case 'music':
        return <Music className="w-8 h-8 text-purple-500" />;
      case 'video':
        return <Video className="w-8 h-8 text-red-500" />;
      case 'archive':
        return <Archive className="w-8 h-8 text-orange-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">TauCloud</span>
              </div>
              <div className="hidden md:flex items-center space-x-6 ml-8">
                <a href="#" className="text-blue-600 font-medium">Files</a>
                <a href="#" className="text-gray-500 hover:text-gray-700">Photos</a>
                <a href="#" className="text-gray-500 hover:text-gray-700">Music</a>
                <a href="#" className="text-gray-500 hover:text-gray-700">Backups</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowUpload(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Folder</span>
                </button>
              </div>
              <div className="text-sm text-gray-500">
                2.1 GB of 5 GB used
              </div>
            </div>

            {/* Files Grid/List */}
            <div className="bg-white rounded-lg shadow-sm border">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 rounded-lg border-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedFile === file.name ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedFile(file.name)}
                    >
                      <div className="text-center">
                        <div className="flex justify-center mb-3">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex items-center justify-center mb-2">
                          <span className="text-sm font-medium text-gray-900 truncate max-w-full">
                            {file.name}
                          </span>
                          {file.isEncrypted && (
                            <Shield className="w-4 h-4 text-green-500 ml-1" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{file.size}</p>
                        <p className="text-xs text-gray-400">{file.modified}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        selectedFile === file.name ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedFile(file.name)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 flex-1">
                          {getFileIcon(file.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{file.name}</span>
                              {file.isEncrypted && (
                                <Shield className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{file.modified}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Storage Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Storage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Used</span>
                    <span className="text-gray-900">2.1 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">5 GB total</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Documents</span>
                    <span className="text-gray-900">1.2 GB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Photos</span>
                    <span className="text-gray-900">800 MB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Music</span>
                    <span className="text-gray-900">100 MB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Privacy Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Zero-Knowledge</span>
                  <div className="flex items-center space-x-2">
                    <EyeOff className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Client-Side Encryption</span>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Enabled</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">No Data Mining</span>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Protected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                  <Upload className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">Upload Files</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                  <Share className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Share Folder</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                  <Download className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">Download All</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                  <Trash className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium">Empty Trash</span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">TauCloud Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Client-side encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <EyeOff className="w-4 h-4 text-green-500" />
                  <span>Zero-knowledge privacy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>No data mining</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-green-500" />
                  <span>Self-host option</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Upload Files</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop files here</p>
                <p className="text-sm text-gray-500">or</p>
                <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Browse Files
                </button>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Files will be encrypted automatically</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 