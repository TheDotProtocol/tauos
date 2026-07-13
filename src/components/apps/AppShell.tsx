'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/marketing/Logo';
import { site } from '@/content/site';
import {
  Mail,
  Cloud,
  Fingerprint,
  Store,
  Globe,
  Sparkles,
  Download,
  Menu,
  X,
  MessageCircle,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const appLinks = [
  { href: '/taumail', label: 'Tau Mail', icon: Mail },
  { href: '/taucloud', label: 'Tau Cloud', icon: Cloud },
  { href: '/tauid', label: 'Tau ID', icon: Fingerprint },
  { href: '/taustore', label: 'Tau Store', icon: Store },
  { href: '/taubrowser', label: 'Tau Browser', icon: Globe },
  { href: '/tautalk', label: 'Tau Talk', icon: MessageCircle },
  { href: '/tauai', label: 'Tau AI', icon: Sparkles },
];

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  /** Marketing-style full bleed (no max-width card) */
  variant?: 'app' | 'marketing';
};

export default function AppShell({
  children,
  title,
  subtitle,
  variant = 'app',
}: AppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Logo size="sm" />

          <nav className="hidden lg:flex items-center gap-1">
            {appLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-colors',
                  pathname.startsWith(href)
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-primary hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <Link
              href="/download"
              className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-md text-sm bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
            >
              <Download className="w-4 h-4" />
              Download
            </Link>
          </nav>

          <button
            type="button"
            className="lg:hidden p-2 text-muted-foreground hover:text-primary"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1">
            {appLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm',
                  pathname.startsWith(href) ? 'bg-primary/15 text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <Link
              href="/download"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-primary text-primary-foreground font-semibold mt-1"
            >
              <Download className="w-4 h-4" />
              Download TauOS
            </Link>
          </nav>
        )}
      </header>

      {(title || subtitle) && (
        <div className="border-b border-white/5 bg-[#050505]">
          <div className="container mx-auto px-4 sm:px-6 py-10">
            {title && (
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-white via-[#FFF0B3] to-primary bg-clip-text text-transparent">
                {title}
              </h1>
            )}
            {subtitle && <p className="mt-2 text-muted-foreground max-w-2xl">{subtitle}</p>}
          </div>
        </div>
      )}

      <main className={variant === 'app' ? 'container mx-auto px-4 sm:px-6 py-8' : ''}>
        {children}
      </main>

      <footer className="mt-auto border-t border-white/10 py-8 text-center text-sm text-muted-foreground">
        <p>{site.copyright}</p>
      </footer>
    </div>
  );
}
