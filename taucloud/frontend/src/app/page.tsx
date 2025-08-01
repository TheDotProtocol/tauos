'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useFiles } from '@/hooks/useFiles'
import { useFolders } from '@/hooks/useFolders'
import { FileUpload } from '@/components/FileUpload'
import { FileList } from '@/components/FileList'
import { FolderTree } from '@/components/FolderTree'
import { StorageUsage } from '@/components/StorageUsage'
import { SearchBar } from '@/components/SearchBar'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { EmptyState } from '@/components/EmptyState'
import { 
  CloudIcon, 
  FolderIcon, 
  DocumentIcon, 
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { 
    files, 
    isLoading: filesLoading, 
    error: filesError,
    refetch: refetchFiles 
  } = useFiles(selectedFolder, searchQuery, sortBy, sortOrder)

  const { 
    folders, 
    isLoading: foldersLoading,
    error: foldersError 
  } = useFolders()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      refetchFiles()
    }
  }, [isAuthenticated, isLoading, selectedFolder, searchQuery, sortBy, sortOrder])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CloudIcon className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome to TauCloud
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Privacy-first cloud storage with zero telemetry
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <button
              onClick={() => window.location.href = '/login'}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
            <button
              onClick={() => window.location.href = '/register'}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return PhotoIcon
    if (mimeType.startsWith('video/')) return VideoCameraIcon
    if (mimeType.startsWith('audio/')) return MusicalNoteIcon
    if (mimeType.includes('pdf')) return DocumentTextIcon
    if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('rar')) return ArchiveBoxIcon
    if (mimeType.startsWith('text/') || mimeType.includes('document')) return DocumentTextIcon
    return DocumentIcon
  }

  const totalFiles = files?.length || 0
  const totalSize = files?.reduce((acc, file) => acc + file.size, 0) || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <div className="flex">
        <Sidebar 
          folders={folders}
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
          isLoading={foldersLoading}
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Storage Usage */}
            <div className="mb-6">
              <StorageUsage 
                used={user?.storageUsed || 0}
                total={user?.storageLimit || 0}
              />
            </div>

            {/* Search and Actions */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search files..."
              />
              
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="date">Date</option>
                  <option value="size">Size</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
                
                <div className="flex border border-gray-300 rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 text-sm ${
                      viewMode === 'grid' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 text-sm ${
                      viewMode === 'list' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <FileUpload 
                onUploadSuccess={refetchFiles}
                currentFolder={selectedFolder}
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow">
              {filesLoading ? (
                <div className="p-8 text-center">
                  <LoadingSpinner />
                  <p className="mt-2 text-gray-500">Loading files...</p>
                </div>
              ) : filesError ? (
                <div className="p-8 text-center">
                  <p className="text-red-500">Error loading files: {filesError.message}</p>
                  <button
                    onClick={refetchFiles}
                    className="mt-2 text-blue-600 hover:text-blue-700"
                  >
                    Try again
                  </button>
                </div>
              ) : files && files.length > 0 ? (
                <FileList
                  files={files}
                  viewMode={viewMode}
                  getFileIcon={getFileIcon}
                  onFileSelect={(file) => {
                    // Handle file selection
                    console.log('Selected file:', file)
                  }}
                  onFileDelete={refetchFiles}
                />
              ) : (
                <EmptyState
                  icon={FolderIcon}
                  title="No files found"
                  description={
                    searchQuery 
                      ? `No files match "${searchQuery}"`
                      : selectedFolder 
                        ? "This folder is empty"
                        : "Upload your first file to get started"
                  }
                  action={
                    <FileUpload 
                      onUploadSuccess={refetchFiles}
                      currentFolder={selectedFolder}
                      variant="button"
                    />
                  }
                />
              )}
            </div>

            {/* Stats */}
            {files && files.length > 0 && (
              <div className="mt-6 text-sm text-gray-500 text-center">
                {totalFiles} file{totalFiles !== 1 ? 's' : ''} • {formatBytes(totalSize)}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
} 