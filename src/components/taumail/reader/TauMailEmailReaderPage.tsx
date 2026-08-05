'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { geistSans } from '@/lib/website/fonts';
import { fetchTauMailEmails } from '@/lib/taumail/api-client';
import type { TauMailEmail } from '@/lib/taumail/types';
import TauMailAppShell from '@/components/taumail/shared/TauMailAppShell';
import EmailReaderPane from '@/components/taumail/shared/EmailReaderPane';
import { useTauMailSession } from '@/hooks/useTauMailSession';

export default function TauMailEmailReaderPage() {
  const params = useParams();
  const router = useRouter();
  const { ready, isLoggedIn } = useTauMailSession();
  const [email, setEmail] = useState<TauMailEmail | null>(null);

  useEffect(() => {
    if (!ready || !isLoggedIn) return;
    const id = params.id as string;
    fetchTauMailEmails('inbox')
      .then((emails) => {
        const found = emails.find((e) => String(e.id) === id);
        if (found) setEmail(found);
        else if (emails[0]) setEmail(emails[0]);
      })
      .catch(console.error);
  }, [params.id, ready, isLoggedIn]);

  if (!ready || !isLoggedIn) {
    return <div className={`${geistSans.className} flex min-h-screen items-center justify-center bg-[#070708] text-[#a1a1aa]`}>Loading...</div>;
  }

  return (
    <TauMailAppShell active="inbox">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="border-b border-[rgba(255,255,255,0.05)] px-8 py-3">
          <button type="button" onClick={() => router.push('/taumail/inbox')} className="text-xs font-semibold text-[#d4a843]">
            ← Back to Inbox
          </button>
        </div>
        {email ? <EmailReaderPane email={email} /> : <p className="p-8 text-[#71717a]">Email not found</p>}
      </div>
    </TauMailAppShell>
  );
}
