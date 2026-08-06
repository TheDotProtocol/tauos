'use client';

import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import { inter } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';

type CloudSuiteNavProps = {
  active: 'tau-cloud' | 'tau-talk' | 'tau-id';
};

const links = [
  { id: 'tau-cloud' as const, label: 'Tau Cloud', href: websiteRoutes.tauCloud },
  { id: 'tau-talk' as const, label: 'Tau Talk', href: websiteRoutes.tauTalk },
  { id: 'tau-id' as const, label: 'Tau ID', href: websiteRoutes.tauId },
];

const ctaBySuite: Record<CloudSuiteNavProps['active'], { href: string; label: string; signInHref: string }> = {
  'tau-cloud': { href: '/taucloud/login', label: 'Get Started', signInHref: '/taucloud/login' },
  'tau-talk': { href: '/tautalk/login', label: 'Get Started', signInHref: '/tautalk/login' },
  'tau-id': { href: websiteRoutes.tauIdRegister, label: 'Get Started', signInHref: websiteRoutes.tauIdLogin },
};

export default function CloudSuiteNav({ active }: CloudSuiteNavProps) {
  const cta = ctaBySuite[active];
  return (
    <header className={`${inter.className} sticky top-0 z-50 flex items-center justify-between border-b border-[#262626] bg-[#0f0f0f] px-6 py-6 md:px-20`}>
      <Link href={websiteRoutes.home} className="flex items-center gap-2.5">
        <Image src="/website/logos/tau-core/logo-nav.png" alt="" width={36} height={36} className="rounded-md" />
        <span className="text-lg font-bold">Tau Suite</span>
      </Link>

      <nav className="hidden items-center gap-8 md:flex" aria-label="Tau suite">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={clsx(
              'text-sm transition',
              link.id === active ? 'font-semibold text-[#d4af37]' : 'text-[#8e8e93] hover:text-white',
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href={cta.signInHref}
          className="hidden text-sm font-medium text-[#8e8e93] transition hover:text-white sm:block"
        >
          Sign in
        </Link>
        <Link
          href={cta.href}
          className="rounded-md border border-[#d4af37] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[rgba(212,175,55,0.08)]"
        >
          {cta.label}
        </Link>
      </div>
    </header>
  );
}
