import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import { outfit } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';

type TauLogoProps = {
  size?: 'nav' | 'hero' | 'footer';
  showWordmark?: boolean;
  className?: string;
  href?: string;
};

const sizes = {
  nav: { img: 36, word: 'text-xl' },
  hero: { img: 80, word: 'text-2xl' },
  footer: { img: 28, word: 'text-base' },
} as const;

export default function TauLogo({ size = 'nav', showWordmark = true, className, href = websiteRoutes.home }: TauLogoProps) {
  const s = sizes[size];
  const src = size === 'nav' ? '/website/logos/tau-core/logo-nav.png' : '/website/logos/tau-core/logo-primary.png';

  const content = (
    <>
      <Image
        src={src}
        alt="Tau"
        width={s.img}
        height={s.img}
        className="rounded-2xl object-contain"
        priority={size === 'nav'}
      />
      {showWordmark && (
        <span className={clsx(outfit.className, s.word, 'font-semibold text-white')}>Tau</span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={clsx('flex items-center gap-3', className)}>
        {content}
      </Link>
    );
  }

  return <div className={clsx('flex items-center gap-3', className)}>{content}</div>;
}
