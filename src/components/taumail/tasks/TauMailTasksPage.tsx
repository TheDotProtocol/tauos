'use client';

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { geistMono, geistSans, outfit } from '@/lib/website/fonts';
import { tauMailAssets } from '@/lib/taumail/assets';
import TauMailAppShell from '@/components/taumail/shared/TauMailAppShell';
import { MailIcon } from '@/components/taumail/shared/MailIcon';
import { fetchTauMailTasks, toggleTauMailTask, type TauMailTask } from '@/lib/taumail/api-client';
import { useTauMailSession } from '@/hooks/useTauMailSession';

export default function TauMailTasksPage() {
  const { ready, isLoggedIn } = useTauMailSession();
  const [tasks, setTasks] = useState<TauMailTask[]>([]);

  useEffect(() => {
    if (!ready || !isLoggedIn) return;
    fetchTauMailTasks().then(setTasks).catch(console.error);
  }, [ready, isLoggedIn]);

  const handleToggle = async (task: TauMailTask) => {
    const next = !task.done;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: next } : t)));
    await toggleTauMailTask(task.id, next);
  };

  if (!ready || !isLoggedIn) {
    return <div className={`${geistSans.className} flex min-h-screen items-center justify-center bg-[#070708] text-[#a1a1aa]`}>Loading...</div>;
  }

  return (
    <TauMailAppShell active="tasks">
      <div className={`${geistSans.className} flex min-h-0 flex-1 flex-col p-8`}>
        <div className="flex items-center justify-between">
          <h1 className={`${outfit.className} text-[28px] font-bold text-white`}>Tasks</h1>
          <button type="button" className="flex items-center gap-2 rounded-lg bg-[#d4a843] px-4 py-2 text-sm font-semibold text-[#070708]">
            <MailIcon src={tauMailAssets.icons.plus} size={14} />
            New Task
          </button>
        </div>
        <div className="mt-6 flex gap-2">
          {['All', 'AI Suggested', 'Due Today'].map((tab, i) => (
            <button
              key={tab}
              type="button"
              className={clsx(
                'rounded-lg px-3 py-1.5 text-xs font-medium',
                i === 0 ? 'bg-[rgba(212,168,67,0.08)] text-[#d4a843]' : 'text-[#a1a1aa]',
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-6 space-y-3">
          {tasks.length === 0 ? (
            <p className="text-sm text-[#71717a]">No tasks yet</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#121214] p-4">
                <button
                  type="button"
                  onClick={() => handleToggle(task)}
                  className={clsx(
                    'flex size-5 items-center justify-center rounded border',
                    task.done ? 'border-[#d4a843] bg-[rgba(212,168,67,0.15)]' : 'border-[rgba(255,255,255,0.1)]',
                  )}
                >
                  {task.done ? <MailIcon src={tauMailAssets.auth.checkmark} size={10} /> : null}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={clsx('text-sm font-medium', task.done ? 'text-[#71717a] line-through' : 'text-white')}>{task.title}</p>
                  <p className={`${geistMono.className} text-[11px] text-[#71717a]`}>Due {task.due}</p>
                </div>
                <span
                  className={clsx(
                    'rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase',
                    task.priority === 'urgent' && 'bg-[rgba(239,68,68,0.15)] text-red-400',
                    task.priority === 'high' && 'bg-[rgba(212,168,67,0.15)] text-[#d4a843]',
                    task.priority === 'normal' && 'bg-[rgba(255,255,255,0.05)] text-[#71717a]',
                  )}
                >
                  {task.priority}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </TauMailAppShell>
  );
}
