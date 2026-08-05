'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Apple,
  CheckCircle2,
  EyeOff,
  Globe,
  Lock,
  Monitor,
  RefreshCw,
  ShieldCheck,
  XCircle,
  Zap,
} from 'lucide-react';
import { inter } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';
import AppsSuiteFooter from '@/components/website/product/shared/AppsSuiteFooter';
import AppsSuiteNav from '@/components/website/product/shared/AppsSuiteNav';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import ProductSectionHeader from '@/components/website/product/shared/ProductSectionHeader';

const features = [
  {
    icon: EyeOff,
    title: 'No Tracking',
    body: 'Aggressive built-in ad and tracker blocking. Prevent fingerprints and block analytics scripts at connection-level.',
  },
  {
    icon: RefreshCw,
    title: 'Ecosystem Sync',
    body: 'Securely synchronize your open tabs, historical logs, passwords, and bookmarks across all Tau devices seamlessly.',
  },
  {
    icon: Zap,
    title: 'Peak Speed',
    body: 'Chromium-based engine stripped of every Google tracker and optimized for raw compilation and rendering performance.',
  },
  {
    icon: ShieldCheck,
    title: 'Built-in VPN',
    body: 'Route your traffic through multi-hop secure nodes directly from the browser window. Zero logs, zero subscription cost.',
  },
] as const;

const comparisonRows = [
  { feature: 'Built-in Tracker Blocking', tau: true, chrome: false, firefox: true, safari: true },
  { feature: 'Zero Telemetry & Analytics', tau: true, chrome: false, firefox: false, safari: false },
  { feature: 'Integrated Free VPN', tau: true, chrome: false, firefox: false, safari: false },
  { feature: 'Chromium Engine Speed', tau: true, chrome: true, firefox: false, safari: false },
  { feature: 'Local Password Sync', tau: true, chrome: false, firefox: false, safari: false },
] as const;

const downloads = [
  {
    icon: Apple,
    os: 'macOS',
    desc: 'Optimized for Apple Silicon M1/M2/M3 and Intel',
    version: 'v1.2.3 (ARM64 & x64)',
  },
  {
    icon: Monitor,
    os: 'Windows',
    desc: 'Native executable with silent secure background updates',
    version: 'v1.2.3 (x64 EXE / MSI)',
  },
  {
    icon: Globe,
    os: 'Linux',
    desc: 'Verified AppImage, Flatpak, and snap configurations',
    version: 'v1.2.3 (x86_64 AppImage)',
  },
] as const;

function CheckIcon({ ok, gold }: { ok: boolean; gold?: boolean }) {
  if (ok) return <CheckCircle2 className={`mx-auto size-5 ${gold ? 'text-[#d4af37]' : 'text-green-500'}`} />;
  return <XCircle className="mx-auto size-5 text-[#666]" />;
}

