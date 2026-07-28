'use client';

import { motion } from "framer-motion";
import { Shield, Cpu, Lock, EyeOff, Cloud, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

        <div className="relative flex justify-center mt-10">
          {/* Phone Mockup */}
          <motion.div 
            className="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-[#222] shadow-2xl z-10 flex flex-col p-2 ring-1 ring-primary/30"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            animate={{ rotateY: [-5, 5, -5] }}
            // @ts-ignore
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          >
            {/* Fake Notch / Dynamic Island */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#222] rounded-b-3xl z-20 flex justify-center items-end pb-1 gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>

            {/* Screen UI */}
            <div className="flex-1 bg-gradient-to-b from-[#111] to-black rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col pt-10 px-4 relative">
              <div className="absolute inset-0 bg-primary/5 opacity-50" />
              
              {/* Fake Clock */}
              <div className="text-white/80 font-bold text-4xl mb-8 mt-4 self-center tracking-tighter">10:42</div>

              {/* Fake Widgets */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 h-24 rounded-2xl border border-white/5 p-3 flex flex-col justify-between relative overflow-hidden group">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Shield className="w-3 h-3 text-primary" />
                  </div>
                  <div className="text-xs text-white/70">Protected</div>
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-primary/10 rounded-full blur-xl" />
                </div>
                <div className="bg-white/5 h-24 rounded-2xl border border-white/5 p-3 flex flex-col justify-between">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Cloud className="w-3 h-3 text-blue-400" />
                  </div>
                  <div className="text-xs text-white/70">Synced</div>
                </div>
              </div>

              {/* Fake App Icons */}
              <div className="grid grid-cols-4 gap-y-6 gap-x-2 mt-auto pb-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white/5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Fake Bottom Dock */}
              <div className="h-20 bg-white/5 rounded-3xl mb-2 flex items-center justify-around px-4 border border-white/5 backdrop-blur-md">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-2xl bg-white/20" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Floating Chips */}
          {chips.map((chip, i) => (
            <motion.div
              key={i}
              className={`absolute ${chip.position} bg-card/80 backdrop-blur-xl border border-primary/30 py-3 px-5 rounded-2xl flex items-center gap-3 shadow-[0_0_20px_rgba(255,215,0,0.1)] hidden sm:flex`}
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
                  No telemetry. Locations use OpenStreetMap.
                </p>
                <Link
                  href="/tautalk"
                  className="inline-flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded-xl hover:opacity-90 transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  Explore TauTalk
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
