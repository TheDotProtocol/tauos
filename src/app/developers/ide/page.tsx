'use client';

import { useState } from 'react';
import { Play, Terminal, Code } from 'lucide-react';

const WELCOME = `// TauStudio — TauScript on TAU CORE™
print("Hello from TauScript!");

let name = "Developer";
print("Welcome, " + name);
`;

export default function DevelopersIdePage() {
  const [code, setCode] = useState(WELCOME);
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCode = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch('/api/developers/tauscript/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.output?.length) setOutput(data.output);
      else if (data.value !== undefined) setOutput([String(data.value)]);
      if (data.error) setError(data.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Run failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Code className="w-6 h-6 text-yellow-400" />
            TauStudio IDE
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Write and run TauScript in the browser — privacy-first development on TAU CORE™
          </p>
        </div>
        <button
          onClick={runCode}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          {running ? 'Running…' : 'Run'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[60vh]">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-[60vh] font-mono text-sm bg-gray-900 border border-gray-800 rounded-xl p-4 text-green-100 focus:outline-none focus:border-yellow-500/50 resize-none"
        />
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <Terminal className="w-4 h-4" />
            Output
          </div>
          <pre className="flex-1 font-mono text-sm text-gray-200 whitespace-pre-wrap overflow-auto">
            {error && <span className="text-red-400">{error}{'\n'}</span>}
            {output.length ? output.join('\n') : '// Run your TauScript to see output'}
          </pre>
        </div>
      </div>
    </div>
  );
}
