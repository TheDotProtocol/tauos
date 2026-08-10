'use client';

import Image from 'next/image';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import JourneyNav from '@/components/website/marketing/shared/JourneyNav';
import JourneyFooter from '@/components/website/marketing/shared/JourneyFooter';
import { inter, instrumentSerif } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';
import { clsx } from 'clsx';
import { ArrowRight, Sparkles } from 'lucide-react';

type MilestoneStatus = 'shipped' | 'in-progress' | 'planned';

type Milestone = {
  quarter: string;
  title: string;
  status: MilestoneStatus;
  items: string[];
  side: 'left' | 'right';
  marker: 'complete' | 'current' | 'upcoming' | 'vision';
  label?: string;
  faded?: boolean;
};

const milestones: Milestone[] = [
  {
    quarter: 'Q1 2026',
    title: 'Foundation & Launch',
    status: 'shipped',
    side: 'left',
    marker: 'complete',
    items: ['Tau Core 1.0 Launch', 'Tau Mail Beta', 'Tau Browser Alpha'],
  },
  {
    quarter: 'Q2 2026',
    title: 'Infrastructure Scale',
    status: 'shipped',
    side: 'right',
    marker: 'complete',
    items: ['Tau Cloud Launch', 'Tau Talk Beta', 'Tau AI Alpha', 'Project Grayscale Open Source'],
  },
  {
    quarter: 'Q3 2026',
    title: 'Sovereign Operating System',
    status: 'in-progress',
    side: 'left',
    marker: 'current',
    label: 'Current focus',
    items: [
      'Tau Desktop OS Beta',
      'Tau Mobile OS Alpha',
      'Tau Mail Android & iOS apps',
      'Tau Developer Platform',
      'Tau ID Launch',
    ],
  },
  {
    quarter: 'Q4 2026',
    title: 'Hardware Integration',
    status: 'planned',
    side: 'right',
    marker: 'upcoming',
    faded: true,
    items: ['Tau Phone Hardware', 'Tau Book Pro', 'Tau Store', 'Enterprise Solutions'],
  },
  {
    quarter: '2027',
    title: 'Ubiquitous Ecosystem & Vision',
    status: 'planned',
    side: 'left',
    marker: 'vision',
    faded: true,
    items: ['Tau Watch', 'Tau Glass', 'Tau Tablet', 'Global Expansion'],
  },
];

function StatusBadge({ status }: { status: MilestoneStatus }) {
  const styles = {
    shipped: 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-400',
    'in-progress': 'border border-[#d4af37]/40 bg-[#3a3114] text-[#d4af37]',
    planned: 'border border-[#2a2820] bg-[#161616] text-[#8e8e93]',
  };
  const labels = { shipped: 'Shipped', 'in-progress': 'In Progress', planned: 'Planned' };
  return (
    <span className={clsx('rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide', styles[status])}>
      {labels[status]}
    </span>
  );
}

function TimelineMarker({ marker }: { marker: Milestone['marker'] }) {
  if (marker === 'complete') {
    return (
      <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.35)]">
        <Image src={marketingAssets.roadmap.check} alt="" width={14} height={14} />
      </span>
    );
  }
  if (marker === 'current') {
    return (
      <span className="relative z-10 flex size-10 items-center justify-center">
        <span className="absolute inset-0 animate-pulse rounded-full bg-[#d4af37]/20" />
        <Image src={marketingAssets.roadmap.markerCurrent} alt="" width={36} height={36} />
      </span>
    );
  }
  return (
    <span className="relative z-10 flex size-7 items-center justify-center">
      <Image src={marketingAssets.roadmap.markerUpcoming} alt="" width={24} height={24} />
    </span>
  );
}

