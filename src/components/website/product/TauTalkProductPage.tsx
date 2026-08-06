'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { inter } from '@/lib/website/fonts';
import { tauTalkAssets, tauTalkRoutes } from '@/lib/tautalk-ui/assets';
import { websiteRoutes } from '@/lib/website/routes';
import TauTalkHeroMockup from '@/components/tautalk/marketing/TauTalkHeroMockup';
import CloudSuiteFooter from '@/components/website/product/shared/CloudSuiteFooter';
import CloudSuiteNav from '@/components/website/product/shared/CloudSuiteNav';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import ProductSectionHeader from '@/components/website/product/shared/ProductSectionHeader';

const features = [
  {
    title: 'End-to-End Encrypted',
    body: 'No middleman. Messages, audio/video calls, and file transfers are cryptographically secured so only you and the recipient hold the keys.',
  },
  {
    title: 'Group Channels',
    body: 'Host large communities, direct teams, or launch project rooms with custom ACL controls powered by cryptographic group keys.',
  },
  {
    title: 'Voice & Video',
    body: 'Peer-to-peer WebRTC streaming delivers crystal-clear audio and low-latency video without routing media through centralized servers.',
  },
  {
    title: 'Cross-Platform',
    body: 'Continuous access wherever you are. Seamlessly coordinate chats across phones, desktops, web browsers, and tablets.',
  },
] as const;

export default function TauTalkProductPage() {
  return (
    <ProductPageLayout>
      <CloudSuiteNav active="tau-talk" />

      <section className="relative overflow-hidden px-6 pb-24 pt-20 md:px-20">
        <div
          className="pointer-events-none absolute left-1/2 top-32 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[rgba(212,175,55,0.08)] blur-[100px]"
          aria-hidden
        />

        <div className="relative mx-auto flex max-w-[960px] flex-col items-center text-center">
          <Image
            src={tauTalkAssets.brand.logoPrimary}
            alt="Tau Talk"
            width={80}
            height={80}
            className="rounded-xl"
            priority
          />
          <p className={`${inter.className} mt-6 text-sm font-bold uppercase tracking-wide text-[#d4af37]`}>
            Messaging
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-instrument-serif)] text-5xl text-white md:text-[60px]">
            Tau Talk
          </h1>
          <p className="mt-6 max-w-[600px] text-xl leading-relaxed text-[#8e8e93]">
            Conversations that stay between you. End-to-end encrypted messaging, calls, and group channels.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={tauTalkRoutes.login}
              className="rounded-md bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#e0bc4a]"
            >
              Open Tau Talk
            </Link>
            <Link
              href={tauTalkRoutes.download}
              className="rounded-md bg-[#171717] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#222]"
            >
              Download Android Beta
            </Link>
          </div>

          <TauTalkHeroMockup />
        </div>
      </section>

      <section className="bg-[#171717] px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[1280px]">
          <ProductSectionHeader badge="Capabilities" title="Real Privacy, No Compromise" muted />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-lg border border-[#262626] bg-[#0f0f0f] p-8">
                <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-[rgba(212,175,55,0.08)]">
                  <Shield className="size-5 text-[#d4af37]" />
                </div>
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8e8e93]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[800px] rounded-2xl border border-[#d4af37] bg-[#171717] p-12 text-center shadow-[0_12px_12px_rgba(212,175,55,0.04)]">
          <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl text-white">
            Start a conversation that stays private
          </h2>
          <p className="mt-4 text-[#8e8e93]">
            No phone number required. No personal information harvested. Just absolute cryptographic autonomy.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={tauTalkRoutes.download}
              className="rounded-md bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#e0bc4a]"
            >
              Download Android Beta
            </Link>
            <Link
              href={tauTalkRoutes.login}
              className="rounded-md border border-[#d4af37] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[rgba(212,175,55,0.08)]"
            >
              Join Web App
            </Link>
          </div>
        </div>
      </section>

      <CloudSuiteFooter brandName="Tau Talk" />
    </ProductPageLayout>
  );
}
