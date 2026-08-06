'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Folder, FolderOpen, Search, Shield, Star, Trash2 } from 'lucide-react';
import { inter } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';
import CloudSuiteFooter from '@/components/website/product/shared/CloudSuiteFooter';
import CloudSuiteNav from '@/components/website/product/shared/CloudSuiteNav';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import ProductSectionHeader from '@/components/website/product/shared/ProductSectionHeader';

const features = [
  {
    title: 'Zero-Knowledge Encryption',
    body: 'We cannot read your files. By design, your encryption keys are derived from your password and never leave your client device.',
  },
  {
    title: 'Seamless Sync',
    body: 'Real-time, peer-to-peer data transport syncs files instantly across all your Tau devices without relying on central relay nodes.',
  },
  {
    title: 'Collaborative',
    body: 'Share secure folders, co-edit documents in real-time, and leverage cryptographic version history with perfect rollback safety.',
  },
  {
    title: 'Self-Hostable',
    body: 'Run Tau Cloud on your own home server, NAS, or private cluster with single-command Docker and Kubernetes manifests.',
  },
] as const;

const plans = [
  {
    name: 'Free',
    price: '15 GB',
    period: '',
    desc: 'For personal exploration',
    features: ['End-to-end encryption', 'Client for 2 devices', 'Standard community support'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$4.99',
    period: '/mo',
    desc: 'Most Popular',
    features: ['1 TB Secure Cloud Storage', 'Unlimited synced devices', 'Cryptographic file audit trail', 'Priority 24/7 technical help'],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '$9.99',
    period: '/user/mo',
    desc: 'For high-throughput teams',
    features: ['Unlimited storage per user', 'Granular team directory sync', 'SAML & SSO Integration', 'Dedicated Account Manager'],
    cta: 'Contact Sales',
    highlighted: false,
  },
] as const;

const files = [
  { name: 'Keys.backup', meta: '12 KB · Encrypted', icon: Shield },
  { name: 'Manifesto.md', meta: '4.2 MB · Text', icon: Folder },
  { name: 'LocalDB_2026.sqlite', meta: '128 MB · Sqlite', icon: Search },
] as const;

export default function TauCloudProductPage() {
  return (
    <ProductPageLayout>
      <CloudSuiteNav active="tau-cloud" />

      <section className="px-6 pb-24 pt-20 md:px-20">
        <div className="mx-auto flex max-w-[960px] flex-col items-center text-center">
          <Image src="/website/logos/tau-cloud/logo-primary.png" alt="" width={80} height={80} className="rounded-xl" />
          <p className={`${inter.className} mt-6 text-sm font-bold uppercase text-[#d4af37]`}>Storage</p>
          <h1 className="mt-3 font-[family-name:var(--font-instrument-serif)] text-5xl md:text-[60px]">Tau Cloud</h1>
          <p className="mt-6 max-w-[600px] text-xl leading-relaxed text-[#8e8e93]">
            Your files. Your servers. Your rules. Secure decentralized storage with uncompromised encryption.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/taucloud/login" className="rounded-md bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#0f0f0f] hover:bg-[#e0bc4a]">
              Get Tau Cloud
            </Link>
            <Link href={websiteRoutes.security} className="rounded-md bg-[#171717] px-6 py-3 text-sm font-semibold hover:bg-[#222]">
              Read Security Specs
            </Link>
          </div>

          {/* Dashboard mockup — Figma 31:1920 */}
          <div className="mt-16 flex w-full max-w-[1000px] overflow-hidden rounded-xl border border-[#262626] bg-[#171717] shadow-[0_20px_40px_rgba(0,0,0,0.7)]">
            <div className="hidden w-[240px] shrink-0 flex-col gap-6 border-r border-[#262626] p-6 sm:flex">
              <div>
                <p className="text-[11px] font-semibold uppercase text-[#8e8e93]">Storage Status</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-sm font-bold">34.2 GB</span>
                  <span className="text-[11px] text-[#8e8e93]">of 100 GB</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-[#48484a]">
                  <div className="h-full w-[34%] rounded-full bg-[#d4af37]" />
                </div>
              </div>
              <div className="space-y-3 text-[13px]">
                <p className="text-[11px] font-semibold uppercase text-[#8e8e93]">My Drive</p>
                <div className="flex items-center gap-2 text-white"><FolderOpen className="size-4 text-[#d4af37]" /> Secure Vault</div>
                <div className="flex items-center gap-2 text-[#8e8e93]"><Folder className="size-4" /> Shared Folders</div>
                <div className="flex items-center gap-2 text-[#8e8e93]"><Folder className="size-4" /> Backups</div>
                <div className="flex items-center gap-2 text-[#8e8e93]"><Trash2 className="size-4" /> Trash</div>
              </div>
            </div>
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Secure Vault</h3>
                <div className="flex items-center gap-2 rounded-md bg-[#222] px-3 py-1.5 text-xs text-[#8e8e93]">
                  <Search className="size-3.5" /> Search Vault
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {files.map((f) => (
                  <div key={f.name} className="rounded-lg border border-[#262626] bg-[#222] p-4">
                    <f.icon className="size-6 text-[#d4af37]" />
                    <p className="mt-3 truncate text-sm font-semibold">{f.name}</p>
                    <p className="text-[11px] text-[#8e8e93]">{f.meta}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#171717] px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[1280px]">
          <ProductSectionHeader badge="Architecture" title="Engineered for Sovereignty" muted />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-lg border border-[#262626] bg-[#0f0f0f] p-8">
                <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-[rgba(212,175,55,0.08)]">
                  <Star className="size-5 text-[#d4af37]" />
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
          <ProductSectionHeader badge="Pricing" title="Flexible Plans for Sovereign Storage" muted />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-10 ${
                  plan.highlighted ? 'border-[#d4af37] bg-[#171717] shadow-[0_12px_12px_rgba(212,175,55,0.08)]' : 'border-[#262626] bg-[#171717]'
                }`}
              >
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className={`mt-2 text-[13px] ${plan.highlighted ? 'text-[#d4af37]' : 'text-[#8e8e93]'}`}>{plan.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-[#8e8e93]">{plan.period}</span>
                </div>
                <ul className="mt-8 space-y-3 text-sm text-[#8e8e93]">
                  {plan.features.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
                <Link
                  href={plan.highlighted ? websiteRoutes.tauCloud : websiteRoutes.contact}
                  className={`mt-8 block w-full rounded-md py-3 text-center text-sm font-semibold ${
                    plan.highlighted
                      ? 'bg-[#d4af37] text-[#0f0f0f] hover:bg-[#e0bc4a]'
                      : 'border border-[#d4af37] hover:bg-[rgba(212,175,55,0.08)]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CloudSuiteFooter brandName="Tau Cloud" />
    </ProductPageLayout>
  );
}
