'use client';

import { useState } from 'react';
import TauIdeSidebar from './Sidebar';
import TauIdeHeader from './Header';
import ConnectionStatusBar from './ConnectionStatusBar';

interface PlatformShellProps {
  children: React.ReactNode;
  title?: string;
  mode?: 'professional' | 'beginner' | 'architect';
}

export default function PlatformShell({ children, title, mode }: PlatformShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="tau-ide flex h-screen overflow-hidden bg-[#0a0a0a]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-black focus:rounded-lg"
      >
        Skip to main content
      </a>
      <TauIdeSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TauIdeHeader onMenuClick={() => setSidebarOpen(true)} title={title} mode={mode} />
        <main id="main-content" className="flex-1 overflow-auto" tabIndex={-1}>
          {children}
        </main>
        <ConnectionStatusBar />
      </div>
    </div>
  );
}
