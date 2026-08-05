'use client';

import { geistSans, geistMono, instrumentSerif, inter, outfit } from '@/lib/website/fonts';
import { clsx } from 'clsx';
import '../../website.css';

type ProductPageLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ProductPageLayout({ children, className }: ProductPageLayoutProps) {
  return (
    <div
      className={clsx(
        'tau-website',
        geistSans.className,
        geistMono.variable,
        instrumentSerif.variable,
        inter.variable,
        outfit.variable,
        'min-h-screen bg-[#0f0f0f] text-white antialiased',
        className,
      )}
    >
      {children}
    </div>
  );
}
