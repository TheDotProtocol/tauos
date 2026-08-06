'use client';

import { useEffect, useState } from 'react';
import { inter } from '@/lib/website/fonts';
import { tauCloudAssets } from '@/lib/taucloud/assets';
import { createTauCloudFolder, fetchTauCloudFolders } from '@/lib/taucloud/api-client';
import type { TauCloudFolder } from '@/lib/taucloud/types';
import CloudIcon from '@/components/taucloud/shared/CloudIcon';

type FolderBrowserProps = {
  activeFolder: string;
  onFolderChange: (folder: string) => void;
};

export default function FolderBrowser({ activeFolder, onFolderChange }: FolderBrowserProps) {
  const [folders, setFolders] = useState<TauCloudFolder[]>([]);
  const [error, setError] = useState('');

  const load = () =>
    fetchTauCloudFolders()
      .then(setFolders)
      .catch(() => setError('Could not load folders'));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    const name = window.prompt('New folder name');
    if (!name?.trim()) return;
    const result = await createTauCloudFolder(name.trim());
    if (!result.ok) {
      setError(result.error || 'Could not create folder');
      return;
    }
    await load();
    if (result.folder?.name) onFolderChange(result.folder.name);
  };

  return (
    <div className="rounded-xl border border-[#222228] bg-[#16161b] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`${inter.className} text-sm font-semibold text-white`}>Vault Folders</h3>
        <button type="button" onClick={handleCreate} className="text-xs font-medium text-[#ffb800] hover:text-[#ffc933]">
          + New
        </button>
      </div>
      {error ? <p className="mb-2 text-xs text-red-400">{error}</p> : null}
      <div className="space-y-1">
        {folders.map((folder) => {
          const active = folder.name === activeFolder;
          return (
            <button
              key={folder.name}
              type="button"
              onClick={() => onFolderChange(folder.name)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                active ? 'bg-[rgba(255,184,0,0.12)] text-[#ffb800]' : 'text-[#a1a1aa] hover:bg-[#121214] hover:text-white'
              }`}
            >
              <CloudIcon src={tauCloudAssets.icons.folderOpen} size={16} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{folder.label}</span>
              <span className="shrink-0 text-[11px] text-[#71717a]">{folder.fileCount}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
