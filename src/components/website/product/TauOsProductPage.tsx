'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { geistMono, outfit } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';

type ProductPageConfig = {
  badge: string;
  title: string;
  tagline: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  features: { title: string; body: string }[];
};

const desktopConfig: ProductPageConfig = {
  badge: 'DESKTOP',
  title: 'Tau Desktop OS',
  tagline: 'Sovereignty at your desk.',
  description:
    'A precision-engineered desktop operating system built on Tau Core. Fluid window management, zero-telemetry defaults, and deep hardware integration for workstations and laptops.',
  primaryCta: { label: 'Download Desktop OS', href: websiteRoutes.download },
  secondaryCta: { label: 'View System Requirements', href: websiteRoutes.docs },
  features: [
    { title: 'Native Performance', body: 'Direct kernel scheduling with sub-millisecond input latency and hardware-accelerated compositing.' },
    { title: 'Privacy by Default', body: 'No telemetry daemons, no background analytics. Every process sandboxed with Tau Core isolation.' },
    { title: 'Unified Ecosystem', body: 'Tau Mail, Browser, and IDE ship pre-integrated with single-sign-on via Tau ID.' },
    { title: 'Developer Ready', body: 'Full POSIX compatibility, container runtime, and TauScript tooling built in.' },
  ],
};

const mobileConfig: ProductPageConfig = {
  badge: 'MOBILE',
  title: 'Tau Mobile OS',
  tagline: 'Your pocket, your rules.',
  description:
    'A mobile operating system designed around human attention and cryptographic sovereignty. Milled hardware meets zero-tracking software on Tau Phone.',
  primaryCta: { label: 'Explore Tau Phone', href: websiteRoutes.tauPhone },
  secondaryCta: { label: 'Compare Devices', href: websiteRoutes.experience },
  features: [
    { title: 'Hardware Consensus', body: 'Secure enclave signing on every transaction. Biometric gates without cloud dependency.' },
    { title: 'Attention Architecture', body: 'Notification budgets, focus modes, and grayscale interfaces that respect your time.' },
    { title: 'P2P First', body: 'Tau Talk and Mail run peer-to-peer by default — no central relay required.' },
    { title: 'Seamless Sync', body: 'End-to-end encrypted handoff between phone, tablet, and desktop via Tau Core.' },
  ],
};

function TauOsProductPage({ config }: { config: ProductPageConfig }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`${outfit.className} min-h-screen bg-tau-bg-deep text-white`}>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-tau-border-strong bg-tau-bg-deep/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-20">
          <Link href={websiteRoutes.home} className="flex items-center gap-2.5">
            <Image src="/website/logos/tau-core/logo-nav.png" alt="" width={36} height={36} className="rounded-md" />
            <span className="text-xl font-bold">TAU</span>
            <span className={`${geistMono.className} rounded bg-tau-accent-muted px-1.5 py-0.5 text-[10px] font-semibold text-tau-accent`}>
              {config.badge}
            </span>
          </Link>
          <Link
            href={websiteRoutes.download}
            className="rounded-md bg-tau-accent px-6 py-3 text-sm font-semibold text-tau-bg-deep hover:bg-tau-accent-hover"
          >
            Get Tau
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden pb-20 pt-[180px]">
        <div className="pointer-events-none absolute left-1/2 top-[300px] h-[400px] w-[800px] -translate-x-1/2 opacity-50">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse,rgba(212,175,55,0.1)_0%,transparent_70%)]" />
        </div>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto max-w-[800px] px-6 text-center"
        >
          <Image src="/website/logos/tau-core/logo-primary.png" alt="" width={80} height={80} className="mx-auto rounded-xl" />
          <h1 className="mt-6 text-5xl font-extrabold md:text-[56px]">{config.title}</h1>
          <p className="mt-3 text-2xl text-tau-accent">{config.tagline}</p>
          <p className="mx-auto mt-6 max-w-[600px] leading-relaxed text-tau-text-secondary">{config.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={config.primaryCta.href} className="rounded-md bg-tau-accent px-6 py-3 text-sm font-semibold text-tau-bg-deep hover:bg-tau-accent-hover">
              {config.primaryCta.label}
            </Link>
            <Link href={config.secondaryCta.href} className="rounded-md border border-tau-border-strong px-6 py-3 text-sm font-semibold hover:border-tau-accent">
              {config.secondaryCta.label}
            </Link>
          </div>
        </motion.div>

        <div className="mx-auto mt-16 flex max-w-4xl justify-center px-6">
          <div className="w-full max-w-sm rounded-[32px] border-2 border-tau-accent-border bg-tau-card-elevated p-3 shadow-[0_24px_48px_rgba(0,0,0,0.5)] md:max-w-md">
            <div className="flex aspect-[9/19] items-center justify-center rounded-[24px] bg-[#060607]">
              <Image src="/website/logos/tau-core/logo-primary.png" alt="" width={64} height={64} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-20">
        <div className="mx-auto grid max-w-[1280px] gap-6 md:grid-cols-2">
          {config.features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-tau-border-strong bg-tau-card-elevated p-8"
            >
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-tau-text-secondary">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24 md:px-20">
        <div className="mx-auto max-w-[1280px] rounded-3xl border border-tau-accent bg-tau-card-elevated p-12 text-center">
          <h2 className="text-3xl font-bold">Built on Tau Core</h2>
          <p className="mx-auto mt-4 max-w-lg text-tau-text-secondary">
            Every Tau OS shares the same secure runtime foundation. Explore the kernel that powers the ecosystem.
          </p>
          <Link href={websiteRoutes.tauCore} className="mt-8 inline-block rounded-md bg-tau-accent px-6 py-3 text-sm font-semibold text-tau-bg-deep hover:bg-tau-accent-hover">
            Explore Tau Core
          </Link>
        </div>
      </section>
    </div>
  );
}

export function TauDesktopOsProductPage() {
  return <TauOsProductPage config={desktopConfig} />;
}

export function TauMobileOsProductPage() {
  return <TauOsProductPage config={mobileConfig} />;
}
