'use client';

import { motion } from "framer-motion";
import { Shield, Cpu, Lock, EyeOff, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AnimatedTauPhone from "./AnimatedTauPhone";

export default function TauMobile() {
  const chips = [
    { text: "Hardware Kill Switch", icon: Shield, position: "top-10 -left-24 md:-left-40" },
    { text: "On-Device AI", icon: Cpu, position: "bottom-32 -left-20 md:-left-32" },
    { text: "Privacy Dashboard", icon: Lock, position: "top-32 -right-20 md:-right-32" },
    { text: "No Ads. No Spying.", icon: EyeOff, position: "bottom-20 -right-24 md:-right-40" },
  ];

  return (
    <section id="mobile" className="py-32 bg-[#050505] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] z-0 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Your Phone. Your Rules.</h2>
          <p className="text-xl text-muted-foreground mb-20 max-w-2xl mx-auto">
            The first smartphone OS built on the premise that your personal device should actually be personal.
          </p>
        </motion.div>

        <div className="relative mt-4">
          <AnimatedTauPhone showScrollStory className="max-w-4xl mx-auto" />

          {/* Floating Chips — positioned beside sticky phone on large screens */}
          <div className="hidden lg:block pointer-events-none absolute inset-0 max-w-4xl mx-auto">
            {chips.map((chip, i) => (
              <motion.div
                key={i}
                className={`absolute ${chip.position} bg-card/80 backdrop-blur-xl border border-primary/30 py-3 px-5 rounded-2xl flex items-center gap-3 shadow-[0_0_20px_rgba(255,215,0,0.1)] pointer-events-auto`}
                initial={{ opacity: 0, scale: 0.8, x: i % 2 === 0 ? 20 : -20 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <chip.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-sm whitespace-nowrap">{chip.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-16 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="bg-card/60 border border-primary/30 rounded-2xl p-8 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Image
                src="/brand/tautalk-icon.png"
                alt="TauTalk"
                width={88}
                height={88}
                className="rounded-2xl ring-2 ring-primary/40"
              />
              <div className="text-left flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <h3 className="text-2xl font-bold text-white">TauTalk — Public Beta</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Encrypted messaging for Android. Register with Gmail or any email — OTP verified.
                  No telemetry. Locations use OpenStreetMap. iPhone? Use browser chat at tauos.org/tautalk/chat.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/tautalk"
                    className="inline-flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded-xl hover:opacity-90 transition"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Explore TauTalk
                  </Link>
                  <Link
                    href="/tautalk/chat"
                    className="inline-flex items-center gap-2 border border-primary/40 text-primary font-semibold px-6 py-3 rounded-xl hover:bg-primary/10 transition"
                  >
                    Use in browser
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
