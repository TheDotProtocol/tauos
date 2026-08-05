'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProductPageContent } from '@/content/txp/products';
import {
  TxpContainer,
  TxpGlassCard,
  TxpGlow,
  TxpGoldAccent,
  TxpGradientText,
  TxpSection,
  TxpSectionHeading,
} from '@/txp/components/primitives';
import { fadeUp } from '@/txp/motion/variants';
import { txpNav } from '@/content/txp/navigation';

type Props = {
  product: ProductPageContent;
};

export default function ProductPageTemplate({ product }: Props) {
  return (
    <>
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center pt-24 pb-16 overflow-hidden">
        <TxpGlow className="w-[500px] h-[500px] top-1/3 left-1/2 -translate-x-1/2" />
        <TxpContainer wide className="relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-4xl mx-auto text-center lg:text-left lg:mx-0"
          >
            <p className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-4">Tau Platform</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-white">
              {product.name}
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
              <TxpGradientText>{product.tagline}</TxpGradientText>
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mb-10 mx-auto lg:mx-0 leading-relaxed">
              {product.heroSubtext}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                <Link href={txpNav.actions.join.href}>{product.cta.primary}</Link>
              </Button>
              {product.download ? (
                <Button asChild size="lg" variant="outline" className="border-yellow-400/40 text-white">
                  <Link href={product.download.href}>
                    <Download className="w-4 h-4 mr-2" />
                    {product.download.label}
                  </Link>
                </Button>
              ) : null}
            </div>
          </motion.div>
        </TxpContainer>
      </section>

      <TxpSection variant="elevated">
        <TxpContainer wide>
          <TxpSectionHeading wide align="left" title={product.problem.title} subtitle={product.problem.body} />
        </TxpContainer>
      </TxpSection>

      <TxpSection>
        <TxpContainer wide>
          <TxpSectionHeading wide align="left" title={product.solution.title} subtitle={product.solution.body} />
        </TxpContainer>
      </TxpSection>

      <TxpSection variant="elevated">
        <TxpContainer wide>
          <TxpSectionHeading wide title="Why it matters" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.benefits.map((b) => (
              <TxpGlassCard key={b.title}>
                <h3 className="font-bold text-lg text-yellow-400 mb-2">{b.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{b.description}</p>
              </TxpGlassCard>
            ))}
          </div>
        </TxpContainer>
      </TxpSection>

      <TxpSection>
        <TxpContainer wide>
          <TxpSectionHeading wide align="left" title="Features" />
          <ul className="grid sm:grid-cols-2 gap-4 max-w-4xl">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-gray-300">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </TxpContainer>
      </TxpSection>

      <TxpSection variant="elevated">
        <TxpContainer wide>
          <TxpSectionHeading wide title={product.privacy.title} subtitle={product.privacy.body} />
        </TxpContainer>
      </TxpSection>

      <TxpSection>
        <TxpContainer wide>
          <TxpSectionHeading wide align="left" title="Questions" />
          <div className="grid md:grid-cols-2 gap-4 max-w-5xl">
            {product.faq.map((item) => (
              <TxpGlassCard key={item.q}>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-white">
                    {item.q}
                    <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" />
                  </summary>
                  <p className="mt-3 text-sm text-gray-300 leading-relaxed">{item.a}</p>
                </details>
              </TxpGlassCard>
            ))}
          </div>
        </TxpContainer>
      </TxpSection>

      <TxpSection variant="void">
        <TxpContainer wide className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            <TxpGradientText>Join Tau. Build Your World.</TxpGradientText>
          </h2>
          <p className="text-gray-300 mb-8">
            One identity. One platform. <TxpGoldAccent>Infinite possibilities.</TxpGoldAccent>
          </p>
          <Button asChild size="lg" className="font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
            <Link href={txpNav.actions.join.href}>Get Started</Link>
          </Button>
        </TxpContainer>
      </TxpSection>
    </>
  );
}
