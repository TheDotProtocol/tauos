'use client';

import { useMemo, useState } from 'react';
import { avatarBackgroundColor, gravatarUrl, initialsFromName } from '@/lib/taumail/avatar';

type TauMailUserAvatarProps = {
  name: string;
  imageUrl?: string | null;
  email?: string;
  size?: number;
  className?: string;
  rounded?: 'full' | '2xl';
};

export default function TauMailUserAvatar({
  name,
  imageUrl,
  email,
  size = 40,
  className = '',
  rounded = 'full',
}: TauMailUserAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const initials = useMemo(() => initialsFromName(name), [name]);
  const radiusClass = rounded === '2xl' ? 'rounded-2xl' : 'rounded-full';
  const gravatar = email && !imageUrl ? gravatarUrl(email, size * 2) : null;
  const resolvedUrl = !imgFailed ? imageUrl || gravatar : null;

  if (resolvedUrl) {
    return (
      <img
        src={resolvedUrl}
        alt={name}
        width={size}
        height={size}
        className={`${radiusClass} shrink-0 object-cover ${className}`}
        style={{ width: size, height: size }}
        onError={() => setImgFailed(true)}
      />
    );
  }

  const bg = email ? avatarBackgroundColor(email) : '#1e1e24';

  return (
    <div
      className={`${radiusClass} flex shrink-0 items-center justify-center font-semibold text-white ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(11, size * 0.34),
        backgroundColor: bg,
      }}
      aria-hidden
    >
      {initials || '+'}
    </div>
  );
}
