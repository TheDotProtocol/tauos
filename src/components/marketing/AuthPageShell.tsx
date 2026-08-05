'use client';

import Link from 'next/link';
import MarketingChrome from '@/components/marketing/MarketingChrome';
import TxpNavigation from '@/txp/patterns/TxpNavigation';
import TxpFooter from '@/txp/patterns/TxpFooter';
import Logo from '@/components/marketing/Logo';
import { TxpGradientText } from '@/txp/components/primitives';

type AuthPageShellProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
};

export default function AuthPageShell({
  children,
  title,
  subtitle,
  backHref,
  backLabel = '← Back',
}: AuthPageShellProps) {
  return (
    <MarketingChrome>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <TxpNavigation />
        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Logo className="justify-center mb-6" href={null} showWordmark={false} />
              <h1 className="text-3xl font-bold mb-2">
                <TxpGradientText>{title}</TxpGradientText>
              </h1>
              {subtitle ? <p className="text-gray-300">{subtitle}</p> : null}
            </div>
            {children}
            {backHref ? (
              <p className="text-center mt-6 text-sm">
                <Link href={backHref} className="text-yellow-400 hover:text-yellow-300 transition-colors">
                  {backLabel}
                </Link>
              </p>
            ) : null}
          </div>
        </main>
        <TxpFooter />
      </div>
    </MarketingChrome>
  );
}
