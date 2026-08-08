'use client';

import type { ReactNode } from 'react';
import { outfit } from '@/lib/website/fonts';
import type { TauAiNavId } from '@/lib/tau-ai-app/assets';
import TauAiSidebar from '@/components/tau-ai-app/shared/TauAiSidebar';

type TauAiAppShellProps = {
  active: TauAiNavId;
  children: ReactNode;
  /** When true, main area uses full-height column layout (chat) */
  fullHeight?: boolean;
};

export default function TauAiAppShell({
  active,
  children,
  fullHeight = false,
}: TauAiAppShellProps) {
  return (
    <div className={`${outfit.className} flex h-screen min-h-0 bg-black text-white`}>
      <TauAiSidebar active={active} />
      <div className={clsxMain(fullHeight)} data-name="main-content">
        {children}
      </div>
    </div>
  );
}

function clsxMain(fullHeight: boolean) {
  if (fullHeight) {
    return 'flex min-h-0 min-w-0 flex-1 flex-col';
  }
  return 'flex min-h-0 min-w-0 flex-1 flex-col gap-[32px] px-[40px] py-[32px]';
}
