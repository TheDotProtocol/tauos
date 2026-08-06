'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fingerprint } from 'lucide-react';
import { inter } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';
import CloudSuiteFooter from '@/components/website/product/shared/CloudSuiteFooter';
import CloudSuiteNav from '@/components/website/product/shared/CloudSuiteNav';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import ProductSectionHeader from '@/components/website/product/shared/ProductSectionHeader';

const features = [
  {
    title: 'Single Sign-On',
    body: 'No more disconnected credentials. One cryptographically audited login grants you seamless entry to every decentralized Tau service.',
  },
  {
    title: 'Passwordless Options',
    body: 'Ditch passwords. Leverage secure hardware keys, passkeys, and multi-device biometrics to establish trust safely.',
  },
  {
    title: 'Privacy Controls',
    body: 'Granular control at your fingertips. Approve or revoke permissions per app, monitor data requests, and lock down secrets instantly.',
  },
  {
    title: 'Data Portability',
    body: 'Complete platform agility. Export every byte of stored diagnostic data or delete your cryptographic profile entirely. Your choice.',
  },
] as const;

const steps = [
  { num: 1, title: 'Create ID', body: 'Derive your sovereign cryptographic keys locally.' },
  { num: 2, title: 'Connect Services', body: 'Link your ID securely with a single cryptographic tap.' },
  { num: 3, title: 'Take Control', body: 'Own your logs, access credentials, and network footprint.' },
] as const;

export default function TauIdProductPage() {
  return (
    <ProductPageLayout>
      <CloudSuiteNav active="tau-id" />

      <section className="px-6 pb-24 pt-20 md:px-20">
        <div className="mx-auto flex max-w-[960px] flex-col items-center text-center">
          <Image src="/website/logos/tau-id/logo-primary.png" alt="" width={80} height={80} className="rounded-xl" />
          <p className={`${inter.className} mt-6 text-sm font-bold uppercase text-[#d4af37]`}>Identity</p>
          <h1 className="mt-3 font-[family-name:var(--font-instrument-serif)] text-5xl md:text-[60px]">Tau ID</h1>
          <p className="mt-6 max-w-[600px] text-xl leading-relaxed text-[#8e8e93]">
            One identity. Complete control. Decouple your digital footprint from corporations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={websiteRoutes.tauIdRegister} className="rounded-md bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#0f0f0f] hover:bg-[#e0bc4a]">
              Create Your Tau ID
            </Link>
            <Link href={websiteRoutes.tauIdLogin} className="rounded-md bg-[#171717] px-6 py-3 text-sm font-semibold hover:bg-[#222]">
              Sign In
            </Link>
            <Link href={websiteRoutes.docs} className="rounded-md border border-[#262626] bg-transparent px-6 py-3 text-sm font-semibold hover:bg-[#171717]">
              Explore SSO Protocols
            </Link>
          </div>

          {/* Identity graphic — Figma 31:2219 */}
          <div className="relative mt-16 flex h-[400px] w-full max-w-[1000px] items-center justify-center overflow-hidden rounded-xl border border-[#262626] bg-[#171717]">
            <div className="absolute size-[280px] rounded-full border border-[rgba(212,175,55,0.15)]" />
            <div className="absolute size-[220px] rounded-full border border-[rgba(212,175,55,0.25)]" />
            <div className="absolute size-[160px] rounded-full border border-[rgba(212,175,55,0.35)]" />
            <div className="relative flex size-20 items-center justify-center rounded-[40px] border border-[#d4af37] bg-[rgba(212,175,55,0.08)] shadow-[0_0_16px_rgba(212,175,55,0.2)]">
              <Fingerprint className="size-9 text-[#d4af37]" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#171717] px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[1280px]">
          <ProductSectionHeader badge="Principles" title="Your Digital DNA, Protected" muted />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-lg border border-[#262626] bg-[#0f0f0f] p-8">
                <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-[rgba(212,175,55,0.08)]">
                  <Fingerprint className="size-5 text-[#d4af37]" />
                </div>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8e8e93]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[1280px]">
          <ProductSectionHeader badge="Workflow" title="Step Into Autonomy" muted />
          <div className="mt-16 flex flex-wrap items-start justify-center gap-4 md:gap-0">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-start">
                <div className="flex max-w-[220px] flex-col items-center text-center">
                  <div className="flex size-16 items-center justify-center rounded-[32px] border border-[#d4af37] bg-[#171717] text-xl font-bold text-[#d4af37] shadow-[0_4px_6px_rgba(212,175,55,0.07)]">
                    {step.num}
                  </div>
                  <h3 className="mt-6 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#8e8e93]">{step.body}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="mx-4 mt-8 hidden h-px w-[80px] bg-[#262626] md:block lg:w-[120px]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CloudSuiteFooter brandName="Tau ID" />
    </ProductPageLayout>
  );
}
