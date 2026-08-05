'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import TauPhoneHero from '@/txp/components/TauPhoneHero';
import { Button } from '@/components/ui/button';
import { TxpContainer, TxpGlow, TxpGradientText, TxpLead } from '@/txp/components/primitives';
import { slideFromLeft, slideFromRight } from '@/txp/motion/variants';
import { txpStory } from '@/content/txp/story';
import { txpNav } from '@/content/txp/navigation';

export default function TxpHero() {
  const { hero } = txpStory;

  return (
    <section className="relative min-h-[100svh] flex items-center pt-24 pb-16 overflow-hidden">
      <TxpGlow className="w-[min(90vw,640px)] h-[min(90vw,640px)] top-[10%] left-1/2 -translate-x-1/2 opacity-80" />

      <TxpContainer wide className="relative z-10">
        {/* Unified composition — phone and copy feel like one keynote slide */}
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-10 lg:gap-14 xl:gap-16">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideFromLeft}
              className="flex-shrink-0 flex justify-center lg:justify-end lg:flex-[0.95]"
            >
              <TauPhoneHero className="w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[380px]" />
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideFromRight}
              className="flex-1 text-center lg:text-left lg:max-w-xl xl:max-w-2xl"
            >
              <p className="text-yellow-400/90 text-xs sm:text-sm font-medium tracking-[0.3em] uppercase mb-6">
                {hero.eyebrow}
              </p>
              <h1 className="text-[clamp(2.75rem,7vw,5rem)] font-bold tracking-tight leading-[0.98] text-white mb-2">
                {hero.headline}
              </h1>
              <p className="text-[clamp(1.75rem,4.5vw,3.25rem)] font-bold tracking-tight leading-tight mb-8">
                <TxpGradientText>{hero.headlineAccent}</TxpGradientText>
              </p>
              <TxpLead className="mx-auto lg:mx-0 mb-10">{hero.body}</TxpLead>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-8 h-12 hover:shadow-lg hover:shadow-yellow-400/20 border-0 transition-shadow duration-500"
                >
                  <Link href={txpNav.actions.join.href}>{hero.ctaPrimary}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 hover:border-yellow-400/30 h-12 px-8 font-medium transition-colors duration-500"
                >
                  <Link href={txpNav.actions.download.href}>{hero.ctaSecondary}</Link>
                </Button>
              </div>

              <Link
                href="#ecosystem"
                className="inline-flex items-center gap-2 mt-10 text-sm text-gray-500 hover:text-yellow-400/90 transition-colors duration-500"
              >
                {hero.ctaTertiary}
                <ArrowDown className="w-4 h-4 opacity-70" />
              </Link>
            </motion.div>
          </div>
        </div>
      </TxpContainer>
    </section>
  );
}
