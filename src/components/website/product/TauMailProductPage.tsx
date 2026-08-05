'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check, EyeOff, Globe, Inbox, Lock, Sparkles } from 'lucide-react';
import { inter } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';
import AppsSuiteFooter from '@/components/website/product/shared/AppsSuiteFooter';
import AppsSuiteNav from '@/components/website/product/shared/AppsSuiteNav';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import ProductSectionHeader from '@/components/website/product/shared/ProductSectionHeader';

const features = [
  {
    icon: Lock,
    title: 'End-to-End Encrypted',
    body: 'Messages are encrypted on your device before they ever leave. Only you and your recipient hold the keys.',
  },
  {
    icon: EyeOff,
    title: 'No Ads. Zero Tracking',
    body: 'We never scan your inbox to build ad profiles. Your correspondence is invisible to us by design.',
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    body: 'Bring your own domain with full DNS control. Professional identity without surrendering your data.',
  },
  {
    icon: Sparkles,
    title: 'Smart Filtering',
    body: 'On-device spam detection and priority sorting. Intelligence that never uploads your message content.',
  },
] as const;

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    desc: 'Smallest personal communication basics.',
    features: ['1 GB encrypted storage', 'Single custom alias', 'Standard spam filter', 'Community support'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$8',
    period: '/mo',
    desc: 'Advanced identity mapping and custom tools.',
    features: ['50 GB encrypted storage', '5 custom domains', 'Priority routing', 'Advanced filters'],
    cta: 'Get Started',
    highlighted: true,
    badge: 'Recommended',
  },
  {
    name: 'Business',
    price: '$16',
    period: '/mo',
    desc: 'Ultimate compliance and administrative tools.',
    features: ['Unlimited storage', 'Team admin console', 'Audit trail exports', 'Dedicated support'],
    cta: 'Get Started',
    highlighted: false,
  },
] as const;

const inbox = [
  { name: 'Zoe Harrington', subject: 'Review: Security Audit logs V2', time: '10:24 AM', unread: true },
  { name: 'Ethan Blackwell', subject: 'Meridian integration blueprint', time: 'Yesterday', unread: true },
  { name: 'Tau Registrar', subject: 'Your domain registrar verification', time: 'Yesterday', unread: false },
] as const;

export default function TauMailProductPage() {
  return (
    <ProductPageLayout>
      <AppsSuiteNav active="tau-mail" />

      <section className="px-6 pb-24 pt-20 md:px-20">
        <div className="mx-auto flex max-w-[960px] flex-col items-center text-center">
          <Image src="/website/logos/tau-mail/logo-primary.png" alt="" width={80} height={80} className="rounded-xl" />
          <p className={`${inter.className} mt-6 text-sm font-bold uppercase text-[#d4af37]`}>Communicate</p>
          <h1 className="mt-3 font-[family-name:var(--font-instrument-serif)] text-5xl md:text-[60px]">Tau Mail</h1>
          <p className="mt-6 max-w-[600px] text-xl leading-relaxed text-[#a0a0a0]">
            Email that keeps your conversations private. Zero access tracking, on-device spam detection, and end-to-end encrypted inbox storage.
          </p>
          <Link
            href={websiteRoutes.tauMail}
            className="mt-8 rounded-lg bg-[#d4af37] px-7 py-3.5 text-[15px] font-bold text-[#0f0f0f] hover:bg-[#e0bc4a]"
          >
            Get Tau Mail
          </Link>

          {/* Mail mockup — Figma 31:1472 */}
          <div className="mt-16 flex w-full max-w-[1000px] overflow-hidden rounded-xl border border-[#2a2820] bg-[#161616] shadow-[0_16px_32px_-4px_rgba(0,0,0,0.7)]">
            <div className="hidden w-[200px] shrink-0 flex-col gap-6 border-r border-[#2a2820] p-5 sm:flex">
              <div className="rounded-md bg-[#d4af37] px-4 py-2.5 text-center text-xs font-bold text-[#0f0f0f]">
                Compose Message
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 rounded bg-[#222] p-2 font-semibold">
                  <Inbox className="size-3.5" /> Inbox <span className="ml-auto text-[#d4af37]">3 unread</span>
                </div>
                {['Sent', 'Drafts', 'Spam'].map((f) => (
                  <div key={f} className="p-2 text-[#a0a0a0]">{f}</div>
                ))}
              </div>
            </div>
            <div className="w-[320px] shrink-0 border-r border-[#2a2820] bg-[#0f0f0f]">
              <div className="border-b border-[#2a2820] p-4 text-xs font-bold">INBOX</div>
              {inbox.map((m) => (
                <div key={m.name} className={`border-b border-[#2a2820] p-4 ${m.unread ? 'bg-[#161616]' : ''}`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-bold">
                      {m.unread && <span className="size-1.5 rounded-full bg-[#d4af37]" />}
                      {m.name}
                    </span>
                    <span className="text-[#666]">{m.time}</span>
                  </div>
                  <p className="mt-1 truncate text-[13px] text-[#a0a0a0]">{m.subject}</p>
                </div>
              ))}
            </div>
            <div className="hidden flex-1 p-6 md:block">
              <div className="flex items-start justify-between border-b border-[#2a2820] pb-4">
                <h3 className="text-lg font-bold">Review: Security Audit logs V2</h3>
                <span className="rounded border border-[#9e8124] bg-[#3a3114] px-2 py-1 text-[10px] font-bold text-[#d4af37]">
                  E2E ENCRYPTED
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#a0a0a0]">
                Hi team — attached are the updated audit logs for V2. All endpoints have been verified against the latest cryptographic spec. Please review before we push to production nodes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#2a2820] bg-[#161616] px-6 py-24 md:px-20">
        <div className="mx-auto max-w-[1280px]">
          <ProductSectionHeader
            badge="Zero Silent Visibility"
            title="Secure communication without compromise"
            description="Most email servers scan your content to build ad matrices. Tau Mail encrypts your communications securely on-device."
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
          <ProductSectionHeader badge="The Pricing Model" title="Fair pricing for honest privacy" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-10 ${
                  plan.highlighted
                    ? 'border-[#d4af37] bg-[#161616] shadow-[0_12px_12px_rgba(212,175,55,0.08)]'
                    : 'border-[#2a2820] bg-[#161616]'
                }`}
              >
                {'badge' in plan && plan.badge && (
                  <span className="mb-4 inline-block rounded-full bg-[#3a3114] px-3 py-1 text-[10px] font-bold uppercase text-[#d4af37]">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-sm text-[#a0a0a0]">{plan.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-[#a0a0a0]">{plan.period}</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                      <Check className="size-4 shrink-0 text-[#d4af37]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={websiteRoutes.register}
                  className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold ${
                    plan.highlighted
                      ? 'bg-[#d4af37] text-[#0f0f0f] hover:bg-[#e0bc4a]'
                      : 'border border-[#2a2820] hover:border-[#d4af37]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AppsSuiteFooter />
    </ProductPageLayout>
  );
}
