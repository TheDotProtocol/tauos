'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { geistMono, geistSans } from '@/lib/website/fonts';
import {
  fetchTauMailProfile,
  saveTauMailDraft,
  sendTauMail,
  uploadTauMailAttachment,
  type TauMailAttachmentRef,
} from '@/lib/taumail/api-client';
import {
  formatAttachmentSize,
  TAUMAIL_MAX_FILES,
  validateFilesForCompose,
} from '@/lib/taumail-attachments';
import { tauMailAssets } from '@/lib/taumail/assets';
import TauMailAppShell from '@/components/taumail/shared/TauMailAppShell';
import { MailIcon } from '@/components/taumail/shared/MailIcon';
import { useTauMailSession } from '@/hooks/useTauMailSession';

const toolbarIcons = [
  tauMailAssets.icons.bold,
  tauMailAssets.icons.italic,
  tauMailAssets.icons.underline,
  tauMailAssets.icons.strikethrough,
  tauMailAssets.icons.alignLeft,
  tauMailAssets.icons.alignCenter,
  tauMailAssets.icons.alignRight,
  tauMailAssets.icons.list,
  tauMailAssets.icons.listOrdered,
  tauMailAssets.icons.link,
  tauMailAssets.icons.image,
] as const;

type PendingAttachment = TauMailAttachmentRef & {
  previewUrl?: string;
};

