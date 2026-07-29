'use client';

import { useState } from 'react';
import TauIdeSidebar from './Sidebar';
import TauIdeHeader from './Header';

interface PlatformShellProps {
  children: React.ReactNode;
  title?: string;
  mode?: 'professional' | 'beginner' | 'architect';
}

export default function PlatformShell({ children, title, mode }: PlatformShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="tau-ide flex h-screen overflow-hidden bg-[#0a0a0a]">
      <TauIdeSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TauIdeHeader onMenuClick={() => setSidebarOpen(true)} title={title} mode={mode} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
