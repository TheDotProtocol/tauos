'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import DeveloperSidebar from '@/components/tau-developer/DeveloperSidebar';
import DeveloperTopBar from '@/components/tau-developer/DeveloperTopBar';
import { geistSans } from '@/lib/website/fonts';
import { titleForPath } from '@/lib/tau-developer/nav';
import { tauDev } from '@/lib/tau-developer/theme';
import '@/styles/tau-developer.css';

type Props = {
  children: React.ReactNode;
  title?: string;
  /** @deprecated Figma shell uses pathname-based titles; kept for existing pages */
  mode?: 'professional' | 'beginner' | 'architect';
};

export default function PlatformShell({ children, title }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = title ?? titleForPath(pathname);

  return (
    <div
      className={`tau-dev ${geistSans.className} flex h-screen min-h-screen overflow-hidden`}
      style={{ backgroundColor: tauDev.bg, color: tauDev.text }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded-lg focus:bg-[#f5a623] focus:px-4 focus:py-2 focus:text-[#060608]"
      >
        Skip to main content
      </a>
      <DeveloperSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DeveloperTopBar title={pageTitle} onMenuClick={() => setSidebarOpen(true)} />
        <main id="main-content" className="tau-dev-scroll flex-1 overflow-auto" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
