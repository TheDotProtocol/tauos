'use client';

import React from 'react';
import { 
  InboxIcon, 
  PaperAirplaneIcon, 
  DocumentDuplicateIcon, 
  ArchiveBoxIcon, 
  TrashIcon,
  PlusIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  selectedFolder: string;
  onFolderSelect: (folder: string) => void;
  onCompose: () => void;
  mode: 'standard' | 'parental' | 'senior';
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedFolder, 
  onFolderSelect, 
  onCompose,
  mode 
}) => {
  const folders = [
    { id: 'inbox', name: 'Inbox', icon: InboxIcon, count: 12 },
    { id: 'sent', name: 'Sent', icon: PaperAirplaneIcon, count: 8 },
    { id: 'drafts', name: 'Drafts', icon: DocumentDuplicateIcon, count: 3 },
    { id: 'archive', name: 'Archive', icon: ArchiveBoxIcon, count: 45 },
    { id: 'trash', name: 'Trash', icon: TrashIcon, count: 0 }
  ];

  const isSeniorMode = mode === 'senior';
  const isParentalMode = mode === 'parental';

  return (
    <div className={`w-64 bg-gray-50 border-r border-gray-200 flex flex-col ${
      isSeniorMode ? 'text-lg' : ''
    }`}>
      {/* Compose Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onCompose}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            isSeniorMode 
              ? 'bg-purple-600 text-white hover:bg-purple-700 text-lg' 
              : isParentalMode 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <PlusIcon className={`${isSeniorMode ? 'h-6 w-6' : 'h-5 w-5'}`} />
          <span>Compose</span>
        </button>
      </div>

      {/* Folders */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {folders.map((folder) => {
            const Icon = folder.icon;
            const isSelected = selectedFolder === folder.id;
            
            return (
              <button
                key={folder.id}
                onClick={() => onFolderSelect(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  isSelected
                    ? isSeniorMode 
                      ? 'bg-purple-100 text-purple-800' 
                      : isParentalMode 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`${isSeniorMode ? 'h-6 w-6' : 'h-5 w-5'}`} />
                  <span className={`font-medium ${isSeniorMode ? 'text-lg' : ''}`}>
                    {folder.name}
                  </span>
                </div>
                {folder.count > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isSelected
                      ? isSeniorMode 
                        ? 'bg-purple-200 text-purple-800' 
                        : isParentalMode 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-blue-200 text-blue-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {folder.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <CogIcon className={`${isSeniorMode ? 'h-6 w-6' : 'h-5 w-5'}`} />
          <span className={`font-medium ${isSeniorMode ? 'text-lg' : ''}`}>
            Settings
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 