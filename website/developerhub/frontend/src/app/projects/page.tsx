'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Calendar, 
  Users, 
  Folder,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  MoreVertical,
  Edit,
  Trash2,
  Share,
  Download
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  type: 'personal' | 'work' | 'creative' | 'learning';
  status: 'active' | 'archived' | 'completed';
  lastModified: string;
  size: string;
  files: number;
  collaborators: number;
  isStarred: boolean;
  tags: string[];
  thumbnail?: string;
}

export default function ProjectsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const projects: Project[] = [
    {
      id: '1',
      name: 'Family Photos 2024',
      description: 'Collection of family photos from 2024 vacation',
      type: 'personal',
      status: 'active',
      lastModified: '2025-01-15',
      size: '2.3 GB',
      files: 156,
      collaborators: 3,
      isStarred: true,
      tags: ['photos', 'family', 'vacation'],
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '2',
      name: 'Website Redesign',
      description: 'Complete redesign of company website',
      type: 'work',
      status: 'active',
      lastModified: '2025-01-14',
      size: '45 MB',
      files: 23,
      collaborators: 5,
      isStarred: false,
      tags: ['web', 'design', 'company']
    },
    {
      id: '3',
      name: 'Learning Python',
      description: 'Python programming course materials and exercises',
      type: 'learning',
      status: 'active',
      lastModified: '2025-01-13',
      size: '128 MB',
      files: 67,
      collaborators: 1,
      isStarred: true,
      tags: ['programming', 'python', 'course']
    },
    {
      id: '4',
      name: 'Creative Writing',
      description: 'Short stories and poetry collection',
      type: 'creative',
      status: 'active',
      lastModified: '2025-01-12',
      size: '12 MB',
      files: 34,
      collaborators: 1,
      isStarred: false,
      tags: ['writing', 'stories', 'poetry']
    },
    {
      id: '5',
      name: 'Old Documents',
      description: 'Archived documents from previous projects',
      type: 'personal',
      status: 'archived',
      lastModified: '2024-12-20',
      size: '890 MB',
      files: 234,
      collaborators: 1,
      isStarred: false,
      tags: ['archive', 'documents']
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || project.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'personal': return Folder;
      case 'work': return FileText;
      case 'creative': return Image;
      case 'learning': return Video;
      default: return Folder;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'personal': return 'bg-blue-500';
      case 'work': return 'bg-green-500';
      case 'creative': return 'bg-purple-500';
      case 'learning': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400';
      case 'archived': return 'text-gray-600 dark:text-gray-400';
      case 'completed': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    My Projects
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Organize and manage your personal and work projects
                  </p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                  <Plus className="h-5 w-5" />
                  <span>New Project</span>
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="all">All Types</option>
                      <option value="personal">Personal</option>
                      <option value="work">Work</option>
                      <option value="creative">Creative</option>
                      <option value="learning">Learning</option>
                    </select>
                  </div>

                  {/* View Mode */}
                  <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-yellow-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-yellow-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredProjects.map((project) => {
                const TypeIcon = getTypeIcon(project.type);
                const typeColor = getTypeColor(project.type);
                
                return (
                  <div
                    key={project.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow group"
                  >
                    {/* Project Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 ${typeColor} rounded-lg flex items-center justify-center`}>
                            <TypeIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                              {project.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-sm font-medium ${getStatusColor(project.status)}`}>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors">
                            <Star className={`h-5 w-5 ${project.isStarred ? 'fill-current text-yellow-500' : ''}`} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Project Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {project.files}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Files
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {project.size}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Size
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {project.collaborators}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            People
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Modified {project.lastModified}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="Share">
                            <Share className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-500 transition-colors" title="Download">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors" title="Edit">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No projects found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
                </p>
                <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                  <Plus className="h-5 w-5 mr-2 inline" />
                  Create New Project
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
