'use client';

import Image from 'next/image';
import Link from 'next/link';
import { inter } from '@/lib/website/fonts';
import { tauCloudAssets } from '@/lib/taucloud/assets';
import type { TauCloudFile } from '@/lib/taucloud/types';
import CloudIcon from '@/components/taucloud/shared/CloudIcon';

function fileIcon(file: TauCloudFile): string {
  if (file.typeLabel === 'ARCHIVE') return tauCloudAssets.icons.fileArchive;
  if (file.typeLabel === 'DOC') return tauCloudAssets.icons.fileDoc;
  if (file.typeLabel === 'VIDEO') return tauCloudAssets.icons.fileVideo;
  return tauCloudAssets.icons.file;
}

type FileCardProps = {
  file: TauCloudFile;
  starred?: boolean;
  href?: string;
  onStarToggle?: (fileId: string) => void;
};

export default function FileCard({ file, starred = false, href, onStarToggle }: FileCardProps) {
  const content = (
    <div className="rounded-xl border border-[#222228] bg-[#16161b] p-3">
      <div className="relative flex h-[138px] items-center justify-center overflow-hidden rounded-lg bg-[#0d0d0f]">
        {file.thumbnailUrl ? (
          <Image src={file.thumbnailUrl} alt="" fill className="object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <CloudIcon src={fileIcon(file)} size={32} />
            <span className="text-[11px] font-medium text-[#71717a]">{file.typeLabel}</span>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{file.name}</p>
          <p className="mt-0.5 text-[11px] text-[#71717a]">
            {file.sizeLabel} • {file.timeLabel}
          </p>
        </div>
        {onStarToggle ? (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onStarToggle(file.id);
            }}
            className="shrink-0"
            aria-label={starred || file.starred ? 'Unpin file' : 'Pin file'}
          >
            <CloudIcon src={starred || file.starred ? tauCloudAssets.icons.star : tauCloudAssets.icons.starOff} size={16} />
          </button>
        ) : (
          <CloudIcon src={starred || file.starred ? tauCloudAssets.icons.star : tauCloudAssets.icons.starOff} size={16} />
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }
  return content;
}

type FileSectionProps = {
  title: string;
  actionLabel: string;
  actionHref?: string;
  files: TauCloudFile[];
  starred?: boolean;
  onStarToggle?: (fileId: string) => void;
};

export function FileSection({ title, actionLabel, actionHref, files, starred = false, onStarToggle }: FileSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className={`${inter.className} text-lg font-semibold text-white`}>{title}</h2>
        {actionHref ? (
          <Link href={actionHref} className="text-[13px] font-medium text-[#ffb800] hover:text-[#ffc933]">
            {actionLabel}
          </Link>
        ) : (
          <span className="text-[13px] font-medium text-[#ffb800]">{actionLabel}</span>
        )}
      </div>
      {files.length === 0 ? (
        <p className="text-sm text-[#71717a]">No files in this view yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              starred={starred || file.starred}
              href={`/taucloud/preview/${file.id}`}
              onStarToggle={onStarToggle}
            />
          ))}
        </div>
      )}
    </section>
  );
}
