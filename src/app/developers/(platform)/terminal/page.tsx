'use client';

import { useState } from 'react';
import PlatformShell from '@/components/tau-ide/PlatformShell';
import { Play, Terminal as TerminalIcon } from 'lucide-react';

const EXAMPLES = [
  { label: 'Hello', code: 'print("Hello from TauScript")' },
  { label: 'Variables', code: 'let x = 42\nprint(x + 8)' },
  { label: 'Function', code: 'fn greet(name) {\n  return "Hi " + name\n}\nprint(greet("dev"))' },
  { label: 'Loop', code: 'let i = 0\nwhile i < 3 {\n  print("step " + i)\n  i = i + 1\n}' },
];

export default function TerminalPage() {
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const run = async () => {
    setRunning(true);
    setHistory((h) => [...h, `$ tauscript run\n${code}`]);
    try {
      const res = await fetch('/api/developers/tauscript/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      const lines = data.output?.length ? data.output : data.error ? [`Error: ${data.error}`] : [String(data.value ?? '')];
      setOutput(lines);
      setHistory((h) => [...h, ...lines]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed';
      setOutput([msg]);
      setHistory((h) => [...h, msg]);
    } finally {
      setRunning(false);
    }
  };

  return (
    <PlatformShell title="Terminal">
      <div className="p-6 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col gap-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <TerminalIcon className="w-4 h-4 text-cyan-400" />
          TauScript REPL — interactive runtime
        </div>

        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => setCode(ex.code)}
              className="px-3 py-1.5 text-xs glass rounded-lg text-gray-400 hover:text-cyan-400"
            >
              {ex.label}
            </button>
          ))}
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 min-h-[200px] font-mono text-sm glass rounded-xl p-4 text-green-100 border border-white/10 focus:border-cyan-500 focus:outline-none resize-none"
        />

        <button onClick={run} disabled={running} className="btn-primary w-fit">
          <Play className="w-4 h-4" /> {running ? 'Running…' : 'Run'}
        </button>

        <div className="flex-1 min-h-[200px] bg-black rounded-xl border border-white/10 p-4 font-mono text-sm text-green-400 overflow-auto">
          {history.length === 0 && <span className="text-gray-600">// Output appears here</span>}
          {history.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    </PlatformShell>
  );
}
