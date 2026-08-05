'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Code,
  FileCode,
  FolderGit2,
  Star,
  Terminal,
  Wrench,
} from 'lucide-react';
import { geistMono, inter } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import ProductSectionHeader from '@/components/website/product/shared/ProductSectionHeader';

const navLinks = [
  { label: 'Platform', href: websiteRoutes.developer },
  { label: 'SDKs', href: '#sdks' },
  { label: 'API Reference', href: websiteRoutes.docs },
  { label: 'Docs', href: websiteRoutes.docs },
  { label: 'Community', href: websiteRoutes.community },
] as const;

const sdks = [
  { name: 'Rust', desc: 'Blazing fast memory safety compiled straight to raw web assemblies.', featured: true, badge: 'v2.4 (Latest)', icon: Wrench },
  { name: 'TypeScript', desc: 'Fully typed orchestrations for cloud edge workers.', featured: false, icon: FileCode },
  { name: 'Swift', desc: 'Elegant native bridges for iOS and macOS systems.', featured: false, icon: Code },
  { name: 'Kotlin', desc: 'Robust architecture patterns for Android and JVM enterprise.', featured: false, icon: Terminal },
  { name: 'Python', desc: 'Rapid prototyping and data science integrations.', featured: false, icon: Code },
] as const;

const repos = [
  { name: 'tau-core', desc: 'The fundamental runtime and cryptographic kernel.', stars: '4.2k', lang: 'Rust' },
  { name: 'tau-sdk-js', desc: 'Official TypeScript SDK for edge orchestration.', stars: '1.8k', lang: 'TypeScript' },
  { name: 'tau-node-launcher', desc: 'One-command node deployment utilities.', stars: '958', lang: 'Go' },
  { name: 'tau-crypto', desc: 'Low-level cryptographic primitives library.', stars: '2.1k', lang: 'C++' },
] as const;

