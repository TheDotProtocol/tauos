'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import {
  TxpContainer,
  TxpChapterRule,
  TxpGlow,
  TxpSection,
  TxpSectionHeading,
} from '@/txp/components/primitives';
import TauLogoPulse from '@/txp/components/TauLogoPulse';
import { ecosystemGroups, txpStory } from '@/content/txp/story';
import { fadeUp, staggerContainer, staggerSlow } from '@/txp/motion/variants';

export default function EcosystemSection() {
  const { ecosystem } = txpStory;

  return (
    <TxpSection id="ecosystem" variant="elevated">
      <TxpGlow className="w-[min(100vw,800px)] h-[min(100vw,800px)] top-0 left-1/2 -translate-x-1/2 opacity-40" />
      <TxpContainer wide className="relative">
        <TxpSectionHeading
          eyebrow={ecosystem.eyebrow}
          title={ecosystem.title}
          subtitle={ecosystem.subtitle}
        />

        <motion.div
          className="flex justify-center mb-20 md:mb-28"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <TauLogoPulse size="lg" />
        </motion.div>

        <div className="space-y-20 md:space-y-28 lg:space-y-32">
          {ecosystemGroups.map((group, gi) => (
            <motion.div
              key={group.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={staggerSlow}
            >
              <motion.div variants={fadeUp} className="mb-10 md:mb-12 lg:max-w-2xl">
                <TxpChapterRule className="mb-8 md:mb-10" />
                <h3 className="text-sm font-medium tracking-[0.25em] uppercase text-yellow-400/90 mb-3">
                  {group.title}
                </h3>
                <p className="text-lg md:text-xl text-gray-400 leading-relaxed">{group.description}</p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8"
              >
                {group.products.map((product) => (
                  <motion.div key={product.id} variants={fadeUp}>
                    <Link
                      href={product.href}
                      className="group flex flex-col h-full min-h-[11rem] md:min-h-[12rem] rounded-2xl md:rounded-3xl border border-white/[0.06] bg-black/20 p-7 md:p-9 transition-all duration-500 hover:border-yellow-400/25 hover:bg-yellow-400/[0.03]"
                    >
                      <h4 className="text-lg md:text-xl font-semibold text-white group-hover:text-yellow-400/95 transition-colors duration-500">
                        {product.label}
                      </h4>
                      <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-400 leading-relaxed flex-1">
                        {product.description}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-yellow-400/80 group-hover:text-yellow-400 transition-colors">
                        {ecosystem.explore}
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {gi < ecosystemGroups.length - 1 ? (
                <div className="mt-20 md:mt-28 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
              ) : null}
            </motion.div>
          ))}
        </div>
      </TxpContainer>
    </TxpSection>
  );
}
