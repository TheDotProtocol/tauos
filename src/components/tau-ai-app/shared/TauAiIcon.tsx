'use client';

type TauAiIconProps = {
  src: string;
  size?: number;
  alt?: string;
  className?: string;
};

export default function TauAiIcon({ src, size = 18, alt = '', className }: TauAiIconProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${className ?? ''}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={size} height={size} className="block size-full max-w-none" />
    </span>
  );
}
