'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Code, GitBranch, Settings, Terminal, Brain,
  ChevronDown, X, BookOpen, Rocket, LogIn, LogOut, Search
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getStoredUser, clearSession } from '@/lib/tau-ide/auth-client';

const BASE = '/developers';

type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  children?: { label: string; href: string; badge?: string }[];
};

const menuItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: `${BASE}/dashboard` },
  { id: 'projects', label: 'Projects', icon: Code, href: `${BASE}/projects` },
  { id: 'workspace', label: 'Tau IDE', icon: Code, href: `${BASE}/workspace` },
  { id: 'architect', label: 'Tau Architect', icon: Brain, href: `${BASE}/architect` },
  { id: 'search', label: 'Search', icon: Search, href: `${BASE}/search` },
  { id: 'tauscript', label: 'TauScript', icon: Terminal, href: `${BASE}/tauscript` },
  { id: 'terminal', label: 'Terminal', icon: Terminal, href: `${BASE}/terminal` },
  { id: 'git', label: 'Git', icon: GitBranch, href: `${BASE}/git` },
  { id: 'automation', label: 'Deployment', icon: Rocket, href: `${BASE}/automation` },
  { id: 'docs', label: 'Documentation', icon: BookOpen, href: `${BASE}/docs` },
  { id: 'settings', label: 'Settings', icon: Settings, href: `${BASE}/settings` },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TauIdeSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [user, setUser] = useState<{ fullName?: string; username?: string } | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const logout = () => {
    clearSession();
    setUser(null);
    window.location.href = '/developers/login';
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-strong transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <Link href={BASE} className="flex items-center gap-3">
              <img src="/brand/tau-ide-logo.png" alt="Tau IDE" className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <h2 className="text-sm font-bold text-white">Tau IDE</h2>
                <p className="text-xs text-gray-400">Developer Platform</p>
              </div>
            </Link>
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Tau IDE navigation">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expanded.includes(item.id);

              return (
                <div key={item.id}>
                  <Link
                    href={hasChildren ? '#' : item.href}
                    onClick={(e) => {
                      if (hasChildren) {
                        e.preventDefault();
                        setExpanded((prev) =>
                          prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id]
                        );
                      } else {
                        onClose();
                      }
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      {item.label}
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    {hasChildren && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </Link>
                  {hasChildren && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children!.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                        >
                          {child.label}
                          {child.badge && <span className="ml-2 text-purple-300">({child.badge})</span>}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-2">
            {user ? (
              <>
                <p className="text-xs text-gray-400 px-3 truncate" aria-label="Signed in user">
                  {user.fullName || user.username}
                </p>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href={`${BASE}/login`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-cyan-400 rounded-lg hover:bg-white/5"
              >
                <LogIn className="w-4 h-4" />
                Sign in for cloud sync
              </Link>
            )}
            <div className="glass p-3 rounded-lg">
              <p className="text-xs font-medium text-cyan-400">TauScript v1.0 · Public Beta RC1</p>
              <p className="text-xs text-gray-500 mt-1">Privacy-first programming language</p>
            </div>
            <div className="flex flex-wrap gap-2 px-1 text-[10px] text-gray-600">
              <Link href="/legal/privacy" className="hover:text-cyan-400">Privacy</Link>
              <Link href="/legal/terms" className="hover:text-cyan-400">Terms</Link>
              <Link href="/legal/acceptable-use" className="hover:text-cyan-400">AUP</Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
