import { getPool } from '@/lib/db-pool';
import { userInConversation, getConversationParticipants } from '@/lib/tautalk-data';

function uid(userId: string | number): string {
  return String(userId);
}

export type CallMode = 'voice' | 'video';
export type CallStatus = 'ringing' | 'active' | 'ended' | 'declined' | 'missed';

export type CallSession = {
  id: string;
  conversation_id: string;
  caller_id: string;
  callee_id: string;
  mode: CallMode;
  status: CallStatus;
  started_at: string;
  answered_at: string | null;
  ended_at: string | null;
};

export async function getPeerForCall(conversationId: string, userId: string | number) {
  const participants = await getConversationParticipants(conversationId);
  const me = uid(userId);
  const peer = participants.find((p) => String(p.id) !== me);
  if (!peer) throw new Error('No peer in conversation');
  return peer;
}

export async function expireStaleCallSessions(conversationId?: string) {
  await getPool().query(
    `UPDATE tautalk_call_sessions
     SET status = 'missed', ended_at = NOW()
     WHERE status = 'ringing' AND started_at < NOW() - INTERVAL '15 seconds'`
  );
  await getPool().query(
    `UPDATE tautalk_call_sessions
     SET status = 'ended', ended_at = NOW()
     WHERE status = 'active'
       AND COALESCE(answered_at, started_at) < NOW() - INTERVAL '2 hours'`
  );
  if (conversationId) {
    await getPool().query(
      `UPDATE tautalk_call_sessions
       SET status = 'missed', ended_at = NOW()
       WHERE conversation_id = $1 AND status = 'ringing'`,
      [conversationId]
    );
  }
}

export async function createCallSession(
  userId: string | number,
  conversationId: string,
  mode: CallMode
): Promise<CallSession> {
  const allowed = await userInConversation(userId, conversationId);
  if (!allowed) throw new Error('Not found');

  await expireStaleCallSessions(conversationId);

  const peer = await getPeerForCall(conversationId, userId);
  const existing = await getPool().query(
    `SELECT id FROM tautalk_call_sessions
     WHERE conversation_id = $1 AND status = 'active'
       AND COALESCE(answered_at, started_at) > NOW() - INTERVAL '5 minutes'
     LIMIT 1`,
    [conversationId]
  );
  if (existing.rows.length > 0) {
    throw new Error('A call is already in progress');
  }

  const result = await getPool().query(
    `INSERT INTO tautalk_call_sessions (conversation_id, caller_id, callee_id, mode, status)
     VALUES ($1, $2, $3, $4, 'ringing')
     RETURNING *`,
    [conversationId, uid(userId), uid(peer.id), mode]
  );
  return result.rows[0] as CallSession;
}

export async function getCallSession(sessionId: string, userId: string | number) {
  const result = await getPool().query(
    `SELECT * FROM tautalk_call_sessions
     WHERE id = $1 AND (caller_id = $2 OR callee_id = $2)`,
    [sessionId, uid(userId)]
  );
  return (result.rows[0] as CallSession) ?? null;
}

export async function listIncomingCalls(userId: string | number) {
  await expireStaleCallSessions();
  const result = await getPool().query(
    `SELECT s.*,
            c.type AS conversation_type,
            c.title AS conversation_title,
            json_build_object(
              'id', u.id,
              'username', u.username,
              'full_name', u.full_name,
              'avatar_url', u.avatar_url
            ) AS caller
     FROM tautalk_call_sessions s
     JOIN tautalk_conversations c ON c.id = s.conversation_id
     JOIN users u ON u.id = s.caller_id
     WHERE s.callee_id = $1 AND s.status = 'ringing'
     ORDER BY s.started_at DESC`,
    [uid(userId)]
  );
  return result.rows;
}

export async function acceptCallSession(sessionId: string, userId: string | number) {
  const session = await getCallSession(sessionId, userId);
  if (!session) throw new Error('Not found');
  if (String(session.callee_id) !== uid(userId)) throw new Error('Only callee can accept');
  if (session.status !== 'ringing') throw new Error('Call is not ringing');

  const result = await getPool().query(
    `UPDATE tautalk_call_sessions
     SET status = 'active', answered_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [sessionId]
  );
  return result.rows[0] as CallSession;
}

export async function declineCallSession(sessionId: string, userId: string | number) {
  const session = await getCallSession(sessionId, userId);
  if (!session) throw new Error('Not found');
  if (session.status !== 'ringing') throw new Error('Call is not ringing');

  const result = await getPool().query(
    `UPDATE tautalk_call_sessions
     SET status = 'declined', ended_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [sessionId]
  );
  return result.rows[0] as CallSession;
}

export async function missCallSession(sessionId: string, userId: string | number) {
  const session = await getCallSession(sessionId, userId);
  if (!session) throw new Error('Not found');
  if (String(session.caller_id) !== uid(userId)) throw new Error('Only caller can mark missed');
  if (session.status !== 'ringing') throw new Error('Call is not ringing');

  const result = await getPool().query(
    `UPDATE tautalk_call_sessions
     SET status = 'missed', ended_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [sessionId]
  );
  return result.rows[0] as CallSession;
}

export async function endCallSession(sessionId: string, userId: string | number) {
  const session = await getCallSession(sessionId, userId);
  if (!session) throw new Error('Not found');
  if (session.status === 'ended' || session.status === 'declined' || session.status === 'missed') {
    return session;
  }

  const result = await getPool().query(
    `UPDATE tautalk_call_sessions
     SET status = 'ended', ended_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [sessionId]
  );
  return result.rows[0] as CallSession;
}

export async function addCallSignal(
  sessionId: string,
  senderId: string | number,
  signalType: string,
  payload: unknown
) {
  const session = await getCallSession(sessionId, senderId);
  if (!session) throw new Error('Not found');
  if (!['ringing', 'active'].includes(session.status)) throw new Error('Call not active');

  const result = await getPool().query(
    `INSERT INTO tautalk_call_signals (session_id, sender_id, signal_type, payload)
     VALUES ($1, $2, $3, $4)
     RETURNING id, session_id, sender_id, signal_type, payload, created_at`,
    [sessionId, uid(senderId), signalType, JSON.stringify(payload ?? {})]
  );
  return result.rows[0];
}

export async function listCallSignals(
  sessionId: string,
  userId: string | number,
  since?: string
) {
  const session = await getCallSession(sessionId, userId);
  if (!session) throw new Error('Not found');

  const params: string[] = [sessionId, uid(userId)];
  let sql = `
    SELECT id, session_id, sender_id, signal_type, payload, created_at
    FROM tautalk_call_signals
    WHERE session_id = $1 AND sender_id <> $2`;
  if (since) {
    params.push(since);
    sql += ` AND created_at > $3::timestamptz`;
  }
  sql += ` ORDER BY created_at ASC LIMIT 100`;

  const result = await getPool().query(sql, params);
  return result.rows;
}
