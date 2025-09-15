'use client';
// TauCloud Search - Advanced File Search - v1.0

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, File, Image, Video, Music, Archive, 
  FileText, FileImage, FileVideo, FileArchive, 
  FileCode, FileSpreadsheet, Folder,
  Download, Share2, Eye, MoreVertical, Calendar, Clock,
  X, RotateCcw, Grid, List, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

export default function TauCloudSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    folder: 'all',
    dateRange: 'all'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('tauos_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      window.location.href = '/taucloud';
    }
  }, []);

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('tauos_token');
      const params = new URLSearchParams({
        q: query,
        ...(filters.type !== 'all' && { type: filters.type }),
        ...(filters.folder !== 'all' && { folder_id: filters.folder })
      });

      const response = await fetch(`https://tauos-47am.vercel.app/api/search?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.files || []);
      } else {
        console.error('Search failed');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const clearFilters = () => {
    setFilters({ type: 'all', folder: 'all', dateRange: 'all' });
    if (searchQuery) {
      handleSearch();
    }
  };

  if (!user) {
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
              <Link href="/taucloud/dashboard" className="flex items-center space-x-2">
                <img src="/brand/tauos-logo.svg" alt="TauOS" className="w-10 h-10" />
                <div>
                  <h1 className="text-xl font-bold text-white">TauCloud</h1>
                  <p className="text-sm text-gray-400">Search Files</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filters:</span>
          </div>
          
          <select
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="application/pdf">PDFs</option>
            <option value="text">Documents</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400"
          >
            <option value="all">Any Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear</span>
          </button>

          <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1 ml-auto">
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

        {/* Search Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Searching...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-400"
              >
                <option value="relevance">Most Relevant</option>
                <option value="name">Name A-Z</option>
                <option value="date">Date Modified</option>
                <option value="size">File Size</option>
              </select>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4' : 'space-y-2'}>
              {searchResults.map((file) => {
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
                          {file.folder_name && (
                            <p className="text-xs text-blue-400 flex items-center">
                              <Folder className="w-3 h-3 mr-1" />
                              {file.folder_name}
                            </p>
                          )}
                        </div>
                        
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-1">
                            <button className="p-1 bg-gray-700 rounded hover:bg-gray-600">
                              <Eye className="w-3 h-3 text-white" />
                            </button>
                            <button className="p-1 bg-gray-700 rounded hover:bg-gray-600">
                              <Download className="w-3 h-3 text-white" />
                            </button>
                            <button className="p-1 bg-gray-700 rounded hover:bg-gray-600">
                              <Share2 className="w-3 h-3 text-white" />
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
                            {file.folder_name && ` • ${file.folder_name}`}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {file.is_public && (
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
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
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No results found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Search your files</h3>
            <p className="text-gray-500">
              Enter a search term above to find your files
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
