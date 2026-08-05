'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { instrumentSerif } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';
import { useMotionReady } from '@/lib/website/useMotionReady';
import SectionBadge from '@/components/website/ui/SectionBadge';
import { GlowOrb } from '@/components/website/ui/GlowBackground';

const portals = [
  {
    name: 'Tau Core Desktop',
    desc: 'Sovereign productivity engine styled around clarity.',
    href: websiteRoutes.tauDesktopOs,
    type: 'desktop' as const,
  },
  {
    name: 'Tau Phone OS',
    desc: 'Zero notification fatigue. Pure sovereign communication.',
    href: websiteRoutes.tauMobileOs,
    type: 'phone' as const,
  },
  {
    name: 'Tau Book Pro',
    desc: 'Creative workstation hardware bound seamlessly to core.',
    href: websiteRoutes.tauBookPro,
    type: 'laptop' as const,
  },
] as const;

export default function ExperienceSection() {
  const { motionEnabled } = useMotionReady();
  const motionProps = motionEnabled
    ? { initial: false as const, whileInView: { opacity: 1, y: 0 } as const, viewport: { once: true } as const, transition: { duration: 0.6 } as const }
    : {};

  return (
    <section id="experience" className="relative overflow-hidden py-24 md:py-32">
      <GlowOrb src="/website/images/glow/experience-tl.svg" className="left-[5%] top-[10%]" size={500} />
      <GlowOrb src="/website/images/glow/experience-br.svg" className="bottom-[5%] right-[5%]" size={600} />

      <div className="relative z-10 mx-auto max-w-[1440px] px-12 lg:px-20">
        <motion.div {...motionProps} className="mb-16 flex flex-col items-center text-center">
          <SectionBadge number="04" label="Experience Tau" />
          <h2 className={`${instrumentSerif.className} max-w-4xl text-4xl leading-tight text-white md:text-[64px] md:leading-[72px]`}>
            Ecosystem portals forged in absolute sync.
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {portals.map((portal) => (
            <Link key={portal.name} href={portal.href} className="group flex flex-col items-center gap-6">
              {portal.type === 'desktop' && <DesktopPortalMockup />}
              {portal.type === 'phone' && <PhonePortalMockup />}
              {portal.type === 'laptop' && <LaptopPortalMockup />}
              <div className="text-center">
                <p className="text-base font-semibold text-white group-hover:text-[#d4af37]">{portal.name}</p>
                <p className="mt-1.5 text-[13px] text-[rgba(255,255,255,0.5)]">{portal.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function DesktopPortalMockup() {
  return (
    <div className="w-full rounded-xl border border-[rgba(212,175,55,0.2)] bg-[#121214] p-3 shadow-[0_16px_16px_rgba(0,0,0,0.7)]">
      <div className="flex h-[200px] gap-3 rounded-md bg-[#060607] p-3">
        <div className="flex w-9 shrink-0 flex-col gap-3 border-r border-[rgba(255,255,255,0.07)] pr-2">
          <div className="size-4 rounded-full bg-[#d4af37]" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[3px] w-4 rounded-sm bg-[rgba(255,255,255,0.5)]" />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-2.5 pt-1">
          <div className="h-2 w-[120px] rounded bg-[rgba(255,255,255,0.5)]" />
          <div className="h-3.5 w-[180px] rounded bg-white" />
          <div className="mt-3 flex flex-1 gap-2">
            <div className="flex-1 rounded border border-[rgba(212,175,55,0.2)] bg-[#121214]" />
            <div className="flex-1 rounded bg-[#121214]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PhonePortalMockup() {
  return (
    <div className="w-[190px] rounded-[32px] border border-[rgba(212,175,55,0.2)] bg-[#121214] p-2 shadow-[0_16px_16px_rgba(0,0,0,0.7)]">
      <div className="flex h-[290px] flex-col justify-between rounded-[26px] bg-[#060607] px-4 pb-4 pt-3.5">
        <div className="flex justify-between text-[8px] font-bold">
          <span className="text-[#d4af37]">9:41</span>
          <span className="h-2 w-3.5 rounded-sm border border-[#d4af37]" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <Image src="/website/logos/tau-core/logo-primary.png" alt="" width={36} height={36} />
          <div className="h-1 w-[60px] rounded-sm bg-[rgba(255,255,255,0.5)]" />
        </div>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`size-3 rounded-full ${i === 1 ? 'bg-[#d4af37]' : 'bg-[rgba(255,255,255,0.2)]'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LaptopPortalMockup() {
  return (
    <div className="w-full rounded-xl border border-[rgba(212,175,55,0.2)] bg-[#121214] p-3 shadow-[0_16px_16px_rgba(0,0,0,0.7)]">
      <div className="flex h-[200px] flex-col justify-between rounded-md bg-[#060607] p-3">
        <div className="flex items-center justify-between">
          <div className="h-1.5 w-20 rounded bg-[rgba(255,255,255,0.5)]" />
          <div className="flex gap-1.5">
            <div className="size-3.5 rounded-sm border border-[#d4af37] bg-[rgba(212,175,55,0.1)]" />
            <div className="size-3.5 rounded-sm bg-[#121214]" />
            <div className="size-3.5 rounded-sm bg-[#121214]" />
          </div>
        </div>
        <div className="flex h-[130px] items-center justify-center rounded border border-[rgba(255,255,255,0.07)] bg-[#121214]">
          <Image src="/website/logos/tau-core/logo-primary.png" alt="" width={48} height={48} />
        </div>
      </div>
    </div>
  );
}
