'use client';

import Image from 'next/image';
import Link from 'next/link';
import { inter } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';

export default function AppsSuiteFooter() {
  const columns = [
    {
      title: 'Products',
      links: [
        { label: 'Tau AI', href: websiteRoutes.tauAi },
        { label: 'Tau Browser', href: websiteRoutes.tauBrowser },
        { label: 'Tau Mail', href: websiteRoutes.tauMail },
        { label: 'Tau Cloud', href: websiteRoutes.tauCloud },
      ],
    },
    {
      title: 'Security',
      links: [
        { label: 'Local First', href: websiteRoutes.help },
        { label: 'E2E Encryption', href: websiteRoutes.security },
        { label: 'Zero Telemetry', href: websiteRoutes.privacy },
        { label: 'Audit Logs', href: websiteRoutes.docs },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: websiteRoutes.about },
        { label: 'Open Models', href: websiteRoutes.tauAi },
        { label: 'Careers', href: websiteRoutes.careers },
        { label: 'Contact', href: websiteRoutes.contact },
      ],
    },
  ] as const;

  return (
    <footer className={`${inter.className} border-t border-[#2a2820] px-6 py-16 md:px-20`}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap gap-12">
        <div className="w-full max-w-xs">
          <Image src="/website/logos/tau-core/logo-nav.png" alt="" width={36} height={36} />
          <p className="mt-4 text-lg font-extrabold">TAU</p>
          <p className="mt-4 text-sm leading-relaxed text-[#a0a0a0]">
            A unified suite of sovereign tools designed from the ground up to respect your intelligence, your time, and your privacy.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="min-w-[120px] flex-1">
            <p className="text-xs font-bold uppercase text-[#d4af37]">{col.title}</p>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[#a0a0a0] transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-[1280px] flex-wrap items-center justify-between gap-4 border-t border-[#2a2820] pt-8 text-xs text-[#666]">
        <p>© 2026 Tau Technology Group. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href={websiteRoutes.privacy} className="hover:text-[#a0a0a0]">
            Privacy Policy
          </Link>
          <Link href={websiteRoutes.terms} className="hover:text-[#a0a0a0]">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
