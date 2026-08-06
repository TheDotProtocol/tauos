'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { inter } from '@/lib/website/fonts';
import { tauCloudAssets } from '@/lib/taucloud/assets';
import { createTauCloudFolder, uploadTauCloudFile } from '@/lib/taucloud/api-client';
import CloudIcon from '@/components/taucloud/shared/CloudIcon';

type HeroBannerProps = {
  userName: string;
  folder?: string;
  syncSummary?: string;
  onUploaded?: () => void;
};

export default function HeroBanner({ userName, folder = 'root', syncSummary, onUploaded }: HeroBannerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const folderLabel = folder === 'root' ? 'My Vault' : folder.replace(/_/g, ' ');

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const result = await uploadTauCloudFile(file, folder);
    if (!result.ok) {
      setMessage(result.error || 'Upload failed');
      return;
    }
    setMessage(`Uploaded to ${folderLabel}`);
    onUploaded?.();
  };

  const handleNewFolder = async () => {
    const name = window.prompt('Folder name');
    if (!name?.trim()) return;
    const result = await createTauCloudFolder(name.trim());
    if (!result.ok) {
      setMessage(result.error || 'Could not create folder');
      return;
    }
    setMessage(`Folder "${result.folder?.label || name}" created`);
    onUploaded?.();
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#222228] bg-[#16161b] p-6">
      <Image
        src={tauCloudAssets.images.heroBanner}
        alt=""
        fill
        className="pointer-events-none object-cover opacity-20"
      />
      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className={`${inter.className} text-2xl font-bold text-white`}>Welcome back, {userName}</h2>
          <span className="rounded-full border border-[rgba(255,184,0,0.3)] bg-[rgba(255,184,0,0.12)] px-3 py-1 text-xs font-medium text-[#ffb800]">
            {folderLabel}
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-[#a1a1aa]">
          {syncSummary ||
            'Your quantum encrypted vaults are secure. Files synchronized across your active terminals.'}
        </p>
        {message ? <p className="mt-2 text-sm text-[#ffb800]">{message}</p> : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#ffb800] px-4 py-2.5 text-sm font-semibold text-[#0d0d0f]"
          >
            <CloudIcon src={tauCloudAssets.icons.upload} size={16} />
            Upload File
          </button>
          <button
            type="button"
            onClick={handleNewFolder}
            className="inline-flex items-center gap-2 rounded-lg border border-[#222228] bg-[rgba(13,13,15,0.6)] px-4 py-2.5 text-sm font-medium text-white"
          >
            <CloudIcon src={tauCloudAssets.icons.folderPlus} size={16} />
            New Folder
          </button>
          <input ref={inputRef} type="file" className="hidden" onChange={handleUpload} />
        </div>
      </div>
    </div>
  );
}
