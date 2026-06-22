import { motion } from "framer-motion";

const phases = [
  {
    phase: "Phase 1",
    title: "Foundation",
    items: ["Tau OS Core", "Tau Mobile Base", "Tau Mail Beta", "Tau Cloud Sync"],
    status: "active"
  },
  {
    phase: "Phase 2",
    title: "Intelligence",
    items: ["Tau AI Integration", "Tau Store Launch", "TauScript 1.0", "Developer SDK"],
    status: "upcoming"
  },
  {
    phase: "Phase 3",
    title: "Scale",
    items: ["Enterprise Ecosystem", "Global Hardware Partners", "Decentralized Nodes", "Tau Core v2.0"],
    status: "upcoming"
  }
];

export default function Roadmap() {
  return (
    <section className="py-32 bg-[#050505] relative border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">The Road Ahead.</h2>
        </motion.div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 hidden md:block" />
          <div className="absolute top-1/2 left-0 w-1/3 h-1 bg-primary -translate-y-1/2 hidden md:block shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
          
          <div className="absolute left-[39px] top-0 w-1 h-full bg-white/10 md:hidden" />
          <div className="absolute left-[39px] top-0 w-1 h-1/3 bg-primary md:hidden shadow-[0_0_15px_rgba(255,215,0,0.5)]" />

          <div className="grid md:grid-cols-3 gap-12 md:gap-6">
            {phases.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative pl-20 md:pl-0 md:pt-16"
              >
                {/* Node */}
                <div className={`absolute left-8 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 ${
                  phase.status === 'active' ? 'bg-primary border-black shadow-[0_0_20px_rgba(255,215,0,0.8)]' : 'bg-[#111] border-white/20'
                } z-10`} />

                <div className={`bg-card/40 backdrop-blur-md border ${phase.status === 'active' ? 'border-primary/50' : 'border-white/5'} p-8 rounded-2xl`}>
                  <div className={`text-sm font-bold font-mono mb-2 ${phase.status === 'active' ? 'text-primary' : 'text-white/40'}`}>
                    {phase.phase}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-6">{phase.title}</h3>
                  <ul className="space-y-3">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-3 text-muted-foreground">
                        <div className={`w-1.5 h-1.5 rounded-full ${phase.status === 'active' ? 'bg-primary/50' : 'bg-white/20'}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
