import { motion } from "framer-motion";
import { Monitor, Smartphone, Cloud, Mail, Fingerprint, BrainCircuit, Store, Code2 } from "lucide-react";
import { site } from "@/content/site";

const icons = [Monitor, Smartphone, Cloud, Mail, Fingerprint, BrainCircuit, Store, Code2];

export default function WhatIsTau() {
  return (
    <section id="os" className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">The Foundation of Everything.</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{site.mission}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {site.ecosystem.map((item, i) => {
            const Icon = icons[i] ?? Monitor;
            return (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,215,0,0.15)" }}
                className="bg-card/50 backdrop-blur-md border border-white/10 hover:border-primary/50 p-6 rounded-xl relative group transition-all duration-300 block"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <p className="text-muted-foreground">{item.tag}</p>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
