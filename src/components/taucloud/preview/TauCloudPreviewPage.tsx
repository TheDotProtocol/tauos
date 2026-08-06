'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TauCloudAppShell from '@/components/taucloud/shared/TauCloudAppShell';
import { downloadTauCloudFile, fetchTauCloudFileDetail, shareTauCloudFile, toggleTauCloudStar } from '@/lib/taucloud/api-client';
import type { TauCloudFile } from '@/lib/taucloud/types';

type TauCloudPreviewPageProps = {
  fileId: string;
};

function PreviewContent({ file, previewUrl }: { file: TauCloudFile; previewUrl: string }) {
  if (file.mimeType.startsWith('image/')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={previewUrl} alt={file.name} className="max-h-[70vh] w-full rounded-lg object-contain" />
    );
  }

  if (file.mimeType.startsWith('video/')) {
    return <video src={previewUrl} controls className="max-h-[70vh] w-full rounded-lg bg-black" />;
  }

  if (file.mimeType === 'application/pdf') {
    return <iframe src={previewUrl} title={file.name} className="h-[70vh] w-full rounded-lg border-0 bg-[#0d0d0f]" />;
  }

  return (
    <div className="rounded-lg border border-dashed border-[#222228] bg-[#0d0d0f] p-10 text-center">
      <p className="text-sm text-[#a1a1aa]">Inline preview is not available for {file.typeLabel} files.</p>
      <p className="mt-2 text-xs text-[#71717a]">Use Download to open this file locally.</p>
    </div>
  );
}

export default function TauCloudPreviewPage({ fileId }: TauCloudPreviewPageProps) {
  const [file, setFile] = useState<TauCloudFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTauCloudFileDetail(fileId)
      .then((result) => {
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setFile(result.file);
        setPreviewUrl(result.previewUrl);
      })
      .catch(() => setError('File not found'));
  }, [fileId]);

  const handleShare = async () => {
    if (!file) return;
    const result = await shareTauCloudFile(file.id);
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
  };

  const handleStar = async () => {
    if (!file) return;
    const result = await toggleTauCloudStar(file.id);
    if (result.ok) setFile(result.file);
  };

  return (
    <TauCloudAppShell active="files" title="File Preview" subtitle="Inspect vault item metadata and contents.">
      <div className="space-y-6 p-8">
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {message ? <p className="text-sm text-[#ffb800]">{message}</p> : null}
        {file ? (
          <>
            <div className="max-w-5xl rounded-xl border border-[#222228] bg-[#16161b] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{file.name}</h2>
                  <p className="mt-2 text-sm text-[#71717a]">
                    {file.typeLabel} • {file.sizeLabel} • {file.timeLabel}
                    {file.isShared ? ' • Shared' : ''}
                    {file.starred ? ' • Pinned' : ''}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => downloadTauCloudFile(file.id)} className="rounded-lg bg-[#ffb800] px-4 py-2 text-sm font-semibold text-[#0d0d0f]">
                    Download
                  </button>
                  <button type="button" onClick={handleShare} className="rounded-lg border border-[#222228] px-4 py-2 text-sm text-white">
                    Share
                  </button>
                  <button type="button" onClick={handleStar} className="rounded-lg border border-[#222228] px-4 py-2 text-sm text-white">
                    {file.starred ? 'Unpin' : 'Pin'}
                  </button>
                  <Link href="/taucloud/files" className="rounded-lg border border-[#222228] px-4 py-2 text-sm text-[#a1a1aa]">
                    Back to Files
                  </Link>
                </div>
              </div>
            </div>

            {previewUrl ? (
              <div className="max-w-5xl overflow-hidden rounded-xl border border-[#222228] bg-[#16161b] p-4">
                <PreviewContent file={file} previewUrl={previewUrl} />
              </div>
            ) : null}
          </>
        ) : !error ? (
          <p className="text-sm text-[#71717a]">Loading preview…</p>
        ) : null}
      </div>
    </TauCloudAppShell>
  );
}