export default function TauDeveloperPlatformPage() {
  return (
    <ProductPageLayout>
      <header className={`${inter.className} sticky top-0 z-50 flex items-center justify-between border-b border-[#2a2a2a] bg-[#0f0f0f] px-6 py-5 md:px-20`}>
        <Link href={websiteRoutes.home} className="flex items-center gap-2">
          <Image src="/website/logos/tau-core/logo-nav.png" alt="" width={32} height={32} className="rounded" />
          <span className="text-lg font-bold lowercase">tau</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Developer">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm font-medium text-[#a0a0a0] transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link href={websiteRoutes.login} className="hidden text-sm text-[#a0a0a0] hover:text-white sm:block">
            Sign In
          </Link>
          <Link href={websiteRoutes.register} className="rounded bg-[#d4af37] px-6 py-3 text-sm font-semibold uppercase text-[#0f0f0f] hover:bg-[#e0bc4a]">
            Get Started
          </Link>
        </div>
      </header>

      <section className="px-6 py-24 md:px-20">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-16 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Image src="/website/logos/tau-developer/logo-primary.png" alt="" width={80} height={80} className="rounded-xl" />
            <div className="mt-6 flex items-center gap-2">
              <span className="h-px w-4 bg-[#d4af37]" />
              <p className="text-sm font-bold uppercase text-[#d4af37]">Build</p>
            </div>
            <h1 className="mt-4 font-[family-name:var(--font-instrument-serif)] text-5xl leading-tight md:text-[60px]">
              Tau Developer
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-[#a0a0a0]">
              For people who build things. Ship code that works, backed by real-time AI modeling and distributed consensus orchestration.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={websiteRoutes.register} className="rounded bg-[#d4af37] px-6 py-3 text-sm font-semibold uppercase text-[#0f0f0f] hover:bg-[#e0bc4a]">
                Start Building
              </Link>
              <Link href={websiteRoutes.docs} className="rounded border border-[#2a2a2a] px-6 py-3 text-sm font-semibold uppercase hover:border-[#d4af37]">
                Read Whitepaper
              </Link>
            </div>
          </div>
          <div className={`${geistMono.className} w-full max-w-[640px] flex-1 overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#161616]`}>
            <div className="flex h-10 items-center justify-between border-b border-[#2a2a2a] bg-[#0f0f0f] px-4">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-xs text-[#d4af37]">tau_orchestrator.rs</span>
              <span className="size-4" />
            </div>
            <pre className="overflow-x-auto p-6 text-[13px] leading-relaxed">
              <span className="text-[#c5a44e]">use </span>
              <span className="text-white">tau_core::consensus::Node;</span>
              {'\n\n'}
              <span className="text-[#c5a44e]">pub async fn </span>
              <span className="text-white">deploy_cluster() -&gt; Result&lt;(), Error&gt; {'{'}</span>
              {'\n'}
              <span className="text-white">    </span>
              <span className="text-[#c5a44e]">let mut </span>
              <span className="text-white">node = Node::init()?;</span>
              {'\n'}
              <span className="text-white">    node.secure_boundary(BoundaryLevel::Maximum)?;</span>
              {'\n'}
              <span className="text-white">    node.bind_consensus(ConsensusRule::PBFT)?;</span>
              {'\n'}
              <span className="text-[#9e86e5]">    info!</span>
              <span className="text-white">(&quot;Cluster deployed successfully.&quot;);</span>
              {'\n'}
              <span className="text-white">    </span>
              <span className="text-[#c5a44e]">Ok</span>
              <span className="text-white">(())</span>
              {'\n'}
              <span className="text-white">{'}'}</span>
            </pre>
          </div>
        </div>
      </section>

      <section id="sdks" className="border-t border-[#2a2a2a] px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[1280px]">
          <ProductSectionHeader
            badge="Native Languages"
            title="Robust Native SDKs"
            description="Integrate with Tau natively using our production-grade libraries. Maintain lightning speed with complete types."
            align="left"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {sdks.map((sdk) => (
              <div
                key={sdk.name}
                className={`flex flex-col rounded-lg border p-6 ${
                  sdk.featured ? 'border-[#d4af37] bg-[#161616]' : 'border-[#2a2a2a] bg-[#1c1c1c]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-md border border-[#2a2a2a] bg-[#0f0f0f]">
                    <sdk.icon className="size-5 text-[#d4af37]" />
                  </div>
                  {'badge' in sdk && sdk.badge && (
                    <span className="rounded bg-[#a3841d] px-2 py-1 text-[10px] font-bold uppercase text-[#0f0f0f]">
                      {sdk.badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{sdk.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#a0a0a0]">{sdk.desc}</p>
                <Link href={websiteRoutes.docs} className={`${geistMono.className} mt-4 flex items-center gap-1 text-xs text-[#d4af37] hover:underline`}>
                  view integration <ArrowRight className="size-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2a2a2a] px-6 py-24 md:px-20">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-2">
          <div>
            <ProductSectionHeader badge="REST Engine" title="Developer REST Endpoint" align="left" />
            <div className={`${geistMono.className} mt-8 rounded-lg border border-[#2a2a2a] bg-[#161616] p-6 text-xs leading-relaxed`}>
              <p className="text-[#d4af37]">POST /v1/orchestration/consensus</p>
              <pre className="mt-4 text-[#a0a0a0]">{`{
  "cluster_id": "us-west-1",
  "nodes": 3,
  "rule": "PBFT"
}`}</pre>
            </div>
          </div>
          <div>
            <ProductSectionHeader badge="Documentation" title="Extensive Guides" align="left" />
            <div className="mt-8 flex overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#161616]">
              <div className="w-40 shrink-0 border-r border-[#2a2a2a] p-4 text-sm">
                {['Introduction', 'Quick Setup', 'Node Config', 'Advanced', 'Custom Schemes'].map((item, i) => (
                  <p key={item} className={`py-2 ${i === 0 ? 'font-semibold text-[#d4af37]' : 'text-[#a0a0a0]'}`}>
                    {item}
                  </p>
                ))}
              </div>
              <div className="flex-1 p-6">
                <h3 className="font-bold">Introduction</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#a0a0a0]">
                  Tau is a modular core engine designed for developers who need cryptographic guarantees without sacrificing velocity.
                </p>
                <Link href={websiteRoutes.docs} className={`${geistMono.className} mt-6 inline-flex items-center gap-1 text-xs text-[#d4af37] hover:underline`}>
                  READ FULL GUIDE <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#2a2a2a] px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[1280px]">
          <ProductSectionHeader badge="Open Ecosystem" title="Active Repositories" align="left" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {repos.map((repo) => (
              <div key={repo.name} className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-6">
                <FolderGit2 className="size-5 text-[#d4af37]" />
                <h3 className={`${geistMono.className} mt-4 text-sm font-bold`}>{repo.name}</h3>
                <p className="mt-2 text-sm text-[#a0a0a0]">{repo.desc}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-[#a0a0a0]">
                  <span className="flex items-center gap-1">
                    <Star className="size-3.5 text-[#d4af37]" /> {repo.stars}
                  </span>
                  <span>{repo.lang}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2a2a2a] px-6 py-28 text-center md:px-20">
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl md:text-5xl">
          Build the next generation of software
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[#a0a0a0]">
          Join thousands of developers building on Tau. Open source, privacy-first, and production ready.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href={websiteRoutes.register} className="rounded bg-[#d4af37] px-8 py-4 text-sm font-semibold uppercase text-[#0f0f0f] hover:bg-[#e0bc4a]">
            Get Started Now
          </Link>
          <Link href={websiteRoutes.community} className="rounded border border-[#2a2a2a] px-8 py-4 text-sm font-semibold uppercase hover:border-[#d4af37]">
            Join Discord
          </Link>
        </div>
      </section>

      <footer className={`${inter.className} border-t border-[#2a2a2a] px-6 py-8 md:px-20`}>
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 text-xs text-[#606060]">
          <p>© 2026 Tau Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href={websiteRoutes.status} className="hover:text-[#a0a0a0]">Status</Link>
            <Link href={websiteRoutes.privacy} className="hover:text-[#a0a0a0]">Privacy Policy</Link>
            <Link href={websiteRoutes.terms} className="hover:text-[#a0a0a0]">Terms of Use</Link>
          </div>
        </div>
      </footer>
    </ProductPageLayout>
  );
}
