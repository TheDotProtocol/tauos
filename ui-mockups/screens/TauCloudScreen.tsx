import React, { useState } from 'react'
import { 
  CloudIcon,
  FolderIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UploadIcon,
  ShareIcon,
  TrashIcon,
  StarIcon,
  EyeIcon,
  LockClosedIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  GridIcon,
  ListIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  CalendarIcon,
  ClockIcon,
  DocumentIcon,
  FolderPlusIcon
} from '@heroicons/react/24/outline'
import { TauOSCard, TauOSButton, TauOSIcon } from '../components/TauOSTheme'

const TauCloudScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  const files = [
    {
      id: '1',
      name: 'TauOS Documentation.pdf',
      type: 'pdf',
      size: '2.4 MB',
      modified: '2 hours ago',
      starred: true,
      encrypted: true,
      icon: DocumentTextIcon
    },
    {
      id: '2',
      name: 'Screenshot 2024-01-15.png',
      type: 'image',
      size: '1.8 MB',
      modified: '1 day ago',
      starred: false,
      encrypted: true,
      icon: PhotoIcon
    },
    {
      id: '3',
      name: 'Project Presentation.mp4',
      type: 'video',
      size: '45.2 MB',
      modified: '3 days ago',
      starred: true,
      encrypted: false,
      icon: VideoCameraIcon
    },
    {
      id: '4',
      name: 'Backup Archive.zip',
      type: 'archive',
      size: '128.7 MB',
      modified: '1 week ago',
      starred: false,
      encrypted: true,
      icon: ArchiveBoxIcon
    },
    {
      id: '5',
      name: 'Meeting Notes.txt',
      type: 'document',
      size: '12 KB',
      modified: '2 weeks ago',
      starred: false,
      encrypted: false,
      icon: DocumentTextIcon
    },
    {
      id: '6',
      name: 'Music Collection',
      type: 'folder',
      size: '2.1 GB',
      modified: '1 month ago',
      starred: true,
      encrypted: false,
      icon: FolderIcon
    }
  ]

  const folders = [
    { name: 'Documents', count: 12 },
    { name: 'Photos', count: 45 },
    { name: 'Videos', count: 8 },
    { name: 'Music', count: 156 },
    { name: 'Backups', count: 3 }
  ]

  const handleUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return DocumentTextIcon
      case 'image': return PhotoIcon
      case 'video': return VideoCameraIcon
      case 'archive': return ArchiveBoxIcon
      case 'document': return DocumentTextIcon
      case 'folder': return FolderIcon
      default: return DocumentTextIcon
    }
  }

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'text-red-400'
      case 'image': return 'text-green-400'
      case 'video': return 'text-purple-400'
      case 'archive': return 'text-yellow-400'
      case 'document': return 'text-blue-400'
      case 'folder': return 'text-cyan-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="w-full h-screen bg-neutral-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-800 border-r border-neutral-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CloudIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">TauCloud</h1>
              <p className="text-neutral-400 text-xs">Privacy-First Storage</p>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <div className="p-4">
          <TauOSButton 
            variant="primary" 
            size="lg" 
            className="w-full"
            onClick={handleUpload}
            disabled={isUploading}
          >
            <UploadIcon className="w-5 h-5 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </TauOSButton>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="px-4 mb-4">
            <div className="bg-neutral-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-neutral-400 mt-1">{uploadProgress}% complete</p>
          </div>
        )}

        {/* Storage Usage */}
        <div className="px-4 mb-4">
          <TauOSCard className="p-4">
            <div className="mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">Storage Used</span>
                <span className="text-white">2.1 GB / 10 GB</span>
              </div>
              <div className="bg-neutral-700 rounded-full h-2 mt-2">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full" style={{ width: '21%' }}></div>
              </div>
            </div>
            <p className="text-xs text-neutral-400">21% of storage used</p>
          </TauOSCard>
        </div>

        {/* Folders */}
        <div className="flex-1 px-4">
          <h3 className="text-sm font-medium text-neutral-300 mb-3">Folders</h3>
          <nav className="space-y-1">
            {folders.map((folder) => (
              <button
                key={folder.name}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <FolderIcon className="w-4 h-4 text-cyan-400" />
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
              <p className="text-neutral-400 text-xs">2.1 GB used</p>
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
                placeholder="Search files..."
                className="bg-transparent text-neutral-300 placeholder-neutral-500 outline-none text-sm w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <TauOSButton variant="ghost" size="sm">
              <SortAscendingIcon className="w-4 h-4" />
            </TauOSButton>
            <TauOSButton 
              variant="ghost" 
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <ListIcon className="w-4 h-4" /> : <GridIcon className="w-4 h-4" />}
            </TauOSButton>
            <TauOSButton variant="ghost" size="sm">
              <Cog6ToothIcon className="w-4 h-4" />
            </TauOSButton>
          </div>
        </div>

        {/* File Explorer */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">My Files</h2>
              <div className="flex items-center space-x-2">
                <TauOSButton variant="ghost" size="sm">
                  <FolderPlusIcon className="w-4 h-4 mr-2" />
                  New Folder
                </TauOSButton>
                <TauOSButton variant="ghost" size="sm">
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Upload
                </TauOSButton>
              </div>
            </div>
          </div>

          {/* Files Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'space-y-2'}>
            {files.map((file) => (
              <div
                key={file.id}
                className={`${
                  viewMode === 'grid' 
                    ? 'p-4 rounded-lg border border-neutral-700 hover:border-primary-500/50 cursor-pointer transition-all duration-200' 
                    : 'flex items-center p-3 rounded-lg hover:bg-neutral-800 cursor-pointer transition-all duration-200'
                } ${
                  selectedFile === file.id ? 'bg-primary-500/20 border-primary-500/50' : 'bg-neutral-800'
                }`}
                onClick={() => setSelectedFile(file.id)}
              >
                {viewMode === 'grid' ? (
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className={`w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center ${getFileColor(file.type)}`}>
                        <file.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-white mb-1 truncate">{file.name}</h3>
                    <p className="text-xs text-neutral-400 mb-2">{file.size}</p>
                    <div className="flex items-center justify-center space-x-1">
                      {file.starred && <StarIcon className="w-3 h-3 text-yellow-400" />}
                      {file.encrypted && <LockClosedIcon className="w-3 h-3 text-green-400" />}
                      <span className="text-xs text-neutral-500">{file.modified}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center ${getFileColor(file.type)}`}>
                      <file.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-white">{file.name}</h3>
                      <p className="text-xs text-neutral-400">{file.size} • {file.modified}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.starred && <StarIcon className="w-4 h-4 text-yellow-400" />}
                      {file.encrypted && <LockClosedIcon className="w-4 h-4 text-green-400" />}
                      <TauOSButton variant="ghost" size="sm">
                        <ShareIcon className="w-4 h-4" />
                      </TauOSButton>
                      <TauOSButton variant="ghost" size="sm">
                        <EyeIcon className="w-4 h-4" />
                      </TauOSButton>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <TauOSCard className="w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Share File</h3>
              <button 
                onClick={() => setShareModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Share Link</label>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value="https://cloud.tauos.org/share/abc123"
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm"
                    readOnly
                  />
                  <TauOSButton variant="primary" size="sm">
                    Copy
                  </TauOSButton>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Permissions</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-neutral-300">Allow download</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-neutral-300">Password protected</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Expiration</label>
                <select className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Never</option>
                  <option>1 day</option>
                  <option>7 days</option>
                  <option>30 days</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-neutral-700">
              <TauOSButton variant="ghost" size="sm" onClick={() => setShareModalOpen(false)}>
                Cancel
              </TauOSButton>
              <TauOSButton variant="primary" size="sm">
                Share
              </TauOSButton>
            </div>
          </TauOSCard>
        </div>
      )}
    </div>
  )
}

export default TauCloudScreen 