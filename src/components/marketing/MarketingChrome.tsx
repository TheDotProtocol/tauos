'use client';

import { useEffect } from 'react';
import Cursor from '@/components/marketing/Cursor';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

/** Matches canonical Replit App.tsx chrome: cursor, tooltips, toasts */
export default function MarketingChrome({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('tau-marketing');
    return () => {
      document.body.classList.remove('tau-marketing');
    };
  }, []);

  return (
    <TooltipProvider>
      <Cursor />
      {children}
      <Toaster />
    </TooltipProvider>
  );
}
