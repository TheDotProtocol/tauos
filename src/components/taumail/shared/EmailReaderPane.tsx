'use client';

import { geistMono, geistSans, outfit } from '@/lib/website/fonts';
import { tauMailAssets } from '@/lib/taumail/assets';
import type { TauMailEmail } from '@/lib/taumail/types';
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

function downloadAttachment(name: string, contentType: string, base64: string) {
  const link = document.createElement('a');
  link.href = `data:${contentType};base64,${base64}`;
  link.download = name;
  link.click();
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
          className="email-body flex-1 text-sm leading-relaxed text-[#a1a1aa] [&_a]:text-[#d4a843] [&_img]:my-3 [&_img]:max-h-[480px] [&_img]:max-w-full [&_img]:rounded-lg [&_p]:my-2"
          dangerouslySetInnerHTML={{ __html: email.bodyHtml! }}
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
          <div className="flex flex-wrap gap-2">
            {email.attachments.map((file) => (
              <button
                key={file.name}
                type="button"
                onClick={() => file.content && downloadAttachment(file.name, file.type, file.content)}
                className="flex max-w-[240px] items-center gap-3 rounded-[10px] border border-[rgba(255,255,255,0.05)] bg-[#121214] p-3 text-left hover:bg-[#1a1a1e]"
              >
                <MailIcon src={tauMailAssets.icons.file} size={24} />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-white">{file.name}</p>
                  <p className={`${geistMono.className} text-[11px] text-[#71717a]`}>{file.size}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
