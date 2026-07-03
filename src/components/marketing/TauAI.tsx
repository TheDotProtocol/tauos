'use client';

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Brain, Fingerprint, FileText, Code, Zap, Search, Mic } from "lucide-react";

const features = [
  { name: "On-Device Inference", icon: Brain, desc: "Models run locally. Zero latency. Zero cloud dependency." },
  { name: "Privacy-Preserving", icon: Fingerprint, desc: "Your data never leaves your device to train our models." },
  { name: "Document Assistant", icon: FileText, desc: "Instantly summarize, query, and analyze local files." },
  { name: "Developer Assistant", icon: Code, desc: "Native code generation and debugging in TauScript." },
  { name: "Smart Productivity", icon: Zap, desc: "Automate repetitive tasks across the OS seamlessly." },
  { name: "Visual Search", icon: Search, desc: "Find anything on your screen or in your history via semantic search." },
  { name: "Voice Assistant", icon: Mic, desc: "Natural voice control that actually understands context." },
];

export default function TauAI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Neural network background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const numNodes = 50;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 215, 0, 0.5)";
      ctx.strokeStyle = "rgba(255, 215, 0, 0.15)";
      ctx.lineWidth = 1;

      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          let node2 = nodes[j];
          let dist = Math.hypot(node.x - node2.x, node.y - node2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.2 * (1 - dist/150)})`;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section id="ai" className="py-32 relative bg-black overflow-hidden border-t border-white/5">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">AI That Serves You.<br/>Not Advertisers.</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deeply integrated into the OS layer. Powerful enough to reason. Private enough to trust.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card/40 backdrop-blur-xl border border-white/10 hover:border-primary/50 p-6 rounded-2xl group transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