function MilestoneCard({ m }: { m: Milestone }) {
  const isCurrent = m.marker === 'current';

  return (
    <article
      className={clsx(
        'w-full rounded-2xl border bg-[#161616] p-8 md:max-w-[460px] md:p-10',
        isCurrent
          ? 'border-[#d4af37]/50 shadow-[0_16px_48px_rgba(212,175,55,0.12)]'
          : 'border-[#2a2820]',
        m.faded && !isCurrent && 'opacity-70',
        m.marker === 'vision' && 'opacity-50',
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold uppercase tracking-wide text-[#d4af37]">{m.quarter}</p>
        <StatusBadge status={m.status} />
      </div>

      {isCurrent && m.label && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#3a3114] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#d4af37]">
          <Sparkles className="size-3" />
          {m.label}
        </p>
      )}

      <h3 className="mt-5 text-2xl font-bold leading-snug text-white">{m.title}</h3>

      <ul className="mt-6 space-y-3.5">
        {m.items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#a0a0a0]">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#d4af37]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function RoadmapPage() {
  const markerLabels: Record<Milestone['marker'], string> = {
    complete: 'Complete',
    current: 'Now',
    upcoming: 'Next',
    vision: 'Vision',
  };

  return (
    <ProductPageLayout>
      <JourneyNav active="roadmap" />

      <section className={`${inter.className} relative overflow-hidden px-6 pb-20 pt-24 md:px-20 md:pb-28 md:pt-28`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_55%)]" />
        <div className="relative mx-auto max-w-[800px] text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]">The Journey</p>
          <h1
            className={`${instrumentSerif.className} mt-6 text-5xl font-normal tracking-tight text-white md:text-7xl`}
          >
            Roadmap
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#8e8e93] md:text-xl">
            Where we are. Where we are going. A transparent view of the Tau ecosystem — from shipped
            milestones to the sovereign hardware vision ahead.
          </p>
        </div>
      </section>

      <section className={`${inter.className} px-6 pb-28 md:px-20`}>
        <div className="relative mx-auto max-w-[1080px]">
          <div
            className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-[#d4af37] via-[#d4af37]/50 to-transparent md:block"
            aria-hidden
          />

          <div className="flex flex-col gap-16 md:gap-24">
            {milestones.map((m) => (
              <div key={m.quarter} className="relative">
                {/* Mobile */}
                <div className="flex flex-col gap-5 md:hidden">
                  <div className="flex items-center gap-3">
                    <TimelineMarker marker={m.marker} />
                    <span className="text-xs font-bold uppercase tracking-wide text-[#666]">
                      {m.label ?? markerLabels[m.marker]}
                    </span>
                  </div>
                  <MilestoneCard m={m} />
                </div>

                {/* Desktop — 3-column alternating timeline */}
                <div className="hidden md:grid md:grid-cols-[1fr_72px_1fr] md:items-center md:gap-x-10">
                  <div className={clsx('flex', m.side === 'left' ? 'justify-end' : 'justify-end')}>
                    {m.side === 'left' ? <MilestoneCard m={m} /> : null}
                  </div>

                  <div className="flex flex-col items-center gap-2 py-2">
                    <TimelineMarker marker={m.marker} />
                    <span className="text-center text-[10px] font-bold uppercase leading-tight tracking-[0.12em] text-[#666]">
                      {m.label ?? markerLabels[m.marker]}
                    </span>
                  </div>

                  <div className={clsx('flex', m.side === 'right' ? 'justify-start' : 'justify-start')}>
                    {m.side === 'right' ? <MilestoneCard m={m} /> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${inter.className} border-t border-[#2a2820] bg-[#0f0f0f] px-6 py-24 md:px-20 md:py-32`}>
        <div className="mx-auto max-w-[720px] rounded-2xl border border-[#2a2820] bg-[#161616] px-8 py-12 text-center md:px-14 md:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]">Stay in the loop</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Keep up with the journey
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[#8e8e93]">
            Development updates, hardware reservation openings, and roadmap dispatches — delivered
            without noise or tracking.
          </p>
          <form
            className="mx-auto mt-10 flex max-w-lg flex-col gap-4 sm:flex-row sm:items-stretch"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="you@email.com"
              className="h-14 min-w-0 flex-1 rounded-xl border border-[#2a2820] bg-[#0f0f0f] px-5 text-base text-white outline-none transition placeholder:text-[#555] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30"
            />
            <button
              type="submit"
              className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-8 text-sm font-bold text-[#0f0f0f] transition hover:bg-[#e0bc4a]"
            >
              Stay updated
              <ArrowRight className="size-4" />
            </button>
          </form>
          <p className="mt-5 text-xs text-[#555]">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <JourneyFooter />
    </ProductPageLayout>
  );
}
