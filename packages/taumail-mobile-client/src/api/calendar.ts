import { jsonAuthHeaders } from '../session';
import { tauMobileFetch } from '../network';
import type { TauMailCalendarData } from '../types';

export type FetchCalendarOptions = {
  weekStart?: string;
  date?: string;
  rangeStart?: string;
  rangeEnd?: string;
};

export async function fetchCalendar(options?: FetchCalendarOptions): Promise<TauMailCalendarData> {
  const params = new URLSearchParams();
  if (options?.weekStart) params.set('weekStart', options.weekStart);
  if (options?.date) params.set('date', options.date);
  if (options?.rangeStart) params.set('rangeStart', options.rangeStart);
  if (options?.rangeEnd) params.set('rangeEnd', options.rangeEnd);
  const query = params.toString();
  const path = query ? `/api/taumail/calendar?${query}` : '/api/taumail/calendar';

  const res = await tauMobileFetch(path, { headers: await jsonAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load calendar');
  return res.json() as Promise<TauMailCalendarData>;
}

export async function createCalendarEvent(input: {
  title: string;
  location?: string;
  startsAt: string;
  endsAt?: string;
  color?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await tauMobileFetch('/api/taumail/calendar', {
    method: 'POST',
    headers: await jsonAuthHeaders(),
    body: JSON.stringify(input),
  });
  const data = (await res.json()) as { error?: string };
  if (!res.ok) return { ok: false, error: data.error || 'Failed to create event' };
  return { ok: true };
}
