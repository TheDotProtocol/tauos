'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Database,
  FileCode2,
  LockKeyhole,
  Network,
  Paperclip,
  Pen,
  SendHorizontal,
  Settings,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { inter } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';
import AppsSuiteFooter from '@/components/website/product/shared/AppsSuiteFooter';
import AppsSuiteNav from '@/components/website/product/shared/AppsSuiteNav';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import ProductSectionHeader from '@/components/website/product/shared/ProductSectionHeader';

const features = [
  {
    icon: ShieldCheck,
    title: 'Private by Design',
    body: 'Runs locally on your device or via end-to-end encrypted private nodes. Your inputs and completions never leak.',
  },
  {
    icon: Network,
    title: 'Context Aware',
    body: 'Instantly synthesizes context across all of your on-device Tau applications safely and automatically.',
  },
  {
    icon: LockKeyhole,
    title: 'No Data Training',
    body: 'Your intellectual property is sacred. Your models are never trained on your personal prompts or history.',
  },
  {
    icon: FileCode2,
    title: 'Open Models',
    body: 'Audit the openweights models. Run custom reasoning engines and inspect model weights directly.',
  },
] as const;

const capabilities = [
  {
    icon: Pen,
    title: 'Writing',
    body: 'Draft high-fidelity copy, clean internal documents, or technical specs with precise local contextual tone adjustment.',
  },
  {
    icon: Terminal,
    title: 'Code',
    body: 'Inject smart logic directly into your IDE. Auto-complete, debug, and trace code execution paths without cloud dependency.',
  },
  {
    icon: Database,
    title: 'Research',
    body: 'Ingest massive volumes of PDFs, whitepapers, or system logs and extract exact signal without uploading.',
  },
  {
    icon: Sparkles,
    title: 'Creative',
    body: 'Synthesize disparate concepts, draft storyboards, and brainstorm architecture variations privately.',
  },
] as const;

const integrations = ['Tau Mail', 'Tau Cloud', 'Tau Browser', 'Tau IDE'] as const;

export default function TauAiProductPage() {
  return (
    <ProductPageLayout>
      <AppsSuiteNav active="tau-ai" />

      <section className="px-6 pb-24 pt-20 md:px-20">
        <div className="mx-auto flex max-w-[960px] flex-col items-center text-center">
          <Image
            src="/website/logos/tau-ai/logo-primary.png"
            alt=""
            width={80}
            height={80}
            className="rounded-xl"
          />
          <p className={`${inter.className} mt-6 text-sm font-bold uppercase text-[#d4af37]`}>Intelligence</p>
          <h1 className="mt-3 font-[family-name:var(--font-instrument-serif)] text-5xl md:text-[60px]">Tau AI</h1>
          <p className="mt-6 max-w-[600px] text-xl leading-relaxed text-[#a0a0a0]">
            Intelligence that respects your privacy. Runs complex reasoning locally, keeps your prompts yours, and never leaks a byte.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={websiteRoutes.tauAiApp}
              className="rounded-lg bg-[#d4af37] px-6 py-3.5 text-[15px] font-bold text-[#0f0f0f] hover:bg-[#e0bc4a]"
            >
              Try Tau AI
            </Link>
            <Link
              href="#features"
              className="rounded-lg border border-[#2a2820] px-6 py-3.5 text-[15px] font-semibold hover:border-[#d4af37]"
            >
              Learn More
            </Link>
          </div>

          {/* Chat mockup — Figma 31:1074 */}
          <div className="mt-16 w-full max-w-[840px] overflow-hidden rounded-2xl border border-[#2a2820] bg-[#161616] shadow-[0_16px_32px_-4px_rgba(0,0,0,0.7)]">
            <div className="flex items-center justify-between border-b border-[#2a2820] p-4">
              <div className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-full bg-[#28c840]" />
                <span className="text-sm font-semibold">Tau AI v1.2</span>
                <span className="text-[11px] uppercase text-[#666]">Local Node</span>
              </div>
              <Settings className="size-4 text-[#a0a0a0]" />
            </div>
            <div className="flex flex-col gap-5 p-6">
              <div className="flex justify-end">
                <div className="max-w-[500px] rounded-bl-xl rounded-tl-xl rounded-tr-xl bg-[#222] p-3.5 text-left text-sm leading-relaxed">
                  Can you audit this smart contract fragment for potential race conditions?
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-[14px] bg-[#d4af37] text-xs font-extrabold text-[#0f0f0f]">
                  T
                </div>
                <div className="max-w-[580px] rounded-bl-xl rounded-br-xl rounded-tr-xl border border-[#9e8124] bg-[#3a3114] p-4 text-left">
                  <p className="text-xs font-bold uppercase text-[#d4af37]">Tau AI response</p>
                  <p className="mt-3 text-sm leading-relaxed">
                    I analyzed the provided logic. A reentrancy vector exists in the withdrawal step. Since you are transferring funds before resetting the user balance state, an external contract could make nested calls to drain funds.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-[#d4af37]">
                    <ShieldCheck className="size-3.5" />
                    Audited locally — No telemetry transmitted
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-[#2a2820] p-4">
              <div className="flex flex-1 items-center justify-between rounded-md bg-[#222] p-2.5">
                <span className="text-[13px] text-[#666]">Ask Tau AI anything...</span>
                <Paperclip className="size-4 text-[#666]" />
              </div>
              <button type="button" className="flex size-9 items-center justify-center rounded-[18px] bg-[#d4af37]">
                <SendHorizontal className="size-4 text-[#0f0f0f]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-[#2a2820] bg-[#161616] px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[1280px]">
          <ProductSectionHeader
            badge="Sovereign Protocol"
            title="AI that works for you, not on you"
            description="We believe intelligence should expand your potential without harvesting your personal or business data."
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-[#2a2820] bg-[#0f0f0f] p-8">
                <div className="mb-5 flex size-10 items-center justify-center rounded-[20px] bg-[#3a3114]">
                  <f.icon className="size-5 text-[#d4af37]" />
                </div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#a0a0a0]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[1280px]">
          <ProductSectionHeader badge="Capabilities" title="Built for extreme productivity" />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c) => (
              <div key={c.title} className="rounded-xl border border-[#2a2820] bg-[#161616] p-6">
                <c.icon className="size-6 text-[#d4af37]" />
                <h3 className="mt-4 text-lg font-bold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#a0a0a0]">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-6 border-y border-[#2a2820] bg-[#161616] px-6 py-8 md:px-20">
        <p className="text-xs font-bold uppercase text-[#a0a0a0]">Deep Integration</p>
        <div className="flex flex-wrap gap-12">
          {integrations.map((name) => (
            <div key={name} className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#d4af37]" />
              <span className="text-sm font-semibold">{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-28 text-center md:px-20">
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl md:text-[32px]">
          Unlock deep reasoning on-device
        </h2>
        <p className="mx-auto mt-4 max-w-[500px] text-[#a0a0a0]">
          Experience privacy-first localized artificial intelligence without compromises.
        </p>
        <Link
          href={websiteRoutes.download}
          className="mt-8 inline-block rounded-lg bg-[#d4af37] px-8 py-4 text-[15px] font-bold text-[#0f0f0f] hover:bg-[#e0bc4a]"
        >
          Download Tau AI Node
        </Link>
      </section>

      <AppsSuiteFooter />
    </ProductPageLayout>
  );
}
