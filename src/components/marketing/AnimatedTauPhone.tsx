'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { MessageCircle, Shield, Lock } from 'lucide-react';

const PHONE_W = 320;
const PHONE_H = 650;

function HomeScreenMock() {
  const apps = ['Mail', 'Cloud', 'Talk', 'AI', 'ID', 'Store', 'Browser', 'Settings'];
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c] to-black flex flex-col pt-14 px-4 pb-6">
      <div className="text-white/90 text-3xl font-light text-center mb-1">10:30</div>
      <div className="text-white/50 text-xs text-center mb-6">TAU OS · Home</div>
      <div className="grid grid-cols-4 gap-4 flex-1 content-start">
        {apps.map((name) => (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                name === 'Talk'
                  ? 'bg-primary/20 border-primary ring-2 ring-primary/40'
                  : 'bg-white/10 border-white/10'
              }`}
            >
              {name === 'Talk' ? (
                <MessageCircle className="w-5 h-5 text-primary" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-white/20" />
              )}
            </div>
            <span className={`text-[10px] ${name === 'Talk' ? 'text-primary' : 'text-white/50'}`}>
              {name === 'Talk' ? 'TauTalk' : name}
            </span>
          </div>
        ))}
      </div>
      <div className="h-16 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-around px-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-9 h-9 rounded-xl bg-white/15" />
        ))}
      </div>
    </div>
  );
}

function TauTalkScreenMock() {
  return (
    <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col">
      <div className="px-3 py-3 pt-12 bg-[#111] border-b border-primary/20 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/30 border border-primary/40" />
        <div>
          <div className="text-white text-sm font-semibold">Arun</div>
          <div className="text-primary/80 text-[10px]">encrypted</div>
        </div>
      </div>
      <div className="flex-1 p-3 space-y-2">
        <div className="max-w-[75%] bg-[#1a1a1a] border border-white/10 rounded-2xl rounded-bl-sm px-3 py-2">
          <p className="text-white/90 text-xs">Hey — TauTalk beta is live</p>
        </div>
        <div className="max-w-[75%] ml-auto bg-primary/20 border border-primary/30 rounded-2xl rounded-br-sm px-3 py-2">
          <p className="text-white/90 text-xs">End-to-end encrypted ✓</p>
        </div>
      </div>
      <div className="p-2 border-t border-white/10 flex gap-2 items-center">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-lg">
          +
        </div>
        <div className="flex-1 h-9 rounded-full bg-white/10 border border-white/10" />
      </div>
    </div>
  );
}

type PhoneInnerProps = {
  lockOpacity?: MotionValue<number> | number;
  homeOpacity?: MotionValue<number> | number;
  talkOpacity?: MotionValue<number> | number;
  showScrollStory?: boolean;
};

function PhoneInner({ lockOpacity = 1, homeOpacity = 0, talkOpacity = 0, showScrollStory = false }: PhoneInnerProps) {
  return (
    <div
      className="relative mx-auto rounded-[2.75rem] overflow-hidden shadow-2xl shadow-primary/10 ring-1 ring-primary/25"
      style={{ width: PHONE_W, height: PHONE_H }}
    >
      <motion.div className="absolute inset-0 z-10" style={{ opacity: lockOpacity }}>
        <Image
          src="/brand/tau-phone-lock.png"
          alt="Tau OS lock screen"
          fill
          className="object-cover"
          priority
          sizes="320px"
        />
        <motion.div
          className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-primary/60"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        />
      </motion.div>

      {showScrollStory ? (
        <>
          <motion.div className="absolute inset-0 z-20 bg-black" style={{ opacity: homeOpacity }}>
            <HomeScreenMock />
          </motion.div>
          <motion.div className="absolute inset-0 z-30 bg-black" style={{ opacity: talkOpacity }}>
            <TauTalkScreenMock />
          </motion.div>
        </>
      ) : null}
    </div>
  );
}

type Props = {
  showScrollStory?: boolean;
  className?: string;
};

/** Static hero phone — no useScroll (avoids hydration ref errors). */
function AnimatedTauPhoneStatic({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <motion.div
        animate={{ rotateY: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
        style={{ perspective: 1000 }}
      >
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <div className="absolute w-[380px] h-[380px] border border-primary/15 rounded-full animate-[spin_24s_linear_infinite]" />
          </div>
          <PhoneInner />
        </div>
      </motion.div>
    </div>
  );
}

/** Scroll-driven lock → home → TauTalk story — useScroll only when ref is mounted. */
function AnimatedTauPhoneScroll({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const lockOpacity = useTransform(scrollYProgress, [0, 0.25, 0.35], [1, 1, 0]);
  const homeOpacity = useTransform(scrollYProgress, [0.25, 0.4, 0.55, 0.65], [0, 1, 1, 0]);
  const talkOpacity = useTransform(scrollYProgress, [0.55, 0.7, 1], [0, 1, 1]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const labelOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.4]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ height: '220vh' }}>
      <div className="sticky top-24 h-[calc(100vh-6rem)] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <div className="absolute w-[380px] h-[380px] border border-primary/15 rounded-full animate-[spin_24s_linear_infinite]" />
            <div className="absolute w-[460px] h-[460px] border border-primary/10 rounded-full animate-[spin_32s_linear_infinite_reverse]" />
          </div>
          <motion.div style={{ y: phoneY }}>
            <PhoneInner
              showScrollStory
              lockOpacity={lockOpacity}
              homeOpacity={homeOpacity}
              talkOpacity={talkOpacity}
            />
          </motion.div>
        </div>
        <motion.div className="mt-8 flex gap-6 text-xs text-muted-foreground" style={{ opacity: labelOpacity }}>
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-primary" /> Lock
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-primary" /> Home
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3 text-primary" /> TauTalk
          </span>
        </motion.div>
        <motion.p className="mt-4 text-sm text-primary/80" style={{ opacity: talkOpacity }}>
          <Link href="/tautalk" className="hover:underline font-semibold">
            Download TauTalk →
          </Link>
        </motion.p>
      </div>
    </div>
  );
}

export default function AnimatedTauPhone({ showScrollStory = true, className = '' }: Props) {
  if (!showScrollStory) {
    return <AnimatedTauPhoneStatic className={className} />;
  }
  return <AnimatedTauPhoneScroll className={className} />;
}
