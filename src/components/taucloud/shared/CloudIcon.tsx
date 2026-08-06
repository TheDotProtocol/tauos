'use client';

import Image from 'next/image';

type CloudIconProps = {
  src: string;
  size?: number;
  className?: string;
};

export default function CloudIcon({ src, size = 18, className = '' }: CloudIconProps) {
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden
    />
  );
}
