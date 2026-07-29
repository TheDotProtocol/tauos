'use client';

import { Menu, Search, Bell, User, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { getStoredUser } from '@/lib/tau-ide/auth-client';
import { useEffect, useState } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
  mode?: 'professional' | 'beginner' | 'architect';
}

export default function TauIdeHeader({ onMenuClick, title = 'Tau IDE', mode = 'professional' }: HeaderProps) {
  const [user, setUser] = useState<{ username?: string; fullName?: string } | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const modeLabel =
    mode === 'architect' ? 'AI Architect Mode' : mode === 'beginner' ? 'Beginner Mode' : 'Professional Mode';

  return (
    <header className="glass-strong border-b border-white/10 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-white truncate">{title}</h1>
            <p className="text-xs text-cyan-400/80">{modeLabel}</p>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search projects, files, docs…"
              className="w-full pl-10 pr-4 py-2 glass rounded-lg text-sm text-white placeholder-gray-500 border border-white/10 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/developers/architect"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-400 glass rounded-lg hover:bg-cyan-500/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Tau Architect
          </Link>
          <button className="p-2 text-gray-400 hover:text-white rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
          <Link
            href="/developers/settings"
            className="flex items-center gap-2 px-2 py-1.5 glass rounded-lg text-sm text-gray-300 hover:text-white"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline truncate max-w-[120px]">
              {user?.fullName || user?.username || 'Guest'}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
