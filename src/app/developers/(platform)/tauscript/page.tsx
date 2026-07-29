'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { useState } from 'react';
import { TAUSCRIPT_V1_FEATURES, TAUSCRIPT_EXAMPLES } from '@/lib/tau-ide/tauscript-docs';

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
        <div>
          <h2 className="text-2xl font-bold">TauScript v1.0</h2>
          <p className="text-gray-400 mt-2">
            A real programming language — not a demo. Documentation reflects only what the runtime executes.
          </p>
        </div>

        <section>
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Implemented in v1</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {TAUSCRIPT_V1_FEATURES.implemented.map((f) => (
              <div key={f.name} className="card">
                <h4 className="font-medium text-white">{f.name}</h4>
                <code className="text-xs text-gray-500 block mt-1">{f.syntax}</code>
                <button
                  onClick={() => run(f.example)}
                  className="mt-3 text-xs text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Play className="w-3 h-3" /> Run example
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4 text-purple-300">Version 2 (architecture ready)</h3>
          <ul className="grid md:grid-cols-2 gap-2">
            {TAUSCRIPT_V1_FEATURES.version2.map((item) => (
              <li key={item} className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-purple-400" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h3 className="font-semibold mb-4">Live REPL</h3>
          <textarea
            value={activeExample}
            onChange={(e) => setActiveExample(e.target.value)}
            className="w-full h-40 font-mono text-sm glass rounded-lg p-4 text-green-100 border border-white/10 focus:border-cyan-500 focus:outline-none"
          />
          <button onClick={() => run(activeExample)} className="btn-primary text-sm mt-3">
            <Play className="w-4 h-4" /> Run
          </button>
          <pre className="mt-4 p-4 bg-black rounded-lg text-sm text-green-400 font-mono">
            {output.length ? output.join('\n') : '// output'}
          </pre>
        </section>

        <p className="text-sm text-gray-500">
          Open the full <Link href="/developers/terminal" className="text-cyan-400 hover:underline">Terminal REPL</Link> or{' '}
          <Link href="/developers/workspace" className="text-cyan-400 hover:underline">Tau IDE workspace</Link>.
        </p>
      </div>
    </PlatformShell>
  );
}
