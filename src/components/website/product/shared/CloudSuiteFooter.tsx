'use client';

import Image from 'next/image';
import Link from 'next/link';
import { inter } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';

type CloudSuiteFooterProps = {
  brandName: string;
};

export default function CloudSuiteFooter({ brandName }: CloudSuiteFooterProps) {
  const columns = [
    {
      title: 'Products',
      links: [
        { label: 'Tau Cloud', href: websiteRoutes.tauCloud },
        { label: 'Tau Talk', href: websiteRoutes.tauTalk },
        { label: 'Tau ID', href: websiteRoutes.tauId },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: websiteRoutes.docs },
        { label: 'Self-Hosting Guide', href: websiteRoutes.docs },
        { label: 'API Reference', href: websiteRoutes.docs },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: websiteRoutes.privacy },
        { label: 'Terms of Service', href: websiteRoutes.terms },
        { label: 'Security Audits', href: websiteRoutes.security },
      ],
    },
  ] as const;

  return (
    <footer className={`${inter.className} border-t border-[#262626] px-6 pb-10 pt-20 md:px-20`}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5">
            <Image src="/website/logos/tau-core/logo-nav.png" alt="" width={32} height={32} className="rounded" />
            <span className="font-bold">{brandName}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#8e8e93]">
            Next-generation decentralized infrastructure designed for complete digital autonomy. Your data remains entirely in your control.
          </p>
        </div>
        <div className="flex flex-wrap gap-16">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase text-[#d4af37]">{col.title}</p>
              <ul className="mt-3 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[#8e8e93] transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-[1280px] flex-wrap items-center justify-between gap-4 text-xs text-[#48484a]">
        <p>© 2026 Tau Suite. Built for Digital Sovereignty.</p>
        <p>Distributed worldwide.</p>
      </div>
    </footer>
  );
}
