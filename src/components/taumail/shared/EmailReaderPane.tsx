'use client';

import { useState } from 'react';
import { geistMono, geistSans, outfit } from '@/lib/website/fonts';
import { tauMailAssets } from '@/lib/taumail/assets';
import type { TauMailEmail } from '@/lib/taumail/types';
import {
  downloadTauMailAttachment,
  openTauMailAttachment,
} from '@/lib/taumail/api-client';
import { MailIcon } from '@/components/taumail/shared/MailIcon';
import TauMailUserAvatar from '@/components/taumail/shared/TauMailUserAvatar';

export type EmailReaderAction = 'reply' | 'forward' | 'archive' | 'delete' | 'star' | 'ai-summarize';

const actionButtons: { action: EmailReaderAction; label: string; icon: string; gold: boolean }[] = [
  { action: 'reply', label: 'Reply', icon: tauMailAssets.icons.arrowUpLeft, gold: false },
  { action: 'forward', label: 'Forward', icon: tauMailAssets.icons.arrowUpRight, gold: false },
  { action: 'archive', label: 'Archive', icon: tauMailAssets.icons.package, gold: false },
  { action: 'delete', label: 'Delete', icon: tauMailAssets.icons.trash, gold: false },
  { action: 'star', label: 'Star', icon: tauMailAssets.icons.starOff, gold: false },
  { action: 'ai-summarize', label: 'AI Summarize', icon: tauMailAssets.icons.sparkles, gold: true },
];

type EmailReaderPaneProps = {
  email: TauMailEmail;
  recipientLabel?: string;
  avatarName?: string;
  avatarEmail?: string;
  avatarUrl?: string | null;
  busyAction?: EmailReaderAction | null;
  aiSummary?: string | null;
  onAction?: (action: EmailReaderAction) => void;
};

function isPreviewableImage(contentType: string, filename: string): boolean {
  if (contentType.startsWith('image/')) return true;
  return /\.(jpe?g|png|webp|gif)$/i.test(filename);
}

export default function EmailReaderPane({
  email,
  recipientLabel,
  avatarName,
  avatarEmail,
  avatarUrl,
  busyAction,
  aiSummary,
  onAction,
}: EmailReaderPaneProps) {
  const paragraphs = email.body.split('\n\n').filter(Boolean);
  const hasHtmlBody = Boolean(email.bodyHtml?.trim());
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [attachmentError, setAttachmentError] = useState('');

  const handleDownload = async (index: number, filename: string, contentType: string) => {
    setAttachmentError('');
    setDownloadingIndex(index);

    if (email.attachments?.[index]?.content) {
      try {
        const bytes = Uint8Array.from(atob(email.attachments[index].content!.replace(/\s/g, '')), (c) =>
          c.charCodeAt(0),
        );
        const blob = new Blob([bytes], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        setDownloadingIndex(null);
        return;
      } catch {
        /* fall through to API download */
      }
    }

    const result = await downloadTauMailAttachment(email.id, index, filename);
    setDownloadingIndex(null);
    if (!result.ok) {
      setAttachmentError(result.error || 'Could not download attachment');
    }
  };

  const handleOpen = async (index: number) => {
    setAttachmentError('');
    setDownloadingIndex(index);
    const result = await openTauMailAttachment(email.id, index);
    setDownloadingIndex(null);
    if (!result.ok) {
      setAttachmentError(result.error || 'Could not open attachment');
    }
  };

  return (
    <div className={`${geistSans.className} flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto p-8`}>
      <div className="border-b border-[rgba(255,255,255,0.05)] pb-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TauMailUserAvatar
              name={avatarName || email.sender}
              email={avatarEmail || email.senderEmail}
              imageUrl={avatarUrl}
              size={44}
            />
            <div>
              <p className="text-[15px] font-semibold text-white">{email.sender}</p>
              <p className={`${geistMono.className} text-xs text-[#71717a]`}>
                {recipientLabel || `${email.senderEmail} → to me`}
              </p>
            </div>
          </div>
          <p className={`${geistMono.className} text-xs text-[#71717a]`}>{email.time}</p>
        </div>
        <h2 className={`${outfit.className} mt-4 text-[22px] font-bold text-white`}>{email.subject}</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {actionButtons.map((btn) => {
          const isStar = btn.action === 'star';
          const label = isStar && email.starred ? 'Unstar' : btn.label;
          const isBusy = busyAction === btn.action;
          return (
            <button
              key={btn.action}
              type="button"
              disabled={Boolean(busyAction) && !isBusy}
              onClick={() => onAction?.(btn.action)}
              className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium disabled:opacity-50 ${
                btn.gold
                  ? 'border-[rgba(212,168,67,0.15)] bg-[rgba(212,168,67,0.08)] text-[#d4a843]'
                  : isStar && email.starred
                    ? 'border-[rgba(212,168,67,0.25)] bg-[rgba(212,168,67,0.12)] text-[#d4a843]'
                    : 'border-[rgba(255,255,255,0.05)] bg-[#121214] text-white'
              }`}
            >
              <MailIcon src={btn.icon} size={14} />
              {isBusy ? 'Working…' : label}
            </button>
          );
        })}
      </div>

      {aiSummary ? (
        <div className="rounded-lg border border-[rgba(212,168,67,0.15)] bg-[rgba(212,168,67,0.06)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#d4a843]">AI Summary</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#d4c4a0]">{aiSummary}</p>
        </div>
      ) : null}

      {hasHtmlBody ? (
        <div
          className="email-body flex-1 text-sm leading-relaxed text-[#a1a1aa] [&_a]:text-[#d4a843] [&_img]:my-3 [&_img]:max-h-[480px] [&_img]:max-w-full [&_img]:rounded-lg [&_img]:cursor-pointer [&_p]:my-2"
          dangerouslySetInnerHTML={{ __html: email.bodyHtml! }}
          onClick={(event) => {
            const target = event.target as HTMLElement;
            if (target.tagName === 'IMG' && target instanceof HTMLImageElement && target.src.startsWith('data:')) {
              const link = document.createElement('a');
              link.href = target.src;
              link.download = 'inline-image';
              link.click();
            }
          }}
        />
      ) : (
        <div className="flex-1 space-y-4 text-sm leading-relaxed text-[#a1a1aa]">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      )}

      {email.attachments && email.attachments.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#71717a]">Attachments</p>
          {attachmentError ? <p className="text-xs text-red-400">{attachmentError}</p> : null}
          <div className="flex flex-wrap gap-2">
            {email.attachments.map((file, index) => {
              const busy = downloadingIndex === index;
              const canPreview = isPreviewableImage(file.type, file.name);
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="flex max-w-[280px] items-center gap-3 rounded-[10px] border border-[rgba(255,255,255,0.05)] bg-[#121214] p-3"
                >
                  <MailIcon src={tauMailAssets.icons.file} size={24} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-white">{file.name}</p>
                    <p className={`${geistMono.className} text-[11px] text-[#71717a]`}>{file.size}</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleDownload(index, file.name, file.type)}
                        className="text-[11px] font-medium text-[#d4a843] hover:text-[#e8c468] disabled:opacity-50"
                      >
                        {busy ? 'Loading…' : 'Download'}
                      </button>
                      {canPreview ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleOpen(index)}
                          className="text-[11px] font-medium text-[#a1a1aa] hover:text-white disabled:opacity-50"
                        >
                          Open
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