export default function TauMailComposePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { ready, isLoggedIn, user, isDemo } = useTauMailSession();
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [signatureName, setSignatureName] = useState('');
  const [signatureTitle, setSignatureTitle] = useState('');
  const [signatureEmail, setSignatureEmail] = useState('');
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [sending, setSending] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftId, setDraftId] = useState<string | undefined>();
  const [error, setError] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    if (!ready || !isLoggedIn) return;

    const prefillTo = searchParams.get('to');
    const prefillSubject = searchParams.get('subject');
    const prefillBody = searchParams.get('body');
    if (prefillTo) setTo(prefillTo);
    if (prefillSubject) setSubject(prefillSubject);
    if (prefillBody) setBody(prefillBody);

    if (isDemo) {
      setSignatureName(user?.fullName || user?.username || '');
      setSignatureEmail(user?.email || '');
      return;
    }

    fetchTauMailProfile()
      .then((profile) => {
        if (!profile) return;
        setSignatureName(profile.displayName || profile.fullName || '');
        setSignatureTitle(profile.title || '');
        setSignatureEmail(profile.email || '');
      })
      .catch(() => {
        setSignatureName(user?.fullName || user?.username || '');
        setSignatureEmail(user?.email || '');
      });
  }, [ready, isLoggedIn, user, isDemo, searchParams]);

  const totalAttachmentBytes = attachments.reduce((sum, a) => sum + a.size, 0);

  const handlePickAttachments = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;

    if (attachments.length + files.length > TAUMAIL_MAX_FILES) {
      setError(`Maximum ${TAUMAIL_MAX_FILES} attachments per email`);
      return;
    }

    const check = validateFilesForCompose(files, totalAttachmentBytes);
    if (check.ok === false) {
      setError(check.error);
      return;
    }

    setError('');
    setUploadingAttachment(true);

    for (const file of files) {
      const result = await uploadTauMailAttachment(file);
      if (result.ok === false) {
        setError(result.error);
        continue;
      }

      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
      setAttachments((prev) => [...prev, { ...result.ref, previewUrl }]);
    }

    setUploadingAttachment(false);
  };

  const removeAttachment = (path: string) => {
    setAttachments((prev) => {
      const item = prev.find((a) => a.path === path);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((a) => a.path !== path);
    });
  };

  const handleSend = async () => {
    if (!to.trim()) {
      setError('Recipient is required');
      return;
    }
    setSending(true);
    setError('');
    const result = await sendTauMail({
      to,
      subject,
      body,
      cc: cc.trim() || undefined,
      bcc: bcc.trim() || undefined,
      attachments: attachments.map(({ attachmentId, path, filename, contentType, size }) => ({
        attachmentId,
        path,
        filename,
        contentType,
        size,
      })),
    });
    setSending(false);
    if (!result.ok) {
      setError(result.error || 'Failed to send');
      return;
    }
    router.push('/taumail/sent');
  };

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    setError('');
    const result = await saveTauMailDraft({ to, subject, body, draftId });
    setSavingDraft(false);
    if (!result.ok) {
      setError(result.error || 'Failed to save draft');
      return;
    }
    if (result.draftId) setDraftId(String(result.draftId));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  if (!ready || !isLoggedIn) {
    return <div className={`${geistSans.className} flex min-h-screen items-center justify-center bg-[#070708] text-[#a1a1aa]`}>Loading...</div>;
  }

  return (
    <TauMailAppShell active="compose" header="compose">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z"
        onChange={handleFilesSelected}
      />
      <div className={`${geistSans.className} flex min-h-0 flex-1`}>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="space-y-0 border-b border-[rgba(255,255,255,0.05)] px-8">
            <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.05)] py-4">
              <span className="w-8 text-xs font-semibold text-[#71717a]">To</span>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#71717a]"
              />
              <button
                type="button"
                onClick={() => setShowCcBcc((v) => !v)}
                className="ml-auto text-xs font-semibold text-[#71717a] hover:text-white"
              >
                CC / BCC
              </button>
            </div>
            {showCcBcc ? (
              <>
                <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.05)] py-4">
                  <span className="w-8 text-xs font-semibold text-[#71717a]">Cc</span>
                  <input
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="cc@example.com"
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#71717a]"
                  />
                </div>
                <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.05)] py-4">
                  <span className="w-8 text-xs font-semibold text-[#71717a]">Bcc</span>
                  <input
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="bcc@example.com"
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#71717a]"
                  />
                </div>
              </>
            ) : null}
            <div className="flex items-center gap-2 py-4">
              <span className="w-8 text-xs font-semibold text-[#71717a]">Subject</span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#71717a]"
              />
            </div>
            {signatureEmail ? (
              <p className={`${geistMono.className} pb-3 text-[11px] text-[#71717a]`}>
                From: {signatureName ? `${signatureName} ` : ''}&lt;{signatureEmail}&gt;
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-1 border-b border-[rgba(255,255,255,0.05)] bg-[#121214] px-4 py-2">
            {toolbarIcons.map((icon) => (
              <button key={icon} type="button" className="flex size-8 items-center justify-center rounded-md hover:bg-[rgba(255,255,255,0.05)]">
                <MailIcon src={icon} size={14} />
              </button>
            ))}
            <button
              type="button"
              onClick={handlePickAttachments}
              disabled={uploadingAttachment}
              title="Attach files"
              className="flex size-8 items-center justify-center rounded-md hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-50"
            >
              <MailIcon src={tauMailAssets.icons.paperclip} size={14} />
            </button>
          </div>

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
            className="flex-1 resize-none overflow-y-auto bg-transparent px-8 py-6 text-sm leading-relaxed text-[#a1a1aa] outline-none placeholder:text-[#71717a]"
          />

          {attachments.length > 0 ? (
            <div className="border-t border-[rgba(255,255,255,0.05)] px-8 py-4">
              <p className="mb-2 text-xs font-semibold text-[#71717a]">
                Attachments ({attachments.length}) · {formatAttachmentSize(totalAttachmentBytes)}
              </p>
              <div className="flex flex-wrap gap-2">
                {attachments.map((file) => (
                  <div
                    key={file.path}
                    className="flex max-w-[220px] items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214] p-2"
                  >
                    {file.previewUrl ? (
                      <img src={file.previewUrl} alt="" className="size-10 rounded object-cover" />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded bg-[#1e1e24]">
                        <MailIcon src={tauMailAssets.icons.file} size={16} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-white">{file.filename}</p>
                      <p className={`${geistMono.className} text-[10px] text-[#71717a]`}>{formatAttachmentSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(file.path)}
                      className="shrink-0 text-[#71717a] hover:text-white"
                      aria-label={`Remove ${file.filename}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {error ? <p className="px-8 text-xs text-red-400">{error}</p> : null}
          {draftSaved ? <p className="px-8 text-xs text-[#d4a843]">Draft saved</p> : null}
          {uploadingAttachment ? <p className="px-8 text-xs text-[#71717a]">Uploading attachment…</p> : null}

          <div className="flex items-center gap-3 border-t border-[rgba(255,255,255,0.05)] px-8 py-4">
            <button
              type="button"
              onClick={handleSend}
              disabled={sending || uploadingAttachment}
              className="flex items-center gap-2 rounded-lg bg-[#d4a843] px-5 py-2.5 text-sm font-semibold text-[#070708] disabled:opacity-60"
            >
              <MailIcon src={tauMailAssets.icons.send} size={14} />
              {sending ? 'Sending...' : 'Send'}
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={savingDraft}
              title={draftSaved ? 'Draft saved' : 'Save draft'}
              className="flex size-10 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214] disabled:opacity-60"
            >
              <MailIcon src={tauMailAssets.icons.clock} size={16} />
            </button>
            <button
              type="button"
              onClick={handlePickAttachments}
              disabled={uploadingAttachment}
              title="Attach documents, images, and files"
              className="flex size-10 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214] disabled:opacity-60"
            >
              <MailIcon src={tauMailAssets.icons.paperclip} size={16} />
            </button>
          </div>
        </div>

        <aside className="w-[300px] shrink-0 overflow-y-auto border-l border-[rgba(255,255,255,0.05)] p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[#71717a]">Signature Preview</h3>
          <div className="mt-3 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214] p-3 text-xs">
            {signatureName ? (
              <p className="font-semibold text-[#d4a843]">{signatureName}</p>
            ) : (
              <p className="text-[#71717a]">Your name will appear here</p>
            )}
            {signatureTitle ? <p className="text-[#71717a]">{signatureTitle}</p> : null}
            {signatureEmail ? (
              <p className={`${geistMono.className} text-[#71717a]`}>{signatureEmail}</p>
            ) : (
              <p className={`${geistMono.className} text-[#71717a]`}>your@email.com</p>
            )}
          </div>
          <p className="mt-4 text-[11px] text-[#71717a]">Update your signature details in Settings → Profile.</p>
          <p className="mt-2 text-[11px] text-[#71717a]">
            Recipients will see your name and {signatureEmail || 'Tau Mail address'} as the sender.
          </p>
        </aside>
      </div>
    </TauMailAppShell>
  );
}
