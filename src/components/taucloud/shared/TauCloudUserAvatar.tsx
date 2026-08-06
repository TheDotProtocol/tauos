'use client';

import TauMailUserAvatar from '@/components/taumail/shared/TauMailUserAvatar';

type TauCloudUserAvatarProps = {
  name: string;
  email?: string;
  imageUrl?: string | null;
  size?: number;
  className?: string;
};

export default function TauCloudUserAvatar({
  name,
  email,
  imageUrl,
  size = 36,
  className = '',
}: TauCloudUserAvatarProps) {
  return (
    <TauMailUserAvatar
      name={name}
      email={email}
      imageUrl={imageUrl}
      size={size}
      className={className}
      rounded="full"
    />
  );
}
