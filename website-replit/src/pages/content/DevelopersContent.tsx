/* Ported from src/app/developers/page.tsx — content preserved from legacy site */
import { motion } from 'framer-motion';
import {
  Code, Github, Bug, FileText, Palette, Users, Globe, Shield,
  Lock, Eye, Zap, Heart, GitBranch, Terminal, Database, Server,
  Smartphone, Monitor, Tablet, ArrowRight, Mail, ExternalLink,
  CheckCircle, Star, GitPullRequest, GitCommit, GitMerge
} from 'lucide-react';

export function DevelopersContent() {
  return (
    <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Developers
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Welcome to the <span className="text-yellow-400 font-semibold">Tau OS developer hub</span>.
              <br />
              This is where builders, hackers, researchers, and curious minds come together to shape the future of a sovereign operating system.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
              Tau OS is <span className="text-yellow-400 font-semibold">open, modular, and community-driven</span>. 
              Whether you're into kernel-level systems programming, app development, or building privacy-first cloud services, 
              there's a place for you here.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Globe className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Our Philosophy
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Freedom First",
                description: "Users should own their data, identity, and digital choices."
              },
              {
                icon: Eye,
                title: "Transparency",
                description: "Every line of code is open for inspection, review, and contribution."
              },
              {
                icon: Shield,
                title: "Security",
                description: "Built from the ground up to protect users, not exploit them."
              },
              {
                icon: Users,
                title: "Collaboration",
                description: "Like the Linux Foundation, The Tau Foundation provides governance, while Tau LLC drives commercial adoption."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <item.icon className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Code className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Get Involved
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: Github,
                title: "Contribute Code",
                description: "Join us on GitHub (coming soon).",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Bug,
                title: "Test & Report Bugs",
                description: "Help us strengthen Tau OS by stress-testing releases.",
                color: "from-red-500 to-pink-500"
              },
              {
                icon: FileText,
                title: "Write Documentation",
                description: "Good docs matter — clear guides empower users.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Palette,
                title: "Design Apps & Tools",
                description: "Build privacy-first apps that enhance the Tau ecosystem.",
                color: "from-purple-500 to-indigo-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Stack Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Terminal className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Technical Stack
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Server,
                title: "Core",
                description: "Lightweight Linux-based OS, customized for sovereignty & control."
              },
              {
                icon: Mail,
                title: "TauMail",
                description: "Encrypted, independent email service."
              },
              {
                icon: Database,
                title: "TauCloud",
                description: "Secure, decentralized storage and collaboration tools."
              },
              {
                icon: Code,
                title: "SDKs",
                description: "Developer-friendly tools to build applications directly on Tau OS."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <item.icon className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Community
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Tau is not a product — it's a <span className="text-yellow-400 font-semibold">movement</span>.
              <br />
              We welcome developers, sysadmins, security researchers, UI/UX designers, and anyone with a vision for a better digital future.
            </p>
            <a
              href="mailto:verify@tauos.org"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              <span>Join our early dev program</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Why Build on Tau Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Why Build on Tau?
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              "No corporate gatekeepers.",
              "Open governance model under The Tau Foundation.",
              "Commercialization opportunities through Tau LLC.",
              "A real chance to shape the future of operating systems."
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4 p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <p className="text-gray-300">{item}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
              <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                Your code. Your rules. Our collective future.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <img src="/brand/tauos-logo.svg" alt="TauOS" className="h-8 w-auto" />
              <span className="text-xl font-bold text-white">Tau OS</span>
            </div>
            <p className="text-gray-400">© 2026 Tau Foundation & Tau LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
