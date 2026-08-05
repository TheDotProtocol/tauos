import Link from 'next/link';
import Image from 'next/image';
import { footerLinks, websiteRoutes } from '@/lib/website/routes';

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-xs font-bold uppercase text-white">{title}</p>
      <ul className="mt-4 space-y-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-[13px] text-[rgba(255,255,255,0.5)] transition hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const socialLinks = [
  { icon: '/website/icons/footer/instagram.svg', href: 'https://instagram.com', label: 'Instagram' },
  { icon: '/website/icons/footer/twitter.svg', href: 'https://twitter.com', label: 'Twitter' },
  { icon: '/website/icons/footer/github.svg', href: 'https://github.com/TheDotProtocol/tauos', label: 'GitHub' },
  { icon: '/website/icons/footer/circle-x.svg', href: 'https://x.com', label: 'X' },
] as const;

/** Figma 4:994 — single-row footer brick */
export default function TauWebsiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[rgba(255,255,255,0.07)] bg-[#0a0a0b] pt-20 pb-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px">
        <div className="relative h-full w-full">
          <Image src="/website/images/footer/gold-divider.svg" alt="" fill className="object-cover" />
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[1200px] -translate-x-1/2 translate-y-1/2 opacity-30">
        <Image src="/website/images/glow/footer-glow.svg" alt="" fill className="object-contain" />
      </div>

      {/* Figma footer-columns-container — all 7 columns in one horizontal row */}
      <div className="relative mx-auto max-w-[1440px] overflow-x-auto px-12 xl:px-[120px]">
        <div className="flex min-w-[1200px] gap-6">
        <div className="w-full max-w-[280px] shrink-0">
          <Link href={websiteRoutes.home} className="mb-6 flex items-center gap-3">
            <Image src="/website/logos/tau-core/logo-nav.png" alt="" width={28} height={28} className="size-7 rounded-lg object-contain" />
            <span className="text-base font-bold text-white">TAU</span>
          </Link>
          <p className="text-[13px] leading-[22px] text-[rgba(255,255,255,0.5)]">
            Designed with purpose. Built for people. Made by AR Holdings Group.
          </p>
          <p className="mt-3 text-[11px] text-[rgba(255,255,255,0.3)]">Sovereign Operational Matrix © 2026.</p>
        </div>
        <FooterColumn title="Products" links={footerLinks.products} />
        <FooterColumn title="Company" links={footerLinks.company} />
        <FooterColumn title="Developers" links={footerLinks.developers} />
        <FooterColumn title="Support" links={footerLinks.support} />
        <FooterColumn title="Legal" links={footerLinks.legal} />
        <FooterColumn title="Resources" links={footerLinks.resources} />
        </div>
      </div>

      <div className="relative mx-auto mt-16 flex max-w-[1440px] flex-col items-center justify-between gap-6 border-t border-[rgba(255,255,255,0.07)] px-12 py-6 xl:flex-row xl:px-[120px]">
        <div className="flex gap-4">
          {socialLinks.map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="rounded-full bg-[rgba(255,255,255,0.03)] p-2 transition hover:bg-[rgba(255,255,255,0.06)]"
            >
              <Image src={icon} alt="" width={16} height={16} className="size-4" />
            </a>
          ))}
        </div>
        <p className="text-center text-xs text-[rgba(255,255,255,0.3)] xl:text-left">
          © 2026 AR Holdings Group. Sovereign systems configured under air-gapped isolation protocols.
        </p>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-[13px] text-[rgba(255,255,255,0.5)]">
            <Image src="/website/icons/footer/globe.svg" alt="" width={14} height={14} className="size-3.5" />
            English (US)
          </span>
          <div className="flex items-center gap-1.5 rounded-full bg-[#161619] p-[3px]">
            <span className="rounded-full bg-[rgba(212,175,55,0.08)] p-1">
              <Image src="/website/icons/footer/moon.svg" alt="" width={12} height={12} className="size-3" />
            </span>
            <span className="p-1">
              <Image src="/website/icons/footer/sun.svg" alt="" width={12} height={12} className="size-3 opacity-40" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
