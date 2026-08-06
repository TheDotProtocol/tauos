'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TauCloudAppShell from '@/components/taucloud/shared/TauCloudAppShell';
import FolderBrowser from '@/components/taucloud/shared/FolderBrowser';
import UploadDropZone from '@/components/taucloud/shared/UploadDropZone';
import { useTauCloudSession } from '@/hooks/useTauCloudSession';

function UploadLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0f] text-[#71717a]">Loading...</div>
  );
}

export default function TauCloudUploadPage() {
  return (
    <Suspense fallback={<UploadLoading />}>
      <TauCloudUploadPageContent />
    </Suspense>
  );
}

function TauCloudUploadPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const folder = searchParams.get('folder') || 'root';
  const { user } = useTauCloudSession();

  const handleFolderChange = (nextFolder: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextFolder === 'root') params.delete('folder');
    else params.set('folder', nextFolder);
    const query = params.toString();
    router.push(query ? `/taucloud/upload?${query}` : '/taucloud/upload');
  };

  return (
    <TauCloudAppShell active="upload" title="Upload Center" subtitle="Ingest files into your secure vault.">
      <div className="grid gap-6 p-8 xl:grid-cols-[280px_minmax(0,1fr)]">
        <FolderBrowser activeFolder={folder} onFolderChange={handleFolderChange} />
        <div className="space-y-6">
          <div className="rounded-xl border border-[#222228] bg-[#16161b] p-5">
            <h2 className="text-lg font-semibold text-white">Upload Center</h2>
            <p className="mt-1 text-sm text-[#71717a]">
              Signed in as {user?.fullName || user?.username || 'User'}. Files will be encrypted at rest in your vault.
            </p>
          </div>
          <UploadDropZone folder={folder} />
        </div>
      </div>
    </TauCloudAppShell>
  );
}
