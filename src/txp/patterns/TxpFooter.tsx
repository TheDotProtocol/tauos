import Link from 'next/link';
import Logo from '@/components/marketing/Logo';
import { TxpContainer } from '@/txp/components/primitives';
import { txpNav } from '@/content/txp/navigation';
import { site } from '@/content/site';

const legalLinks = [
  { label: 'Privacy', href: '/legal/privacy' },
  { label: 'Terms', href: '/legal/terms' },
  { label: 'DPA', href: '/legal/dpa' },
  { label: 'Contact', href: '/contact' },
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/tauos' },
  { label: 'X', href: 'https://x.com/tauosorg' },
  { label: 'Documentation', href: '/docs' },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-yellow-400/90 mb-5 md:mb-6">{title}</p>
      <ul className="space-y-3 md:space-y-3.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="text-sm text-gray-400 hover:text-yellow-400 transition-colors duration-300"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TxpFooter() {
  const productLinks = txpNav.megaMenus.products.columns.flatMap((c) => c.links).slice(0, 8);
  const devLinks = [
    txpNav.megaMenus.developers.columns[0].links[0],
    { label: 'Documentation', href: '/docs' },
    { label: 'SDK', href: '/developers' },
    { label: 'API', href: '/docs/api-reference' },
    txpNav.megaMenus.developers.columns[1].links[0],
  ];
  const businessLinks = txpNav.megaMenus.business.columns.flatMap((c) => c.links).slice(0, 4);

  return (
    <footer className="relative mt-auto border-t border-white/[0.06] bg-gradient-to-b from-[hsl(var(--txp-surface-0))] to-black">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/25 to-transparent" />

      <TxpContainer className="pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:justify-between lg:gap-20 xl:gap-28">
          {/* Brand lobby — left */}
          <div className="shrink-0 lg:max-w-sm xl:max-w-md">
            <Logo />
            <p className="mt-6 text-base md:text-lg text-gray-400 leading-[1.8]">
              {site.footer.blurb}
            </p>
            <p className="mt-6 text-sm text-gray-500 leading-relaxed max-w-sm">
              Privacy first. AI native. Built for humanity — and built to last.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/downloads"
                className="inline-flex items-center rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-black hover:bg-yellow-300 transition-colors duration-300"
              >
                Download
              </Link>
              <Link
                href="/beta"
                className="inline-flex items-center rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-white hover:border-yellow-400/35 hover:text-yellow-400 transition-colors duration-300"
              >
                Join Beta
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              {socialLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-xs text-gray-500 hover:text-yellow-400 transition-colors duration-300 tracking-wide"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns — right */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-12 sm:grid-cols-4 sm:gap-x-12 lg:gap-x-14 xl:gap-x-16">
            <FooterColumn title="Products" links={productLinks} />
            <FooterColumn title="Developers" links={devLinks} />
            <FooterColumn title="Business" links={businessLinks} />
            <FooterColumn title="Company" links={[...site.footer.company]} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 md:mt-24 pt-10 border-t border-white/[0.06]">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
            <p className="text-xs text-gray-500 shrink-0">{site.copyright}</p>

            <nav
              className="flex flex-wrap items-center gap-x-8 gap-y-3 md:justify-center md:flex-1"
              aria-label="Legal"
            >
              {legalLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-xs text-gray-500 hover:text-yellow-400 transition-colors duration-300"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <p className="text-xs text-gray-600 shrink-0 md:text-right tracking-wide">
              TXP · Tau Design System V1
            </p>
          </div>
        </div>
      </TxpContainer>
    </footer>
  );
}
