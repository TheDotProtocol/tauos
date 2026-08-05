'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Phone, Shield, Video } from 'lucide-react';
import { inter } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';
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
    body: 'Peer-to-peer webRTC streaming delivers crystal-clear audio and zero-latency video conferences without passing packets through centralized servers.',
  },
  {
    title: 'Cross-Platform',
    body: 'Continuous access wherever you are. Seamlessly coordinate chats across phones, desktops, web browsers, and tablets.',
  },
] as const;

const contacts = [
  { initials: 'JD', name: 'John Doe', preview: 'Decrypt keys completed.', time: '10:24 AM', online: true },
  { initials: 'AS', name: 'Alice Smith', preview: 'Can we discuss self-hosting tomorrow?', time: 'Yesterday', online: true },
  { initials: 'OP', name: 'Ops Room', preview: 'Service monitoring stable.', time: 'Monday', online: false },
] as const;

export default function TauTalkProductPage() {
  return (
    <ProductPageLayout>
      <CloudSuiteNav active="tau-talk" />

      <section className="px-6 pb-24 pt-20 md:px-20">
        <div className="mx-auto flex max-w-[960px] flex-col items-center text-center">
          <Image src="/website/logos/tau-talk/logo-primary.png" alt="" width={80} height={80} className="rounded-xl" />
          <p className={`${inter.className} mt-6 text-sm font-bold uppercase text-[#d4af37]`}>Messaging</p>
          <h1 className="mt-3 font-[family-name:var(--font-instrument-serif)] text-5xl md:text-[60px]">Tau Talk</h1>
          <p className="mt-6 max-w-[600px] text-xl leading-relaxed text-[#8e8e93]">
            Conversations that stay between you. End-to-end encrypted messaging, calls, and group channels.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={websiteRoutes.download} className="rounded-md bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#0f0f0f] hover:bg-[#e0bc4a]">
              Download Tau Talk
            </Link>
            <Link href={websiteRoutes.docs} className="rounded-md bg-[#171717] px-6 py-3 text-sm font-semibold hover:bg-[#222]">
              Self-Host Chat Server
            </Link>
          </div>

          {/* Chat mockup — Figma 31:2083 */}
          <div className="mt-16 flex w-full max-w-[1000px] overflow-hidden rounded-xl border border-[#262626] bg-[#171717] shadow-[0_20px_40px_rgba(0,0,0,0.7)]">
            <div className="hidden w-[280px] shrink-0 flex-col gap-6 border-r border-[#262626] p-5 sm:flex">
              <div className="flex items-center justify-between">
                <span className="font-bold">Chats</span>
              </div>
              {contacts.map((c) => (
                <div key={c.name} className="flex gap-3">
                  <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#48484a] text-sm font-semibold">
                    {c.initials}
                    {c.online && <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-[#28c840]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{c.name}</span>
                      <span className="text-[11px] text-[#8e8e93]">{c.time}</span>
                    </div>
                    <p className="truncate text-xs text-[#8e8e93]">{c.preview}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-[#262626] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#48484a] text-sm font-semibold">JD</div>
                  <div className="text-left">
                    <p className="text-sm font-bold">John Doe</p>
                    <p className="text-[11px] text-[#d4af37]">E2EE Secured Session</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="size-[18px] text-[#d4af37]" />
                  <Video className="size-[18px] text-[#d4af37]" />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-end gap-4 p-5">
                <div className="flex items-end gap-2">
                  <div className="max-w-[340px] rounded-bl rounded-br-xl rounded-tl-xl rounded-tr-xl bg-[#222] p-3 text-left text-[13px] leading-relaxed">
                    Are the database changes committed to our primary cluster yet?
                  </div>
                  <span className="text-[10px] text-[#8e8e93]">10:22 AM</span>
                </div>
                <div className="flex items-end justify-end gap-2">
                  <span className="text-[10px] text-[#8e8e93]">10:24 AM</span>
                  <div className="max-w-[340px] rounded-bl-xl rounded-br rounded-tl-xl rounded-tr-xl border border-[#d4af37] bg-[rgba(212,175,55,0.08)] p-3 text-left text-[13px] leading-relaxed">
                    Yes, synced across all nodes. Everything is fully decentralized and running fine.
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8e8e93]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[800px] rounded-2xl border border-[#d4af37] bg-[#171717] p-12 text-center shadow-[0_12px_12px_rgba(212,175,55,0.04)]">
          <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl">Start a conversation that stays private</h2>
          <p className="mt-4 text-[#8e8e93]">
            No phone number required. No personal information harvested. Just absolute cryptographic autonomy.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={websiteRoutes.download} className="rounded-md bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#0f0f0f] hover:bg-[#e0bc4a]">
              Download Desktop Client
            </Link>
            <Link href={websiteRoutes.tauTalk} className="rounded-md border border-[#d4af37] px-6 py-3 text-sm font-semibold hover:bg-[rgba(212,175,55,0.08)]">
              Join Web App
            </Link>
          </div>
        </div>
      </section>

      <CloudSuiteFooter brandName="Tau Talk" />
    </ProductPageLayout>
  );
}
