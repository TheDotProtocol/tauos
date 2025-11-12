'use client';

import { useState } from 'react';
import { X, Upload, FolderPlus, Link as LinkIcon, Globe, Lock } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProjectModal({ isOpen, onClose, onSuccess }: ProjectModalProps) {
  const [projectType, setProjectType] = useState<'new' | 'upload' | 'clone'>('new');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          repositoryUrl: projectType === 'clone' ? repositoryUrl : undefined,
          isPublic
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create project');
      }

      // Reset form
      setName('');
      setDescription('');
      setRepositoryUrl('');
      setIsPublic(true);
      setProjectType('new');
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-2" style={{ color: 'var(--text-primary)' }}>
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Type Selection */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setProjectType('new')}
            className={`p-4 rounded-lg border-2 transition-all ${
              projectType === 'new'
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <FolderPlus className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--brand-primary)' }} />
            <div className="text-sm font-medium text-white">New Project</div>
          </button>
          <button
            onClick={() => setProjectType('upload')}
            className={`p-4 rounded-lg border-2 transition-all ${
              projectType === 'upload'
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <Upload className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--brand-primary)' }} />
            <div className="text-sm font-medium text-white">Upload</div>
          </button>
          <button
            onClick={() => setProjectType('clone')}
            className={`p-4 rounded-lg border-2 transition-all ${
              projectType === 'clone'
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <LinkIcon className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--brand-primary)' }} />
            <div className="text-sm font-medium text-white">Clone Repo</div>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Project Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-cyan-500 focus:outline-none text-white"
                placeholder="my-awesome-project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-cyan-500 focus:outline-none text-white resize-none"
                placeholder="A brief description of your project..."
              />
            </div>

            {projectType === 'clone' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Repository URL *
                </label>
                <input
                  type="url"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  required={projectType === 'clone'}
                  className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-cyan-500 focus:outline-none text-white"
                  placeholder="https://github.com/user/repo.git"
                />
              </div>
            )}

            {projectType === 'upload' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Upload Files
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Drag and drop your files here, or click to browse
                  </p>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="btn-secondary inline-block cursor-pointer"
                  >
                    Choose Files
                  </label>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    Max file size: 100MB
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  isPublic
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {isPublic ? (
                  <Globe className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                ) : (
                  <Lock className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                )}
                <span className="text-sm text-white">
                  {isPublic ? 'Public' : 'Private'}
                </span>
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading || !name}
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

