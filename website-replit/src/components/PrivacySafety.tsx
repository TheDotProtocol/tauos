import { motion } from "framer-motion";
import { Check, X, ShieldAlert } from "lucide-react";

export default function PrivacySafety() {
  const isList = [
    "End-to-End Encryption by Default",
    "On-Device Processing First",
    "Hardware Kill Switches",
    "Open Source Core Components",
    "Zero-Knowledge Architecture",
    "Granular Permission Controls"
  ];

  const isNotList = [
    "NO Surveillance Platform",
    "NO Data Broker Integrations",
    "NO Hidden Telemetry",
    "NO Darknet OS",
    "NO Hacker Paradise",
    "NO Backdoors"
  ];

  return (
    <section className="py-32 bg-[#0a0a0a] relative border-t border-white/5">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Privacy Is Not An Option. <br/><span className="text-primary">It's The Foundation.</span></h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 mb-32">
          {/* IS */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card/30 border border-primary/20 p-8 md:p-12 rounded-3xl"
          >
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              What Tau Is
            </h3>
            <ul className="space-y-6">
              {isList.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
                  <span className="text-lg text-white/90">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* IS NOT */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card/30 border border-red-500/20 p-8 md:p-12 rounded-3xl"
          >
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-red-400">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                <X className="w-5 h-5 text-red-500" />
              </div>
              What Tau Is NOT
            </h3>
            <ul className="space-y-6">
              {isNotList.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 w-2 h-2 rounded-full bg-red-500/50" />
                  <span className="text-lg text-white/70">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Diagram */}
        <motion.div 
          className="relative h-[400px] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* Orbital rings */}
          <div className="absolute w-[300px] h-[300px] border border-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute w-[450px] h-[450px] border border-primary/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
          <div className="absolute w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_40s_linear_infinite]" />
          
          {/* Center Shield */}
          <div className="relative z-10 w-32 h-32 bg-black rounded-full border-4 border-primary flex items-center justify-center shadow-[0_0_50px_rgba(255,215,0,0.3)]">
            <ShieldAlert className="w-16 h-16 text-primary" />
          </div>

          {/* Orbiting nodes */}
          <div className="absolute w-[300px] h-[300px] animate-[spin_20s_linear_infinite]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-card border border-primary px-3 py-1 rounded-full text-xs font-mono text-primary whitespace-nowrap">Local AI</div>
          </div>
          <div className="absolute w-[450px] h-[450px] animate-[spin_30s_linear_infinite_reverse]">
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 bg-card border border-primary px-3 py-1 rounded-full text-xs font-mono text-primary whitespace-nowrap rotate-90">Kill Switches</div>
          </div>
          <div className="absolute w-[600px] h-[600px] animate-[spin_40s_linear_infinite]">
            <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-card border border-primary px-3 py-1 rounded-full text-xs font-mono text-primary whitespace-nowrap">No Telemetry</div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
