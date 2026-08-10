export type CalendarViewMode = 'day' | 'week' | 'month';

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function formatWeekdayShort(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

export function getMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const cells: (Date | null)[] = Array.from({ length: startPad }, () => null);
  for (let day = 1; day <= last.getDate(); day += 1) {
    cells.push(new Date(year, month, day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function formatEventWhen(item: {
  time: string;
  endTime?: string | null;
  location?: string;
  startsAt?: string;
}): string {
  const timeRange = item.endTime ? `${item.time} – ${item.endTime}` : item.time;
  const locationPart = item.location ? ` · ${item.location}` : '';
  if (!item.startsAt) return `${timeRange}${locationPart}`;

  const start = new Date(item.startsAt);
  const now = new Date();
  const diffMs = start.getTime() - now.getTime();
  if (diffMs > 0 && diffMs < 24 * 60 * 60 * 1000) {
    const mins = Math.max(1, Math.round(diffMs / 60000));
    if (mins < 60) return `${timeRange}${locationPart} · in ${mins}m`;
    const hrs = Math.floor(mins / 60);
    return `${timeRange}${locationPart} · in ${hrs}h ${mins % 60}m`;
  }
  return `${timeRange}${locationPart}`;
}

export const CALENDAR_HOURS = Array.from({ length: 17 }, (_, i) => i + 6);

export function formatHourLabel(hour: number): string {
  if (hour === 0 || hour === 24) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

export function eventStartHour(startsAt?: string): number | null {
  if (!startsAt) return null;
  return new Date(startsAt).getHours();
}

export function eventsForDay<T extends { startsAt?: string }>(events: T[], day: Date): T[] {
  return events.filter((ev) => ev.startsAt && isSameDay(new Date(ev.startsAt), day));
}

export function startOfMonth(date: Date): Date {
  return startOfDay(new Date(date.getFullYear(), date.getMonth(), 1));
}

export function endOfMonth(date: Date): Date {
  return startOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}
