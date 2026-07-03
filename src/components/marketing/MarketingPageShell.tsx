'use client';

import { motion } from 'framer-motion';
import MarketingChrome from '@/components/marketing/MarketingChrome';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { cn } from '@/lib/utils';

type MarketingPageShellProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  /** Show gradient hero block when title is set */
  hero?: boolean;
  className?: string;
};

export default function MarketingPageShell({
  children,
  title,
  subtitle,
  hero = true,
  className,
}: MarketingPageShellProps) {
  return (
    <MarketingChrome>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
        <Navigation />
        <main className={cn('pt-20', className)}>
          {hero && title ? (
            <section className="py-16 md:py-24 border-b border-white/5 bg-[#050505]">
              <div className="container mx-auto px-6 text-center max-w-4xl">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-white via-[#FFF0B3] to-[#FFD700] text-transparent bg-clip-text"
                >
                  {title}
                </motion.h1>
                {subtitle ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="text-lg md:text-xl text-muted-foreground leading-relaxed"
                  >
                    {subtitle}
                  </motion.p>
                ) : null}
              </div>
            </section>
          ) : null}
          {children}
        </main>
        <Footer />
      </div>
    </MarketingChrome>
  );
}
