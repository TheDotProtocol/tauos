'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Database, Code2, Blocks, Globe, Laptop, Server, Workflow } from "lucide-react";

const tools = [
  { name: "TauScript", icon: Code2 },
  { name: "Native SDK", icon: Cpu },
  { name: "Core APIs", icon: Database },
  { name: "Documentation", icon: FileTextIcon },
  { name: "Tau CLI", icon: Terminal },
  { name: "Tau IDE", icon: Laptop },
  { name: "Git Integration", icon: Workflow },
  { name: "CI/CD", icon: Server },
  { name: "Package Manager", icon: Blocks },
];

function FileTextIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

const terminalLines = [
  "> tau init new-project",
  "Initializing Tau environment...",
  "Creating secure sandbox...",
  "Installing dependencies...",
  "Ready.",
  "> tau run dev",
  "Compiling TauScript...",
  "Starting local server on tau://localhost:8080",
  "AI Copilot attached to session."
];

export default function DeveloperPlatform() {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= terminalLines.length) return;

    const currentLine = terminalLines[currentLineIndex];
    
    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setCurrentCharIndex(prev => prev + 1);
      }, Math.random() * 30 + 20); // typing speed
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setTypedLines(prev => [...prev, currentLine]);
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, 500); // delay between lines
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex]);

  return (
    <section id="developers" className="py-32 bg-[#050505] relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Build The Future.</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A developer experience crafted with zero friction. Write code that is inherently secure, private, and AI-accelerated.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Terminal */}
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="mx-auto text-xs text-muted-foreground font-mono">tau-cli — bash</div>
              </div>
              <div className="p-6 font-mono text-sm md:text-base text-primary/90 h-[300px] overflow-y-auto">
                {typedLines.map((line, i) => (
                  <div key={i} className="mb-2">{line}</div>
                ))}
                {currentLineIndex < terminalLines.length && (
                  <div className="flex">
                    <span>{terminalLines[currentLineIndex].substring(0, currentCharIndex)}</span>
                    <span className="w-2.5 h-5 bg-primary ml-1 animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Grid */}
          <motion.div 
            className="flex-1 w-full grid grid-cols-2 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
          >
            {tools.map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-card/50 border border-white/5 hover:border-primary/30 p-4 rounded-xl flex flex-col items-center justify-center gap-3 group cursor-pointer"
              >
                <tool.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-center text-white/80 group-hover:text-white">{tool.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
