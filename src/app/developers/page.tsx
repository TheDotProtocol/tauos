'use client';

import Link from 'next/link';
import {
  Code, GitBranch, Terminal, Brain, Shield, Rocket, BookOpen, Lock,
  ArrowRight, Sparkles, Layers, Globe
} from 'lucide-react';

const features = [
  { icon: Code, title: 'Tau IDE Workspace', desc: 'Monaco editor, file explorer, tabs, terminal, and project management in one workspace.' },
  { icon: Brain, title: 'Tau Architect', desc: 'AI software architect — describe your app in plain English and get PRD, architecture, and code.' },
  { icon: Terminal, title: 'TauScript', desc: 'A real programming language with lexer, parser, runtime, and REPL — not a demo.' },
  { icon: GitBranch, title: 'Git Integration', desc: 'Repository management, commits, and branches — foundation ready for v1.' },
  { icon: Rocket, title: 'Deploy Anywhere', desc: 'Architecture for Vercel, Docker, Tau Cloud, and self-hosted deployment.' },
  { icon: Shield, title: 'Secure by Tau', desc: 'Privacy-first development with zero telemetry in TauScript runs.' },
];

export default function TauIdeLandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 glass-strong sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/developers" className="flex items-center gap-3">
            <img src="/brand/tau-ide-logo.png" alt="Tau IDE" className="w-10 h-10 rounded-lg" />
            <div>
              <span className="font-bold text-white">Tau IDE</span>
              <span className="hidden sm:inline text-xs text-cyan-400 ml-2">Developer Platform</span>
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Public Beta RC1</span>
            </div>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/developers/docs" className="text-gray-400 hover:text-cyan-400 hidden sm:inline">Docs</Link>
            <Link href="/developers/login" className="text-gray-400 hover:text-white">Sign in</Link>
            <Link href="/developers/dashboard" className="btn-primary text-sm py-2 px-4">
              Open Platform <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <img
            src="/brand/tau-ide-logo.png"
            alt="Tau IDE"
            className="w-32 h-32 mx-auto rounded-2xl shadow-2xl shadow-cyan-500/20 mb-8"
          />
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-white">Tau </span>
            <span className="text-gradient">IDE</span>
          </h1>
          <p className="text-xl text-cyan-400/90 font-medium mb-2">Developer Platform</p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            One platform to design, build, understand, and deploy software.
            Professional IDE, AI architect, TauScript language, Git, and deployment — unified.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/developers/dashboard" className="btn-primary text-lg px-8 py-3">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/developers/architect" className="btn-secondary text-lg px-8 py-3">
              <Sparkles className="w-5 h-5" /> Try Tau Architect
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">The foundation of the Tau ecosystem</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Tau IDE is not just another code editor. It is the developer platform where Tau Core, Tau Mail,
              Tau Cloud, Tau Browser, and Tau AI are built. Think GitHub + Cursor + VS Code + Vercel — one coherent product.
            </p>
            <ul className="space-y-3 text-gray-300">
              {['Beginner Mode — build with conversation', 'Professional Mode — full IDE control', 'AI Architect Mode — senior architect in your workspace'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Layers, label: 'Code Host' },
              { icon: Code, label: 'Build & Deploy' },
              { icon: Terminal, label: 'TauScript Powered' },
              { icon: Globe, label: 'Collaborate' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="card text-center py-6">
                <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card">
                <Icon className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TauScript */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <pre className="glass p-4 rounded-xl text-sm font-mono text-green-300 overflow-x-auto">
{`fn greet(name) {
  return "Hello, " + name;
}

print(greet("Tau"));`}
            </pre>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold mb-4">TauScript</h2>
            <p className="text-gray-400 mb-4">
              A real programming language — lexer, parser, AST, evaluator, and REPL.
              Documentation and runtime stay synchronized. No fake syntax.
            </p>
            <Link href="/developers/tauscript" className="text-cyan-400 hover:underline inline-flex items-center gap-1">
              Explore TauScript <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tau Architect */}
      <section className="py-16 bg-gradient-to-r from-cyan-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Brain className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Tau Architect</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Zero programming knowledge required. Describe your software in natural language.
            Tau Architect gathers requirements, designs architecture, and generates your project inside Tau IDE.
          </p>
          <Link href="/developers/architect" className="btn-primary">
            Start Building with AI <Sparkles className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Privacy & Open Source */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div className="card">
            <Lock className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Privacy First</h3>
            <p className="text-gray-400 text-sm">Your code stays yours. TauScript runs locally. No telemetry in language execution.</p>
          </div>
          <div className="card">
            <BookOpen className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Open Source</h3>
            <p className="text-gray-400 text-sm">Built on transparent foundations. Inspect, contribute, and deploy on your terms.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center border-t border-white/10">
        <h2 className="text-3xl font-bold mb-4">Ready to build?</h2>
        <p className="text-gray-400 mb-8">One account. Multiple projects. Persistent workspaces.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/developers/register" className="btn-primary px-8 py-3">Create Account</Link>
          <Link href="/developers/workspace" className="btn-secondary px-8 py-3">Open Tau IDE</Link>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-500 space-y-2">
        <p>Tau IDE v1.0.0-beta.1 — Developer Platform · <Link href="https://www.tauos.org" className="hover:text-cyan-400">tauos.org</Link></p>
        <p className="flex flex-wrap justify-center gap-4 text-xs">
          <Link href="/legal/privacy" className="hover:text-cyan-400">Privacy Policy</Link>
          <Link href="/legal/terms" className="hover:text-cyan-400">Terms of Service</Link>
          <Link href="/legal/acceptable-use" className="hover:text-cyan-400">Acceptable Use</Link>
          <Link href="/legal/cookies" className="hover:text-cyan-400">Cookies</Link>
        </p>
        <p className="text-xs text-gray-600">AI-generated code should be reviewed. Tau Architect requires sign-in.</p>
      </footer>
    </div>
  );
}
