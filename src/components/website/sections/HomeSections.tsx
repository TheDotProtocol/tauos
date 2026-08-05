'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Circle, Users } from 'lucide-react';
import { instrumentSerif } from '@/lib/website/fonts';
import { useMotionReady } from '@/lib/website/useMotionReady';
import SectionBadge from '@/components/website/ui/SectionBadge';
import { GlowOrb } from '@/components/website/ui/GlowBackground';
import DeveloperCodeEditor from '@/components/website/ui/DeveloperCodeEditor';

function FadeIn({ children, className }: { children: React.ReactNode; className?: string }) {
  const { motionEnabled } = useMotionReady();

  if (!motionEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function WelcomeSection() {
  const pillars = [
    {
      icon: Shield,
      title: 'Privacy as a Right',
      body: 'We treat your data like physical property. Your emails, files, and coordinates belong exclusively inside your private devices—never used to feed models, construct user profiles, or sell targeted ads.',
    },
    {
      icon: Circle,
      title: 'Pure Simplicity',
      body: 'Our systems are built on fluid geometry, honest navigation, and absolute focus. We design products to work perfectly out-of-the-box, removing notifications and alert fatigue so you can create in peace.',
    },
    {
      icon: Users,
      title: 'Built for Humans',
      body: 'No technical buzzwords, no complicated subscription loops. Built by engineers who value tactile craft and sovereign digital spaces. Premium glass, milled magnesium, and pure code.',
    },
  ] as const;

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <GlowOrb src="/website/images/glow/chapter-1.svg" className="left-[8%] top-[10%]" size={400} />
      <GlowOrb src="/website/images/glow/chapter-2.svg" className="bottom-[10%] right-[5%]" size={500} />

      <div className="relative z-10 mx-auto max-w-[1440px] px-12 lg:px-[120px]">
        <FadeIn>
          <SectionBadge number="01" label="Welcome" />
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <h2 className={`${instrumentSerif.className} text-4xl leading-[1.15] text-white md:text-[48px] md:leading-[56px]`}>
              Welcome to something different.
            </h2>
            <div className="flex flex-col gap-6 text-[rgba(255,255,255,0.5)]">
              <p className="text-lg leading-7">
                Tau isn&apos;t just another tech brand. We build custom-engineered hardware and deeply integrated sovereign software to give you complete digital command.
              </p>
              <p className="text-[15px] leading-6">
                No tracking scripts, no aggressive advertising hooks, and no dark patterns designed to waste your attention. Just beautifully forged machinery running software designed to obey your intentions.
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="my-20 h-px w-full bg-[rgba(255,255,255,0.07)]" />

        <FadeIn>
          <SectionBadge number="02" label="Why Tau Exists" />
          <div className="grid gap-12 md:grid-cols-3 md:gap-12">
            {pillars.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex flex-col gap-5">
                <div className="flex size-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.1)]">
                  <Icon className="size-5 text-[#d4af37]" strokeWidth={1.5} />
                </div>
                <h3 className={`${instrumentSerif.className} text-[28px] text-white`}>{title}</h3>
                <p className="text-sm leading-relaxed text-[rgba(255,255,255,0.5)]">{body}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function EcosystemSection() {
  const personal = [
    ['Tau Core', 'Sovereign hardware node serving as your local encrypted database and cloud bridge.', '/products/tau-core', '/website/icons/ecosystem/database.svg'],
    ['Tau Phone', 'Milled metal hardware with a zero-telemetry OS designed to respect your life.', '/products/tau-phone', '/website/icons/ecosystem/smartphone.svg'],
    ['Tau Book Pro', 'Ultra-thin magnesium laptop powered by a hyper-efficient system architecture.', '/products/tau-book-pro', '/website/icons/ecosystem/laptop.svg'],
    ['Tau Browser', 'A clean, secure doorway to the web. Blocks tracking and ads natively.', '/taubrowser', '/website/icons/ecosystem/compass.svg'],
    ['Tau Mail', 'End-to-end encrypted inbox, hosted locally or securely synced with zero snooping.', '/taumail', '/website/icons/ecosystem/mail.svg'],
    ['Tau Talk', 'Pure private communications—secure, instant video and audio channels.', '/tautalk', '/website/icons/ecosystem/mic.svg'],
    ['Tau Drive', 'Fully encrypted cloud backup. Your files, hosted on your secure personal node.', '/products/tau-drive', '/website/icons/ecosystem/cloud-upload.svg'],
  ] as const;

  const dev = [
    ['Tau IDE', 'Elegant workspace tailored for crafting fast, native apps for the Tau ecosystem.', '/developers', '/website/icons/ecosystem/code.svg'],
    ['Tau AI', 'Private, secure AI inference running locally on your hardware node.', '/tauai', '/website/icons/ecosystem/brain.svg'],
    ['Tau Cloud', 'Scalable sovereign infrastructure for testing, compiling, and hosting dApps.', '/taucloud', '/website/icons/ecosystem/network.svg'],
    ['Tau ID', 'Cryptographically-secured identity protocol allowing passport-free authentication.', '/tauid', '/website/icons/ecosystem/user-key.svg'],
  ] as const;

  const business = [
    ['Tau Startup', 'Custom-built package with infrastructure and resources designed for fast-scaling projects.', '/products/tau-startup', '/website/icons/ecosystem/rocket.svg'],
    ['Project Grayscale', 'Experimental visual interface initiative designed to bring absolute zero distraction.', '/products/project-grayscale', '/website/icons/ecosystem/circle-x.svg'],
    ['Business Hardware', 'Secure-by-design systems tailored to enforce absolute corporate confidentiality.', '/enterprise', '/website/icons/ecosystem/cpu.svg'],
    ['Enterprise Solutions', 'SSO, managed security layers, and dedicated support for modern digital workflows.', '/enterprise', '/website/icons/ecosystem/building.svg'],
  ] as const;

  return (
    <section className="relative overflow-hidden border-y border-[rgba(255,255,255,0.07)] py-24 md:py-32">
      <GlowOrb src="/website/images/glow/chapter-1.svg" className="left-1/2 top-0 -translate-x-1/2" size={1000} />
      <div className="relative z-10 mx-auto max-w-[1440px] px-12 lg:px-[120px]">
        <FadeIn>
          <SectionBadge number="03" label="Ecosystem Map" />
          <h2 className={`${instrumentSerif.className} mb-14 text-[48px] leading-[56px] text-white`}>
            Meet the Tau Ecosystem.
          </h2>
        </FadeIn>
        <EcosystemGroup title="Personal Core" items={personal} />
        <EcosystemGroup title="Developer & Build Tools" items={dev} />
        <EcosystemGroup title="Business & Scale" items={business} />
      </div>
    </section>
  );
}

function EcosystemGroup({ title, items }: { title: string; items: readonly (readonly [string, string, string, string])[] }) {
  const rows: (readonly (readonly [string, string, string, string])[])[] = [];
  for (let i = 0; i < items.length; i += 4) {
    rows.push(items.slice(i, i + 4));
  }

  return (
    <FadeIn className="mb-10 last:mb-0">
      <p className="mb-4 text-xs font-bold uppercase text-[rgba(255,255,255,0.5)]">{title}</p>
      <div className="flex flex-col gap-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {row.map(([name, desc, href, icon]) => (
              <a
                key={name}
                href={href}
                className="group flex h-[130px] flex-1 flex-col gap-3 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#121214] p-6 transition hover:border-[rgba(212,175,55,0.25)]"
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <p className="text-base font-semibold text-white group-hover:text-[#d4af37]">{name}</p>
                  <Image src={icon} alt="" width={20} height={20} className="size-5 shrink-0" />
                </div>
                <p className="text-[13px] leading-[1.5] text-[rgba(255,255,255,0.5)]">{desc}</p>
              </a>
            ))}
          </div>
        ))}
      </div>
    </FadeIn>
  );
}

