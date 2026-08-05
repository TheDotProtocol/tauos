'use client';

import MarketingChrome from '@/components/marketing/MarketingChrome';
import TxpNavigation from '@/txp/patterns/TxpNavigation';
import TxpFooter from '@/txp/patterns/TxpFooter';

type Props = {
  children: React.ReactNode;
};

export default function TxpShell({ children }: Props) {
  return (
    <MarketingChrome>
      <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30 selection:text-yellow-200">
        <TxpNavigation />
        <main>{children}</main>
        <TxpFooter />
      </div>
    </MarketingChrome>
  );
}
