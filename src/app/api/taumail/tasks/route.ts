import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { ensureDefaultWorkspaceData } from '@/lib/taumail/schema';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function formatDueLabel(dueDate: string | null, isDone: boolean): string {
  if (!dueDate) return 'No due date';
  const due = new Date(`${dueDate}T12:00:00`);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (due.toDateString() === today.toDateString()) return 'Today';
  if (due.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export async function GET(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const pool = getPool();
    await ensureDefaultWorkspaceData(pool, userId);
    const result = await pool.query(
      `SELECT id, title, due_date, priority, is_done, created_at
       FROM taumail_tasks
       WHERE user_id = $1
       ORDER BY is_done ASC, due_date ASC NULLS LAST, created_at DESC`,
      [userId],
    );
    const tasks = result.rows.map((row) => ({
      ...row,
      due: formatDueLabel(row.due_date, row.is_done),
      done: row.is_done,
    }));
    return NextResponse.json({ success: true, tasks });
  });
}

export async function POST(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const { title, dueDate, priority } = await request.json();
    if (!title) {
      return NextResponse.json({ error: 'title required' }, { status: 400 });
    }
    const result = await getPool().query(
      `INSERT INTO taumail_tasks (user_id, title, due_date, priority)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, due_date, priority, is_done, created_at`,
      [userId, title, dueDate || null, priority || 'normal'],
    );
    const row = result.rows[0];
    return NextResponse.json({
      success: true,
      task: { ...row, due: formatDueLabel(row.due_date, row.is_done), done: row.is_done },
    });
  });
}

export async function PATCH(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const { id, isDone } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }
    const result = await getPool().query(
      `UPDATE taumail_tasks
       SET is_done = COALESCE($3, is_done)
       WHERE id = $1 AND user_id = $2
       RETURNING id, title, due_date, priority, is_done, created_at`,
      [id, userId, isDone],
    );
    if (!result.rows.length) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    const row = result.rows[0];
    return NextResponse.json({
      success: true,
      task: { ...row, due: formatDueLabel(row.due_date, row.is_done), done: row.is_done },
    });
  });
}
