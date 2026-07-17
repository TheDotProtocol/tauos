'use client';

import React from 'react';
import { Download, Paperclip } from 'lucide-react';
import type { MailAttachmentPayload } from '@/lib/taumail-attachments';
import { formatAttachmentSize } from '@/lib/taumail-attachments';

type Props = {
  attachments: MailAttachmentPayload[];
};

export default function TauMailAttachmentList({ attachments }: Props) {
  if (!attachments.length) return null;

  const download = (a: MailAttachmentPayload) => {
    const href = `data:${a.contentType};base64,${a.content}`;
    const link = document.createElement('a');
    link.href = href;
    link.download = a.filename;
    link.click();
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-800">
      <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
        <Paperclip className="w-4 h-4" />
        {attachments.length} attachment{attachments.length !== 1 ? 's' : ''}
      </p>
      <div className="flex flex-wrap gap-3">
        {attachments.map((a) => {
          const isImage = a.contentType.startsWith('image/');
          const src = isImage ? `data:${a.contentType};base64,${a.content}` : undefined;

          return (
            <div
              key={`${a.filename}-${a.size}`}
              className="bg-gray-800/60 border border-gray-700 rounded-lg overflow-hidden max-w-xs"
            >
              {isImage && src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={a.filename} className="max-h-48 w-full object-contain bg-black/40" />
              ) : null}
              <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                <div className="min-w-0">
                  <p className="text-gray-200 truncate" title={a.filename}>
                    {a.filename}
                  </p>
                  <p className="text-xs text-gray-500">{formatAttachmentSize(a.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => download(a)}
                  className="shrink-0 p-1.5 text-yellow-400 hover:text-yellow-300"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
