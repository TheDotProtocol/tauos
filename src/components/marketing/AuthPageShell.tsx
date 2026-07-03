'use client';

import Link from 'next/link';
import MarketingChrome from '@/components/marketing/MarketingChrome';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import Logo from '@/components/marketing/Logo';

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
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Logo className="justify-center mb-6" href={null} showWordmark={false} />
              <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
              {subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
            </div>
            {children}
            {backHref ? (
              <p className="text-center mt-6 text-sm">
                <Link href={backHref} className="text-primary hover:text-primary/80 transition-colors">
                  {backLabel}
                </Link>
              </p>
            ) : null}
          </div>
        </main>
        <Footer />
      </div>
    </MarketingChrome>
  );
}
