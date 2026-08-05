import Image from 'next/image';
import { clsx } from 'clsx';

type MarketingIconProps = {
  src: string;
  size?: number;
  className?: string;
};

export default function MarketingIcon({ src, size = 20, className }: MarketingIconProps) {
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={clsx('shrink-0', className)}
    />
  );
}
