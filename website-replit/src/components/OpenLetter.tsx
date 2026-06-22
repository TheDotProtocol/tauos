import { motion } from "framer-motion";

export default function OpenLetter() {
  return (
    <section className="py-40 bg-black relative border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-16 tracking-tight text-white">
            We Believe Technology Should Respect You.
          </h2>
          
          <div className="text-2xl md:text-4xl leading-relaxed md:leading-relaxed font-serif text-white/80 space-y-8">
            <p>
              "We are building Tau because privacy matters. Freedom matters. Innovation matters."
            </p>
            <p className="text-primary italic">
              "The future belongs to builders who refuse to compromise."
            </p>
          </div>

          <div className="mt-20">
            <div className="w-16 h-px bg-primary/50 mx-auto mb-6" />
            <p className="text-xl tracking-widest font-mono text-white/50 uppercase">
              — The Tau Team
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
