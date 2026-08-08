import { outfit } from '@/lib/website/fonts';
import type { ReactNode } from 'react';
import { TauAiSessionProvider } from '@/lib/tau-ai-app/session-context';

export const metadata = {
  title: 'Tau AI',
};

export default function TauAiAppLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${outfit.className} min-h-screen bg-black`}>
      <TauAiSessionProvider>{children}</TauAiSessionProvider>
    </div>
  );
}
