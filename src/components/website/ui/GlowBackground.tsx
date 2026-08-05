import Image from 'next/image';

type GlowOrbProps = {
  src: string;
  className?: string;
  size?: number;
};

export function GlowOrb({ src, className, size = 400 }: GlowOrbProps) {
  return (
    <div className={`section-glow relative ${className ?? ''}`} style={{ width: size, height: size }}>
      <div className="absolute inset-[-25%]">
        <Image src={src} alt="" width={size * 1.5} height={size * 1.5} className="size-full max-w-none object-contain" />
      </div>
    </div>
  );
}

export function HeroBackglow() {
  return (
    <div className="hero-backglow" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/website/images/hero/backglow.svg" alt="" />
      {/* CSS fallback if SVG filter fails in some browsers */}
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(212,175,55,0.35) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
