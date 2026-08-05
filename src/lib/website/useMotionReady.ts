'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Avoid SSR/hydration leaving Framer Motion elements stuck at opacity: 0. */
export function useMotionReady() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    mounted,
    reduceMotion: reduceMotion === true,
    /** Safe to apply motion initial states only after mount */
    motionEnabled: mounted && reduceMotion !== true,
  };
}
