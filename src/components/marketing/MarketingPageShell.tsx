'use client';

import { motion } from 'framer-motion';
import MarketingChrome from '@/components/marketing/MarketingChrome';
import TxpNavigation from '@/txp/patterns/TxpNavigation';
import TxpFooter from '@/txp/patterns/TxpFooter';
import { TxpGradientText } from '@/txp/components/primitives';
import { cn } from '@/lib/utils';

type MarketingPageShellProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  hero?: boolean;
  className?: string;
};

/** Shared TXP shell — same nav/footer as homepage on every marketing page. */
export default function MarketingPageShell({
  children,
  title,
  subtitle,
  hero = true,
  className,
}: MarketingPageShellProps) {
  return (
    <MarketingChrome>
      <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30 selection:text-yellow-200">
        <TxpNavigation />
        <main className={cn('pt-20', className)}>
          {hero && title ? (
            <section className="py-14 md:py-20 lg:py-24 border-b border-white/5 bg-gradient-to-b from-black to-gray-950">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
                >
                  <TxpGradientText>{title}</TxpGradientText>
                </motion.h1>
                {subtitle ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
                  >
                    {subtitle}
                  </motion.p>
                ) : null}
              </div>
            </section>
          ) : null}
          {children}
        </main>
        <TxpFooter />
      </div>
    </MarketingChrome>
  );
}
