import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "Linux based",
  "Privacy First",
  "AI Native",
  "Modern UI",
  "Developer Friendly",
  "Enterprise Ready"
];

export default function TauOSDesktop() {
  return (
    <section className="py-32 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Monitor Mockup */}
            <div className="relative w-full aspect-[16/10] bg-[#111] border-[4px] border-[#333] rounded-2xl shadow-2xl overflow-hidden ring-1 ring-primary/20 group">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/50 blur-[2px]" />
              {/* Fake UI */}
              <div className="w-full h-full p-4 flex flex-col">
                <div className="flex justify-between items-center mb-6 opacity-50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="text-[10px] text-white/50">9:41 AM</div>
                </div>
                
                <div className="flex-1 flex gap-4">
                  {/* Fake Sidebar */}
                  <div className="w-1/4 h-full bg-white/5 rounded-lg border border-white/5" />
                  {/* Fake Main Area */}
                  <div className="flex-1 h-full bg-primary/5 rounded-lg border border-primary/20 flex items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                     <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                       <span className="text-primary font-bold">τ</span>
                     </div>
                  </div>
                </div>
                
                {/* Fake Dock */}
                <div className="h-12 w-3/4 mx-auto mt-4 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center gap-4 px-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary/20 hover:scale-110 transition-all cursor-none" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">An OS That Thinks With You.</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Meticulously crafted from the kernel up. Stripped of bloatware, tracking, and ads. Replaced with raw performance and native intelligence.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-lg rounded-none">
              See Desktop
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
