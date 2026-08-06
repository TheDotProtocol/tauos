'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import TauCloudAppShell from '@/components/taucloud/shared/TauCloudAppShell';
import { FileSection } from '@/components/taucloud/shared/FileCard';
import HeroBanner from '@/components/taucloud/shared/HeroBanner';
import FolderBrowser from '@/components/taucloud/shared/FolderBrowser';
import {
  deleteTauCloudFile,
  downloadTauCloudFile,
  fetchTauCloudFiles,
  restoreTauCloudFile,
  shareTauCloudFile,
  toggleTauCloudStar,
  type TauCloudFileView,
} from '@/lib/taucloud/api-client';
import type { TauCloudFile } from '@/lib/taucloud/types';
import { useTauCloudSession } from '@/hooks/useTauCloudSession';

type TauCloudFilesMode = 'files' | 'recent' | 'shared' | 'trash';

type TauCloudFilesPageProps = {
  mode?: TauCloudFilesMode;
};

const viewMap: Record<TauCloudFilesMode, TauCloudFileView> = {
  files: 'files',
  recent: 'recent',
  shared: 'shared',
  trash: 'trash',
};

function FilesLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0f] text-[#71717a]">Loading...</div>
  );
}

export default function TauCloudFilesPage({ mode = 'files' }: TauCloudFilesPageProps) {
  if (mode === 'files') {
    return (
      <Suspense fallback={<FilesLoading />}>
        <TauCloudFilesWithFolder />
      </Suspense>
    );
  }

  return <TauCloudFilesPageContent mode={mode} folder="root" />;
}

function TauCloudFilesWithFolder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const folder = searchParams.get('folder') || 'root';

  const handleFolderChange = (nextFolder: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextFolder === 'root') params.delete('folder');
    else params.set('folder', nextFolder);
    const query = params.toString();
    router.push(query ? `/taucloud/files?${query}` : '/taucloud/files');
  };

  return (
    <TauCloudFilesPageContent mode="files" folder={folder} onFolderChange={handleFolderChange} />
  );
}

type TauCloudFilesPageContentProps = {
  mode: TauCloudFilesMode;
  folder: string;
  onFolderChange?: (folder: string) => void;
};

function TauCloudFilesPageContent({ mode, folder, onFolderChange }: TauCloudFilesPageContentProps) {
  const { user } = useTauCloudSession();
  const [files, setFiles] = useState<TauCloudFile[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const active: TauCloudFilesMode = mode;

  const reload = useCallback(() => {
    const request =
      mode === 'files'
        ? fetchTauCloudFiles({ folder })
        : fetchTauCloudFiles({ view: viewMap[mode] });
    return request.then(setFiles).catch(() => setError('Could not load files'));
  }, [folder, mode]);

  useEffect(() => {
    setError('');
    reload();
  }, [reload]);

  const handleShare = async (fileId: string) => {
    const result = await shareTauCloudFile(fileId);
    if (!result.ok) {
      setMessage(result.error || 'Share failed');
      return;
    }
    if (result.shareUrl) {
      await navigator.clipboard.writeText(
        result.shareUrl.startsWith('http') ? result.shareUrl : `${window.location.origin}${result.shareUrl}`,
      );
      setMessage('Share link copied to clipboard');
    }
    reload();
  };

  const handleDelete = async (fileId: string) => {
    const result = await deleteTauCloudFile(fileId, mode === 'trash');
    if (!result.ok) {
      setMessage(result.error || 'Delete failed');
      return;
    }
    setMessage(mode === 'trash' ? 'File permanently deleted' : 'File moved to trash');
    reload();
  };

  const handleRestore = async (fileId: string) => {
    const result = await restoreTauCloudFile(fileId);
    if (!result.ok) {
      setMessage(result.error || 'Restore failed');
      return;
    }
    setMessage('File restored');
    reload();
  };

  const handleStar = async (fileId: string) => {
    const result = await toggleTauCloudStar(fileId);
    if (!result.ok) {
      setMessage(result.error || 'Could not update pin');
      return;
    }
    reload();
  };

  const folderLabel = folder === 'root' ? 'My Vault' : folder.replace(/_/g, ' ');

  return (
    <TauCloudAppShell active={active}>
      <div className="space-y-8 p-8">
        {mode === 'files' ? (
          <HeroBanner
            userName={user?.fullName || user?.username || 'User'}
            folder={folder}
            onUploaded={reload}
          />
        ) : null}

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {message ? <p className="text-sm text-[#ffb800]">{message}</p> : null}

        <div className={mode === 'files' ? 'grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]' : undefined}>
          {mode === 'files' && onFolderChange ? (
            <FolderBrowser activeFolder={folder} onFolderChange={onFolderChange} />
          ) : null}

          <div className="space-y-8">
            <FileSection
              title={
                mode === 'trash'
                  ? 'Deleted Items'
                  : mode === 'shared'
                    ? 'Shared Items'
                    : mode === 'recent'
                      ? 'Recent Files'
                      : `${folderLabel} Files`
              }
              actionLabel="Refresh"
              files={files}
              starred={mode === 'files'}
              onStarToggle={mode !== 'trash' ? handleStar : undefined}
            />

            {files.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-[#222228]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#16161b] text-[#71717a]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Size</th>
                      <th className="px-4 py-3 font-medium">{mode === 'trash' ? 'Deleted' : 'Modified'}</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr key={file.id} className="border-t border-[#222228] bg-[#121214]">
                        <td className="px-4 py-3">
                          <Link href={`/taucloud/preview/${file.id}`} className="font-medium text-white hover:text-[#ffb800]">
                            {file.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-[#a1a1aa]">{file.sizeLabel}</td>
                        <td className="px-4 py-3 text-[#a1a1aa]">
                          {mode === 'trash' && file.deletedAt ? new Date(file.deletedAt).toLocaleString() : file.timeLabel}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-3 text-xs">
                            {mode === 'trash' ? (
                              <>
                                <button type="button" className="text-[#ffb800]" onClick={() => handleRestore(file.id)}>
                                  Restore
                                </button>
                                <button type="button" className="text-red-400" onClick={() => handleDelete(file.id)}>
                                  Delete forever
                                </button>
                              </>
                            ) : (
                              <>
                                <button type="button" className="text-[#ffb800]" onClick={() => downloadTauCloudFile(file.id)}>
                                  Download
                                </button>
                                <button type="button" className="text-[#a1a1aa]" onClick={() => handleShare(file.id)}>
                                  Share
                                </button>
                                <button type="button" className="text-[#a1a1aa]" onClick={() => handleStar(file.id)}>
                                  {file.starred ? 'Unpin' : 'Pin'}
                                </button>
                                <button type="button" className="text-red-400" onClick={() => handleDelete(file.id)}>
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </TauCloudAppShell>
  );
}
