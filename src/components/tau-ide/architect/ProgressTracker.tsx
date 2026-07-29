'use client';

import type { ProjectTask } from '@/lib/tau-ide/architect/memory';
import { CheckCircle, Circle, Loader2, XCircle } from 'lucide-react';

interface ProgressTrackerProps {
  tasks: ProjectTask[];
}

export default function ProgressTracker({ tasks }: ProgressTrackerProps) {
  if (!tasks.length) return null;

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const total = tasks.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="glass rounded-lg p-3 border border-white/5">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-gray-400">Implementation Progress</span>
        <span className="text-cyan-400">{completed}/{total} ({pct}%)</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full mb-3">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="space-y-1.5 max-h-32 overflow-y-auto">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center gap-2 text-xs">
            {task.status === 'completed' ? (
              <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
            ) : task.status === 'in_progress' ? (
              <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
            ) : task.status === 'failed' ? (
              <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-gray-600 shrink-0" />
            )}
            <span className={task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-300'}>
              {task.title}
            </span>
            {task.agent && <span className="text-gray-600 ml-auto">{task.agent}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
