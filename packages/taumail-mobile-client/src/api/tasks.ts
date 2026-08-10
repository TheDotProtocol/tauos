import { jsonAuthHeaders } from '../session';
import { tauMobileFetch } from '../network';
import type { TauMailTask } from '../types';

export async function fetchTasks(): Promise<TauMailTask[]> {
  const res = await tauMobileFetch('/api/taumail/tasks', { headers: await jsonAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load tasks');
  const data = (await res.json()) as { tasks?: TauMailTask[] };
  return data.tasks || [];
}

export async function toggleTask(id: string, isDone: boolean): Promise<void> {
  const res = await tauMobileFetch('/api/taumail/tasks', {
    method: 'PATCH',
    headers: await jsonAuthHeaders(),
    body: JSON.stringify({ id, isDone }),
  });
  if (!res.ok) throw new Error('Failed to update task');
}
