'use client';

import { useCallback, useRef, useState } from 'react';
import { inter } from '@/lib/website/fonts';
import { tauCloudAssets } from '@/lib/taucloud/assets';
import { uploadTauCloudFile } from '@/lib/taucloud/api-client';
import CloudIcon from '@/components/taucloud/shared/CloudIcon';

type UploadQueueItem = {
  id: string;
  name: string;
  sizeLabel: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
};

type UploadDropZoneProps = {
  folder?: string;
  onComplete?: () => void;
};

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default function UploadDropZone({ folder = 'root', onComplete }: UploadDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (!list.length) return;

      const initial = list.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        sizeLabel: formatBytes(file.size),
        status: 'pending' as const,
      }));
      setQueue((prev) => [...initial, ...prev]);

      for (let i = 0; i < list.length; i += 1) {
        const file = list[i];
        const itemId = initial[i].id;
        setQueue((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: 'uploading' } : item)));
        const result = await uploadTauCloudFile(file, folder);
        setQueue((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? { ...item, status: result.ok ? 'done' : 'error', error: result.ok ? undefined : result.error }
              : item
          )
        );
      }
      onComplete?.();
    },
    [folder, onComplete]
  );

  return (
    <div className="space-y-6">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files?.length) processFiles(event.dataTransfer.files);
        }}
        className={`rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          dragging ? 'border-[#ffb800] bg-[rgba(255,184,0,0.08)]' : 'border-[#222228] bg-[#16161b]'
        }`}
      >
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[rgba(255,184,0,0.12)]">
          <CloudIcon src={tauCloudAssets.icons.upload} size={28} />
        </div>
        <h3 className={`${inter.className} mt-4 text-lg font-semibold text-white`}>Drop files to ingest</h3>
        <p className="mt-2 text-sm text-[#71717a]">
          Quantum-encrypted upload into <span className="text-[#ffb800]">{folder === 'root' ? 'My Vault' : folder}</span>
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#ffb800] px-5 py-2.5 text-sm font-semibold text-[#0d0d0f]"
        >
          Browse Files
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.length) processFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </div>

      {queue.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-[#222228]">
          <div className="border-b border-[#222228] bg-[#16161b] px-4 py-3">
            <h4 className="text-sm font-semibold text-white">Upload Queue</h4>
          </div>
          <div className="divide-y divide-[#222228]">
            {queue.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-[#121214] px-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{item.name}</p>
                  <p className="text-xs text-[#71717a]">{item.sizeLabel}</p>
                </div>
                <span
                  className={
                    item.status === 'done'
                      ? 'text-[#22c55e]'
                      : item.status === 'error'
                        ? 'text-red-400'
                        : item.status === 'uploading'
                          ? 'text-[#ffb800]'
                          : 'text-[#71717a]'
                  }
                >
                  {item.status === 'done'
                    ? 'Complete'
                    : item.status === 'error'
                      ? item.error || 'Failed'
                      : item.status === 'uploading'
                        ? 'Uploading…'
                        : 'Queued'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
