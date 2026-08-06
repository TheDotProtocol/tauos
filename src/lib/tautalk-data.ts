import { getPool } from '@/lib/db-pool';

function uid(userId: string | number): string {
  return String(userId);
}

export async function upsertPublicKey(userId: string | number, publicKey: string) {
  const id = uid(userId);
  const existing = await getPublicKey(userId);
  if (existing?.public_key && existing.public_key !== publicKey) {
    try {
      await getPool().query(
        `INSERT INTO tautalk_key_history (user_id, public_key) VALUES ($1, $2)`,
        [id, existing.public_key]
      );
    } catch {
      /* history table may not exist yet — run npm run talk:setup */
    }
  }
  await getPool().query(
    `INSERT INTO tautalk_keys (user_id, public_key, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (user_id) DO UPDATE SET public_key = $2, key_version = tautalk_keys.key_version + 1, updated_at = NOW()`,
    [id, publicKey]
  );
}

/** Current + recent historical public keys (for decrypt after device/browser changes). */
export async function getPublicKeysForUser(userId: string | number): Promise<string[]> {
  const id = uid(userId);
  const keys = new Set<string>();
  const current = await getPublicKey(userId);
  if (current?.public_key) keys.add(current.public_key);

  try {
    const history = await getPool().query(
      `SELECT public_key FROM tautalk_key_history
       WHERE user_id = $1 ORDER BY created_at DESC LIMIT 12`,
      [id]
    );
    for (const row of history.rows) {
      if (row.public_key) keys.add(row.public_key);
    }
  } catch {
    /* history table may not exist yet — run npm run talk:setup */
  }

  return Array.from(keys);
}

export async function getContactLabel(
  ownerUserId: string | number,
  contactUserId: string | number
): Promise<string | null> {
  try {
    const result = await getPool().query(
      `SELECT display_name FROM tautalk_contact_labels
       WHERE owner_user_id = $1 AND contact_user_id = $2`,
      [uid(ownerUserId), uid(contactUserId)]
    );
    return result.rows[0]?.display_name ?? null;
  } catch {
    return null;
  }
}

export async function upsertContactLabel(
  ownerUserId: string | number,
  contactUserId: string | number,
  displayName: string
) {
  const name = displayName.trim();
  if (!name) throw new Error('Display name required');
  await getPool().query(
    `INSERT INTO tautalk_contact_labels (owner_user_id, contact_user_id, display_name, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (owner_user_id, contact_user_id)
     DO UPDATE SET display_name = $3, updated_at = NOW()`,
    [uid(ownerUserId), uid(contactUserId), name]
  );
}

export async function deleteContactLabel(
  ownerUserId: string | number,
  contactUserId: string | number
) {
  await getPool().query(
    `DELETE FROM tautalk_contact_labels WHERE owner_user_id = $1 AND contact_user_id = $2`,
    [uid(ownerUserId), uid(contactUserId)]
  );
}

export async function getPublicKey(userId: string | number) {
  const result = await getPool().query(
    `SELECT user_id, public_key, key_version, updated_at FROM tautalk_keys WHERE user_id = $1`,
    [uid(userId)]
  );
  return result.rows[0] ?? null;
}

export async function findUserByEmailOrUsername(query: string) {
  const q = query.toLowerCase().trim();
  const email = q.includes('@') ? q : `${q}@tauos.org`;
  const username = q.replace(/@tauos\.org$/, '');
  const result = await getPool().query(
    `SELECT id, username, email, full_name, avatar_url FROM users
     WHERE LOWER(email) = $1 OR LOWER(username) = $2 LIMIT 1`,
    [email, username]
  );
  return result.rows[0] ?? null;
}

export async function listConversations(userId: string | number) {
  const result = await getPool().query(
    `SELECT c.id, c.type, c.title, c.updated_at,
            (SELECT content_encrypted FROM tautalk_messages m
             WHERE m.conversation_id = c.id AND m.deleted_at IS NULL
             ORDER BY m.created_at DESC LIMIT 1) AS last_message_encrypted,
            (SELECT created_at FROM tautalk_messages m
             WHERE m.conversation_id = c.id AND m.deleted_at IS NULL
             ORDER BY m.created_at DESC LIMIT 1) AS last_message_at,
            (SELECT COUNT(*)::int FROM tautalk_messages m
             WHERE m.conversation_id = c.id AND m.deleted_at IS NULL
               AND m.created_at > COALESCE(p.last_read_at, '1970-01-01')) AS unread_count,
             (SELECT json_build_object(
               'id', u.id,
               'username', u.username,
               'email', u.email,
               'full_name', u.full_name,
               'avatar_url', u.avatar_url,
               'contact_label', cl.display_name
             )
             FROM tautalk_participants p2
             JOIN users u ON u.id = p2.user_id
             LEFT JOIN tautalk_contact_labels cl
               ON cl.contact_user_id = u.id AND cl.owner_user_id = $1
             WHERE p2.conversation_id = c.id AND p2.user_id <> $1
             LIMIT 1) AS peer
     FROM tautalk_conversations c
     JOIN tautalk_participants p ON p.conversation_id = c.id AND p.user_id = $1
     ORDER BY c.updated_at DESC`,
    [uid(userId)]
  );
  return result.rows;
}