export default function TauBrowserProductPage() {
  return (
    <ProductPageLayout>
      <AppsSuiteNav active="tau-browser" />

      <section className="px-6 pb-24 pt-20 md:px-20">
        <div className="mx-auto flex max-w-[960px] flex-col items-center text-center">
          <Image src="/website/logos/tau-browser/logo-primary.png" alt="" width={80} height={80} className="rounded-xl" />
          <p className={`${inter.className} mt-6 text-sm font-bold uppercase text-[#d4af37]`}>Browse</p>
          <h1 className="mt-3 font-[family-name:var(--font-instrument-serif)] text-5xl md:text-[60px]">Tau Browser</h1>
          <p className="mt-6 max-w-[600px] text-xl leading-relaxed text-[#a0a0a0]">
            The web, without the surveillance. Stop tracking scripts, load pages up to 3x faster, and route traffic safely through built-in VPN.
          </p>
          <Link
            href={websiteRoutes.download}
            className="mt-8 rounded-lg bg-[#d4af37] px-7 py-3.5 text-[15px] font-bold text-[#0f0f0f] hover:bg-[#e0bc4a]"
          >
            Download Tau Browser
          </Link>

          {/* Browser mockup — Figma 31:1233 */}
          <div className="mt-16 w-full max-w-[960px] overflow-hidden rounded-xl border border-[#2a2820] bg-[#161616] shadow-[0_16px_32px_-4px_rgba(0,0,0,0.7)]">
            <div className="flex items-end gap-3 px-4 pt-2">
              <div className="flex gap-1.5 pb-2">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-[#2a2820] bg-[#0f0f0f] px-4 py-2">
                <Globe className="size-3.5 text-[#d4af37]" />
                <span className="text-xs font-semibold">Sovereign Web</span>
              </div>
              <span className="pb-2 text-xs text-[#a0a0a0]">Tau Mail - Inbox (3)</span>
            </div>
            <div className="flex items-center gap-4 border-y border-[#2a2820] bg-[#222] p-3">
              <div className="flex flex-1 items-center gap-2 rounded-md border border-[#9e8124] bg-[#0f0f0f] p-2">
                <Lock className="size-3.5 text-[#d4af37]" />
                <span className="text-xs">https://sovereign.tau/ecosystem</span>
              </div>
              <span className="rounded border border-[#9e8124] bg-[#3a3114] px-2 py-1 text-[10px] font-bold text-[#d4af37]">
                VPN ON
              </span>
              <ShieldCheck className="size-4 text-[#d4af37]" />
            </div>
            <div className="bg-[#0f0f0f] p-10 text-left">
              <h3 className="text-2xl font-extrabold">Your data belongs in your hands</h3>
              <p className="mt-3 max-w-[600px] text-sm leading-relaxed text-[#a0a0a0]">
                Every webpage you visit should be a transaction between you and the publisher. No intermediates, no profiling matrices, no tracking pixels.
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[100px] w-[200px] rounded-lg border border-[#2a2820] bg-[#161616]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#2a2820] bg-[#161616] px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[1280px]">
          <ProductSectionHeader badge="Zero Surveillance" title="A clean window to the digital world" />
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="flex gap-5 rounded-xl border border-[#2a2820] bg-[#0f0f0f] p-8">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-3xl bg-[#3a3114]">
                  <f.icon className="size-5 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#a0a0a0]">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[1280px]">
          <ProductSectionHeader badge="The Benchmark" title="How Tau compares to standard browsers" />
          <div className="mt-12 overflow-x-auto rounded-xl border border-[#2a2820]">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-[#2a2820] bg-[#161616]">
                  <th className="px-6 py-4 text-left text-[#a0a0a0]">Feature</th>
                  <th className="px-6 py-4 text-center text-[#d4af37]">Tau Browser</th>
                  <th className="px-6 py-4 text-center text-[#a0a0a0]">Chrome</th>
                  <th className="px-6 py-4 text-center text-[#a0a0a0]">Firefox</th>
                  <th className="px-6 py-4 text-center text-[#a0a0a0]">Safari</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-b border-[#2a2820]">
                    <td className="px-6 py-4 text-[#a0a0a0]">{row.feature}</td>
                    <td className="px-6 py-4"><CheckIcon ok={row.tau} gold /></td>
                    <td className="px-6 py-4"><CheckIcon ok={row.chrome} /></td>
                    <td className="px-6 py-4"><CheckIcon ok={row.firefox} /></td>
                    <td className="px-6 py-4"><CheckIcon ok={row.safari} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-t border-[#2a2820] bg-[#161616] px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[1280px]">
          <ProductSectionHeader badge="Cross-Platform" title="Secure browsing wherever you work" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {downloads.map((d) => (
              <div key={d.os} className="rounded-xl border border-[#2a2820] bg-[#0f0f0f] p-8 text-center">
                <d.icon className="mx-auto size-10 text-[#d4af37]" />
                <h3 className="mt-6 text-xl font-bold">{d.os}</h3>
                <p className="mt-2 text-sm text-[#a0a0a0]">{d.desc}</p>
                <Link
                  href={websiteRoutes.download}
                  className="mt-6 inline-block rounded-lg border border-[#2a2820] px-6 py-3 text-sm font-semibold hover:border-[#d4af37]"
                >
                  Download package
                </Link>
                <p className="mt-4 text-xs text-[#666]">{d.version}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AppsSuiteFooter />
    </ProductPageLayout>
  );
}
