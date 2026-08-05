'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { instrumentSerif } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';
import { useMotionReady } from '@/lib/website/useMotionReady';
import { HeroBackglow } from '@/components/website/ui/GlowBackground';

export default function HeroSection() {
  const { motionEnabled } = useMotionReady();

  return (
    <section className="relative pb-32 pt-20">
      <HeroBackglow />

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center gap-12 px-12 pb-8 pt-24">
        <motion.div
          initial={false}
          animate={motionEnabled ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full max-w-[900px] flex-col items-center gap-4 text-center"
        >
          <h1
            className={`${instrumentSerif.className} text-[40px] leading-tight text-white sm:text-5xl md:text-[64px] md:leading-[72px]`}
          >
            Technology should feel human again.
          </h1>
          <p className="max-w-[720px] text-lg leading-7 text-[rgba(255,255,255,0.5)]">
            Tau is a complete ecosystem of devices, software, and services designed around one idea — that technology should serve you, not the other way around.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href={websiteRoutes.experience}
              className="rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#0a0a0b] transition hover:bg-[#e5c348]"
            >
              Explore Tau
            </Link>
            <Link
              href={websiteRoutes.download}
              className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition hover:border-[#d4af37] hover:text-[#d4af37]"
            >
              Download Tau Core
            </Link>
          </div>
        </motion.div>

        <div className="w-full overflow-x-auto pb-2">
        <motion.div
          initial={false}
          animate={motionEnabled ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex h-[520px] min-w-[1308px] items-end justify-center gap-6"
        >
          <DeviceMockup
            className="h-[320px] w-[480px] shrink-0 rounded-t-2xl rounded-b-[4px] p-3"
            logoSize={64}
          />
          <DeviceMockup
            className="h-[380px] w-[560px] shrink-0 rounded-3xl border-2 p-4"
            logoSize={96}
            highlight
          />
          <DeviceMockup className="h-[340px] w-[220px] shrink-0 rounded-[32px] p-2" logoSize={48} />
        </motion.div>
        </div>
      </div>
    </section>
  );
}

function DeviceMockup({
  className,
  logoSize,
  highlight,
}: {
  className?: string;
  logoSize: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col border border-[rgba(212,175,55,0.25)] bg-[#121214] shadow-[0_12px_12px_rgba(0,0,0,1)] ${className}`}
      style={highlight ? { boxShadow: '0 16px 16px rgba(0,0,0,1)' } : undefined}
    >
      <div className="flex flex-1 items-center justify-center rounded-xl bg-[#060607]">
        <Image
          src="/website/logos/tau-core/logo-primary.png"
          alt=""
          width={logoSize}
          height={logoSize}
          className="object-contain"
        />
      </div>
    </div>
  );
}
