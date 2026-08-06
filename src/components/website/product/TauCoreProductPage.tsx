'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { geistMono, outfit } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';
import { Github } from 'lucide-react';

const features = [
  { title: 'Privacy First', tag: 'Standard', body: 'Zero-knowledge isolation mechanisms prevent side-channel leaking. Your keys and processes remain fully encrypted even during raw computation.' },
  { title: 'Lightning Fast', tag: 'Benchmark', body: 'Direct-to-metal compilation bypassing heavy middleware abstraction. Benchmarked at 150,000 operations per second with microsecond tick times.' },
  { title: 'Beautiful Design', tag: null, body: 'Consolidated developer tools, rich telemetry dashboards, and minimalist design systems make building with Tau Core a highly aesthetic experience.' },
  { title: 'Open Source', tag: 'Audited', body: '100% transparent codebase audited by top-tier cryptographic security firms. Backed by a community of thousands of independent nodes.' },
  { title: 'Cross-Platform', tag: null, body: 'Run smoothly on Linux kernel extensions, lightweight WebAssembly nodes, macOS, or custom bare-metal architectures.' },
  { title: 'Always Free', tag: null, body: 'No arbitrary licenses or paywalled core routines. Standardize your operations on free and open-source software that stays yours forever.' },
] as const;

const ecosystemNodes = ['Tau Base', 'Tau Link', 'Tau Core', 'Tau Shield', 'Tau Stream'] as const;

const navItems = [
  { label: 'Overview', href: '#overview', active: true },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'Docs', href: websiteRoutes.docs },
  { label: 'Download', href: websiteRoutes.download },
] as const;

