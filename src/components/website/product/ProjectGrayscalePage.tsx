'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  AlertCircle,
  BookOpen,
  GitFork,
  Github,
  GitPullRequest,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { geistMono, inter } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';

const navLinks = ['// Core', '// Cryptography', '// Architecture', '// Contribute'] as const;

const repos = [
  { name: 'grayscale-core', desc: 'The fundamental systems layer for asynchronous node clusters and cryptographic identity.', stars: '12,482', forks: '1,940' },
  { name: 'grayscale-crypto', desc: 'Implementations of experimental hash structures and multiparty computation protocols.', stars: '8,102', forks: '650' },
  { name: 'grayscale-ui', desc: 'A zero-dependency dashboard rendering realtime topology stats in raw SVG output.', stars: '3,110', forks: '420' },
  { name: 'grayscale-net', desc: 'Network transit tools and custom transport protocols bypassing heavy overhead limits.', stars: '6,345', forks: '890' },
] as const;

const contribute = [
  { icon: AlertCircle, title: 'Open Issues', body: 'Find verified starter tasks for newcomers to the system architecture.' },
  { icon: GitPullRequest, title: 'Active PRs', body: 'Review existing developer proposals or open your own patch branch.' },
  { icon: BookOpen, title: 'Documentation', body: 'Browse through mathematical design specifications and setups.' },
  { icon: ShieldCheck, title: 'Audits & Tests', body: 'Integrate unit runs locally to confirm mathematical model compliance.' },
] as const;

export default function ProjectGrayscalePage() {
  return (
    <ProductPageLayout>
      <header className={`${geistMono.className} sticky top-0 z-50 flex items-center justify-between border-b border-[#2a2a2a] bg-[#0f0f0f] px-6 py-6 md:px-20`}>
        <div className="flex items-center gap-2.5">
          <Image src="/website/logos/project-grayscale/logo-primary.png" alt="" width={32} height={32} className="rounded" />
          <span className="text-[15px] font-bold">PROJECT GRAYSCALE</span>
        </div>
        <nav className="hidden items-center gap-6 text-[13px] text-[#a0a0a0] md:flex">
          {navLinks.map((link) => (
            <span key={link}>{link}</span>
          ))}
        </nav>
        <a
          href="https://github.com/TheDotProtocol/tauos"
          className="flex items-center gap-2 rounded border border-[#d4af37] px-3 py-1.5 text-xs text-[#d4af37] hover:bg-[rgba(212,175,55,0.08)]"
        >
          <Github className="size-3.5" /> GITHUB
        </a>
      </header>

      <section className="px-6 py-24 md:px-20">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-12 lg:flex-row">
          <div className="flex-1">
            <p className="text-xs font-bold text-[#d4af37]">[ OPEN SOURCE ]</p>
            <h1 className={`${geistMono.className} mt-4 text-5xl font-bold leading-tight md:text-[60px]`}>
              Project Grayscale
            </h1>
            <p className={`${inter.className} mt-6 text-lg leading-relaxed text-[#a0a0a0]`}>
              Technology should be transparent. Explore the raw source patterns behind extreme scale networks. Security audited, publicly compiled, and free forever.
            </p>
            <a
              href="https://github.com/TheDotProtocol/tauos"
              className="mt-8 inline-flex items-center gap-2 rounded-sm bg-[#d4af37] px-7 py-3.5 text-sm font-bold text-[#0f0f0f] hover:bg-[#e0bc4a]"
            >
              <Github className="size-4" /> EXPLORE ON GITHUB
            </a>
          </div>
          <div className={`${geistMono.className} w-full max-w-[640px] flex-1 rounded border border-[#2a2a2a] bg-[#080808] p-6 text-[13px]`}>
            <p>
              <span className="text-[#d4af37]">guest@grayscale:~$</span>{' '}
              <span className="text-white">grayscale-cli inspect --node peer-us-west-1</span>
            </p>
            <div className="mt-4 space-y-1 text-[#a0a0a0]">
              <p>[i] Establishing handshake with peer...</p>
              <p>[✓] Connection confirmed in 14.2ms.</p>
              <p>[i] Integrity status: SHA-256 MATCH.</p>
              <p className="text-[#f3e7c4]">---------------------------------------------</p>
              <p className="text-white">Node uptime     : 142 days, 11 hours</p>
              <p className="text-white">Active threads  : 1,024 running instances</p>
              <p className="text-white">Consensus rule  : PBFT asymmetric v3</p>
            </div>
            <p className="mt-4 flex items-center gap-2">
              <span className="text-[#d4af37]">guest@grayscale:~$</span>
              <span className="inline-block h-3.5 w-2 animate-pulse bg-[#d4af37]" />
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#2a2a2a] bg-[#161616] px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[1280px]">
          <p className={`${geistMono.className} text-xs font-bold text-[#d4af37]`}>// STRUCTURE</p>
          <h2 className={`${geistMono.className} mt-3 text-[32px] font-bold`}>The Four Pillars</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {repos.map((repo) => (
              <div key={repo.name} className="border border-[#2a2a2a] bg-[#0f0f0f] p-8">
                <h3 className={`${geistMono.className} text-lg font-bold`}>{repo.name}</h3>
                <p className={`${inter.className} mt-2 text-sm leading-relaxed text-[#a0a0a0]`}>{repo.desc}</p>
                <div className="mt-5 flex gap-4 text-xs text-[#a0a0a0]">
                  <span className="flex items-center gap-1.5"><Star className="size-3.5 text-[#d4af37]" /> {repo.stars}</span>
                  <span className="flex items-center gap-1.5"><GitFork className="size-3.5" /> {repo.forks}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-20">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 lg:flex-row lg:items-start">
          <div className="flex-1">
            <p className={`${geistMono.className} text-xs font-bold text-[#d4af37]`}>// JOIN THE CAUSE</p>
            <h2 className={`${geistMono.className} mt-3 text-4xl font-bold`}>Contribute to the Architecture</h2>
            <p className={`${inter.className} mt-4 text-[#a0a0a0]`}>
              We accept community audits, modular improvements, and optimization patches. Let&apos;s make robust system tools universally accessible together.
            </p>
          </div>
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            {contribute.map((item) => (
              <div key={item.title} className="rounded border border-[#2a2a2a] bg-[#1c1c1c] p-6">
                <item.icon className="size-4 text-[#d4af37]" />
                <h3 className={`${geistMono.className} mt-3 text-sm font-bold`}>{item.title}</h3>
                <p className={`${inter.className} mt-2 text-[13px] leading-relaxed text-[#a0a0a0]`}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className={`${geistMono.className} border-t border-[#2a2a2a] px-6 pb-10 pt-16 md:px-20`}>
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <Image src="/website/logos/project-grayscale/logo-primary.png" alt="" width={28} height={28} className="rounded" />
              <span className="text-[13px] font-bold">PROJECT GRAYSCALE</span>
            </div>
            <div className="flex flex-wrap gap-6 text-[13px] text-[#606060]">
              <span>// CORE ARCH</span>
              <span>// SECURITY BLUEPRINT</span>
              <span>// SIGNATURES</span>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#606060]">
            <p>Project Grayscale is distributed freely under the MIT License.</p>
            <p>STABLE CORE VER. 1.0.4-BETA</p>
          </div>
        </div>
      </footer>
    </ProductPageLayout>
  );
}