export function PrivacySection() {
  const items = [
    { icon: '/website/icons/sections/shield-check.svg', title: 'Your data stays yours.', body: "We don't sell, share, or monetize your personal information. Period. All parameters stay processed directly inside local chips." },
    { icon: '/website/icons/sections/lock.svg', title: 'Encryption everywhere.', body: 'End-to-end encryption across every Tau service. Not optional, not premium. Standard protocols running silently by design.' },
    { icon: '/website/icons/sections/eye.svg', title: 'Transparent by design.', body: 'Open-source core. Public audits. Every promise we claim is verifiable in open space. No hidden logic scripts behind closed curtains.' },
  ];
  return (
    <section id="privacy" className="relative overflow-hidden py-24 md:py-32">
      <GlowOrb src="/website/images/glow/privacy-center.svg" className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={700} />
      <div className="relative z-10 mx-auto max-w-[1440px] px-12 lg:px-[120px]">
        <FadeIn>
          <div className="mb-14 flex flex-col items-center gap-6 text-center">
            <SectionBadge number="05" label="Privacy That Makes Sense" />
            <h2 className={`${instrumentSerif.className} max-w-4xl text-4xl text-white md:text-[64px] md:leading-[72px]`}>
              Sovereignty isn&apos;t a premium feature.
            </h2>
          </div>
          <div className="flex flex-col gap-6 lg:flex-row">
            {items.map((item) => (
              <div key={item.title} className="flex flex-1 flex-col gap-5 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#121214] p-8">
                <div className="flex size-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.1)]">
                  <Image src={item.icon} alt="" width={20} height={20} className="size-5" />
                </div>
                <h3 className={`${instrumentSerif.className} text-[28px] text-white`}>{item.title}</h3>
                <p className="text-sm leading-[22px] text-[rgba(255,255,255,0.5)]">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-12 flex max-w-[800px] flex-col items-center gap-4 pt-6">
            <div className="h-px w-full bg-[rgba(255,255,255,0.07)]" />
            <p className="text-center text-base leading-[26px] text-[rgba(255,255,255,0.5)]">
              &ldquo;Privacy isn&apos;t a feature we added. It&apos;s the foundation we built everything on. Every line of code, every product decision, every business model — privacy comes first.&rdquo;
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function BuiltForEveryoneSection() {
  const segments = [
    { icon: '/website/icons/sections/everyone/book-open.svg', title: 'Students', subtitle: 'Educational Access', body: 'Focus on learning, not fighting with technology. Free for students worldwide.' },
    { icon: '/website/icons/sections/everyone/heart.svg', title: 'Families', subtitle: 'Generational Harmony', body: 'Keep everyone connected and safe. One ecosystem, every generation.' },
    { icon: '/website/icons/sections/everyone/sparkles.svg', title: 'Creators', subtitle: 'Aesthetic Flow', body: 'Your tools should inspire, not frustrate. Create without limits.' },
    { icon: '/website/icons/sections/everyone/code.svg', title: 'Developers', subtitle: 'Open Sovereignty', body: 'Open APIs. Clean documentation. A platform that respects your craft.' },
    { icon: '/website/icons/sections/everyone/briefcase.svg', title: 'Businesses', subtitle: 'Human-Scale Systems', body: 'Enterprise-grade. Human-scale. Technology your team will actually enjoy using.' },
  ] as const;

  return (
    <section className="relative overflow-hidden border-y border-[rgba(255,255,255,0.07)] py-24 md:py-32">
      <GlowOrb src="/website/images/glow/everyone-left.svg" className="left-[8%] bottom-[10%]" size={600} />
      <div className="relative z-10 mx-auto max-w-[1440px] px-12 lg:px-[120px]">
        <FadeIn>
          <div className="mb-14 flex flex-col items-center gap-6 text-center">
            <SectionBadge number="06" label="Built For Everyone" />
            <h2 className={`${instrumentSerif.className} max-w-4xl text-4xl text-white md:text-[64px] md:leading-[72px]`}>
              Sovereign technology, shaped for real life.
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {segments.map(({ icon, title, subtitle, body }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#121214] px-8 py-5 transition hover:border-[rgba(212,175,55,0.2)] lg:flex-row lg:items-center lg:justify-between lg:gap-6"
              >
                <div className="flex items-center gap-6 lg:w-[400px] lg:shrink-0">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.1)]">
                    <Image src={icon} alt="" width={18} height={18} className="size-[18px]" />
                  </div>
                  <div>
                    <p className={`${instrumentSerif.className} text-2xl text-white`}>{title}</p>
                    <p className="text-[11px] uppercase text-[#c5a44e]">{subtitle}</p>
                  </div>
                </div>
                <p className="flex-1 text-[15px] text-[rgba(255,255,255,0.5)] lg:text-left">{body}</p>
                <div className="hidden shrink-0 rounded-full p-2 lg:block">
                  <Image src="/website/icons/sections/everyone/chevron-right.svg" alt="" width={14} height={14} className="size-3.5" />
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function BusinessSection() {
  const cards = [
    {
      icon: '/website/icons/sections/business/rocket.svg',
      title: 'Tau Startup',
      body: 'Launch with confidence. Everything founders need to build, ship, and scale their next-generation sovereign operations.',
      active: true,
    },
    {
      icon: '/website/icons/sections/business/circle-x.svg',
      title: 'Project Grayscale',
      body: 'Open-source tools tailored explicitly for remote engineering teams who demand perfect architectural transparency and real-time cryptography.',
      active: false,
    },
    {
      icon: '/website/icons/sections/business/laptop-minimal.svg',
      title: 'Business Devices',
      body: 'Tau Phone and Tau Book Pro configurations explicitly tuned for your department core. Air-gapped isolation and hardware encryption by default.',
      active: false,
    },
    {
      icon: '/website/icons/sections/business/shield-half.svg',
      title: 'Enterprise Solutions',
      body: 'Sovereign server deployments, dedicated physical failover pipelines, and zero-trust private infrastructure custom configured for global networks.',
      active: false,
    },
  ] as const;

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <GlowOrb src="/website/images/glow/business-left.svg" className="left-[5%] top-[15%]" size={600} />
      <GlowOrb src="/website/images/glow/business-right.svg" className="right-[5%] bottom-[10%]" size={600} />
      <div className="relative z-10 mx-auto max-w-[1440px] px-12 lg:px-[120px]">
        <FadeIn>
          <div className="mb-16 flex flex-col items-center gap-6 text-center">
            <SectionBadge number="07" label="Tau for Business" />
            <h2 className={`${instrumentSerif.className} text-4xl text-white md:text-[64px] md:leading-[72px]`}>
              Built to grow with you.
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {cards.map(({ icon, title, body, active }) => (
              <div
                key={title}
                className={`flex h-[280px] w-full max-w-[588px] flex-col gap-8 rounded-2xl border bg-[#121214] p-8 ${
                  active
                    ? 'border-[rgba(212,175,55,0.3)] shadow-[0_8px_12px_rgba(212,175,55,0.02)]'
                    : 'border-[rgba(212,175,55,0.14)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`rounded-xl p-3 ${
                      active
                        ? 'border border-[rgba(212,175,55,0.14)] bg-[rgba(212,175,55,0.05)]'
                        : 'border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.1)]'
                    }`}
                  >
                    <Image src={icon} alt="" width={24} height={24} className="size-6" />
                  </div>
                  {active && (
                    <span className="rounded-full bg-[#d4af37]/15 px-2.5 py-1 text-[10px] font-semibold text-[#d4af37]">
                      Active Glow
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-[22px] text-[rgba(255,255,255,0.5)]">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <Link
              href="/contact"
              className="rounded-full border border-[#d4af37] bg-[#0a0a0b] px-8 py-3 text-sm font-semibold text-[#d4af37] transition hover:bg-[rgba(212,175,55,0.08)]"
            >
              Talk to our team
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function DevelopersSection() {
  const features = [
    { icon: '/website/icons/developers/code.svg', title: 'Native Platform SDKs', body: 'Swift, Kotlin, Rust, and TypeScript toolkits engineered with absolute type-safety.' },
    { icon: '/website/icons/developers/chart-network.svg', title: 'REST & GraphQL Endpoints', body: 'Deterministic state-sync routes with simple global rate-limits and zero surprise pricing.' },
    { icon: '/website/icons/developers/book-open.svg', title: 'Engineered Documentation', body: 'Pure conceptual specs and live terminal blocks written directly by hardware engineers.' },
    { icon: '/website/icons/developers/github.svg', title: 'Open Source & Auditable', body: 'Fork, build, and deploy. Full cryptographic core verifiable by international audits.' },
  ] as const;

  return (
    <section className="relative overflow-hidden border-y border-[rgba(255,255,255,0.07)] py-24 md:py-32">
      <GlowOrb src="/website/images/glow/developers-center.svg" className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={700} />
      <div className="relative z-10 mx-auto max-w-[1440px] px-12 lg:px-[120px]">
        <FadeIn>
          <div className="mb-12 flex flex-col items-center gap-6 text-center">
            <SectionBadge number="08" label="Sovereign APIs" />
            <h2 className={`${instrumentSerif.className} text-4xl text-white md:text-[64px] md:leading-[72px]`}>
              For people who build things.
            </h2>
          </div>
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
            <div className="flex flex-1 flex-col gap-4">
              {features.map(({ icon, title, body }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#121214] p-5"
                >
                  <div className="flex shrink-0 items-start rounded-lg bg-[rgba(255,255,255,0.1)] p-2.5">
                    <Image src={icon} alt="" width={20} height={20} className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-[rgba(255,255,255,0.5)]">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1">
              <DeveloperCodeEditor />
            </div>
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              href="/developers"
              className="rounded-full bg-[#d4af37] px-8 py-3 text-sm font-semibold text-[#0a0a0b] transition hover:bg-[#e5c348]"
            >
              Start Building
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function CommunitySection() {
  const cards = [
    {
      icon: '/website/icons/sections/community/calendar-range.svg',
      stat: 'Upcoming: Tau Conf Tokyo',
      title: 'Events',
      body: 'Tau Meetups, annual conferences, local gatherings. Meet the people building the future alongside you.',
    },
    {
      icon: '/website/icons/sections/community/video.svg',
      stat: 'Active: 48 Documentaries',
      title: 'Stories',
      body: 'Real stories from real people using Tau every day. No scripts, no actors. Perfect human technological transparency.',
    },
    {
      icon: '/website/icons/sections/community/message-square-text.svg',
      stat: 'Members: 142k Active',
      title: 'Forums',
      body: 'Ask questions. Share ideas. Help others. A community built on mutual respect and air-gapped cryptography help desk.',
    },
    {
      icon: '/website/icons/sections/community/git-branch.svg',
      stat: 'Repositories: 18 Main',
      title: 'Open Source',
      body: 'Contribute to Tau. Every pull request matters. Every voice counts in constructing a safe collective infrastructure.',
    },
  ] as const;

  return (
    <section id="community" className="relative overflow-hidden py-24 md:py-32">
      <GlowOrb src="/website/images/glow/community-ambient.svg" className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={900} />
      <div className="relative z-10 mx-auto max-w-[1440px] px-12 lg:px-[120px]">
        <FadeIn>
          <div className="mb-16 flex flex-col items-center gap-5 text-center">
            <SectionBadge number="09" label="Global Community" />
            <h2 className={`${instrumentSerif.className} text-4xl text-white md:text-[64px] md:leading-[72px]`}>
              You belong here.
            </h2>
            <p className="max-w-[680px] text-base leading-[26px] text-[rgba(255,255,255,0.5)]">
              We are architects, artists, developers, and writers shaping a digital landscape where personal data sovereignty remains intact. Our forum is your sovereign hearth.
            </p>
          </div>
          <div className="flex flex-col gap-6 lg:flex-row">
            {cards.map(({ icon, stat, title, body }) => (
              <div
                key={title}
                className="flex flex-1 flex-col gap-6 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#121214] p-7 shadow-[0_8px_8px_rgba(0,0,0,0.19)] transition hover:border-[rgba(212,175,55,0.2)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="rounded-[10px] border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.08)] p-2.5">
                    <Image src={icon} alt="" width={20} height={20} className="size-5" />
                  </div>
                  <span className="rounded-full bg-[rgba(255,255,255,0.03)] px-2.5 py-1 text-[10px] font-semibold text-[rgba(255,255,255,0.5)]">
                    {stat}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-1.5 text-[13px] leading-5 text-[rgba(255,255,255,0.5)]">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function JoinTauSection() {
  return (
    <section className="relative overflow-hidden border-t border-[rgba(255,255,255,0.07)] py-24 md:py-32">
      <GlowOrb src="/website/images/glow/join-ambient.svg" className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={1000} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
        <Image src="/website/images/glow/floating-dust.svg" alt="" width={1074} height={574} className="max-w-[90%] object-contain" />
      </div>
      <div className="relative z-10 mx-auto max-w-[1440px] px-12 lg:px-[120px]">
        <FadeIn>
          <div className="mb-16 flex flex-col items-center gap-5 text-center">
            <SectionBadge number="10" label="Initiate Sovereignty" />
            <h2 className={`${instrumentSerif.className} text-5xl text-white md:text-[72px] md:leading-[80px]`}>
              Ready to begin?
            </h2>
            <p className="max-w-[600px] text-base leading-[26px] text-[rgba(255,255,255,0.5)]">
              Choose your path to systemic transition. Run the core system, join our dispatch newsletters, or become a physical nodes operator.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {/* Newsletter */}
            <div className="flex flex-col gap-7 rounded-2xl border border-[rgba(212,175,55,0.2)] bg-[#121214] p-8 shadow-[0_8px_12px_rgba(212,175,55,0.02)]">
              <div>
                <p className="text-[13px] font-semibold uppercase text-[#d4af37]">Stay Informed</p>
                <h3 className="mt-1 text-xl font-semibold text-white">Newsletter</h3>
                <p className="mt-1 text-[13px] text-[rgba(255,255,255,0.5)]">
                  Stay close. No spam. Just honest updates, dispatch field reports, and cryptographic releases.
                </p>
              </div>
              <div className="flex h-11 items-center overflow-hidden rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#161619]">
                <input
                  type="email"
                  placeholder="Enter your sovereign email..."
                  className="min-w-0 flex-1 bg-transparent px-4 text-[13px] text-white placeholder:text-[rgba(255,255,255,0.5)] focus:outline-none"
                />
                <button type="button" className="flex h-full items-center justify-center bg-[#d4af37] px-4">
                  <Image src="/website/icons/sections/join/send.svg" alt="" width={16} height={16} className="size-4" />
                </button>
              </div>
            </div>

            {/* Download Core */}
            <div className="flex flex-col gap-7 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#121214] p-8">
              <div>
                <p className="text-[13px] font-semibold uppercase text-[rgba(255,255,255,0.5)]">Open Source System</p>
                <h3 className="mt-1 text-xl font-semibold text-white">Download Core</h3>
                <p className="mt-1 text-[13px] text-[rgba(255,255,255,0.5)]">
                  Get Tau Core. Free. No strings attached. Build your network on sovereign foundation.
                </p>
              </div>
              <Link
                href="/download"
                className="flex items-center justify-center gap-3 rounded-full border border-[rgba(255,255,255,0.07)] bg-[#161619] px-6 py-3 text-sm font-semibold text-white transition hover:border-[rgba(212,175,55,0.3)]"
              >
                Get Tau Core v1.4
                <Image src="/website/icons/sections/join/download.svg" alt="" width={14} height={14} className="size-3.5" />
              </Link>
              <div className="flex justify-center gap-4">
                <Image src="/website/icons/sections/join/apple.svg" alt="" width={16} height={16} className="size-4 opacity-60" />
                <Image src="/website/icons/sections/join/circle-x.svg" alt="" width={16} height={16} className="size-4 opacity-60" />
                <Image src="/website/icons/sections/join/terminal.svg" alt="" width={16} height={16} className="size-4 opacity-60" />
              </div>
            </div>

            {/* Community */}
            <div className="flex flex-col gap-7 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#121214] p-8">
              <div>
                <p className="text-[13px] font-semibold uppercase text-[rgba(255,255,255,0.5)]">Join Thousands</p>
                <h3 className="mt-1 text-xl font-semibold text-white">Community</h3>
                <p className="mt-1 text-[13px] text-[rgba(255,255,255,0.5)]">
                  Join thousands already building something better. Chat real-time in community channels.
                </p>
              </div>
              <Link href="/contact" className="flex items-center justify-center gap-2 text-sm font-semibold text-[#d4af37] transition hover:text-[#e5c348]">
                Join our Discord Server
                <Image src="/website/icons/sections/join/arrow-up-right.svg" alt="" width={14} height={14} className="size-3.5" />
              </Link>
            </div>

            {/* Get Started */}
            <div className="flex flex-col gap-7 rounded-2xl border border-[rgba(212,175,55,0.2)] bg-[#121214] p-8 shadow-[0_12px_16px_rgba(212,175,55,0.04)]">
              <div>
                <p className="text-[13px] font-semibold uppercase text-[#d4af37]">Your Journey Starts Now</p>
                <h3 className="mt-1 text-xl font-semibold text-white">Get Started</h3>
                <p className="mt-1 text-[13px] text-[rgba(255,255,255,0.5)]">
                  Embark on pure cognitive alignment. Order hardware systems or deploy services seamlessly.
                </p>
              </div>
              <Link
                href="/download"
                className="flex items-center justify-center rounded-full bg-[#d4af37] py-3 text-sm font-semibold text-[#0a0a0b] transition hover:bg-[#e5c348]"
              >
                Get Tau Now
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
