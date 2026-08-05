'use client';

import Link from 'next/link';
import WebsiteShell from '@/components/website/layout/WebsiteShell';
import { websiteRoutes } from '@/lib/website/routes';

type MarketingWebsitePageProps = {
  badge: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  cta?: { label: string; href: string };
};

export default function MarketingWebsitePage({
  badge,
  title,
  description,
  children,
  cta,
}: MarketingWebsitePageProps) {
  return (
    <WebsiteShell>
      <section className="px-6 pb-24 pt-32 md:px-20">
        <div className="mx-auto max-w-[800px] text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-[#d4af37]">{badge}</p>
          <h1 className="mt-4 font-[family-name:var(--font-instrument-serif)] text-5xl md:text-6xl">{title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-[rgba(255,255,255,0.5)]">{description}</p>
          {cta && (
            <Link
              href={cta.href}
              className="mt-10 inline-block rounded-lg bg-[#d4af37] px-8 py-4 text-sm font-bold text-[#0a0a0b] hover:bg-[#e0bc4a]"
            >
              {cta.label}
            </Link>
          )}
        </div>
        {children && <div className="mx-auto mt-20 max-w-[960px]">{children}</div>}
      </section>
    </WebsiteShell>
  );
}
