'use client';

import TauMailUserAvatar from '@/components/taumail/shared/TauMailUserAvatar';

type TauIDUserAvatarProps = {
  name: string;
  email?: string;
  imageUrl?: string | null;
  size?: number;
};

export default function TauIDUserAvatar({ name, email, imageUrl, size = 40 }: TauIDUserAvatarProps) {
  return <TauMailUserAvatar name={name} email={email} imageUrl={imageUrl} size={size} rounded="full" />;
}
