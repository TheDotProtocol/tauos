'use client';

type Props = {
  name: string;
  imageUrl?: string | null;
  size?: number;
  className?: string;
};

export default function TauTalkAvatar({ name, imageUrl, size = 40, className = '' }: Props) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        width={size}
        height={size}
        className={`rounded-full object-cover shrink-0 ring-2 ring-[#D4AF37]/30 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-full shrink-0 flex items-center justify-center font-semibold text-[#0f0f0f] bg-gradient-to-br from-[#F5C842] to-[#D4AF37] ring-2 ring-[#D4AF37]/20 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials || '?'}
    </div>
  );
}
