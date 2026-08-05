'use client';

import Image from 'next/image';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import JourneyNav from '@/components/website/marketing/shared/JourneyNav';
import JourneyFooter from '@/components/website/marketing/shared/JourneyFooter';
import { inter, instrumentSerif } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';
import { clsx } from 'clsx';

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
    label: 'Current Milestone',
    items: ['Tau Desktop OS Beta', 'Tau Mobile OS Alpha', 'Tau Developer Platform', 'Tau ID Launch'],
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
    shipped: 'bg-[rgba(27,94,32,0.2)] text-[#2e7d32]',
    'in-progress': 'bg-[rgba(13,71,161,0.2)] text-[#1976d2]',
    planned: 'bg-[#222] text-[#8e8e93]',
  };
  const labels = { shipped: 'Shipped', 'in-progress': 'In Progress', planned: 'Planned' };
  return (
    <span className={clsx('rounded-full px-2.5 py-1 text-[11px] font-semibold', styles[status])}>
      {labels[status]}
    </span>
  );
}

function TimelineMarker({ marker }: { marker: Milestone['marker'] }) {
  if (marker === 'complete') {
    return (
      <span className="flex size-6 items-center justify-center rounded-xl bg-[#d4af37]">
        <Image src={marketingAssets.roadmap.check} alt="" width={12} height={12} />
      </span>
    );
  }
  if (marker === 'current') {
    return <Image src={marketingAssets.roadmap.markerCurrent} alt="" width={32} height={32} />;
  }
  return <Image src={marketingAssets.roadmap.markerUpcoming} alt="" width={24} height={24} />;
}

function MilestoneCard({ m }: { m: Milestone }) {
  return (
    <div
      className={clsx(
        'w-full max-w-[500px] rounded-xl border border-[#2a2a2a] bg-[#171717] p-6',
        m.faded && 'opacity-60',
        m.marker === 'vision' && 'opacity-40',
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[#d4af37]">{m.quarter}</p>
        <StatusBadge status={m.status} />
      </div>
      <h3 className="mt-4 text-xl font-bold">{m.title}</h3>
      <ul className="mt-4 space-y-2">
        {m.items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-[#8e8e93]">
            <span className="size-1 rounded-sm bg-[#a68a2e]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RoadmapPage() {
  const sideLabels: Record<Milestone['marker'], string> = {
    complete: 'Complete',
    current: 'Current Milestone',
    upcoming: 'Upcoming',
    vision: 'Vision',
  };

  return (
    <ProductPageLayout>
      <JourneyNav active="roadmap" />

      <section className={`${inter.className} px-6 pb-16 pt-20 text-center md:px-20`}>
        <p className="text-xs font-bold uppercase text-[#d4af37]">The Journey</p>
        <h1 className={`${instrumentSerif.className} mt-4 text-5xl font-extrabold tracking-tight md:text-6xl`}>Roadmap</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[#8e8e93]">Where we are. Where we are going.</p>
      </section>

      <section className={`${inter.className} relative px-6 pb-20 md:px-20`}>
        <div className="relative mx-auto max-w-[1080px]">
          <div className="absolute left-1/2 top-6 hidden h-[calc(100%-48px)] w-px -translate-x-1/2 bg-gradient-to-b from-[#d4af37] via-[#d4af37] to-[#333] md:block" />

          <div className="space-y-16">
            {milestones.map((m) => (
              <div key={m.quarter} className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_80px_1fr]">
                <div className={clsx('flex', m.side === 'left' ? 'md:justify-end' : 'md:order-3 md:justify-end')}>
                  {m.side === 'left' ? (
                    <MilestoneCard m={m} />
                  ) : (
                    <p className="hidden text-[13px] uppercase text-[#555] md:block">{sideLabels[m.marker]}</p>
                  )}
                </div>

                <div className="hidden justify-center md:flex">
                  <TimelineMarker marker={m.marker} />
                </div>

                <div className={clsx('flex', m.side === 'right' ? 'md:justify-start' : 'md:order-1 md:justify-start')}>
                  {m.side === 'right' ? (
                    <MilestoneCard m={m} />
                  ) : (
                    <p className="hidden items-center gap-2 text-[13px] uppercase text-[#555] md:flex">
                      {m.marker === 'current' && (
                        <Image src={marketingAssets.roadmap.ellipse} alt="" width={6} height={6} />
                      )}
                      {m.label ?? sideLabels[m.marker]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${inter.className} border-y border-[#2a2a2a] bg-[#171717] px-6 py-20 text-center md:px-20`}>
        <h2 className="text-3xl font-extrabold">Keep Up with the Journey</h2>
        <p className="mx-auto mt-4 max-w-lg text-[15px] text-[#8e8e93]">
          Receive highly technical development updates, hardware reservation openings, and network roadmap dispatches.
        </p>
        <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="Enter your email address"
            className="h-12 flex-1 rounded border border-[#2a2a2a] bg-[#0f0f0f] px-4 text-sm text-white outline-none focus:border-[#d4af37]"
          />
          <button type="button" className="h-12 rounded bg-[#d4af37] px-6 text-sm font-semibold text-[#0f0f0f]">
            Stay Updated
          </button>
        </div>
      </section>

      <JourneyFooter />
    </ProductPageLayout>
  );
}
