'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Download, Menu, Moon, Search, Sun, X } from 'lucide-react';
import Logo from '@/components/marketing/Logo';
import { Button } from '@/components/ui/button';
import { txpNav } from '@/content/txp/navigation';
import { cn } from '@/lib/utils';

function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = document.documentElement;
    setTheme(root.classList.contains('light') ? 'light' : 'dark');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(next);
    document.documentElement.style.colorScheme = next;
    localStorage.setItem('tau-theme', next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export default function TxpNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const megaIds = ['products', 'business', 'developers', 'enterprise'] as const;

  return (
    <motion.header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      )}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="mx-auto flex h-[4.5rem] md:h-20 w-full max-w-[var(--txp-container-wide)] items-center px-5 sm:px-8 lg:px-10">
        <div className="shrink-0">
          <Logo />
        </div>

        <nav className="hidden lg:flex flex-1 items-center justify-evenly px-6 xl:px-10 2xl:px-14 min-w-0">
          {txpNav.primary.map((item) => {
            const isMega = megaIds.includes(item.id as (typeof megaIds)[number]);
            if (!isMega && 'href' in item && item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="px-3 xl:px-4 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-300 rounded-lg whitespace-nowrap"
                >
                  {item.label}
                </Link>
              );
            }
            if (!isMega) return null;
            const menu = txpNav.megaMenus[item.id as keyof typeof txpNav.megaMenus];
            return (
              <div key={item.id} className="relative">
                <button
                  type="button"
                  className={cn(
                    'flex items-center gap-1 px-3 xl:px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg whitespace-nowrap',
                    openMenu === item.id ? 'text-yellow-400 bg-white/5' : 'text-gray-300 hover:text-yellow-400'
                  )}
                  onMouseEnter={() => setOpenMenu(item.id)}
                >
                  {item.label}
                  <ChevronDown className={cn('w-4 h-4 transition-transform', openMenu === item.id && 'rotate-180')} />
                </button>
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:flex shrink-0 items-center gap-2 xl:gap-3">
          <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors" aria-label="Search">
            <Search className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground px-2">EN</span>
          <ThemeToggle />
          <Button asChild variant="ghost" className="font-semibold">
            <Link href={txpNav.actions.join.href}>{txpNav.actions.join.label}</Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:shadow-lg hover:shadow-yellow-400/20 border-0">
            <Link href={txpNav.actions.download.href}>
              <Download className="w-4 h-4 mr-2" />
              {txpNav.actions.download.label}
            </Link>
          </Button>
        </div>

        <button type="button" className="lg:hidden ml-auto p-2 text-foreground" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {openMenu && txpNav.megaMenus[openMenu as keyof typeof txpNav.megaMenus] ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="hidden lg:block absolute left-0 right-0 top-full border-b border-white/5 bg-[hsl(var(--txp-surface-1))]/95 backdrop-blur-2xl"
            onMouseEnter={() => setOpenMenu(openMenu)}
          >
            <div className="mx-auto max-w-[var(--txp-container-wide)] px-6 py-10 grid grid-cols-2 xl:grid-cols-4 gap-10">
              {txpNav.megaMenus[openMenu as keyof typeof txpNav.megaMenus].columns.map((col) => (
                <div key={col.title}>
                  <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-4">{col.title}</p>
                  <ul className="space-y-3">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="group block"
                          onClick={() => setOpenMenu(null)}
                        >
                          <span className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors">
                            {link.label}
                          </span>
                          {link.description ? (
                            <span className="block text-xs text-gray-400 mt-0.5 group-hover:text-gray-300">{link.description}</span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 lg:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <Logo />
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-5rem)]">
              {megaIds.map((id) => (
                <div key={id}>
                  <p className="text-primary text-xs uppercase tracking-widest mb-3">{id}</p>
                  <div className="space-y-2 pl-2">
                    {txpNav.megaMenus[id].columns.flatMap((c) =>
                      c.links.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          className="block py-2 text-foreground"
                          onClick={() => setMobileOpen(false)}
                        >
                          {l.label}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              ))}
              <Link href="/downloads" className="block py-2" onClick={() => setMobileOpen(false)}>Downloads</Link>
              <Link href="/about" className="block py-2" onClick={() => setMobileOpen(false)}>About</Link>
              <div className="flex gap-3 pt-4">
                <Button asChild className="flex-1">
                  <Link href={txpNav.actions.join.href}>Join Tau</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 border-primary/30">
                  <Link href={txpNav.actions.download.href}>Download</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
