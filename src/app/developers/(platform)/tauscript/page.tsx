'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import Link from 'next/link';
import { Play, Terminal, Package, BookOpen } from 'lucide-react';
import { useState } from 'react';
import {
  TAUSCRIPT_V1_FEATURES, TAUSCRIPT_EXAMPLES, TAUSCRIPT_STD_MODULES,
  TAUSCRIPT_CLI_COMMANDS, TAUSCRIPT_VERSION,
} from '@/lib/tau-ide/tauscript-docs';

export default function TauScriptPage() {
  const [activeExample, setActiveExample] = useState(TAUSCRIPT_EXAMPLES[0].code);
  const [output, setOutput] = useState<string[]>([]);

  const run = async (code: string) => {
    setActiveExample(code);
    const res = await fetch('/api/developers/tauscript/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    setOutput(data.output?.length ? data.output : data.error ? [`Error: ${data.error}`] : []);
  };

  return (
    <PlatformShell title="TauScript">
      <div className="p-6 max-w-5xl mx-auto space-y-10">
        <div className="glass-strong rounded-xl p-6 border border-cyan-500/30">
          <h2 className="text-3xl font-bold text-cyan-400">TauScript v{TAUSCRIPT_VERSION} Released</h2>
          <p className="text-gray-300 mt-2">
            A complete programming language ecosystem — compiler, CLI, taupm, LSP, formatter, debugger, testing, and 15 stdlib modules.
          </p>
          <div className="flex flex-wrap gap-3 mt-4 text-sm">
            <code className="glass px-3 py-1 rounded-lg text-cyan-400">npm run tau -- run</code>
            <code className="glass px-3 py-1 rounded-lg text-cyan-400">npm run taupm -- install</code>
          </div>
        </div>

        <section>
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Language Features</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {TAUSCRIPT_V1_FEATURES.implemented.map((f) => (
              <div key={f.name} className="card">
                <h4 className="font-medium text-white">{f.name}</h4>
                <code className="text-xs text-gray-500 block mt-1">{f.syntax}</code>
                <button onClick={() => run(f.example)} className="mt-3 text-xs text-cyan-400 hover:underline flex items-center gap-1">
                  <Play className="w-3 h-3" /> Run example
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center gap-2"><Terminal className="w-5 h-5" /> Developer Tooling</h3>
          <ul className="grid md:grid-cols-2 gap-2">
            {TAUSCRIPT_V1_FEATURES.tooling.map((item) => (
              <li key={item} className="text-sm text-gray-400 flex items-center gap-2 glass px-3 py-2 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center gap-2"><Package className="w-5 h-5" /> CLI & taupm</h3>
          <div className="grid md:grid-cols-2 gap-2">
            {TAUSCRIPT_CLI_COMMANDS.map((c) => (
              <div key={c.cmd} className="glass px-3 py-2 rounded-lg text-sm">
                <code className="text-cyan-400">{c.cmd}</code>
                <p className="text-gray-500 text-xs mt-1">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Standard Library ({TAUSCRIPT_STD_MODULES.length} modules)</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {TAUSCRIPT_STD_MODULES.map((m) => (
              <div key={m.name} className="card text-sm">
                <code className="text-cyan-400">{m.name}</code>
                <p className="text-xs text-gray-500 mt-1">{m.exports.slice(0, 4).join(', ')}…</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h3 className="font-semibold mb-4">Live REPL</h3>
          <textarea
            value={activeExample}
            onChange={(e) => setActiveExample(e.target.value)}
            className="w-full h-40 font-mono text-sm glass rounded-lg p-4 text-green-100 border border-white/10 focus:border-cyan-500 focus:outline-none"
          />
          <div className="flex gap-2 mt-3">
            <button onClick={() => run(activeExample)} className="btn-primary text-sm"><Play className="w-4 h-4" /> Run</button>
            <button onClick={async () => {
              const res = await fetch('/api/developers/tauscript/format', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: activeExample }) });
              const data = await res.json();
              if (data.formatted) setActiveExample(data.formatted);
            }} className="btn-secondary text-sm">Format</button>
            <button onClick={async () => {
              const res = await fetch('/api/developers/tauscript/lint', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: activeExample, aiReview: true }) });
              const data = await res.json();
              setOutput([`Score: ${data.score}/100`, ...(data.aiReview?.review?.split('\n') ?? [])]);
            }} className="btn-secondary text-sm">AI Review</button>
          </div>
          <pre className="mt-4 p-4 bg-black rounded-lg text-sm text-green-400 font-mono">
            {output.length ? output.join('\n') : '// output'}
          </pre>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-cyan-400" /> Examples</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {TAUSCRIPT_EXAMPLES.map((ex) => (
              <button key={ex.title} onClick={() => run(ex.code)} className="card text-left hover:border-cyan-500/30">
                <h4 className="font-medium text-white">{ex.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{ex.path}</p>
              </button>
            ))}
          </div>
        </section>

        <p className="text-sm text-gray-500">
          Spec: <code className="text-cyan-400">src/lib/tau-ide/tauscript-v1-spec.md</code> ·{' '}
          <Link href="/developers/terminal" className="text-cyan-400 hover:underline">Terminal REPL</Link> ·{' '}
          <Link href="/developers/workspace" className="text-cyan-400 hover:underline">Tau IDE</Link>
        </p>
      </div>
    </PlatformShell>
  );
}
