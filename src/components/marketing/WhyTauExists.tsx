'use client';

import { motion } from "framer-motion";

export default function WhyTauExists() {
  const lines = [
    "People deserve Privacy.",
    "People deserve Freedom.",
    "People deserve Control.",
    "AI that works for them.",
    "Technology that empowers. Not exploits.",
    "Tau exists to rebuild trust."
  ];

  return (
    <section className="min-h-screen bg-black relative flex flex-col justify-center items-center py-32 overflow-hidden">
      {/* Background sweep effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"
        initial={{ backgroundPosition: "0% -100%" }}
        whileInView={{ backgroundPosition: "0% 200%" }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 3, ease: "linear" }}
        style={{ backgroundSize: "100% 200%" }}
      />

      <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
        <motion.h2 
          className="text-3xl md:text-5xl lg:text-7xl font-bold mb-24 tracking-tight text-white/50"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          The internet forgot who it was built for.
        </motion.h2>

        <div className="flex flex-col gap-8 md:gap-12">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            >
              <h3 className={`text-4xl md:text-6xl font-bold tracking-tight ${
                i === lines.length - 1 ? "text-primary mt-12" : "text-white"
              }`}>
                {line}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
