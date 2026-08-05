'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  priority?: boolean;
};

/** User-provided Tau Phone PNG — no extra frame, just glow + float. */
export default function TauPhoneHero({ className, priority = true }: Props) {
  return (
    <motion.div
      className={cn('relative flex items-center justify-center', className)}
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
    >
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[340px] aspect-[9/16] bg-primary/25 blur-[90px] rounded-full"
      />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] max-w-[280px] aspect-square border border-primary/20 rounded-full animate-[spin_30s_linear_infinite] opacity-40"
      />
      <Image
        src="/brand/tau-phone-lock.png"
        alt="Tau Phone"
        width={420}
        height={860}
        priority={priority}
        className="relative z-10 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] h-auto object-contain drop-shadow-[0_32px_64px_rgba(0,0,0,0.55)]"
        sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 400px"
      />
    </motion.div>
  );
}
