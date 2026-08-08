'use client';

import { tauAiAssets } from '@/lib/tau-ai-app/assets';

type TauAiLogoProps = {
  variant?: 'lockup' | 'emblem';
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
};

export default function TauAiLogo({
  variant = 'lockup',
  width,
  height,
  className = '',
  alt = 'Tau AI',
}: TauAiLogoProps) {
  const src = variant === 'emblem' ? tauAiAssets.brand.logoEmblem : tauAiAssets.brand.logoLockup;

  if (variant === 'lockup') {
    const w = width ?? 280;
    const h = height ?? 120;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        className={`h-auto w-auto max-w-full object-contain ${className}`}
        style={{ width: w, height: 'auto', maxHeight: h }}
      />
    );
  }

  const size = width ?? height ?? 64;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
