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

export async function GET(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const pool = getPool();
    await ensureDefaultWorkspaceData(pool, userId);

    const weekStart = new Date('2026-10-26T00:00:00');
    const weekEnd = new Date('2026-11-02T00:00:00');

    const result = await pool.query(
      `SELECT id, title, location, starts_at, ends_at, color
       FROM taumail_calendar_events
       WHERE user_id = $1 AND starts_at >= $2 AND starts_at < $3
       ORDER BY starts_at ASC`,
      [userId, weekStart.toISOString(), weekEnd.toISOString()],
    );

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return {
        label: day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
        active: day.getDate() === 28,
      };
    });

    const events = result.rows.map((row) => {
      const startsAt = new Date(row.starts_at);
      const dayIndex = Math.floor((startsAt.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000));
      return {
        id: row.id,
        title: row.title,
        day: Math.max(0, Math.min(6, dayIndex)),
        top: formatTime(startsAt),
        color: row.color || 'gold',
        avatars: row.color === 'gold',
      };
    });

    const today = new Date('2026-10-28T00:00:00');
    const tomorrow = new Date('2026-10-29T00:00:00');
    const agendaResult = await pool.query(
      `SELECT title, location, starts_at
       FROM taumail_calendar_events
       WHERE user_id = $1 AND starts_at >= $2 AND starts_at < $3
       ORDER BY starts_at ASC`,
      [userId, today.toISOString(), tomorrow.toISOString()],
    );

    const agenda = agendaResult.rows.map((row) => ({
      time: formatTime(new Date(row.starts_at)),
      title: row.title,
      location: row.location || '',
    }));

    return NextResponse.json({
      success: true,
      monthLabel: 'October 2026',
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
