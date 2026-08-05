'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { fetchTauMailProfile, saveTauMailDraft, sendTauMail } from '@/lib/taumail/api-client';
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
  tauMailAssets.icons.paperclip,
] as const;

export default function TauMailComposePage() {
  const router = useRouter();
  const { ready, isLoggedIn, user, isDemo } = useTauMailSession();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [signatureName, setSignatureName] = useState('');
  const [signatureTitle, setSignatureTitle] = useState('');
  const [signatureEmail, setSignatureEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftId, setDraftId] = useState<string | undefined>();
  const [error, setError] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    if (!ready || !isLoggedIn) return;

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
  }, [ready, isLoggedIn, user, isDemo]);

  const handleSend = async () => {
    if (!to.trim()) {
      setError('Recipient is required');
      return;
    }
    setSending(true);
    setError('');
    const result = await sendTauMail({ to, subject, body });
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
              <button type="button" className="ml-auto text-xs font-semibold text-[#71717a]">
                CC / BCC
              </button>
            </div>
            <div className="flex items-center gap-2 py-4">
              <span className="w-8 text-xs font-semibold text-[#71717a]">Subject</span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#71717a]"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 border-b border-[rgba(255,255,255,0.05)] bg-[#121214] px-4 py-2">
            {toolbarIcons.map((icon) => (
              <button key={icon} type="button" className="flex size-8 items-center justify-center rounded-md hover:bg-[rgba(255,255,255,0.05)]">
                <MailIcon src={icon} size={14} />
              </button>
            ))}
          </div>

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
            className="flex-1 resize-none overflow-y-auto bg-transparent px-8 py-6 text-sm leading-relaxed text-[#a1a1aa] outline-none placeholder:text-[#71717a]"
          />

          {error ? <p className="px-8 text-xs text-red-400">{error}</p> : null}
          {draftSaved ? <p className="px-8 text-xs text-[#d4a843]">Draft saved</p> : null}

          <div className="flex items-center gap-3 border-t border-[rgba(255,255,255,0.05)] px-8 py-4">
            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
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
            <button type="button" className="flex size-10 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#121214]">
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
        </aside>
      </div>
    </TauMailAppShell>
  );
}
