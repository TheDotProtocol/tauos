'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertTriangle,
  FileText,
  Inbox,
  LayoutDashboard,
  PenSquare,
  Send,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/taumail/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/taumail/inbox', label: 'Inbox', icon: Inbox },
  { href: '/taumail/sent', label: 'Sent', icon: Send },
  { href: '/taumail/drafts', label: 'Drafts', icon: FileText },
  { href: '/taumail/spam', label: 'Spam', icon: AlertTriangle },
  { href: '/taumail/trash', label: 'Trash', icon: Trash2 },
  { href: '/taumail/compose', label: 'Compose', icon: PenSquare },
];

export default function TauMailSubNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 mb-8 border border-white/10 bg-white/5 p-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm transition-colors',
              active
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:bg-white/5 hover:text-primary'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