export async function getConversationParticipants(conversationId: string) {
  const result = await getPool().query(
    `SELECT u.id, u.username, u.email, u.full_name, u.avatar_url, p.last_read_at
     FROM tautalk_participants p
     JOIN users u ON u.id = p.user_id
     WHERE p.conversation_id = $1`,
    [conversationId]
  );
  return result.rows;
}

export async function userInConversation(userId: string | number, conversationId: string) {
  const result = await getPool().query(
    `SELECT 1 FROM tautalk_participants WHERE conversation_id = $1 AND user_id = $2`,
    [conversationId, uid(userId)]
  );
  return result.rows.length > 0;
}

export async function createDirectConversation(
  creatorId: string | number,
  targetUserId: string | number
) {
  const creator = uid(creatorId);
  const target = uid(targetUserId);
  if (creator === target) throw new Error('Cannot message yourself');

  const existing = await getPool().query(
    `SELECT c.id FROM tautalk_conversations c
     JOIN tautalk_participants p1 ON p1.conversation_id = c.id AND p1.user_id = $1
     JOIN tautalk_participants p2 ON p2.conversation_id = c.id AND p2.user_id = $2
     WHERE c.type = 'direct'`,
    [creator, target]
  );
  if (existing.rows.length > 0) {
    return { id: existing.rows[0].id, existing: true };
  }

  const conv = await getPool().query(
    `INSERT INTO tautalk_conversations (type, created_by) VALUES ('direct', $1) RETURNING id`,
    [creator]
  );
  const conversationId = conv.rows[0].id;
  await getPool().query(
    `INSERT INTO tautalk_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)`,
    [conversationId, creator, target]
  );
  return { id: conversationId, existing: false };
}

export async function listMessages(
  userId: string | number,
  conversationId: string,
  since?: string,
  limit = 50
) {
  const allowed = await userInConversation(userId, conversationId);
  if (!allowed) throw new Error('Conversation not found');

  const params: (string | number)[] = [conversationId, limit];
  let sinceClause = '';
  if (since) {
    sinceClause = 'AND m.created_at > $3';
    params.push(since);
  }

  const result = await getPool().query(
    `SELECT m.id, m.conversation_id, m.sender_id, m.content_encrypted, m.content_type,
            m.reply_to, m.created_at, m.edited_at,
            u.username AS sender_username
     FROM tautalk_messages m
     JOIN users u ON u.id = m.sender_id
     WHERE m.conversation_id = $1 AND m.deleted_at IS NULL ${sinceClause}
     ORDER BY m.created_at ASC
     LIMIT $2`,
    params
  );

  await getPool().query(
    `UPDATE tautalk_participants SET last_read_at = NOW()
     WHERE conversation_id = $1 AND user_id = $2`,
    [conversationId, uid(userId)]
  );

  return result.rows;
}

export async function sendMessage(
  userId: string | number,
  conversationId: string,
  contentEncrypted: string,
  contentType = 'text',
  replyTo?: string
) {
  const allowed = await userInConversation(userId, conversationId);
  if (!allowed) throw new Error('Conversation not found');
  if (!contentEncrypted?.trim()) throw new Error('Message required');

  const result = await getPool().query(
    `INSERT INTO tautalk_messages (conversation_id, sender_id, content_encrypted, content_type, reply_to)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, conversation_id, sender_id, content_encrypted, content_type, reply_to, created_at`,
    [conversationId, uid(userId), contentEncrypted, contentType, replyTo ?? null]
  );

  await getPool().query(
    `UPDATE tautalk_conversations SET updated_at = NOW() WHERE id = $1`,
    [conversationId]
  );

  return result.rows[0];
}

export async function createGroupConversation(
  creatorId: string | number,
  title: string,
  memberIds: string[]
) {
  const creator = uid(creatorId);
  const uniqueMembers = Array.from(new Set([creator, ...memberIds.map(uid)]));

  const conv = await getPool().query(
    `INSERT INTO tautalk_conversations (type, title, created_by) VALUES ('group', $1, $2) RETURNING id`,
    [title, creator]
  );
  const conversationId = conv.rows[0].id;

  for (const memberId of uniqueMembers) {
    await getPool().query(
      `INSERT INTO tautalk_participants (conversation_id, user_id) VALUES ($1, $2)`,
      [conversationId, memberId]
    );
  }

  return { id: conversationId };
}
