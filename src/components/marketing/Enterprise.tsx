'use client';

import { motion } from "framer-motion";
import { ShieldCheck, Server, Key, FileBarChart2 } from "lucide-react";

const compliances = [
  { name: "GDPR Aligned", icon: ShieldCheck, desc: "DSR export & erasure APIs live" },
  { name: "DPA Available", icon: FileBarChart2, desc: "Standard processor terms at /legal/dpa" },
  { name: "Audit Logs", icon: FileBarChart2, desc: "Immutable audit_log for DSR events" },
  { name: "Zero Trust", icon: Key, desc: "Tau ID SSO across all apps" },
  { name: "Certification Track", icon: Server, desc: "SOC 2 / ISO audits in progress — badges when earned" },
  { name: "Hybrid Arch", icon: Server, desc: "Deploy on-prem or cloud" },
];

export default function Enterprise() {
  return (
    <section id="enterprise" className="py-32 bg-black relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Enterprise-Ready. <span className="text-primary">Day One.</span></h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            GDPR-aligned controls today. Formal SOC 2 / ISO badges only after audits are earned.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {compliances.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card/30 backdrop-blur-sm border border-white/10 hover:border-primary p-8 rounded-2xl relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <item.icon className="w-8 h-8 text-primary mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">{item.name}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
