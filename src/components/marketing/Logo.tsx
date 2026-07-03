'use client';

import Link from 'next/link';
import { site } from '@/content/site';

type LogoProps = {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string | null;
};

const heights = { sm: 'h-7', md: 'h-8', lg: 'h-10' };

export default function Logo({
  className = '',
  showWordmark = true,
  size = 'md',
  href = '/',
}: LogoProps) {
  const mark = (
    <picture>
      <source srcSet="/brand/tauos-logo.svg" type="image/svg+xml" />
      <img
        src="/brand/tauos-logo.png"
        alt={`${site.brand} logo`}
        className={`${heights[size]} w-auto object-contain`}
        width={120}
        height={40}
      />
    </picture>
  );

  const wordmark = showWordmark ? (
    <span className="font-bold text-xl tracking-wider text-white">{site.brand.replace('™', '')}</span>
  ) : null;

  const inner = (
    <>
      {mark}
      {wordmark}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`flex items-center gap-2 shrink-0 ${className}`} aria-label={site.brand}>
        {inner}
      </Link>
    );
  }

  return <div className={`flex items-center gap-2 shrink-0 ${className}`}>{inner}</div>;
}
