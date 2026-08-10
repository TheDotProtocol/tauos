import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { ensureDefaultWorkspaceData } from '@/lib/taumail/schema';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const legends = [
  { label: 'Primary Alignments', color: '#d4a843' },
  { label: 'Subsystem Telemetry', color: '#3b82f6' },
  { label: 'Grid Maintenance', color: '#ef4444' },
  { label: 'External Cargo', color: '#a855f7' },
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function mapEventRow(row: Record<string, unknown>, weekStart: Date) {
  const startsAt = new Date(String(row.starts_at));
  const endsAt = row.ends_at ? new Date(String(row.ends_at)) : null;
  const dayIndex = Math.floor((startsAt.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000));
  return {
    id: String(row.id),
    title: String(row.title),
    day: Math.max(0, Math.min(6, dayIndex)),
    top: formatTime(startsAt),
    end: endsAt ? formatTime(endsAt) : null,
    color: String(row.color || 'gold'),
    avatars: row.color === 'gold',
    startsAt: row.starts_at,
    endsAt: row.ends_at || null,
    location: row.location ? String(row.location) : '',
  };
}

export async function GET(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const pool = getPool();
    await ensureDefaultWorkspaceData(pool, userId);

    const weekStartParam = request.nextUrl.searchParams.get('weekStart');
    const dateParam = request.nextUrl.searchParams.get('date');
    const rangeStartParam = request.nextUrl.searchParams.get('rangeStart');
    const rangeEndParam = request.nextUrl.searchParams.get('rangeEnd');

    const selectedDay = startOfDay(dateParam ? new Date(dateParam) : new Date());
    const weekStart = startOfDay(weekStartParam ? new Date(weekStartParam) : startOfWeek(selectedDay));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    let queryStart = weekStart;
    let queryEnd = weekEnd;
    if (rangeStartParam && rangeEndParam) {
      queryStart = startOfDay(new Date(rangeStartParam));
      queryEnd = startOfDay(new Date(rangeEndParam));
      queryEnd.setDate(queryEnd.getDate() + 1);
    }

    const nextDay = new Date(selectedDay);
    nextDay.setDate(selectedDay.getDate() + 1);

    const result = await pool.query(
      `SELECT id, title, location, starts_at, ends_at, color
       FROM taumail_calendar_events
       WHERE user_id = $1 AND starts_at >= $2 AND starts_at < $3
       ORDER BY starts_at ASC`,
      [userId, queryStart.toISOString(), queryEnd.toISOString()],
    );

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return {
        label: day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
        date: day.toISOString(),
        active: day.toDateString() === selectedDay.toDateString(),
      };
    });

    const events = result.rows.map((row) => mapEventRow(row, weekStart));

    const agendaResult = await pool.query(
      `SELECT title, location, starts_at, ends_at
       FROM taumail_calendar_events
       WHERE user_id = $1 AND starts_at >= $2 AND starts_at < $3
       ORDER BY starts_at ASC`,
      [userId, selectedDay.toISOString(), nextDay.toISOString()],
    );

    const agenda = agendaResult.rows.map((row) => ({
      time: formatTime(new Date(row.starts_at)),
      endTime: row.ends_at ? formatTime(new Date(row.ends_at)) : null,
      title: row.title,
      location: row.location || '',
      startsAt: row.starts_at,
      endsAt: row.ends_at || null,
    }));

    return NextResponse.json({
      success: true,
      monthLabel: selectedDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      weekStart: weekStart.toISOString(),
      selectedDate: selectedDay.toISOString(),
      weekDays,
      events,
      agenda,
      legends,
    });
  });
}

export async function POST(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const { title, location, startsAt, endsAt, color } = await request.json();
    if (!title || !startsAt) {
      return NextResponse.json({ error: 'title and startsAt required' }, { status: 400 });
    }
    const result = await getPool().query(
      `INSERT INTO taumail_calendar_events (user_id, title, location, starts_at, ends_at, color)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, location, starts_at, ends_at, color`,
      [userId, title, location || null, startsAt, endsAt || null, color || 'gold'],
    );
    return NextResponse.json({ success: true, event: result.rows[0] });
  });
}
