'use client';

import Image from 'next/image';
import Link from 'next/link';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import CompanyNav from '@/components/website/marketing/shared/CompanyNav';
import CompanyFooter from '@/components/website/marketing/shared/CompanyFooter';
import SectionLabel from '@/components/website/marketing/shared/SectionLabel';
import { inter, instrumentSerif } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';
import { websiteRoutes } from '@/lib/website/routes';

const feed = [
  { tag: 'PARTNERSHIP', date: 'Feb 18, 2026', title: 'Tau Partners with Secure Hardware Alliance for Physical Enclave Standard', body: 'A collaborative effort to standardize zero-knowledge CPU execution states at the silicon level, ensuring core privacy primitives can never be overridden by OS layers.' },
  { tag: 'TECHNICAL', date: 'Jan 29, 2026', title: 'Tau Testnet Core-V4 Goes Live with 10k Verified Validator Nodes', body: 'The final major milestone before mainnet launch achieves full formal verification for sovereign consensus layers under simulated extreme Byzantine conditions.' },
  { tag: 'GRANTS', date: 'Dec 14, 2025', title: 'Tau Association Announces $45M Dev Grant Pool for Decentralized OS Research', body: 'Focusing on funding independent teams building compiler toolchains, device drivers, and userland applications directly targeting the Tau sovereign platform.' },
  { tag: 'FUNDING', date: 'Nov 03, 2025', title: 'Sovereign Tech Capital Leads Tau Series A to Fund Native Kernel Hardening', body: 'A capital injection dedicated to scaling the core operating systems engineering team and finalizing the microkernel audit roadmap.' },
  { tag: 'SECURITY', date: 'Sep 22, 2025', title: 'Microkernel Architecture Audit Completed with Zero Critical Vulnerabilities', body: 'Trail of Bits concludes comprehensive manual code review and automated symbolic execution audit of Tau microkernel architecture.' },
] as const;

const assets = [
  { title: 'Logo Pack', desc: 'High-resolution vector assets for all Tau brands.', size: 'ZIP (4.2 MB)' },
  { title: 'Brand Guidelines', desc: 'Typography, grid details, and palette rules.', size: 'ZIP (1.8 MB)' },
  { title: 'Product Screenshots', desc: 'Desktop and mobile shell interface captures.', size: 'ZIP (12.4 MB)' },
  { title: 'Executive Photos', desc: 'Dr. Holloway and executive portraits.', size: 'ZIP (18.1 MB)' },
] as const;

export default function PressPage() {
  return (
    <ProductPageLayout>
      <CompanyNav active="press" />

      <section className={`${inter.className} px-6 pb-20 pt-28 md:px-20`}>
        <div className="mx-auto max-w-[1280px]">
          <SectionLabel>Newsroom</SectionLabel>
          <h1 className={`${instrumentSerif.className} mt-6 text-5xl font-extrabold md:text-6xl`}>Press</h1>
          <p className="mt-6 max-w-2xl text-[22px] leading-relaxed text-[#a0a0a0]">
            The latest announcements, technical progress updates, and media assets from Tau OS.
          </p>
        </div>
      </section>

      <section className={`${inter.className} px-6 pb-20 md:px-20`}>
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-12 rounded-xl border border-[#2a2820] bg-[#181818] p-10 lg:grid-cols-[400px_1fr] lg:items-center">
            <div className="relative h-[260px] overflow-hidden rounded-lg">
              <Image src={marketingAssets.press.featured} alt="" fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="rounded bg-[rgba(212,175,55,0.12)] px-3 py-1.5 text-xs font-bold text-[#d4af37]">ANNOUNCEMENT</span>
                <span className="text-sm text-[#a0a0a0]">March 04, 2026</span>
              </div>
              <h2 className={`${instrumentSerif.className} mt-5 text-3xl font-bold leading-snug`}>
                Tau Launches Open Source Initiative Project Grayscale
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#a0a0a0]">
                A public microkernel framework designed to standardize secure execution across commodity x86 and ARM platforms, bringing formal verification methods to system operators globally.
              </p>
              <Link href={websiteRoutes.projectGrayscale} className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-[#d4af37]">
                Read Announcement <Image src={marketingAssets.press.arrowRight} alt="" width={16} height={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={`${inter.className} border-y border-[#2a2820] bg-[#181818] px-6 py-24 md:px-20`}>
        <div className="mx-auto max-w-[1280px]">
          <SectionLabel>Chronological Feed</SectionLabel>
          <h2 className={`${instrumentSerif.className} mt-4 text-4xl font-bold`}>All Updates</h2>
          <div className="mt-12 space-y-5">
            {feed.map((item) => (
              <article key={item.title} className="rounded-lg border border-[#2a2820] bg-[#0f0f0f] p-8">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded bg-[#222] px-2.5 py-1 text-[11px] font-bold text-[#a0a0a0]">{item.tag}</span>
                  <time className="text-sm text-[#666]">{item.date}</time>
                </div>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#a0a0a0]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${inter.className} px-6 py-24 md:px-20`}>
        <div className="mx-auto max-w-[1280px]">
          <SectionLabel>Media Kit</SectionLabel>
          <h2 className={`${instrumentSerif.className} mt-4 text-4xl font-bold`}>Brand assets</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {assets.map((asset) => (
              <div key={asset.title} className="rounded-lg border border-[#2a2820] bg-[#181818] p-8">
                <h3 className="text-lg font-semibold">{asset.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#a0a0a0]">{asset.desc}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[13px] text-[#666]">{asset.size}</span>
                  <button type="button" className="flex size-9 items-center justify-center rounded bg-[rgba(212,175,55,0.12)]">
                    <Image src={marketingAssets.press.download} alt="" width={16} height={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-lg border border-[#2a2820] bg-[#181818] p-10">
            <div>
              <h3 className="text-xl font-semibold">Are you a member of the press?</h3>
              <p className="mt-2 text-[15px] text-[#a0a0a0]">For inquiries, interview requests, or custom asset needs, contact our media team.</p>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <a href="mailto:press@tauos.org" className="text-base font-semibold text-[#d4af37]">press@tauos.org</a>
              <Link href={websiteRoutes.contact} className="rounded border border-[#d4af37] px-6 py-3.5 text-sm font-semibold text-[#d4af37]">
                Media Inquiry Form
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CompanyFooter />
    </ProductPageLayout>
  );
}
