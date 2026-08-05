import Image from 'next/image';
import { clsx } from 'clsx';

type MailIconProps = {
  src: string;
  size?: number;
  className?: string;
};

export function MailIcon({ src, size = 16, className }: MailIconProps) {
  return <Image src={src} alt="" width={size} height={size} className={clsx('shrink-0', className)} />;
}
