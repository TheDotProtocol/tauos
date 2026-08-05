'use client';

import Link from 'next/link';
import { clsx } from 'clsx';
import { ChevronDown, Menu, Search, Sun, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TauLogo from '@/components/website/ui/TauLogo';
import ProductsMegaMenu from '@/components/website/layout/ProductsMegaMenu';
import { inter } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';

const navLinks = [
  { label: 'Home', href: websiteRoutes.home },
  { label: 'Tau Core', href: websiteRoutes.tauCore },
  { label: 'Products', href: '#', hasMenu: 'products' as const },
  { label: 'Developer', href: websiteRoutes.developer },
  { label: 'Startup', href: websiteRoutes.tauStartup },
  { label: 'Roadmap', href: websiteRoutes.roadmap },
  { label: 'Download', href: websiteRoutes.download },
  { label: 'About', href: websiteRoutes.about },
] as const;

export default function TauWebsiteNavigation() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProductsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header
        ref={navRef}
        className={clsx(
          `${inter.className} fixed inset-x-0 top-0 z-50 transition-all duration-300`,
          solid || productsOpen
            ? 'border-b border-[rgba(255,255,255,0.07)] bg-[#0f0f0f]'
            : 'bg-[#0a0a0b]/80 backdrop-blur-sm',
        )}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-12">
          <TauLogo size="nav" />

          <nav className="hidden items-center gap-6 xl:flex" aria-label="Main">
            {navLinks.map((link) => {
              const isProducts = link.label === 'Products';
              const active = isProducts && productsOpen;

              if ('hasMenu' in link && link.hasMenu === 'products') {
                return (
                  <button
                    key={link.label}
                    type="button"
                    aria-expanded={productsOpen}
                    aria-haspopup="true"
                    onClick={() => setProductsOpen(!productsOpen)}
                    className={clsx(
                      'flex items-center gap-1 text-sm font-medium transition',
                      active ? 'text-[#d4af37]' : 'text-white hover:text-[#d4af37]',
                    )}
                  >
                    {link.label}
                    <ChevronDown className={clsx('size-3 transition', active && 'rotate-180')} />
                  </button>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-white transition hover:text-[#d4af37]"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-5 xl:flex">
            <button type="button" aria-label="Search" className="text-white/80 hover:text-white">
              <Search className="size-5" />
            </button>
            <button type="button" aria-label="Toggle theme" className="text-white/80 hover:text-white">
              <Sun className="size-5" />
            </button>
            <Link
              href={websiteRoutes.download}
              className="rounded-xl bg-[#d4af37] px-5 py-2.5 text-sm font-semibold text-[#0f0f0f] hover:bg-[#e5c348]"
            >
              Get Tau
            </Link>
          </div>

          <div className="flex items-center gap-3 xl:hidden">
            <Link
              href={websiteRoutes.download}
              className="rounded-lg bg-[#d4af37] px-3.5 py-1.5 text-xs font-semibold text-[#0f0f0f]"
            >
              Get Tau
            </Link>
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white"
            >
              {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {productsOpen && (
          <div className="hidden border-t border-[#d4af37] xl:block">
            <ProductsMegaMenu onNavigate={() => setProductsOpen(false)} />
          </div>
        )}
      </header>

      {/* Spacer when mega menu open so content isn't hidden under fixed header */}
      {productsOpen && <div className="hidden h-[420px] xl:block" aria-hidden />}

      {mobileOpen && (
        <div className={`${inter.className} fixed inset-0 z-40 overflow-y-auto bg-[#0a0a0b] pt-20 xl:hidden`}>
          <nav className="flex flex-col gap-1 px-6 py-4" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href === '#' ? websiteRoutes.experience : link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-[rgba(255,255,255,0.07)] py-3.5 text-base font-medium text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
