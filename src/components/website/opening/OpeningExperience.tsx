'use client';

import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import TauLogo from '@/components/website/ui/TauLogo';
import { instrumentSerif } from '@/lib/website/fonts';

const SCENES = [
  { id: 1, duration: 4000, type: 'void' as const },
  { id: 2, duration: 5000, type: 'logo' as const },
  { id: 3, duration: 6000, type: 'universe' as const },
  { id: 4, duration: 5000, type: 'words' as const, line1: 'Every journey begins with a single choice.', line2: 'The choice of flow.' },
  { id: 5, duration: 5000, type: 'welcome' as const, line1: 'Welcome.', line2: "You're entering the Tau Universe." },
  { id: 6, duration: 2000, type: 'reveal' as const },
] as const;

const STORAGE_KEY = 'tau-opening-seen';

type OpeningExperienceProps = {
  onComplete: () => void;
};

export default function OpeningExperience({ onComplete }: OpeningExperienceProps) {
  const reduceMotion = useReducedMotion();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const finish = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    onComplete();
    setVisible(false);
  }, [onComplete]);

  const skip = useCallback(() => finish(), [finish]);

  useEffect(() => {
    if (reduceMotion) {
      finish();
      return;
    }
    if (sessionStorage.getItem(STORAGE_KEY)) {
      onComplete();
      setVisible(false);
      return;
    }
  }, [reduceMotion, finish, onComplete]);

  useEffect(() => {
    if (!visible || reduceMotion) return;
    const scene = SCENES[sceneIndex];
    if (!scene) {
      finish();
      return;
    }
    const timer = window.setTimeout(() => {
      if (sceneIndex >= SCENES.length - 1) finish();
      else setSceneIndex((i) => i + 1);
    }, scene.duration);
    return () => window.clearTimeout(timer);
  }, [sceneIndex, visible, reduceMotion, finish]);

  if (!visible) return null;

  const scene = SCENES[sceneIndex];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0a0a0b]">
      <button
        type="button"
        onClick={skip}
        className="absolute right-6 top-6 z-10 rounded-lg border border-tau-border px-4 py-2 text-xs font-medium text-tau-muted transition hover:border-tau-accent-border hover:text-white"
      >
        Skip
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-1 items-center justify-center overflow-hidden"
        >
          {scene.type === 'void' && <SceneVoid />}
          {scene.type === 'logo' && <SceneLogo />}
          {scene.type === 'universe' && <SceneUniverse />}
          {scene.type === 'words' && <SceneWords line1={scene.line1} line2={scene.line2} />}
          {scene.type === 'welcome' && <SceneWelcome line1={scene.line1} line2={scene.line2} />}
          {scene.type === 'reveal' && <SceneReveal />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SceneVoid() {
  return (
    <>
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2"
        animate={{ opacity: [0.3, 0.7, 0.5], scale: [0.95, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image src="/website/images/opening/ambient-glow.svg" alt="" fill className="object-contain" priority />
      </motion.div>
      <motion.div
        className="relative size-2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image src="/website/images/opening/singularity-point.svg" alt="" width={8} height={8} className="size-2" />
      </motion.div>
    </>
  );
}

function SceneLogo() {
  return (
    <>
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2 }}
      >
        <Image src="/website/images/opening/ambient-glow.svg" alt="" fill className="object-contain" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <TauLogo size="hero" href={undefined} />
      </motion.div>
    </>
  );
}

function SceneUniverse() {
  return (
    <>
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,0.15) 0%, transparent 70%)',
        }}
      />
      {[...Array(24)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute size-1 rounded-full bg-tau-accent/60"
          style={{
            left: `${10 + (i * 37) % 80}%`,
            top: `${10 + (i * 23) % 80}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0.6], scale: [0, 1, 0.8] }}
          transition={{ duration: 2, delay: i * 0.08, ease: 'easeOut' }}
        />
      ))}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="relative"
      >
        <TauLogo size="hero" href={undefined} />
      </motion.div>
    </>
  );
}

function SceneWords({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <div className="max-w-3xl px-6 text-center">
      <motion.p
        className={`${instrumentSerif.className} text-3xl leading-tight text-white md:text-5xl`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {line1}
      </motion.p>
      <motion.p
        className="mt-6 text-lg text-tau-accent md:text-xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        {line2}
      </motion.p>
    </div>
  );
}

function SceneWelcome({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <div className="max-w-3xl px-6 text-center">
      <motion.p
        className={`${instrumentSerif.className} text-4xl text-tau-accent md:text-6xl`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {line1}
      </motion.p>
      <motion.p
        className="mt-6 text-xl text-white/80 md:text-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        {line2}
      </motion.p>
    </div>
  );
}

function SceneReveal() {
  return (
    <motion.div
      className="absolute inset-0 bg-tau-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    />
  );
}

export function resetOpeningExperience() {
  sessionStorage.removeItem(STORAGE_KEY);
}
