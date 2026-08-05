'use client';

type TauMailUserAvatarProps = {
  name: string;
  imageUrl?: string | null;
  size?: number;
  className?: string;
  rounded?: 'full' | '2xl';
};

export default function TauMailUserAvatar({
  name,
  imageUrl,
  size = 40,
  className = '',
  rounded = 'full',
}: TauMailUserAvatarProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  const radiusClass = rounded === '2xl' ? 'rounded-2xl' : 'rounded-full';

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        width={size}
        height={size}
        className={`${radiusClass} shrink-0 object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`${radiusClass} flex shrink-0 items-center justify-center border border-[rgba(255,255,255,0.08)] bg-[#1e1e24] font-semibold text-[#a1a1aa] ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.34) }}
      aria-hidden
    >
      {initials || '+'}
    </div>
  );
}
