'use client';

import { motion } from 'framer-motion';
import Logo from '@/components/marketing/Logo';
import { cn } from '@/lib/utils';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizes = {
  sm: { core: 'w-16 h-16 sm:w-20 sm:h-20', ring: ['w-24 h-24', 'w-32 h-32', 'w-40 h-40'] },
  md: { core: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28', ring: ['w-32 h-32', 'w-44 h-44', 'w-56 h-56'] },
  lg: { core: 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32', ring: ['w-40 h-40', 'w-56 h-56', 'w-72 h-72'] },
};

/** Pulsating rings with the Tau Core logo mark at center. */
export default function TauLogoPulse({ size = 'md', className }: Props) {
  const s = sizes[size];

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={cn(
            'absolute rounded-full border border-yellow-400/30',
            s.ring[i]
          )}
          animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.08, 0.35] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.9, ease: 'easeInOut' }}
        />
      ))}
      <div
        className={cn(
          'relative z-10 flex items-center justify-center rounded-full bg-black/80 border border-yellow-400/40 shadow-[0_0_40px_rgba(250,204,21,0.15)]',
          s.core
        )}
      >
        <Logo showWordmark={false} size="lg" href={null} className="scale-110" />
      </div>
    </div>
  );
}
