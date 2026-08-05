import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { ensureDefaultWorkspaceData } from '@/lib/taumail/schema';
import { runAiChat } from '@/lib/ai-gateway';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const aiPrompts = [
  'Summarize all unread signals from the inner core network',
  'Draft a reply to Sariel about protocol v4.3',
  'Find optimal meeting slot with Director Vance',
  'Analyze attachment: tau_universe_protocol.pdf',
];

export async function GET(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const pool = getPool();
    await ensureDefaultWorkspaceData(pool, userId);
    const result = await pool.query(
      `SELECT id, role, content, created_at
       FROM taumail_ai_messages
       WHERE user_id = $1
       ORDER BY created_at ASC
       LIMIT 100`,
      [userId],
    );
    const messages = result.rows.map((row) => ({
      id: row.id,
      role: row.role,
      text: row.content,
    }));
    return NextResponse.json({ success: true, messages, prompts: aiPrompts });
  });
}

export async function POST(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const pool = getPool();
    const { message } = await request.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: 'message required' }, { status: 400 });
    }

    await pool.query(
      'INSERT INTO taumail_ai_messages (user_id, role, content) VALUES ($1, $2, $3)',
      [userId, 'user', message.trim()],
    );

    const history = await pool.query(
      `SELECT role, content FROM taumail_ai_messages
       WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [userId],
    );

    const chatMessages = history.rows
      .reverse()
      .map((row) => ({ role: row.role as 'user' | 'assistant', content: row.content }));

    let assistantText = 'I processed your request. Check your inbox and calendar for related items.';
    try {
      const result = await runAiChat({
        messages: chatMessages,
        privacyMode: true,
      });
      assistantText = result.message || assistantText;
    } catch (error) {
      console.error('[taumail/ai]', error);
      assistantText =
        'Tau AI is temporarily unavailable. Your message was saved — try again in a moment.';
    }

    const saved = await pool.query(
      `INSERT INTO taumail_ai_messages (user_id, role, content)
       VALUES ($1, 'assistant', $2)
       RETURNING id, role, content, created_at`,
      [userId, assistantText],
    );

    return NextResponse.json({
      success: true,
      message: {
        id: saved.rows[0].id,
        role: 'assistant',
        text: assistantText,
      },
    });
  });
}
