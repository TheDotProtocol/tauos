'use client';

import MarketingChrome from '@/components/marketing/MarketingChrome';
import TxpNavigation from '@/txp/patterns/TxpNavigation';
import TxpFooter from '@/txp/patterns/TxpFooter';
import { TxpGradientText } from '@/txp/components/primitives';
import { cn } from '@/lib/utils';

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  /** Marketing-style full bleed (no max-width card) */
  variant?: 'app' | 'marketing';
};

/** Product landing shell — unified TXP nav and footer across Tau apps. */
export default function AppShell({
  children,
  title,
  subtitle,
  variant = 'app',
}: AppShellProps) {
  return (
    <MarketingChrome>
      <div className="min-h-screen flex flex-col bg-black text-white selection:bg-yellow-400/30 selection:text-yellow-200">
        <TxpNavigation />

        {(title || subtitle) && (
          <div className="pt-20 border-b border-white/5 bg-gradient-to-b from-black to-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
              {title ? (
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                  <TxpGradientText>{title}</TxpGradientText>
                </h1>
              ) : null}
              {subtitle ? (
                <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-300 max-w-3xl leading-relaxed">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>
        )}

        <main
          className={cn(
            'flex-1',
            !title && !subtitle && 'pt-20',
            variant === 'app' && 'max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12'
          )}
        >
          {children}
        </main>

        <TxpFooter />
      </div>
    </MarketingChrome>
  );
}
