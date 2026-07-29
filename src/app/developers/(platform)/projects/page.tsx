'use client';

import { useState, useEffect } from 'react';
import PlatformShell from '@/components/tau-ide/PlatformShell';
import Link from 'next/link';
import { Plus, Folder, Trash2, ArrowRight } from 'lucide-react';
import {
  loadProjects, createProject, deleteProject, setActiveProjectId, type TauProject
} from '@/lib/tau-ide/projects';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<TauProject[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const refresh = () => setProjects(loadProjects());

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = () => {
    if (!name.trim()) return;
    createProject(name.trim(), desc.trim());
    setName('');
    setDesc('');
    setShowNew(false);
    refresh();
  };

  return (
    <PlatformShell title="Projects">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <p className="text-gray-400 text-sm mt-1">One account, multiple projects, persistent workspaces.</p>
          </div>
          <button onClick={() => setShowNew(true)} className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>

        {showNew && (
          <div className="glass-strong rounded-xl p-6 mb-6 border border-cyan-500/20">
            <h3 className="font-semibold mb-4">Create Project</h3>
            <div className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
                className="w-full px-4 py-2 glass rounded-lg border border-white/10 text-white focus:border-cyan-500 focus:outline-none"
              />
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="w-full px-4 py-2 glass rounded-lg border border-white/10 text-white focus:border-cyan-500 focus:outline-none resize-none"
              />
              <div className="flex gap-2">
                <button onClick={handleCreate} className="btn-primary text-sm">Create</button>
                <button onClick={() => setShowNew(false)} className="btn-secondary text-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {projects.map((p) => (
            <div key={p.id} className="card flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 glass rounded-lg flex items-center justify-center shrink-0">
                  <Folder className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white truncate">{p.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{p.description || 'No description'}</p>
                  <p className="text-xs text-gray-600 mt-1">{p.files.length} file(s) · {p.language}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/developers/workspace"
                  onClick={() => setActiveProjectId(p.id)}
                  className="btn-primary text-sm py-2 px-4"
                >
                  Open <ArrowRight className="w-4 h-4" />
                </Link>
                {p.id !== 'default' && (
                  <button
                    onClick={() => { deleteProject(p.id); refresh(); }}
                    className="p-2 text-gray-500 hover:text-red-400 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PlatformShell>
  );
}