export default function TauCoreProductPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`${outfit.className} min-h-screen bg-tau-bg-deep text-white`}>
      {/* Product nav — Figma 31:404 */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-tau-border-strong bg-tau-bg-deep/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-20">
          <Link href={websiteRoutes.home} className="flex items-center gap-2.5">
            <Image src="/website/logos/tau-core/logo-nav.png" alt="" width={36} height={36} className="rounded-md" />
            <span className="text-xl font-bold">TAU</span>
            <span className={`${geistMono.className} rounded bg-tau-accent-muted px-1.5 py-0.5 text-[10px] font-semibold text-tau-accent`}>
              CORE
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Product">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium transition ${
                  'active' in item && item.active ? 'text-tau-accent' : 'text-tau-text-secondary hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href={websiteRoutes.download}
            className="rounded-md bg-tau-accent px-6 py-3 text-sm font-semibold text-tau-bg-deep transition hover:bg-tau-accent-hover"
          >
            Get Tau
          </Link>
        </div>
      </header>

      {/* Hero — Figma 31:424 */}
      <section id="overview" className="relative overflow-hidden pb-20 pt-[180px]">
        <div className="pointer-events-none absolute left-1/2 top-[350px] h-[400px] w-[800px] -translate-x-1/2 opacity-60">
          <div className="absolute inset-[-37.5%_-18.75%] rounded-full bg-[radial-gradient(ellipse,rgba(212,175,55,0.12)_0%,transparent_70%)]" />
        </div>

        <div className="relative mx-auto flex max-w-[960px] flex-col items-center px-6 text-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Image src="/website/logos/tau-core/logo-primary.png" alt="" width={80} height={80} className="mx-auto rounded-xl" />
            <h1 className="mt-6 text-5xl font-extrabold leading-tight md:text-[64px]">Tau Core</h1>
            <p className="mt-3 text-2xl text-tau-accent">The heart of everything.</p>
            <p className="mx-auto mt-6 max-w-[640px] text-base leading-relaxed text-tau-text-secondary">
              A state-of-the-art secure runtime built for high-performance decentralized systems. Experience near-zero latency, military-grade memory isolation, and universal compatibility.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href={websiteRoutes.download} className="rounded-md bg-tau-accent px-6 py-3 text-sm font-semibold text-tau-bg-deep hover:bg-tau-accent-hover">
                Download Tau Core
              </Link>
              <Link href="/tau-core/setup/" className="rounded-md border border-tau-border-strong px-6 py-3 text-sm font-semibold text-white hover:border-tau-accent">
                Preview Desktop UI
              </Link>
            </div>
          </motion.div>

          {/* Console mockup — Figma 31:436 */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 w-full overflow-hidden rounded-xl border border-tau-accent shadow-[0_24px_24px_rgba(212,175,55,0.1)]"
          >
            <div className="flex h-10 items-center justify-between border-b border-tau-border-strong bg-[#18181b] px-4">
              <div className="flex gap-1.5">
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
              </div>
              <p className={`${geistMono.className} text-xs text-tau-text-dim`}>tau-core-runtime ~ console</p>
              <span className="size-4" />
            </div>
            <div className="flex flex-col gap-6 bg-tau-card-elevated p-6 md:flex-row">
              <div className="w-full shrink-0 rounded-lg border border-tau-border-strong bg-tau-bg-deep p-4 md:w-80">
                <p className={`${geistMono.className} text-[11px] text-tau-accent`}>SYSTEM METRICS</p>
                {[
                  { label: 'Core Temperature', value: '38.2°C', width: '38%' },
                  { label: 'Memory Isolation', value: '100%', width: '100%' },
                  { label: 'Throughput Limit', value: '4.8 GB/s', width: '82%' },
                ].map((m) => (
                  <div key={m.label} className="mt-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-tau-text-secondary">{m.label}</span>
                      <span className={`${geistMono.className} text-white`}>{m.value}</span>
                    </div>
                    <div className="mt-1.5 h-1 rounded-full bg-tau-border-strong">
                      <div className="h-full rounded-full bg-tau-accent" style={{ width: m.width }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className={`${geistMono.className} flex-1 rounded-lg border border-tau-border-strong bg-tau-bg-deep p-4 text-[13px] leading-relaxed`}>
                <p className="text-[11px] text-tau-text-dim">src/kernel/isolation.rs</p>
                <pre className="mt-3 whitespace-pre-wrap text-left">
                  <span className="text-[#88c0d0]">{`fn initialize_tau_isolate() -> Result<Isolate, Error> {`}</span>
                  {'\n'}
                  <span className="text-tau-text-secondary">{`    let mut isolate = Isolate::new(MemoryBudget::unlimited());`}</span>
                  {'\n'}
                  <span className="text-tau-accent">{`    isolate.secure_boundary(BoundaryLevel::Maximum)?;`}</span>
                  {'\n'}
                  <span className="text-tau-text-secondary">{`    isolate.bind_host_interface(CoreRuntime)?;`}</span>
                  {'\n'}
                  <span className="text-[#81a1c1]">{`    info!("Tau isolation kernel successfully deployed.");`}</span>
                  {'\n'}
                  <span className="text-[#88c0d0]">{`    Ok(isolate)`}</span>
                  {'\n'}
                  <span className="text-[#88c0d0]">{`}`}</span>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Architecture — Figma 31:476 */}
      <section id="architecture" className="px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[1280px] text-center">
          <span className={`${geistMono.className} inline-block rounded-full border border-tau-accent bg-tau-accent-muted px-2.5 py-1 text-[11px] font-semibold uppercase text-tau-accent`}>
            Architecture
          </span>
          <h2 className="mt-4 text-4xl font-bold">Engineered to Perfection</h2>
        </div>
        <div className="mx-auto mt-14 grid max-w-[1280px] gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-tau-border-strong bg-tau-card-elevated p-8"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-full bg-tau-accent-muted">
                  <span className="size-2 rounded-full bg-tau-accent" />
                </div>
                {f.tag && (
                  <span className={`${geistMono.className} rounded bg-tau-accent-muted px-2 py-1 text-[10px] font-semibold uppercase text-tau-accent`}>
                    {f.tag}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-tau-text-secondary">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ecosystem — Figma 31:532 */}
      <section id="ecosystem" className="px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[1280px] text-center">
          <h2 className="text-3xl font-bold">The Connected Ecosystem</h2>
          <p className="mt-3 text-sm text-tau-text-secondary">
            Tau Core sits at the center of a rich framework of specialized tools and products.
          </p>
          <div className="relative mt-16 flex flex-wrap items-start justify-center gap-8 md:justify-between">
            <div className="pointer-events-none absolute left-[10%] right-[10%] top-8 hidden h-px border-t border-dashed border-tau-border-strong md:block" />
            {ecosystemNodes.map((name) => {
              const isCore = name === 'Tau Core';
              return (
                <div key={name} className="relative flex w-28 flex-col items-center gap-3">
                  <div
                    className={`flex size-16 items-center justify-center rounded-full border ${
                      isCore
                        ? 'border-tau-accent bg-tau-accent shadow-[0_4px_8px_rgba(212,175,55,0.2)]'
                        : 'border-tau-border-strong bg-tau-card-elevated'
                    }`}
                  >
                    <Image src="/website/logos/tau-core/logo-nav.png" alt="" width={24} height={24} className={isCore ? 'brightness-0' : ''} />
                  </div>
                  <p className={`text-xs font-semibold ${isCore ? 'text-tau-accent' : 'text-tau-text-secondary'}`}>{name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA — Figma 31:559 */}
      <section className="px-6 py-24 md:px-20">
        <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-3xl border border-tau-accent bg-tau-card-elevated p-16 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
          <h2 className="relative text-4xl font-extrabold">Ready to integrate Tau Core?</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-tau-text-secondary">
            Deployment takes less than five minutes. Use our pre-built setup routines to compile the core kernel on any supported machine.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Link href={websiteRoutes.download} className="rounded-md bg-tau-accent px-6 py-3 text-sm font-semibold text-tau-bg-deep hover:bg-tau-accent-hover">
              Get Started with Tau Core
            </Link>
            <Link href={websiteRoutes.contact} className="rounded-md border border-tau-accent px-6 py-3 text-sm font-semibold text-white hover:bg-tau-accent-muted">
              Contact Architecture Team
            </Link>
          </div>
        </div>
      </section>

      {/* Product footer — Figma 31:570 */}
      <footer className="border-t border-tau-border-strong px-6 pb-12 pt-20 md:px-20">
        <div className="mx-auto flex max-w-[1280px] flex-wrap gap-12">
          <div className="w-full max-w-xs">
            <div className="flex items-center gap-2.5">
              <Image src="/website/logos/tau-core/logo-nav.png" alt="" width={32} height={32} />
              <span className="text-lg font-bold">TAU SYSTEM</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-tau-text-secondary">
              A high-performance cryptographic and computation ecosystem engineered for security-first infrastructure.
            </p>
          </div>
          {[
            { title: 'Products', links: ['Tau Core', 'Tau Base', 'Tau Link', 'Security Modules'] },
            { title: 'Developers', links: ['Documentation', 'Kernel Spec', 'API Reference', 'GitHub'] },
            { title: 'Support', links: ['Help Center', 'Community Forum', 'Enterprise Support', 'Contact'] },
            { title: 'Legal', links: ['Terms of Service', 'Privacy Policy', 'SLA Agreements', 'Auditing Specs'] },
          ].map((col) => (
            <div key={col.title} className="min-w-[120px] flex-1">
              <p className="text-xs font-bold uppercase">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <span className="text-sm text-tau-text-secondary">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-16 flex max-w-[1280px] items-center justify-between border-t border-tau-border-strong pt-8">
          <p className="text-[13px] text-tau-text-dim">© 2026 Tau Systems Inc. All rights reserved.</p>
          <a href="https://github.com/TheDotProtocol/tauos" aria-label="GitHub" className="text-tau-text-secondary hover:text-white">
            <Github className="size-[18px]" />
          </a>
        </div>
      </footer>
    </div>
  );
}
