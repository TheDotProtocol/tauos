'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TxpContainer,
  TxpGlassCard,
  TxpGradientText,
  TxpLead,
  TxpSection,
  TxpSectionHeading,
  TxpSplitSection,
} from '@/txp/components/primitives';
import TauLogoPulse from '@/txp/components/TauLogoPulse';
import { Button } from '@/components/ui/button';
import { txpStory } from '@/content/txp/story';
import { builtForAudiences } from '@/content/txp/products';
import { fadeUp, staggerContainer, staggerSlow } from '@/txp/motion/variants';

export function WhyTauSection() {
  const { why } = txpStory;

  return (
    <TxpSection id="why">
      <TxpContainer wide>
        <TxpSectionHeading eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle} />
        <motion.div
          className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerSlow}
        >
          {why.pillars.map((pillar) => (
            <motion.div key={pillar.title} variants={fadeUp} className="text-center md:text-left px-2 md:px-0">
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-5">
                <TxpGradientText>{pillar.title}</TxpGradientText>
              </h3>
              <p className="text-base md:text-lg text-gray-400 leading-[1.75]">{pillar.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </TxpContainer>
    </TxpSection>
  );
}

export function PrivacyFirstSection() {
  const { privacy } = txpStory;

  return (
    <TxpSection id="privacy" variant="elevated">
      <TxpContainer wide>
        <TxpSectionHeading
          eyebrow={privacy.eyebrow}
          title={privacy.title}
          subtitle={privacy.subtitle}
        />
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {privacy.pillars.map((p) => (
            <motion.div key={p.title} variants={fadeUp}>
              <TxpGlassCard className="p-8 md:p-10">
                <h3 className="font-semibold text-lg md:text-xl text-white mb-3 md:mb-4">{p.title}</h3>
                <p className="text-sm md:text-base text-gray-400 leading-[1.75]">{p.body}</p>
              </TxpGlassCard>
            </motion.div>
          ))}
        </motion.div>
      </TxpContainer>
    </TxpSection>
  );
}

export function BuiltForSection() {
  const { builtFor } = txpStory;

  return (
    <TxpSection id="built-for">
      <TxpContainer wide>
        <TxpSectionHeading
          eyebrow={builtFor.eyebrow}
          title={builtFor.title}
          subtitle={builtFor.subtitle}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {builtForAudiences.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <TxpGlassCard className="p-8 md:p-10">
                <h3 className="text-lg md:text-xl font-semibold text-yellow-400/95 mb-4">{a.title}</h3>
                <p className="text-gray-400 leading-[1.75] text-sm md:text-base">{a.story}</p>
              </TxpGlassCard>
            </motion.div>
          ))}
        </div>
      </TxpContainer>
    </TxpSection>
  );
}

export function TauAISection() {
  const { ai } = txpStory;

  return (
    <TxpSection id="ai" variant="void">
      <TxpContainer wide>
        <TxpSplitSection>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-yellow-400/90 text-xs sm:text-sm font-medium tracking-[0.28em] uppercase mb-6">
              {ai.eyebrow}
            </p>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold tracking-tight leading-[1.08] mb-6 text-white">
              {ai.title}
              <br />
              <TxpGradientText>{ai.titleAccent}</TxpGradientText>
            </h2>
            <TxpLead className="mb-8">{ai.body}</TxpLead>
            <ul className="space-y-4 text-gray-400 text-base md:text-lg leading-relaxed">
              {ai.points.map((point) => (
                <li key={point} className="pl-4 border-l border-yellow-400/20">
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-yellow-400/[0.06] to-transparent p-10 md:p-14 min-h-[320px] flex flex-col items-center justify-center gap-8"
          >
            <TauLogoPulse size="md" />
            <p className="text-base md:text-lg font-medium text-white/90 text-center max-w-xs leading-relaxed">
              {ai.prompt}
            </p>
          </motion.div>
        </TxpSplitSection>
      </TxpContainer>
    </TxpSection>
  );
}

export function GrayscaleSection() {
  const { grayscale } = txpStory;

  return (
    <TxpSection id="grayscale" variant="elevated">
      <TxpContainer wide>
        <div className="max-w-4xl mx-auto text-center">
          <TxpSectionHeading
            eyebrow={grayscale.eyebrow}
            title={grayscale.title}
            subtitle={grayscale.subtitle}
          />
          <Button asChild variant="outline" className="border-white/20 hover:border-yellow-400/30 h-12 px-8">
            <Link href={grayscale.href}>{grayscale.cta}</Link>
          </Button>
        </div>
      </TxpContainer>
    </TxpSection>
  );
}

export function DeveloperSection() {
  const { developers } = txpStory;

  return (
    <TxpSection id="developers">
      <TxpContainer wide>
        <div className="max-w-4xl mx-auto text-center">
          <TxpSectionHeading
            eyebrow={developers.eyebrow}
            title={developers.title}
            subtitle={developers.subtitle}
          />
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-8 h-12 border-0"
          >
            <Link href={developers.href}>{developers.cta}</Link>
          </Button>
        </div>
      </TxpContainer>
    </TxpSection>
  );
}

export function PhilosophySection() {
  const { philosophy } = txpStory;

  return (
    <TxpSection id="philosophy" variant="elevated">
      <TxpContainer wide>
        <TxpSectionHeading
          eyebrow={philosophy.eyebrow}
          title={philosophy.title}
          subtitle={philosophy.intro}
        />
        <motion.div
          className="grid md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-14 md:gap-y-16 lg:gap-y-20 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerSlow}
        >
          {philosophy.principles.map((line, i) => (
            <motion.div key={line} variants={fadeUp} className="group">
              <span className="block text-xs font-medium tracking-[0.2em] text-yellow-400/50 mb-4 md:mb-5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-xl sm:text-2xl md:text-[1.65rem] font-light text-white leading-[1.45] tracking-tight">
                {line}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </TxpContainer>
    </TxpSection>
  );
}
